import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, AlertTriangle, Archive, Bell, Boxes, Building2, CheckCircle2,
  ChevronRight, ClipboardList, Download, Eye, FileText, HardDrive, Laptop,
  LayoutDashboard, Lock, Package, Pencil, Plus, RefreshCcw, Search, Shield,
  Sparkles, Trash2, Upload, Users, WalletCards, X
} from 'lucide-react';
import './styles.css';

type RoleKey = 'IT_ADMIN' | 'HELPDESK' | 'SECURITY' | 'HR' | 'FINANCE' | 'VIEWER';

type Asset = {
  id: string;
  assetTag: string;
  category: string;
  status: string;
  assignedTo: string;
  assignedUpn: string;
  department: string;
  location: string;
  manufacturer: string;
  model: string;
  serial: string;
  deviceName: string;
  vendor: string;
  purchaseDate: string;
  warrantyExpiry: string;
  cost: number | string;
  invoice: string;
  condition: string;
  notes: string;
};

const STORAGE_KEY = 'it_ops_saas_static_pro_v1';

const routeToRole: Record<string, RoleKey> = {
  'it-admin': 'IT_ADMIN',
  'helpdesk': 'HELPDESK',
  'security': 'SECURITY',
  'hr': 'HR',
  'finance': 'FINANCE',
  'viewer': 'VIEWER'
};

const roleToRoute: Record<RoleKey, string> = {
  IT_ADMIN: 'it-admin',
  HELPDESK: 'helpdesk',
  SECURITY: 'security',
  HR: 'hr',
  FINANCE: 'finance',
  VIEWER: 'viewer'
};

const roles: Record<RoleKey, { label: string; access: string[]; description: string }> = {
  IT_ADMIN: {
    label: 'IT Admin',
    access: ['dashboard', 'users', 'devices', 'assets', 'hr', 'finance', 'security', 'reports', 'audit'],
    description: 'Full operational visibility across IT, security, assets and reports.'
  },
  HELPDESK: {
    label: 'Helpdesk',
    access: ['dashboard', 'users', 'devices', 'assets', 'reports'],
    description: 'Support users, devices and asset inventory.'
  },
  SECURITY: {
    label: 'Security',
    access: ['dashboard', 'users', 'devices', 'security', 'reports', 'audit'],
    description: 'Review risks, MFA gaps, compliance and audit activity.'
  },
  HR: {
    label: 'HR',
    access: ['dashboard', 'hr'],
    description: 'View employee asset assignments and return status only.'
  },
  FINANCE: {
    label: 'Finance',
    access: ['dashboard', 'finance', 'reports'],
    description: 'Review asset costs, vendors, warranty and finance exports.'
  },
  VIEWER: {
    label: 'Viewer',
    access: ['dashboard', 'users', 'devices', 'assets'],
    description: 'Read-only overview of core IT information.'
  }
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

const blankAsset: Asset = {
  id: '',
  assetTag: '',
  category: 'Laptop',
  status: 'In Stock',
  assignedTo: '',
  assignedUpn: '',
  department: '',
  location: 'Cairo',
  manufacturer: '',
  model: '',
  serial: '',
  deviceName: '',
  vendor: '',
  purchaseDate: '',
  warrantyExpiry: '',
  cost: '',
  invoice: '',
  condition: 'Good',
  notes: ''
};

function id() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function now() {
  return new Date().toLocaleString();
}

function initialData() {
  return {
    users: [
      { name: 'Ahmed Hassan', upn: 'ahmed.hassan@trufla.com', department: 'IT', title: 'IT Manager', mfa: 'Enabled', status: 'Enabled', risk: 'Low', lastSignIn: 'Today 08:45', license: 'M365 Business Premium + Intune' },
      { name: 'Mona Ali', upn: 'mona.ali@trufla.com', department: 'HR', title: 'HR Specialist', mfa: 'Enabled', status: 'Enabled', risk: 'Low', lastSignIn: 'Yesterday 17:10', license: 'M365 Business Premium' },
      { name: 'Omar Samir', upn: 'omar.samir@trufla.com', department: 'Engineering', title: 'Software Engineer', mfa: 'Disabled', status: 'Enabled', risk: 'Medium', lastSignIn: '2 days ago', license: 'M365 Business Premium + Intune' },
      { name: 'Sara Nabil', upn: 'sara.nabil@trufla.com', department: 'Finance', title: 'Accountant', mfa: 'Enabled', status: 'Enabled', risk: 'Low', lastSignIn: 'Today 09:20', license: 'M365 Business Premium' },
      { name: 'Disabled User', upn: 'disabled.user@trufla.com', department: 'Operations', title: 'Former Employee', mfa: 'Unknown', status: 'Disabled', risk: 'Low', lastSignIn: 'Jan 15', license: 'M365 Business Premium' }
    ],
    devices: [
      { name: 'TRU-LAP-001', user: 'ahmed.hassan@trufla.com', os: 'Windows 11 23H2', compliance: 'Compliant', encryption: 'Enabled', checkIn: 'Today 08:30', model: 'Dell Latitude 7440', serial: 'SN-DLL-001' },
      { name: 'TRU-LAP-002', user: 'omar.samir@trufla.com', os: 'Windows 10 22H2', compliance: 'Non-compliant', encryption: 'Disabled', checkIn: '8 days ago', model: 'HP EliteBook 840', serial: 'SN-HP-002' },
      { name: 'TRU-MAC-001', user: 'mona.ali@trufla.com', os: 'macOS 15', compliance: 'Compliant', encryption: 'Enabled', checkIn: 'Today 09:20', model: 'MacBook Air', serial: 'SN-APL-003' },
      { name: 'TRU-LAP-004', user: 'sara.nabil@trufla.com', os: 'Windows 11 24H2', compliance: 'Compliant', encryption: 'Enabled', checkIn: 'Today 10:05', model: 'Lenovo ThinkPad T14', serial: 'SN-LNV-004' },
      { name: 'TRU-LAP-OLD', user: '-', os: 'Windows 10 21H2', compliance: 'Non-compliant', encryption: 'Unknown', checkIn: '63 days ago', model: 'Dell Latitude 5400', serial: 'SN-OLD-009' }
    ],
    assets: [
      { id: id(), assetTag: 'TRU-LAP-001', category: 'Laptop', status: 'Assigned', assignedTo: 'Ahmed Hassan', assignedUpn: 'ahmed.hassan@trufla.com', department: 'IT', location: 'Cairo', manufacturer: 'Dell', model: 'Latitude 7440', serial: 'SN-DLL-001', deviceName: 'TRU-LAP-001', vendor: 'Dell', purchaseDate: '2025-09-12', warrantyExpiry: '2028-09-12', cost: 1350, invoice: 'INV-1001', condition: 'Good', notes: 'Primary IT laptop' },
      { id: id(), assetTag: 'TRU-LAP-002', category: 'Laptop', status: 'Assigned', assignedTo: 'Omar Samir', assignedUpn: 'omar.samir@trufla.com', department: 'Engineering', location: 'Cairo', manufacturer: 'HP', model: 'EliteBook 840', serial: 'SN-HP-002', deviceName: 'TRU-LAP-002', vendor: 'HP', purchaseDate: '2024-12-01', warrantyExpiry: '2027-12-01', cost: 1200, invoice: 'INV-1002', condition: 'Good', notes: 'Non-compliant in Intune mock data' },
      { id: id(), assetTag: 'TRU-MAC-001', category: 'Laptop', status: 'Assigned', assignedTo: 'Mona Ali', assignedUpn: 'mona.ali@trufla.com', department: 'HR', location: 'Cairo', manufacturer: 'Apple', model: 'MacBook Air', serial: 'SN-APL-003', deviceName: 'TRU-MAC-001', vendor: 'Apple', purchaseDate: '2025-03-20', warrantyExpiry: '2028-03-20', cost: 1450, invoice: 'INV-1003', condition: 'Good', notes: 'HR laptop' },
      { id: id(), assetTag: 'TRU-LAP-004', category: 'Laptop', status: 'Assigned', assignedTo: 'Sara Nabil', assignedUpn: 'sara.nabil@trufla.com', department: 'Finance', location: 'Cairo', manufacturer: 'Lenovo', model: 'ThinkPad T14', serial: 'SN-LNV-004', deviceName: 'TRU-LAP-004', vendor: 'Lenovo', purchaseDate: '2025-01-05', warrantyExpiry: '2028-01-05', cost: 1280, invoice: 'INV-1004', condition: 'Good', notes: 'Finance laptop' },
      { id: id(), assetTag: 'TRU-DOCK-001', category: 'Dock', status: 'In Stock', assignedTo: '', assignedUpn: '', department: 'IT', location: 'IT Stock', manufacturer: 'Dell', model: 'WD19S', serial: 'SN-DOCK-001', deviceName: '', vendor: 'Dell', purchaseDate: '2025-02-11', warrantyExpiry: '2028-02-11', cost: 210, invoice: 'INV-1006', condition: 'New', notes: 'Available stock' }
    ],
    audit: [
      { id: id(), time: now(), actor: 'local.demo@trufla.com', role: 'System', action: 'Seeded demo data', target: 'localStorage', result: 'Success' }
    ]
  };
}

function getRoleFromHash(): RoleKey {
  const route = window.location.hash.replace('#/', '') || 'it-admin';
  return routeToRole[route] || 'IT_ADMIN';
}

function App() {
  const [role, setRole] = useState<RoleKey>(getRoleFromHash());
  const [page, setPage] = useState('dashboard');
  const [q, setQ] = useState('');
  const [editingId, setEditingId] = useState('');
  const [assetForm, setAssetForm] = useState<Asset>(blankAsset);
  const [notice, setNotice] = useState('');

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const onHash = () => setRole(getRoleFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    if (!roles[role].access.includes(page)) setPage(roles[role].access[0]);
  }, [role]);

  function audit(action: string, target: string) {
    setData((prev: any) => ({
      ...prev,
      audit: [{ id: id(), time: now(), actor: 'local.demo@trufla.com', role: roles[role].label, action, target, result: 'Success' }, ...prev.audit]
    }));
  }

  function changeRole(nextRole: RoleKey) {
    window.location.hash = `/${roleToRoute[nextRole]}`;
  }

  function saveAsset(e: React.FormEvent) {
    e.preventDefault();
    if (!assetForm.assetTag.trim()) {
      setNotice('Asset tag is required');
      return;
    }

    const duplicate = data.assets.some((a: Asset) => a.assetTag.toLowerCase() === assetForm.assetTag.toLowerCase() && a.id !== editingId);
    if (duplicate) {
      setNotice('Asset tag already exists');
      return;
    }

    if (editingId) {
      setData((prev: any) => ({
        ...prev,
        assets: prev.assets.map((a: Asset) => a.id === editingId ? { ...assetForm, id: editingId, cost: Number(assetForm.cost || 0) } : a)
      }));
      audit('Updated asset', assetForm.assetTag);
      setNotice('Asset updated successfully');
    } else {
      const newAsset = { ...assetForm, id: id(), cost: Number(assetForm.cost || 0) };
      setData((prev: any) => ({ ...prev, assets: [newAsset, ...prev.assets] }));
      audit('Created asset', newAsset.assetTag);
      setNotice('Asset created successfully');
    }

    setAssetForm(blankAsset);
    setEditingId('');
  }

  function editAsset(asset: Asset) {
    setAssetForm(asset);
    setEditingId(asset.id);
    setNotice(`Editing ${asset.assetTag}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteAsset(asset: Asset) {
    setData((prev: any) => ({ ...prev, assets: prev.assets.filter((a: Asset) => a.id !== asset.id) }));
    audit('Deleted asset', asset.assetTag);
    setNotice(`Deleted ${asset.assetTag}`);
  }

  function resetDemo() {
    setData(initialData());
    setAssetForm(blankAsset);
    setEditingId('');
    setNotice('Demo data reset');
  }

  function exportCsv(rows: any[], filename: string) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).filter(k => k !== 'id');
    const csv = [
      headers.join(','),
      ...rows.map(row => headers.map(h => `"${String(row[h] ?? '').replaceAll('"', '""')}"`).join(','))
    ].join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    audit('Exported CSV', filename);
  }

  const visibleMenu = menu.filter(m => roles[role].access.includes(m.id));
  const title = menu.find(m => m.id === page)?.label || 'Command Center';

  const filtered = (rows: any[]) => {
    if (!q) return rows || [];
    return (rows || []).filter(row => Object.values(row).some(v => String(v ?? '').toLowerCase().includes(q.toLowerCase())));
  };

  const stats = useMemo(() => {
    const assets = data.assets || [];
    const devices = data.devices || [];
    const users = data.users || [];
    return {
      users: users.length,
      devices: devices.length,
      compliant: devices.filter((d: any) => d.compliance === 'Compliant').length,
      nonCompliant: devices.filter((d: any) => d.compliance !== 'Compliant').length,
      usersWithoutMfa: users.filter((u: any) => u.mfa !== 'Enabled').length,
      assets: assets.length,
      assigned: assets.filter((a: Asset) => a.status === 'Assigned').length,
      inStock: assets.filter((a: Asset) => a.status === 'In Stock').length,
      totalCost: assets.reduce((sum: number, a: Asset) => sum + Number(a.cost || 0), 0)
    };
  }, [data]);

  const hrRows = data.assets.map((a: Asset) => ({
    employee: a.assignedTo || '-',
    upn: a.assignedUpn || '-',
    assetTag: a.assetTag,
    category: a.category,
    model: a.model,
    serial: a.serial,
    status: a.status,
    returnStatus: a.status === 'Assigned' ? 'Not Returned' : 'Available',
    location: a.location
  }));

  const financeRows = data.assets.map((a: Asset) => ({
    assetTag: a.assetTag,
    category: a.category,
    vendor: a.vendor,
    purchaseDate: a.purchaseDate,
    cost: a.cost,
    warrantyExpiry: a.warrantyExpiry,
    department: a.department,
    status: a.status,
    invoice: a.invoice
  }));

  const securityRows = [
    ...data.users.filter((u: any) => u.mfa !== 'Enabled').map((u: any) => ({ finding: 'MFA not enabled', target: u.upn, severity: 'High', owner: 'IT', recommendation: 'Require MFA registration' })),
    ...data.devices.filter((d: any) => d.compliance !== 'Compliant').map((d: any) => ({ finding: 'Device non-compliant', target: d.name, severity: 'High', owner: 'Helpdesk', recommendation: 'Review Intune policy' })),
    ...data.devices.filter((d: any) => d.encryption !== 'Enabled').map((d: any) => ({ finding: 'Encryption issue', target: d.name, severity: 'Medium', owner: 'Security', recommendation: 'Enable BitLocker/FileVault' }))
  ];

  const reports = {
    nonCompliantDevices: data.devices.filter((d: any) => d.compliance !== 'Compliant'),
    usersWithoutMfa: data.users.filter((u: any) => u.mfa !== 'Enabled'),
    windows10Devices: data.devices.filter((d: any) => d.os.includes('Windows 10')),
    warrantyAssets: data.assets.map((a: Asset) => ({ assetTag: a.assetTag, model: a.model, warrantyExpiry: a.warrantyExpiry, assignedTo: a.assignedTo }))
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Sparkles size={22} /></div>
          <div><h2>IT Ops</h2><p>SaaS Portal Demo</p></div>
        </div>

        <div className="role-card">
          <span>Static role route</span>
          <select value={role} onChange={e => changeRole(e.target.value as RoleKey)}>
            {Object.entries(roles).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <p>{roles[role].description}</p>
        </div>

        <nav className="nav">
          {['Overview', 'Microsoft 365', 'Operations', 'Governance'].map(group => {
            const items = visibleMenu.filter(item => item.group === group);
            if (!items.length) return null;
            return (
              <div className="nav-group" key={group}>
                <p>{group}</p>
                {items.map(item => {
                  const Icon = item.icon;
                  return <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}><Icon size={18}/><span>{item.label}</span></button>;
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <div className="breadcrumb">Home <ChevronRight size={14}/> {roles[role].label} <ChevronRight size={14}/> {title}</div>
            <h1>{title}</h1>
            <p>Professional static demo with localStorage, role routes and working asset workflows.</p>
          </div>
          <div className="top-actions">
            <div className="global-search"><Search size={18}/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search current page..." /></div>
            <button className="icon-btn" onClick={resetDemo}><RefreshCcw size={18}/></button>
            <button className="icon-btn"><Bell size={18}/></button>
          </div>
        </header>

        <section className="hero-panel">
          <div>
            <span className="eyebrow">GitHub Pages Ready</span>
            <h2>Static role-based IT operations portal.</h2>
            <p>Use the role routes or role buttons to preview IT Admin, Helpdesk, Security, HR, Finance and Viewer experiences.</p>
          </div>
          <div className="role-pills">
            {Object.entries(roles).map(([k, v]) => <button key={k} className={role === k ? 'selected' : ''} onClick={() => changeRole(k as RoleKey)}>{v.label}</button>)}
          </div>
        </section>

        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')}><X size={16}/></button></div>}

        {page === 'dashboard' && <Dashboard stats={stats} assets={data.assets} securityRows={securityRows} />}
        {page === 'users' && <DataPanel title="Microsoft 365 Users" rows={filtered(data.users)} exportCsv={() => exportCsv(data.users, 'm365-users.csv')} />}
        {page === 'devices' && <DataPanel title="Intune Managed Devices" rows={filtered(data.devices)} exportCsv={() => exportCsv(data.devices, 'intune-devices.csv')} />}
        {page === 'assets' && <AssetsPage rows={filtered(data.assets)} form={assetForm} setForm={setAssetForm} editing={!!editingId} save={saveAsset} cancel={() => { setEditingId(''); setAssetForm(blankAsset); }} edit={editAsset} del={deleteAsset} exportCsv={() => exportCsv(data.assets, 'assets.csv')} />}
        {page === 'hr' && <DataPanel title="HR Asset Assignment View" rows={filtered(hrRows)} exportCsv={() => exportCsv(hrRows, 'hr-assets.csv')} />}
        {page === 'finance' && <DataPanel title="Finance Asset View" rows={filtered(financeRows)} exportCsv={() => exportCsv(financeRows, 'finance-assets.csv')} />}
        {page === 'security' && <SecurityPage rows={filtered(securityRows)} />}
        {page === 'reports' && <ReportsPage reports={reports} exportCsv={exportCsv} />}
        {page === 'audit' && <DataPanel title="Audit Trail" rows={filtered(data.audit)} exportCsv={() => exportCsv(data.audit, 'audit.csv')} />}
      </main>
    </div>
  );
}

function Dashboard({ stats, assets, securityRows }: any) {
  const cards = [
    ['Users', stats.users, Users, 'blue'],
    ['Devices', stats.devices, Laptop, 'cyan'],
    ['Compliant', stats.compliant, CheckCircle2, 'green'],
    ['Risks', stats.nonCompliant, AlertTriangle, 'red'],
    ['Assets', stats.assets, Package, 'purple'],
    ['In Stock', stats.inStock, Boxes, 'orange'],
    ['Asset Value', `$${Number(stats.totalCost || 0).toLocaleString()}`, WalletCards, 'indigo'],
    ['MFA Gaps', stats.usersWithoutMfa, Lock, 'red']
  ];
  return (
    <>
      <div className="kpi-grid">{cards.map(([title, value, Icon, tone]: any) => <Kpi key={title} title={title} value={value} icon={Icon} tone={tone} />)}</div>
      <div className="dashboard-grid">
        <section className="glass-panel">
          <div className="panel-head"><h3>Security posture</h3><span className="score-badge">82%</span></div>
          <Progress label="MFA Coverage" value={78} />
          <Progress label="Device Compliance" value={60} />
          <Progress label="Asset Traceability" value={94} />
        </section>
        <section className="glass-panel">
          <div className="panel-head"><h3>Priority alerts</h3><span>{securityRows.length} findings</span></div>
          <AlertItem tone="red" title="Non-compliant devices detected" text="Review Windows 10 and encryption status."/>
          <AlertItem tone="orange" title="Users missing MFA" text="Complete MFA registration before production."/>
          <AlertItem tone="blue" title="Static demo mode" text="All data is stored in browser localStorage." />
        </section>
      </div>
      <DataPanel title="Recent Assets" rows={assets.slice(0, 5)} />
    </>
  );
}

function AssetsPage({ rows, form, setForm, editing, save, cancel, edit, del, exportCsv }: any) {
  return (
    <>
      <div className="action-row">
        <button className="btn soft"><Upload size={16}/> Import placeholder</button>
        <button className="btn primary" onClick={exportCsv}><Download size={16}/> Export CSV</button>
      </div>

      <section className="form-card">
        <div className="form-title">
          <div>
            <h3>{editing ? 'Edit Asset' : 'Create New Asset'}</h3>
            <p>Create, update and track local asset records.</p>
          </div>
          {editing && <button className="btn soft" onClick={cancel}>Cancel</button>}
        </div>
        <form className="asset-form" onSubmit={save}>
          {Object.keys(blankAsset).filter(k => k !== 'id').map(key => (
            <label key={key}>
              <span>{formatLabel(key)}</span>
              <input value={(form as any)[key] ?? ''} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key === 'assetTag'} />
            </label>
          ))}
          <button className="btn primary form-submit"><Plus size={16}/>{editing ? 'Save Changes' : 'Create Asset'}</button>
        </form>
      </section>

      <section className="table-card">
        <div className="panel-head"><h3>Asset Inventory</h3><span>{rows.length} records</span></div>
        <AssetTable rows={rows} edit={edit} del={del} />
      </section>
    </>
  );
}

function SecurityPage({ rows }: any) {
  return (
    <>
      <div className="kpi-grid compact">
        <Kpi title="Findings" value={rows.length} icon={Shield} tone="red" />
        <Kpi title="High Priority" value={rows.filter((r: any) => r.severity === 'High').length} icon={AlertTriangle} tone="orange" />
        <Kpi title="Encryption Issues" value={rows.filter((r: any) => String(r.finding).includes('Encryption')).length} icon={HardDrive} tone="purple" />
      </div>
      <DataPanel title="Security Findings" rows={rows} />
    </>
  );
}

function ReportsPage({ reports, exportCsv }: any) {
  return (
    <>
      <div className="report-grid">
        {Object.entries(reports).map(([key, rows]: any) => (
          <section className="report-card" key={key}>
            <FileText size={24}/>
            <strong>{rows.length}</strong>
            <span>{formatLabel(key)}</span>
            <button onClick={() => exportCsv(rows, `${key}.csv`)}><Download size={15}/> Export</button>
          </section>
        ))}
      </div>
      {Object.entries(reports).map(([key, rows]: any) => <DataPanel key={key} title={formatLabel(key)} rows={rows} />)}
    </>
  );
}

function Kpi({ title, value, icon: Icon, tone }: any) {
  return <section className={`kpi-card ${tone}`}><div className="kpi-icon"><Icon size={22}/></div><div><span>{title}</span><strong>{value}</strong></div></section>;
}

function DataPanel({ title, rows, exportCsv }: any) {
  return (
    <section className="table-card">
      <div className="panel-head">
        <h3>{title}</h3>
        <div className="panel-actions">
          <span>{rows?.length || 0} records</span>
          {exportCsv && <button onClick={exportCsv}><Download size={14}/> CSV</button>}
        </div>
      </div>
      <DataTable rows={rows || []} />
    </section>
  );
}

function DataTable({ rows }: any) {
  if (!rows.length) return <EmptyState title="No data available" />;
  const cols = Object.keys(rows[0]).filter(c => c !== 'id');
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{cols.map(c => <th key={c}>{formatLabel(c)}</th>)}</tr></thead>
        <tbody>{rows.map((row: any, i: number) => <tr key={i}>{cols.map(c => <td key={c}><Cell value={row[c]} /></td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function AssetTable({ rows, edit, del }: any) {
  if (!rows.length) return <EmptyState title="No assets available" />;
  const cols = ['assetTag','category','status','assignedTo','department','manufacturer','model','serial','vendor','cost','warrantyExpiry','condition'];
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{cols.map(c => <th key={c}>{formatLabel(c)}</th>)}<th>Actions</th></tr></thead>
        <tbody>{rows.map((row: Asset) => (
          <tr key={row.id}>
            {cols.map(c => <td key={c}><Cell value={(row as any)[c]} /></td>)}
            <td><div className="row-actions"><button onClick={() => edit(row)}><Pencil size={14}/> Edit</button><button className="danger" onClick={() => del(row)}><Trash2 size={14}/> Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function Cell({ value }: any) {
  const s = String(value ?? '');
  const l = s.toLowerCase();
  let cls = '';
  if (['enabled','compliant','assigned','good','success','low','new'].some(x => l.includes(x))) cls = 'good';
  if (['disabled','non-compliant','high'].some(x => l.includes(x))) cls = 'bad';
  if (['unknown','medium','stock','not returned'].some(x => l.includes(x))) cls = 'warn';
  if (cls) return <span className={`status-pill ${cls}`}>{s}</span>;
  return <span>{s || '-'}</span>;
}

function Progress({ label, value }: any) {
  return <div className="progress-item"><div><span>{label}</span><strong>{value}%</strong></div><div className="progress"><i style={{ width: `${value}%` }} /></div></div>;
}

function AlertItem({ tone, title, text }: any) {
  return <div className={`alert-item ${tone}`}><div/><section><strong>{title}</strong><span>{text}</span></section></div>;
}

function EmptyState({ title }: any) {
  return <div className="empty-state"><Eye size={28}/><strong>{title}</strong></div>;
}

function formatLabel(text: string) {
  return String(text).replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}

createRoot(document.getElementById('root')!).render(<App />);
