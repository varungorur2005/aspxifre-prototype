document.addEventListener('DOMContentLoaded', () => {
  initGreeting();
  initDropdown();
  initPartnerLoad();
  initOppTabs();
  initBannerChange();
  initDismissibles();
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

// ── Load partner by ID ──
function loadPartner(idValue) {
  if (!idValue) return;
  const type = document.getElementById('idTypeDropdown').value;
  const label = type === 'partnerone' ? 'PartnerOne ID' : 'MPN ID';
  const fakeNames = {
    '8834721': 'Contoso Partners',
    '4419283': 'Fabrikam Inc.',
    '5512903': 'Woodgrove Bank',
    '7721054': 'Adatum Corporation',
    '6630182': 'Lucerne Publishing',
    '3310247': 'Datum Corp'
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


