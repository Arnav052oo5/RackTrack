let servers = [];

// ── helpers ──────────────────────────────────────────
function statusClass(s) {
  if (s === 'Active')      return 'active';
  if (s === 'Down')        return 'down';
  if (s === 'Maintenance') return 'maint';
  return 'unreachable';
}
function statusServerClass(s) {
  if (s === 'Active')      return 'active-server';
  if (s === 'Down')        return 'down-server';
  if (s === 'Maintenance') return 'maint-server';
  return '';
}

// ── stats bar ────────────────────────────────────────
function renderStats(list) {
  const total       = list.length;
  const active      = list.filter(s => s.status === 'Active').length;
  const down        = list.filter(s => s.status === 'Down').length;
  const maintenance = list.filter(s => s.status === 'Maintenance').length;
  const racks       = new Set(list.map(s => s.rack)).size;

  document.getElementById('statsBar').innerHTML = `
    <div class="dc-stat"><div class="dc-stat-label">Total Servers</div><div class="dc-stat-value total">${total}</div></div>
    <div class="dc-stat"><div class="dc-stat-label">Active</div><div class="dc-stat-value active">${active}</div></div>
    <div class="dc-stat"><div class="dc-stat-label">Down</div><div class="dc-stat-value down">${down}</div></div>
    <div class="dc-stat"><div class="dc-stat-label">Maintenance</div><div class="dc-stat-value warn">${maintenance}</div></div>
    <div class="dc-stat"><div class="dc-stat-label">Racks</div><div class="dc-stat-value total">${racks}</div></div>
  `;
}

// ── render rack grid ─────────────────────────────────
const render = () => {
  const map        = document.getElementById('map');
  const searchTerm = document.getElementById('searchBox')?.value?.toLowerCase() || '';
  const filterStatus = document.getElementById('statusFilter')?.value || '';
  map.innerHTML = '';

  const grouped = {};
  servers.forEach(srv => {
    const nameMatch = srv.name.toLowerCase().includes(searchTerm) || srv.ip.includes(searchTerm);
    const statusMatch = filterStatus === '' || srv.status === filterStatus;
    if (nameMatch && statusMatch) {
      const key = 'Rack ' + srv.rack;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(srv);
    }
  });

  renderStats(servers);

  if (Object.keys(grouped).length === 0) {
    map.innerHTML = '<p style="color:var(--muted);font-size:13px;grid-column:1/-1;">No servers match your filter.</p>';
    return;
  }

  for (const rack in grouped) {
    const rackNum = grouped[rack][0].rack;
    const rackEl = document.createElement('div');
    rackEl.className = 'dc-rack';

    rackEl.innerHTML = `
      <div class="dc-rack-header" style="${isAdmin ? 'cursor:pointer' : ''}">
        <span>${rack}</span>
        <span class="dc-rack-count">${grouped[rack].length} server${grouped[rack].length !== 1 ? 's' : ''}</span>
      </div>
      <div class="dc-rack-body" id="rack-body-${rackNum}"></div>
    `;

    if (isAdmin) {
      rackEl.querySelector('.dc-rack-header').onclick = () => showAddForm(rackNum);
    }

    const body = rackEl.querySelector(`#rack-body-${rackNum}`);
    grouped[rack].forEach(srv => {
      const srvEl = document.createElement('div');
      srvEl.className = `dc-server ${statusServerClass(srv.status)}`;
      srvEl.innerHTML = `
        <div class="dc-status-dot ${statusClass(srv.status)}"></div>
        <div class="dc-server-name" title="${srv.ip}">${srv.name}</div>
      `;
      srvEl.onclick = (e) => { e.stopPropagation(); showServerDetail(srv); };
      body.appendChild(srvEl);
    });

    map.appendChild(rackEl);
  }
};

// ── close panel ──────────────────────────────────────
function closePanel() {
  document.getElementById('detailPanel').style.display = 'none';
}

// ── server detail ────────────────────────────────────
function showServerDetail(srv) {
  const panel = document.getElementById('detailPanel');
  const body  = document.getElementById('panelBody');
  document.getElementById('panelTitle').textContent = `Server — ${srv.name}`;
  panel.style.display = '';

  const statusBadgeColor = srv.status === 'Active' ? 'var(--success)' : srv.status === 'Down' ? 'var(--danger)' : 'var(--warning)';

  if (!isAdmin) {
    body.innerHTML = `
      <div class="dc-grid-3" style="gap:16px;">
        <div><div class="dc-label">Name</div><div style="font-family:var(--mono);font-size:14px;">${srv.name}</div></div>
        <div><div class="dc-label">IP Address</div><div style="font-family:var(--mono);font-size:14px;">${srv.ip}</div></div>
        <div><div class="dc-label">Status</div><div style="color:${statusBadgeColor};font-family:var(--mono);font-size:14px;">${srv.status}</div></div>
        <div><div class="dc-label">CPU</div><div style="font-size:14px;">${srv.cpu}</div></div>
        <div><div class="dc-label">RAM</div><div style="font-size:14px;">${srv.ram}</div></div>
        <div><div class="dc-label">Rack / Row</div><div style="font-size:14px;">${srv.rack} / ${srv.row}</div></div>
        <div><div class="dc-label">Last Maintenance</div><div style="font-size:14px;">${srv.last_maintenance}</div></div>
      </div>`;
    return;
  }

  body.innerHTML = `
    <div class="dc-grid-3">
      <div class="dc-field">
        <label class="dc-label">Name</label>
        <input class="dc-input" id="editName" value="${srv.name}">
      </div>
      <div class="dc-field">
        <label class="dc-label">IP Address</label>
        <input class="dc-input" readonly value="${srv.ip}" style="opacity:.6;cursor:not-allowed;">
      </div>
      <div class="dc-field">
        <label class="dc-label">Status</label>
        <select class="dc-input" id="editStatus">
          <option ${srv.status==='Active'?'selected':''}>Active</option>
          <option ${srv.status==='Down'?'selected':''}>Down</option>
          <option ${srv.status==='Maintenance'?'selected':''}>Maintenance</option>
          <option ${srv.status==='Unreachable'?'selected':''}>Unreachable</option>
        </select>
      </div>
      <div class="dc-field">
        <label class="dc-label">CPU</label>
        <input class="dc-input" id="editCPU" value="${srv.cpu}">
      </div>
      <div class="dc-field">
        <label class="dc-label">RAM</label>
        <input class="dc-input" id="editRAM" value="${srv.ram}">
      </div>
      <div class="dc-field">
        <label class="dc-label">Rack</label>
        <input class="dc-input" id="editRack" type="number" value="${srv.rack}">
      </div>
      <div class="dc-field">
        <label class="dc-label">Row</label>
        <input class="dc-input" id="editRow" value="${srv.row}">
      </div>
      <div class="dc-field">
        <label class="dc-label">Last Maintenance</label>
        <input class="dc-input" id="editLast" value="${srv.last_maintenance}">
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px;">
      <button class="btn-dc btn-dc-success" onclick="saveServer('${srv.ip}')">💾 Save Changes</button>
      <button class="btn-dc btn-dc-danger" onclick="deleteServer('${srv.ip}')">✕ Delete Server</button>
    </div>`;
}

// ── add server form ───────────────────────────────────
function showAddForm(rackId) {
  if (!isAdmin) return;
  const panel = document.getElementById('detailPanel');
  const body  = document.getElementById('panelBody');
  document.getElementById('panelTitle').textContent = `Add Server to Rack ${rackId}`;
  panel.style.display = '';

  body.innerHTML = `
    <div class="dc-grid-3">
      <div class="dc-field"><label class="dc-label">Name</label><input class="dc-input" id="addName" placeholder="e.g. WebServer-4"></div>
      <div class="dc-field"><label class="dc-label">IP Address</label><input class="dc-input" id="addIP" placeholder="e.g. 10.0.1.5"></div>
      <div class="dc-field">
        <label class="dc-label">Status</label>
        <select class="dc-input" id="addStatus">
          <option>Active</option><option>Down</option><option>Maintenance</option><option>Unreachable</option>
        </select>
      </div>
      <div class="dc-field"><label class="dc-label">CPU</label><input class="dc-input" id="addCPU" placeholder="e.g. 8 cores"></div>
      <div class="dc-field"><label class="dc-label">RAM</label><input class="dc-input" id="addRAM" placeholder="e.g. 32GB"></div>
      <div class="dc-field"><label class="dc-label">Rack</label><input class="dc-input" id="addRack" type="number" value="${rackId}"></div>
      <div class="dc-field"><label class="dc-label">Row</label><input class="dc-input" id="addRow" placeholder="e.g. A"></div>
      <div class="dc-field"><label class="dc-label">Last Maintenance</label><input class="dc-input" id="addLast" placeholder="e.g. 2025-06-01"></div>
    </div>
    <div style="margin-top:4px;">
      <button class="btn-dc btn-dc-primary" onclick="addServer()">+ Add Server</button>
    </div>`;
}

// ── API calls ─────────────────────────────────────────
function addServer() {
  const payload = {
    name: document.getElementById('addName').value.trim(),
    ip:   document.getElementById('addIP').value.trim(),
    status: document.getElementById('addStatus').value,
    cpu:  document.getElementById('addCPU').value.trim(),
    ram:  document.getElementById('addRAM').value.trim(),
    rack: parseInt(document.getElementById('addRack').value),
    row:  document.getElementById('addRow').value.trim(),
    last_maintenance: document.getElementById('addLast').value.trim()
  };
  axios.post('/api/add', payload)
    .then(() => axios.get('/api/data'))
    .then(res => { servers = res.data; render(); closePanel(); })
    .catch(err => alert('Add failed: ' + (err.response?.data?.error || 'Unknown')));
}

function saveServer(ip) {
  if (!isAdmin) return;
  const payload = {
    ip,
    name: document.getElementById('editName').value.trim(),
    status: document.getElementById('editStatus').value,
    cpu:  document.getElementById('editCPU').value.trim(),
    ram:  document.getElementById('editRAM').value.trim(),
    rack: parseInt(document.getElementById('editRack').value),
    row:  document.getElementById('editRow').value.trim(),
    last_maintenance: document.getElementById('editLast').value.trim()
  };
  axios.post('/api/update', payload)
    .then(() => axios.get('/api/data'))
    .then(res => { servers = res.data; render(); closePanel(); })
    .catch(err => alert('Save failed: ' + (err.response?.data?.error || 'Unknown')));
}

function deleteServer(ip) {
  if (!isAdmin) return;
  if (!confirm(`Delete server ${ip}?`)) return;
  axios.post('/api/delete', { ip })
    .then(() => axios.get('/api/data'))
    .then(res => { servers = res.data; render(); closePanel(); });
}

function showDeleteRackForm() {
  if (!isAdmin) return;
  const panel = document.getElementById('detailPanel');
  const body  = document.getElementById('panelBody');
  document.getElementById('panelTitle').textContent = 'Delete Rack';
  panel.style.display = '';
  body.innerHTML = `
    <div style="display:flex;align-items:flex-end;gap:10px;">
      <div class="dc-field" style="margin:0;">
        <label class="dc-label">Rack Number</label>
        <input class="dc-input" type="number" id="deleteRackId" placeholder="e.g. 3" style="width:160px;">
      </div>
      <button class="btn-dc btn-dc-danger" onclick="deleteRack()">✕ Delete Rack</button>
    </div>
    <p style="color:var(--muted);font-size:12px;margin-top:10px;">⚠ This will delete all servers in the rack.</p>`;
}

function deleteRack() {
  if (!isAdmin) return;
  const rackId = parseInt(document.getElementById('deleteRackId').value);
  if (isNaN(rackId)) { alert('Enter a valid rack number'); return; }
  if (!confirm(`Delete all servers in Rack ${rackId}?`)) return;
  axios.post('/api/delete_rack', { rack: rackId })
    .then(() => axios.get('/api/data'))
    .then(res => { servers = res.data; render(); closePanel(); });
}

function addRack() {
  if (!isAdmin) return;
  const rackId = parseInt(document.getElementById('newRack').value);
  if (isNaN(rackId)) { alert('Enter a valid rack number'); return; }
  showAddForm(rackId);
}

// ── init ──────────────────────────────────────────────
axios.get('/api/data').then(res => {
  servers = res.data;
  render();
});

document.getElementById('searchBox')?.addEventListener('input', render);
document.getElementById('statusFilter')?.addEventListener('change', render);
