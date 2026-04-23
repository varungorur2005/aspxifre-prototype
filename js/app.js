document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initSearch();
  initPartnerCards();
  initOppTabs();
  initBannerChange();
  initDismissibles();
  initPartnerViewToggle();
  initAlertActions();
  initPinButtons();
  initKeyboardShortcut();
});

// ── Greeting ──
function initGreeting() {
  const h = new Date().getHours();
  const period = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  document.getElementById('greeting').textContent = `Good ${period}, Varun`;
}

// ── Search data (simulated partner + tenant index) ──
const searchIndex = [
  { name: 'Contoso Partners', type: 'partner', id: '8834721', idType: 'PartnerOne ID', tenants: 47, initials: 'CP' },
  { name: 'Fabrikam Inc.', type: 'partner', id: '4419283', idType: 'MPN ID', tenants: 22, initials: 'FI' },
  { name: 'Woodgrove Bank', type: 'partner', id: '5512903', idType: 'PartnerOne ID', tenants: 31, initials: 'WB' },
  { name: 'Adatum Corporation', type: 'partner', id: '7721054', idType: 'MPN ID', tenants: 15, initials: 'AC' },
  { name: 'Lucerne Publishing', type: 'partner', id: '6630182', idType: 'PartnerOne ID', tenants: 9, initials: 'LP' },
  { name: 'Datum Corp', type: 'partner', id: '3310247', idType: 'MPN ID', tenants: 38, initials: 'DC' },
  { name: 'Contoso Ltd.', type: 'tenant', parent: 'Contoso Partners', parentId: '8834721', tpid: 'TPID-90412', initials: 'CL' },
  { name: 'Northwind Traders', type: 'tenant', parent: 'Contoso Partners', parentId: '8834721', tpid: 'TPID-71823', initials: 'NT' },
  { name: 'Adventure Works', type: 'tenant', parent: 'Fabrikam Inc.', parentId: '4419283', tpid: 'TPID-55091', initials: 'AW' },
  { name: 'Alpine Ski House', type: 'tenant', parent: 'Contoso Partners', parentId: '8834721', tpid: 'TPID-62340', initials: 'AS' },
  { name: 'Trey Research', type: 'tenant', parent: 'Fabrikam Inc.', parentId: '4419283', tpid: 'TPID-48712', initials: 'TR' },
  { name: 'Relecloud Inc.', type: 'tenant', parent: 'Woodgrove Bank', parentId: '5512903', tpid: 'TPID-33901', initials: 'RI' },
  { name: 'Bellows College', type: 'tenant', parent: 'Contoso Partners', parentId: '8834721', tpid: 'TPID-82156', initials: 'BC' },
  { name: 'Fourth Coffee', type: 'tenant', parent: 'Adatum Corporation', parentId: '7721054', tpid: 'TPID-14509', initials: 'FC' },
  { name: 'Litware Inc.', type: 'tenant', parent: 'Datum Corp', parentId: '3310247', tpid: 'TPID-67283', initials: 'LI' },
  { name: 'Proseware Ltd.', type: 'tenant', parent: 'Lucerne Publishing', parentId: '6630182', tpid: 'TPID-20145', initials: 'PL' },
];

// ── Fuzzy search ──
function searchEntities(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return searchIndex.filter(item => {
    return item.name.toLowerCase().includes(q)
      || item.id?.toLowerCase().includes(q)
      || item.tpid?.toLowerCase().includes(q)
      || item.parent?.toLowerCase().includes(q);
  }).slice(0, 8);
}

// ── Highlight match ──
function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx) + '<mark>' + text.slice(idx, idx + query.length) + '</mark>' + text.slice(idx + query.length);
}

// ── Render dropdown ──
function renderDropdown(dropdown, results, query) {
  if (results.length === 0) {
    dropdown.innerHTML = `<div class="search-empty">No results for "${query}"<br><span style="font-size:11px;color:#b3b3b3">Try a partner name, tenant name, or ID</span></div>`;
    dropdown.classList.remove('hidden');
    return;
  }

  const partners = results.filter(r => r.type === 'partner');
  const tenants = results.filter(r => r.type === 'tenant');
  let html = '';

  if (partners.length) {
    html += '<div class="search-group-label">Partners</div>';
    partners.forEach(p => {
      html += `<div class="search-result" data-type="partner" data-name="${p.name}" data-id="${p.id}" data-id-type="${p.idType}">
        <div class="search-result-avatar partner">${p.initials}</div>
        <div class="search-result-info">
          <div class="search-result-name">${highlight(p.name, query)}</div>
          <div class="search-result-meta">${p.idType}: ${p.id} · ${p.tenants} tenants</div>
        </div>
        <span class="search-result-badge partner">Partner</span>
      </div>`;
    });
  }

  if (tenants.length) {
    html += '<div class="search-group-label">Tenants</div>';
    tenants.forEach(t => {
      html += `<div class="search-result" data-type="tenant" data-name="${t.parent}" data-id="${t.parentId}" data-id-type="PartnerOne ID" data-tenant="${t.name}">
        <div class="search-result-avatar tenant">${t.initials}</div>
        <div class="search-result-info">
          <div class="search-result-name">${highlight(t.name, query)}</div>
          <div class="search-result-meta">under ${t.parent} · ${t.tpid}</div>
        </div>
        <span class="search-result-badge tenant">Tenant</span>
      </div>`;
    });
  }

  html += `<div class="search-footer"><kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Enter</kbd> to select · <kbd>Esc</kbd> to close</div>`;
  dropdown.innerHTML = html;
  dropdown.classList.remove('hidden');

  // Wire click handlers
  dropdown.querySelectorAll('.search-result').forEach(el => {
    el.addEventListener('click', () => selectSearchResult(el));
  });
}

// ── Select a search result ──
function selectSearchResult(el) {
  const name = el.dataset.name;
  const id = el.dataset.id;
  const idType = el.dataset.idType;
  showPartnerView(name, idType, id);
  updateGlobalChip(name);
  document.querySelectorAll('.search-dropdown').forEach(d => d.classList.add('hidden'));
}

// ── Update global search chip state ──
function updateGlobalChip(name) {
  const chip = document.getElementById('globalLoadedChip');
  const chipName = document.getElementById('globalChipName');
  const globalInput = document.getElementById('globalSearchInput');
  const kbd = document.querySelector('.global-kbd');
  chipName.textContent = name;
  chip.classList.remove('hidden');
  globalInput.value = '';
  globalInput.style.display = 'none';
  if (kbd) kbd.style.display = 'none';
}

// ── Init search on global input only ──
function initSearch() {
  const globalInput = document.getElementById('globalSearchInput');
  const globalDropdown = document.getElementById('globalSearchDropdown');

  let activeIdx = -1;

  globalInput.addEventListener('input', () => {
    const q = globalInput.value.trim();
    activeIdx = -1;
    // Hide kbd hint when typing
    const kbd = document.querySelector('.global-kbd');
    if (kbd) kbd.style.display = q.length > 0 ? 'none' : '';
    if (q.length < 2) { globalDropdown.classList.add('hidden'); return; }
    renderDropdown(globalDropdown, searchEntities(q), q);
  });

  globalInput.addEventListener('keydown', (e) => {
    const items = globalDropdown.querySelectorAll('.search-result');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle('active', i === activeIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      items.forEach((it, i) => it.classList.toggle('active', i === activeIdx));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      selectSearchResult(items[activeIdx]);
    } else if (e.key === 'Escape') {
      globalDropdown.classList.add('hidden');
      globalInput.blur();
    }
  });

  globalInput.addEventListener('blur', () => {
    setTimeout(() => globalDropdown.classList.add('hidden'), 200);
  });

  globalInput.addEventListener('focus', () => {
    const q = globalInput.value.trim();
    if (q.length >= 2) renderDropdown(globalDropdown, searchEntities(q), q);
  });

  // Global chip clear
  document.getElementById('globalChipClear').addEventListener('click', () => {
    clearLoadedPartner();
  });
}

// ── Clear loaded partner (back to homepage) ──
function clearLoadedPartner() {
  const chip = document.getElementById('globalLoadedChip');
  const globalInput = document.getElementById('globalSearchInput');
  const kbd = document.querySelector('.global-kbd');
  chip.classList.add('hidden');
  globalInput.style.display = '';
  globalInput.value = '';
  if (kbd) kbd.style.display = '';
  globalInput.focus();
  document.getElementById('partnerLoaded').classList.add('hidden');
  document.getElementById('freHomepage').classList.remove('hidden');
  setActiveNav('navHome');
}

// ── Keyboard shortcut: "/" focuses global search ──
function initKeyboardShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      document.getElementById('globalSearchInput').focus();
    }
  });
}

// ── Quick-load from partner cards ──
function initPartnerCards() {
  document.querySelectorAll('.partner-card').forEach(card => {
    const handler = () => {
      const name = card.dataset.partner;
      const id = card.dataset.id;
      const type = card.dataset.type;
      const idType = type === 'partnerone' ? 'PartnerOne ID' : 'MPN ID';
      showPartnerView(name, idType, id);
      updateGlobalChip(name);
    };
    card.addEventListener('click', handler);
    const btn = card.querySelector('.partner-load-quick');
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); handler(); });
  });
}

// ── Show partner-loaded view ──
function showPartnerView(name, idType, id) {
  document.getElementById('freHomepage').classList.add('hidden');
  document.getElementById('partnerLoaded').classList.remove('hidden');
  document.getElementById('bannerPartnerName').textContent = name;
  document.getElementById('bannerIdType').textContent = idType;
  document.getElementById('bannerId').textContent = id;
  setActiveNav('navGrowth');

  renderOppView('copilot');
  setActiveOppTab('copilot');
}

// ── Change partner (back to FRE) ──
function initBannerChange() {
  document.getElementById('bannerChange').addEventListener('click', () => {
    clearLoadedPartner();
  });
}

// ── Sidebar nav highlight ──
function setActiveNav(activeId) {
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');
}

// ── Opportunity tabs ──
function initOppTabs() {
  document.querySelectorAll('.opp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveOppTab(tab.dataset.opp);
      renderOppView(tab.dataset.opp);
    });
  });
}

function setActiveOppTab(opp) {
  document.querySelectorAll('.opp-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.opp-tab[data-opp="${opp}"]`)?.classList.add('active');
}

// ── Sample data per opportunity view ──
const oppData = {
  copilot: {
    kpis: [
      { value: '47', label: 'Tenants' },
      { value: '23%', label: 'Seat Penetration' },
      { value: '68%', label: 'Paid Utilization' },
      { value: '12', label: 'Acquire' },
      { value: '18', label: 'Monetize' },
      { value: '9', label: 'Grow' },
    ],
    columns: ['Tenant Name', 'Segment', 'Copilot Eligible', 'Copilot PAU', 'Utilization', 'Opportunity', 'Adoption Status'],
    rows: [
      ['Northwind Traders', 'Enterprise', '2,400', '310', '74%', '<span class="status-badge acquire">Acquire</span>', 'Starting'],
      ['Adventure Works', 'SMC', '500', '42', '81%', '<span class="status-badge monetize">Monetize</span>', 'Healthy'],
      ['Alpine Ski House', 'Enterprise', '1,240', '275', '62%', '<span class="status-badge grow">Grow</span>', 'Healthy but Negative Slope'],
      ['Relecloud Inc.', 'SMC', '310', '0', '—', '<span class="status-badge acquire">Acquire</span>', 'No licenses'],
      ['Trey Research', 'SMC', '180', '95', '88%', '<span class="status-badge grow">Grow</span>', 'Healthy'],
      ['Contoso Ltd.', 'Enterprise', '3,100', '420', '71%', '<span class="status-badge monetize">Monetize</span>', 'Failure to Adopt'],
      ['Bellows College', 'Enterprise', '800', '210', '59%', '<span class="status-badge monetize">Monetize</span>', 'Healthy but Last Month Drop'],
    ]
  },
  e3: {
    kpis: [
      { value: '19', label: 'Tenants' },
      { value: '54%', label: 'Paid Utilization' },
      { value: '2,840', label: 'Usage Whitespace' },
      { value: '7', label: 'Upsell Ready' },
      { value: '10', label: 'Unhealthy' },
      { value: '2', label: 'Incentive Eligible' },
    ],
    columns: ['Tenant Name', 'Segment', 'Dominant SKU', 'Paid Utilization', 'Whitespace', 'Readiness', 'Upsell Destination'],
    rows: [
      ['Fourth Coffee', 'SMC', 'OE3', '72%', '85', '<span class="status-badge ready">Ready</span>', 'Microsoft 365 E3'],
      ['Graphic Design Institute', 'SMC', 'OE1', '68%', '120', '<span class="status-badge unhealthy">Unhealthy</span>', 'ME3'],
      ['Nod Publishers', 'SMC', 'BB', '81%', '45', '<span class="status-badge ready">Ready</span>', 'Business Premium'],
      ['VanArsdel Ltd.', 'Enterprise', 'OE3+EMS', '58%', '340', '<span class="status-badge unhealthy">Unhealthy</span>', 'ME3'],
      ['Wide World Importers', 'Enterprise', 'OE3', '76%', '190', '<span class="status-badge ready">Ready</span>', 'ME3'],
    ]
  },
  e5: {
    kpis: [
      { value: '14', label: 'Tenants' },
      { value: '61%', label: 'Paid Utilization' },
      { value: '1,920', label: 'Usage Whitespace' },
      { value: '5', label: 'Upsell Ready' },
      { value: '6', label: 'Unhealthy' },
      { value: '3', label: 'At Risk' },
    ],
    columns: ['Tenant Name', 'Segment', 'Dominant SKU', 'Paid Utilization', 'Whitespace', 'Readiness', 'Security Attach'],
    rows: [
      ['Woodgrove Bank', 'Enterprise', 'ME3', '79%', '420', '<span class="status-badge ready">Upsell Ready</span>', 'Purview + Defender'],
      ['Litware Inc.', 'Enterprise', 'ME3', '65%', '310', '<span class="status-badge ready">Upsell Ready</span>', 'Defender'],
      ['Proseware Ltd.', 'SMC', 'ME3', '71%', '95', '<span class="status-badge ready">Upsell Ready</span>', 'Purview'],
      ['Contoso Ltd.', 'Enterprise', 'ME3+Mini', '42%', '680', '<span class="status-badge at-risk">At Risk</span>', 'None'],
      ['Fabrikam Inc.', 'Enterprise', 'ME3', '53%', '415', '<span class="status-badge unhealthy">Unhealthy</span>', 'DLP only'],
    ]
  },
  e5exp: {
    kpis: [
      { value: '8', label: 'Tenants' },
      { value: '78%', label: 'Paid Utilization' },
      { value: '1,040', label: 'Usage Whitespace' },
      { value: '4', label: 'Healthy' },
      { value: '3', label: 'Unhealthy' },
      { value: '1', label: 'Incentive Eligible' },
    ],
    columns: ['Tenant Name', 'Segment', 'ME5 Seats', 'Paid Utilization', 'Whitespace', 'Health', 'MCI Eligible'],
    rows: [
      ['VanArsdel Ltd.', 'Enterprise', '2,100', '82%', '620', '<span class="status-badge healthy">Healthy</span>', 'Yes'],
      ['Wide World Importers', 'Enterprise', '1,400', '76%', '440', '<span class="status-badge healthy">Healthy</span>', 'No'],
      ['Trey Research', 'SMC', '290', '88%', '35', '<span class="status-badge healthy">Healthy</span>', 'Yes'],
      ['Bellows College', 'Enterprise', '800', '51%', '390', '<span class="status-badge unhealthy">Unhealthy</span>', 'No'],
    ]
  }
};

function renderOppView(opp) {
  const data = oppData[opp];
  if (!data) return;

  // KPIs
  const kpiRow = document.getElementById('kpiRow');
  kpiRow.innerHTML = data.kpis.map(k =>
    `<div class="kpi-tile"><span class="kpi-value">${k.value}</span><span class="kpi-label">${k.label}</span></div>`
  ).join('');

  // Table header
  const head = document.getElementById('tableHead');
  head.innerHTML = data.columns.map(c => `<th>${c}</th>`).join('');

  // Table body
  const body = document.getElementById('tableBody');
  body.innerHTML = data.rows.map(r =>
    `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`
  ).join('');
}

/* ── Dismissible strips (Onboarding) ── */
function initDismissibles() {
  const onboardingStrip = document.getElementById('onboardingStrip');

  if (localStorage.getItem('aspxi_onboarding_dismissed') === 'true' && onboardingStrip) {
    onboardingStrip.classList.add('hidden');
  }

  const onboardingDismiss = document.getElementById('dismissOnboarding');
  if (onboardingDismiss) {
    onboardingDismiss.addEventListener('click', () => {
      onboardingStrip.classList.add('hidden');
      localStorage.setItem('aspxi_onboarding_dismissed', 'true');
    });
  }
}

/* ── Pinned / Recent / MPL partner toggle ── */
function initPartnerViewToggle() {
  const btns = document.querySelectorAll('.toggle-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.view;
      const viewMap = { pinned: 'pinnedPartnersView', recent: 'recentPartnersView', mpl: 'mplPartnersView' };
      document.querySelectorAll('.partner-view').forEach(v => {
        v.classList.toggle('hidden', v.id !== viewMap[target]);
      });
    });
  });
}

/* ── Alert action buttons ── */
function initAlertActions() {
  document.querySelectorAll('.alert-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const partner = btn.dataset.partner;
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      if (partner && id) {
        const idLabel = type === 'partnerone' ? 'PartnerOne ID' : 'MPN ID';
        showPartnerView(partner, idLabel, id);
        updateGlobalChip(partner);
      }
    });
  });
}

/* ── Pin / Unpin partner cards ── */
function initPinButtons() {
  document.querySelectorAll('.pin-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      const isPinned = btn.classList.contains('active');
      btn.title = isPinned ? 'Unpin partner' : 'Pin partner';
      btn.innerHTML = isPinned
        ? '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5H8.5v5.5a.5.5 0 0 1-1 0V10H3.5a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.2 5.2 0 0 1 5 6.708V2.277a2.4 2.4 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5H8.5v5.5a.5.5 0 0 1-1 0V10H3.5a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.2 5.2 0 0 1 5 6.708V2.277a2.4 2.4 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"/></svg>';
    });
  });
}
