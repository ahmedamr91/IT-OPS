import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertTriangle, Bell, Boxes, Building2, CheckCircle2, ChevronRight,
  Eye, FileText, Laptop, LayoutDashboard, Lock, Package, Search,
  Shield, Sparkles, Users, WalletCards
} from 'lucide-react';
import './styles.css';

const routeToRole = {
  'it-admin': 'IT_ADMIN',
  'helpdesk': 'HELPDESK',
  'security': 'SECURITY',
  'hr': 'HR',
  'finance': 'FINANCE',
  'viewer': 'VIEWER'
};

const roleToRoute = {
  IT_ADMIN: 'it-admin',
  HELPDESK: 'helpdesk',
  SECURITY: 'security',
  HR: 'hr',
  FINANCE: 'finance',
  VIEWER: 'viewer'
};

const roles = {
  IT_ADMIN: { label: 'IT Admin', access: ['dashboard','users','devices','assets','hr','finance','security','reports','audit'] },
  HELPDESK: { label: 'Helpdesk', access: ['dashboard','users','devices','assets','reports'] },
  SECURITY: { label: 'Security', access: ['dashboard','users','devices','security','reports','audit'] },
  HR: { label: 'HR', access: ['dashboard','hr'] },
  FINANCE: { label: 'Finance', access: ['dashboard','finance','reports'] },
  VIEWER: { label: 'Viewer', access: ['dashboard','users','devices','assets'] }
};

const menu = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, group: 'Overview' },
  { id: 'users', label: 'M365 Users', icon: Users, group: 'Microsoft 365' },
  { id: 'devices', label: 'Intune Devices', icon: Laptop, group: 'Microsoft 365' },
  { id: 'assets', label: 'Asset Inventory', icon: Package, group: 'Operations' },
  { id: 'hr', label: 'HR Assets', icon: Building2, group: 'Operations' },
  { id: 'finance', label: 'Finance View', icon: WalletCards, group: 'Operations' },
  { id: 'security', label: 'Security Center', icon: Shield, group: 'Governance' },
  { id: 'reports', label: 'Reports', icon: FileText, group: 'Governance' },
  { id: 'audit', label: 'Audit Trail', icon: Activity, group: 'Governance' }
];

const users = [
  { name: 'Ahmed Hassan', upn: 'ahmed.hassan@trufla.com', department: 'IT', title: 'IT Manager', mfa: 'Enabled', status: 'Enabled', risk: 'Low', last_signin: 'Today 08:45', license: 'M365 Business Premium + Intune' },
  { name: 'Mona Ali', upn: 'mona.ali@trufla.com', department: 'HR', title: 'HR Specialist', mfa: 'Enabled', status: 'Enabled', risk: 'Low', last_signin: 'Yesterday 17:10', license: 'M365 Business Premium' },
  { name: 'Omar Samir', upn: 'omar.samir@trufla.com', department: 'Engineering', title: 'Software Engineer', mfa: 'Disabled', status: 'Enabled', risk: 'Medium', last_signin: '2 days ago', license: 'M365 Business Premium + Intune' },
  { name: 'Sara Nabil', upn: 'sara.nabil@trufla.com', department: 'Finance', title: 'Accountant', mfa: 'Enabled', status: 'Enabled', risk: 'Low', last_signin: 'Today 09:20', license: 'M365 Business Premium' },
  { name: 'Disabled User', upn: 'disabled.user@trufla.com', department: 'Operations', title: 'Former Employee', mfa: 'Unknown', status: 'Disabled', risk: 'Low', last_signin: 'Jan 15', license: 'M365 Business Premium' }
];

const devices = [
  { name: 'TRU-LAP-001', user: 'ahmed.hassan@trufla.com', os: 'Windows 11 23H2', compliance: 'Compliant', encryption: 'Enabled', check_in: 'Today 08:30', model: 'Dell Latitude 7440', serial: 'SN-DLL-001' },
  { name: 'TRU-LAP-002', user: 'omar.samir@trufla.com', os: 'Windows 10 22H2', compliance: 'Non-compliant', encryption: 'Disabled', check_in: '8 days ago', model: 'HP EliteBook 840', serial: 'SN-HP-002' },
  { name: 'TRU-MAC-001', user: 'mona.ali@trufla.com', os: 'macOS 15', compliance: 'Compliant', encryption: 'Enabled', check_in: 'Today 09:20', model: 'MacBook Air', serial: 'SN-APL-003' },
  { name: 'TRU-LAP-004', user: 'sara.nabil@trufla.com', os: 'Windows 11 24H2', compliance: 'Compliant', encryption: 'Enabled', check_in: 'Today 10:05', model: 'Lenovo ThinkPad T14', serial: 'SN-LNV-004' },
  { name: 'TRU-LAP-OLD', user: '-', os: 'Windows 10 21H2', compliance: 'Non-compliant', encryption: 'Unknown', check_in: '63 days ago', model: 'Dell Latitude 5400', serial: 'SN-OLD-009' }
];

const assets = [
  { asset_tag: 'TRU-LAP-001', category: 'Laptop', status: 'Assigned', assigned_to: 'Ahmed Hassan', assigned_upn: 'ahmed.hassan@trufla.com', department: 'IT', location: 'Cairo', manufacturer: 'Dell', model: 'Latitude 7440', serial: 'SN-DLL-001', vendor: 'Dell', purchase_date: '2025-09-12', warranty_expiry: '2028-09-12', cost: 1350, condition: 'Good' },
  { asset_tag: 'TRU-LAP-002', category: 'Laptop', status: 'Assigned', assigned_to: 'Omar Samir', assigned_upn: 'omar.samir@trufla.com', department: 'Engineering', location: 'Cairo', manufacturer: 'HP', model: 'EliteBook 840', serial: 'SN-HP-002', vendor: 'HP', purchase_date: '2024-12-01', warranty_expiry: '2027-12-01', cost: 1200, condition: 'Good' },
  { asset_tag: 'TRU-MAC-001', category: 'Laptop', status: 'Assigned', assigned_to: 'Mona Ali', assigned_upn: 'mona.ali@trufla.com', department: 'HR', location: 'Cairo', manufacturer: 'Apple', model: 'MacBook Air', serial: 'SN-APL-003', vendor: 'Apple', purchase_date: '2025-03-20', warranty_expiry: '2028-03-20', cost: 1450, condition: 'Good' },
  { asset_tag: 'TRU-LAP-004', category: 'Laptop', status: 'Assigned', assigned_to: 'Sara Nabil', assigned_upn: 'sara.nabil@trufla.com', department: 'Finance', location: 'Cairo', manufacturer: 'Lenovo', model: 'ThinkPad T14', serial: 'SN-LNV-004', vendor: 'Lenovo', purchase_date: '2025-01-05', warranty_expiry: '2028-01-05', cost: 1280, condition: 'Good' },
  { asset_tag: 'TRU-DOCK-001', category: 'Dock', status: 'In Stock', assigned_to: '-', assigned_upn: '-', department: 'IT', location: 'IT Stock', manufacturer: 'Dell', model: 'WD19S', serial: 'SN-DOCK-001', vendor: 'Dell', purchase_date: '2025-02-11', warranty_expiry: '2028-02-11', cost: 210, condition: 'New' }
];

const audit = [
  { time: 'Today 09:00', actor: 'local.demo@trufla.com', role: 'IT Admin', action: 'Viewed dashboard', target: 'Command Center', result: 'Success' },
  { time: 'Today 09:05', actor: 'local.demo@trufla.com', role: 'Finance', action: 'Exported finance report', target: 'Assets', result: 'Success' },
  { time: 'Yesterday 16:20', actor: 'local.demo@trufla.com', role: 'Security', action: 'Reviewed findings', target: 'Security Center', result: 'Success' }
];

function getRoleFromHash() {
  const route = window.location.hash.replace('#/', '') || 'it-admin';
  return routeToRole[route] || 'IT_ADMIN';
}

function App() {
  const [role, setRole] = useState(getRoleFromHash());
  const [page, setPage] = useState('dashboard');
  const [q, setQ] = useState('');

  useEffect(() => {
    const onHash = () => setRole(getRoleFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!roles[role].access.includes(page)) setPage(roles[role].access[0]);
  }, [role]);

  function changeRole(nextRole) {
    window.location.hash = `/${roleToRoute[nextRole]}`;
  }

  const can = (id) => roles[role].access.includes(id);
  const visibleMenu = menu.filter(m => can(m.id));
  const filtered = (rows) => {
    if (!q) return rows || [];
    return (rows || []).filter(r => Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q.toLowerCase())));
  };

  const dashboard = useMemo(() => ({
    users: users.length,
    devices: devices.length,
    compliant: devices.filter(d => d.compliance === 'Compliant').length,
    non_compliant: devices.filter(d => d.compliance !== 'Compliant').length,
    users_without_mfa: users.filter(u => u.mfa !== 'Enabled').length,
    assets: assets.length,
    assigned_assets: assets.filter(a => a.status === 'Assigned').length,
    in_stock_assets: assets.filter(a => a.status === 'In Stock').length,
    total_cost: assets.reduce((sum, a) => sum + a.cost, 0)
  }), []);

  const hrRows = assets.map(a => ({
    employee: a.assigned_to,
    upn: a.assigned_upn,
    asset_tag: a.asset_tag,
    category: a.category,
    model: a.model,
    serial: a.serial,
    status: a.status,
    return_status: a.status === 'Assigned' ? 'Not Returned' : 'Available'
  }));

  const financeRows = assets.map(a => ({
    asset_tag: a.asset_tag,
    category: a.category,
    vendor: a.vendor,
    purchase_date: a.purchase_date,
    cost: a.cost,
    warranty_expiry: a.warranty_expiry,
    department: a.department,
    status: a.status
  }));

  const securityRows = [
    ...users.filter(u => u.mfa !== 'Enabled').map(u => ({ finding: 'MFA not enabled', target: u.upn, severity: 'High', owner: 'IT' })),
    ...devices.filter(d => d.compliance !== 'Compliant').map(d => ({ finding: 'Device non-compliant', target: d.name, severity: 'High', owner: 'Helpdesk' })),
    ...devices.filter(d => d.encryption !== 'Enabled').map(d => ({ finding: 'Encryption issue', target: d.name, severity: 'Medium', owner: 'Security' }))
  ];

  const reports = {
    non_compliant_devices: devices.filter(d => d.compliance !== 'Compliant'),
    users_without_mfa: users.filter(u => u.mfa !== 'Enabled'),
    windows_10_devices: devices.filter(d => d.os.includes('Windows 10')),
    warranty_assets: assets.map(a => ({ asset_tag: a.asset_tag, model: a.model, warranty_expiry: a.warranty_expiry, assigned_to: a.assigned_to }))
  };

  const title = menu.find(m => m.id === page)?.label || 'Command Center';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={22}/></div>
          <div><h2>Trufla IT</h2><p>Static Portal Demo</p></div>
        </div>
        <div className="role-card">
          <span>Static role route</span>
          <select value={role} onChange={e => changeRole(e.target.value)}>
            {Object.entries(roles).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <nav className="nav">
          {['Overview','Microsoft 365','Operations','Governance'].map(group => {
            const items = visibleMenu.filter(m => m.group === group);
            if (!items.length) return null;
            return <div className="nav-group" key={group}><p>{group}</p>{items.map(item => {
              const Icon = item.icon;
              return <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}><Icon size={18}/><span>{item.label}</span></button>
            })}</div>
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Home <ChevronRight size={14}/> {roles[role].label} <ChevronRight size={14}/> {title}</div>
            <h1>{title}</h1>
            <p>GitHub Pages static demo with dedicated role routes and realistic dummy data.</p>
          </div>
          <div className="top-actions">
            <div className="global-search"><Search size={18}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search current page..." /></div>
            <button className="icon-btn"><Bell size={18}/></button>
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <span className="eyebrow">GitHub Pages Ready</span>
            <h2>Static portal experience for each role.</h2>
            <p>Use `/#/it-admin`, `/#/hr`, `/#/finance`, `/#/security`, `/#/helpdesk`, or `/#/viewer`.</p>
          </div>
          <div className="role-pills">
            {Object.entries(roles).map(([k, v]) => <button key={k} className={role === k ? 'selected' : ''} onClick={() => changeRole(k)}>{v.label}</button>)}
          </div>
        </section>

        {page === 'dashboard' && <Dashboard d={dashboard} assets={assets} />}
        {page === 'users' && <DataPanel title="Microsoft 365 Users" rows={filtered(users)} />}
        {page === 'devices' && <DataPanel title="Intune Devices" rows={filtered(devices)} />}
        {page === 'assets' && <DataPanel title="Asset Inventory" rows={filtered(assets)} />}
        {page === 'hr' && <DataPanel title="HR Asset View" rows={filtered(hrRows)} />}
        {page === 'finance' && <DataPanel title="Finance Asset View" rows={filtered(financeRows)} />}
        {page === 'security' && <DataPanel title="Security Findings" rows={filtered(securityRows)} />}
        {page === 'reports' && <Reports reports={reports} />}
        {page === 'audit' && <DataPanel title="Audit Trail" rows={filtered(audit)} />}
      </main>
    </div>
  );
}

function Dashboard({ d, assets }) {
  const cards = [
    ['Users', d.users, Users, 'blue'],
    ['Devices', d.devices, Laptop, 'cyan'],
    ['Compliant', d.compliant, CheckCircle2, 'green'],
    ['Risks', d.non_compliant, AlertTriangle, 'red'],
    ['Assets', d.assets, Package, 'purple'],
    ['Stock', d.in_stock_assets, Boxes, 'orange'],
    ['Asset Value', `$${Number(d.total_cost || 0).toLocaleString()}`, WalletCards, 'indigo'],
    ['MFA Gaps', d.users_without_mfa, Lock, 'red']
  ];

  return <>
    <div className="kpi-grid">{cards.map(([title, value, Icon, tone]) => <Kpi key={title} title={title} value={value} icon={Icon} tone={tone}/>)}</div>
    <div className="dashboard-grid">
      <section className="glass-panel"><div className="panel-head"><h3>Security posture</h3><span className="score-badge">82%</span></div><Progress label="MFA Coverage" value={78}/><Progress label="Device Compliance" value={60}/><Progress label="Asset Traceability" value={94}/></section>
      <section className="glass-panel"><div className="panel-head"><h3>Priority alerts</h3><span>Today</span></div><AlertItem tone="red" title="Non-compliant devices detected" text="Review Windows 10 and encryption status."/><AlertItem tone="orange" title="Users missing MFA" text="Complete MFA registration before production."/><AlertItem tone="blue" title="Static role routes enabled" text="GitHub Pages demo is ready." /></section>
    </div>
    <DataPanel title="Recent Assets" rows={assets.slice(0,5)} />
  </>
}

function Reports({ reports }) {
  return <>
    <div className="report-grid">{Object.entries(reports).map(([key, rows]) => <section className="report-card" key={key}><FileText size={24}/><strong>{rows.length}</strong><span>{formatLabel(key)}</span></section>)}</div>
    {Object.entries(reports).map(([key, rows]) => <DataPanel key={key} title={formatLabel(key)} rows={rows}/>)}
  </>
}

function Kpi({ title, value, icon: Icon, tone }) {
  return <section className={`kpi-card ${tone}`}><div className="kpi-icon"><Icon size={22}/></div><div><span>{title}</span><strong>{value}</strong></div></section>
}

function DataPanel({ title, rows }) {
  return <section className="table-card"><div className="panel-head"><h3>{title}</h3><span>{rows?.length || 0} records</span></div><DataTable rows={rows || []}/></section>
}

function DataTable({ rows }) {
  if (!rows.length) return <div className="empty-state"><Eye size={28}/><strong>No data available</strong></div>;
  const cols = Object.keys(rows[0]).filter(c => c !== 'id');
  return <div className="table-wrap"><table><thead><tr>{cols.map(c => <th key={c}>{formatLabel(c)}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{cols.map(c => <td key={c}><Cell value={row[c]}/></td>)}</tr>)}</tbody></table></div>
}

function Cell({ value }) {
  const s = String(value ?? '');
  const l = s.toLowerCase();
  let cls = '';
  if (['enabled','compliant','assigned','good','success','low','new'].some(x => l.includes(x))) cls = 'good';
  if (['disabled','non-compliant','high'].some(x => l.includes(x))) cls = 'bad';
  if (['unknown','medium','stock','not returned'].some(x => l.includes(x))) cls = 'warn';
  if (cls) return <span className={`status-pill ${cls}`}>{s}</span>;
  return <span>{s || '-'}</span>;
}

function Progress({ label, value }) {
  return <div className="progress-item"><div><span>{label}</span><strong>{value}%</strong></div><div className="progress"><i style={{ width: `${value}%` }}/></div></div>
}

function AlertItem({ tone, title, text }) {
  return <div className={`alert-item ${tone}`}><div/><section><strong>{title}</strong><span>{text}</span></section></div>
}

function formatLabel(text) {
  return String(text).replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}

createRoot(document.getElementById('root')).render(<App />);
