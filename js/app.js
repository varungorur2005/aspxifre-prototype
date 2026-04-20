document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initDropdown();
  initPartnerLoad();
  initPartnerCards();
  initOppTabs();
  initBannerChange();
  initDismissibles();
  initPartnerViewToggle();
  initAlertActions();
  initPinButtons();
});

// ── Greeting ──
function initGreeting() {
  const h = new Date().getHours();
  const period = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
  document.getElementById('greeting').textContent = `Good ${period}, Varun`;
}

// ── Dropdown placeholder toggle ──
function initDropdown() {
  const dropdown = document.getElementById('idTypeDropdown');
  const input = document.getElementById('searchInput');
  const placeholders = {
    partnerone: 'Enter PartnerOne ID (Limit one at a time)',
    mpn: 'Enter MPN ID (comma-separated, up to 200)'
  };
  dropdown.addEventListener('change', () => {
    input.placeholder = placeholders[dropdown.value];
    input.value = '';
    input.focus();
  });
}

// ── Load partner from hero picker ──
function initPartnerLoad() {
  const btn = document.getElementById('loadPartnerBtn');
  const input = document.getElementById('searchInput');

  btn.addEventListener('click', () => loadPartner(input.value.trim()));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loadPartner(input.value.trim());
  });
}

// ── Quick-load from recent partner cards ──
function initPartnerCards() {
  document.querySelectorAll('.partner-card').forEach(card => {
    const handler = () => {
      const name = card.dataset.partner;
      const id = card.dataset.id;
      const type = card.dataset.type;
      showPartnerView(name, type === 'partnerone' ? 'PartnerOne ID' : 'MPN ID', id);
    };
    card.addEventListener('click', handler);
    const btn = card.querySelector('.partner-load-quick');
    if (btn) btn.addEventListener('click', (e) => { e.stopPropagation(); handler(); });
  });
}

// ── Load partner by ID ──
function loadPartner(idValue) {
  if (!idValue) return;
  const type = document.getElementById('idTypeDropdown').value;
  const label = type === 'partnerone' ? 'PartnerOne ID' : 'MPN ID';
  // Simulate partner lookup
  const fakeNames = {
    '8834721': 'Contoso Partners',
    '4419283': 'Fabrikam Inc.',
    '5512903': 'Woodgrove Bank'
  };
  const name = fakeNames[idValue] || `Partner (${idValue})`;
  showPartnerView(name, label, idValue);
}

// ── Show partner-loaded view ──
function showPartnerView(name, idType, id) {
  document.getElementById('freHomepage').classList.add('hidden');
  document.getElementById('partnerLoaded').classList.remove('hidden');
  document.getElementById('bannerPartnerName').textContent = name;
  document.getElementById('bannerIdType').textContent = idType;
  document.getElementById('bannerId').textContent = id;

  renderOppView('copilot');
  setActiveOppTab('copilot');
}

// ── Change partner (back to FRE) ──
function initBannerChange() {
  document.getElementById('bannerChange').addEventListener('click', () => {
    document.getElementById('partnerLoaded').classList.add('hidden');
    document.getElementById('freHomepage').classList.remove('hidden');
  });
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

/* ── Dismissible strips (Onboarding + What's New) ── */
function initDismissibles() {
  const onboardingStrip = document.getElementById('onboardingStrip');
  const whatsNewStrip = document.getElementById('whatsNewStrip');

  // Check localStorage for onboarding dismissal
  if (localStorage.getItem('aspxi_onboarding_dismissed') === 'true' && onboardingStrip) {
    onboardingStrip.classList.add('hidden');
  }
  if (localStorage.getItem('aspxi_whatsnew_dismissed') === 'true' && whatsNewStrip) {
    whatsNewStrip.classList.add('hidden');
  }

  const onboardingDismiss = document.getElementById('dismissOnboarding');
  if (onboardingDismiss) {
    onboardingDismiss.addEventListener('click', () => {
      onboardingStrip.classList.add('hidden');
      localStorage.setItem('aspxi_onboarding_dismissed', 'true');
    });
  }

  const whatsNewDismiss = document.getElementById('dismissWhatsNew');
  if (whatsNewDismiss) {
    whatsNewDismiss.addEventListener('click', () => {
      whatsNewStrip.classList.add('hidden');
      localStorage.setItem('aspxi_whatsnew_dismissed', 'true');
    });
  }
}

/* ── Pinned / Recent partner toggle ── */
function initPartnerViewToggle() {
  const btns = document.querySelectorAll('.toggle-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.view; // "pinned" or "recent"
      document.querySelectorAll('.partner-view').forEach(v => {
        const viewKey = v.id === 'pinnedPartnersView' ? 'pinned' : 'recent';
        v.classList.toggle('hidden', viewKey !== target);
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
