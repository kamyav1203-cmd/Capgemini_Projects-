import { useState, useEffect } from "react";

const USERS = [
  { id: 1, username: "admin", password: "admin123", role: "HR Admin", name: "Kamya Vyas", dept: "Human Resources", email: "kamya.vyas@corp.in", phone: "+91-9876543210", joined: "2019-03-15", salary: "₹12,00,000", status: "Active", avatar: "PS" },
  { id: 2, username: "emp1", password: "emp123", role: "Employee", name: "Priyadarshni", dept: "Engineering", email: "priyadarshni@corp.in", phone: "+91-9123456789", joined: "2021-07-01", salary: "₹8,50,000", status: "Active", avatar: "RV" },
  { id: 3, username: "emp2", password: "emp456", role: "Employee", name: "kunal sonu", dept: "Tester", email: "kunal.sonu@corp.in", phone: "+91-9988776655", joined: "2022-01-10", salary: "₹7,20,000", status: "Active", avatar: "AS" },
  { id: 4, username: "emp3", password: "emp789", role: "Employee", name: "Kanishka", dept: "Finance", email: "kanishka@corp.in", phone: "+91-9011223344", joined: "2020-09-20", salary: "₹9,00,000", status: "Active", avatar: "KM" },
];

const DEPT_COLORS = {
  "Human Resources": "#f59e0b",
  "Engineering": "#3b82f6",
  "Marketing": "#ec4899",
  "Finance": "#10b981",
  "Design": "#8b5cf6",
  "Operations": "#f97316",
};

const ANNOUNCEMENTS = [
  { id: 1, title: "Q2 Performance Reviews", body: "Performance review cycle begins May 1st. All managers to submit ratings by May 15.", date: "2026-04-01", tag: "HR" },
  { id: 2, title: "Office Holiday – April 14", body: "The office will be closed on April 14 in observance of Baisakhi.", date: "2026-03-28", tag: "General" },
  { id: 3, title: "New Health Benefits Policy", body: "Updated health insurance policy rolled out. Check the HR portal for details.", date: "2026-03-25", tag: "Benefits" },
];

const getInitials = (name) => name.split(" ").map(n => n[0]).join("");
const getDeptColor = (dept) => DEPT_COLORS[dept] || "#6366f1";
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const css = `
  :root {
    --bg:#0d0f14; --surface:#161a23; --surface2:#1e2330;
    --border:#2a3044; --text:#e8eaf0; --muted:#7b8299;
    --accent:#5b8dee; --accent2:#7c3aed; --success:#22c55e;
    --warning:#f59e0b; --danger:#ef4444;
    --radius:14px; --radius-sm:8px;
    --shadow:0 4px 24px rgba(0,0,0,0.4);
  }
  .portal-root { display:flex; min-height:100vh; }
  @keyframes slideUp { from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
  @keyframes sideIn  { from{transform:translateX(-20px);opacity:0}to{transform:none;opacity:1} }

  .login-wrap {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background:radial-gradient(ellipse at 30% 20%,#1a2340 0%,#0d0f14 60%);
    position:relative; overflow:hidden;
  }
  .login-wrap::before {
    content:''; position:absolute; width:600px; height:600px;
    background:radial-gradient(circle,rgba(91,141,238,0.08) 0%,transparent 70%);
    top:-100px; right:-100px; border-radius:50%;
  }
  .login-card {
    background:var(--surface); border:1px solid var(--border);
    border-radius:20px; padding:48px 44px; width:420px;
    box-shadow:var(--shadow); position:relative; z-index:1;
    animation:slideUp 0.5s ease;
  }
  .login-logo { display:flex; align-items:center; gap:12px; margin-bottom:32px; }
  .login-logo-icon {
    width:44px; height:44px; border-radius:12px;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:18px; color:#fff;
  }
  .login-logo-text { font-family:'Fraunces',serif; font-size:20px; font-weight:700; }
  .login-logo-sub  { font-size:12px; color:var(--muted); }
  .login-heading   { font-family:'Fraunces',serif; font-size:26px; margin-bottom:6px; }
  .login-sub       { color:var(--muted); font-size:14px; margin-bottom:32px; }
  .form-group  { margin-bottom:18px; }
  .form-label  { font-size:13px; font-weight:500; color:var(--muted); margin-bottom:8px; display:block; }
  .form-input  {
    width:100%; padding:12px 16px; background:var(--surface2);
    border:1px solid var(--border); border-radius:var(--radius-sm);
    color:var(--text); font-size:15px; font-family:'DM Sans',sans-serif;
    transition:border-color 0.2s,box-shadow 0.2s; outline:none;
  }
  .form-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(91,141,238,0.15); }
  .form-input::placeholder { color:var(--muted); }
  .form-select { appearance:none; cursor:pointer; }
  .btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:12px 22px; border-radius:var(--radius-sm);
    font-family:'DM Sans',sans-serif; font-size:14px; font-weight:600;
    cursor:pointer; border:none; transition:all 0.2s;
  }
  .btn-primary {
    background:linear-gradient(135deg,var(--accent),#4a6fd8); color:#fff;
    width:100%; box-shadow:0 4px 14px rgba(91,141,238,0.35);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(91,141,238,0.45); }
  .btn-ghost  { background:transparent; color:var(--muted); padding:8px 12px; }
  .btn-ghost:hover { background:var(--surface2); color:var(--text); }
  .btn-danger { background:rgba(239,68,68,0.12); color:var(--danger); }
  .btn-danger:hover { background:rgba(239,68,68,0.2); }
  .btn-sm   { padding:7px 14px; font-size:13px; }
  .btn-icon { padding:8px; width:36px; height:36px; border-radius:var(--radius-sm); }
  .error-msg {
    background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3);
    color:var(--danger); padding:12px 14px; border-radius:var(--radius-sm);
    font-size:13px; margin-bottom:16px;
  }
  .login-hints { margin-top:24px; padding-top:20px; border-top:1px solid var(--border); }
  .hint-title  { font-size:12px; color:var(--muted); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px; }
  .hint-row    { display:flex; justify-content:space-between; font-size:12px; color:var(--muted); padding:4px 0; }
  .hint-cred   { font-family:monospace; color:var(--accent); }

  .sidebar {
    width:240px; min-height:100vh; background:var(--surface);
    border-right:1px solid var(--border); display:flex; flex-direction:column;
    padding:24px 0; flex-shrink:0; animation:sideIn 0.4s ease;
  }
  .sidebar-logo { padding:0 20px 24px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; }
  .sidebar-logo-icon {
    width:36px; height:36px; border-radius:10px;
    background:linear-gradient(135deg,var(--accent),var(--accent2));
    display:flex; align-items:center; justify-content:center;
    font-weight:700; color:#fff; font-size:14px; flex-shrink:0;
  }
  .sidebar-logo-name    { font-family:'Fraunces',serif; font-size:16px; font-weight:700; }
  .sidebar-logo-tagline { font-size:10px; color:var(--muted); }
  .sidebar-nav { padding:20px 12px; flex:1; }
  .nav-section-label {
    font-size:10px; color:var(--muted); text-transform:uppercase;
    letter-spacing:1px; padding:0 10px; margin-bottom:8px; margin-top:16px;
  }
  .nav-item {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    border-radius:var(--radius-sm); cursor:pointer; font-size:14px;
    font-weight:500; color:var(--muted); transition:all 0.15s; margin-bottom:2px;
  }
  .nav-item:hover  { background:var(--surface2); color:var(--text); }
  .nav-item.active { background:rgba(91,141,238,0.12); color:var(--accent); }
  .nav-icon { font-size:16px; width:20px; text-align:center; }
  .sidebar-footer { padding:16px 12px; border-top:1px solid var(--border); }
  .user-chip {
    display:flex; align-items:center; gap:10px; padding:10px;
    border-radius:var(--radius-sm); background:var(--surface2); margin-bottom:8px;
  }
  .user-chip-info { flex:1; min-width:0; }
  .user-chip-name { font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .user-chip-role { font-size:11px; color:var(--muted); }
  .avatar {
    width:32px; height:32px; border-radius:50%; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#fff;
  }
  .avatar-lg { width:60px; height:60px; font-size:20px; border-radius:16px; }
  .avatar-xl { width:80px; height:80px; font-size:26px; border-radius:20px; }

  .main-content  { flex:1; padding:32px; overflow-y:auto; animation:fadeIn 0.4s ease; }
  .page-header   { margin-bottom:28px; }
  .page-title    { font-family:'Fraunces',serif; font-size:28px; font-weight:700; }
  .page-subtitle { color:var(--muted); font-size:14px; margin-top:4px; }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; }

  .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:28px; }
  .stat-card {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:22px; position:relative; overflow:hidden; animation:fadeIn 0.5s ease both;
  }
  .stat-card::before {
    content:''; position:absolute; top:-20px; right:-20px; width:80px; height:80px;
    border-radius:50%; background:currentColor; opacity:0.06;
  }
  .stat-icon  { font-size:22px; margin-bottom:12px; }
  .stat-value { font-family:'Fraunces',serif; font-size:30px; font-weight:700; }
  .stat-label { font-size:12px; color:var(--muted); margin-top:4px; text-transform:uppercase; letter-spacing:0.5px; }

  .table-wrap { overflow-x:auto; }
  table   { width:100%; border-collapse:collapse; font-size:14px; }
  thead th {
    text-align:left; padding:12px 16px; font-size:11px; text-transform:uppercase;
    letter-spacing:0.5px; color:var(--muted); border-bottom:1px solid var(--border); font-weight:600;
  }
  tbody tr { border-bottom:1px solid var(--border); transition:background 0.15s; }
  tbody tr:last-child { border-bottom:none; }
  tbody tr:hover { background:var(--surface2); }
  tbody td { padding:14px 16px; vertical-align:middle; }

  .badge        { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:11px; font-weight:600; }
  .badge-green  { background:rgba(34,197,94,0.12);  color:var(--success); }
  .badge-blue   { background:rgba(91,141,238,0.12); color:var(--accent);  }
  .badge-purple { background:rgba(124,58,237,0.12); color:#a78bfa; }
  .badge-red    { background:rgba(239,68,68,0.12);  color:var(--danger);  }

  .toolbar { display:flex; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
  .search-input-wrap { position:relative; flex:1; min-width:200px; }
  .search-icon  { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--muted); pointer-events:none; }
  .search-input { padding-left:38px !important; }

  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; z-index:1000; animation:fadeIn 0.2s ease;
  }
  .modal {
    background:var(--surface); border:1px solid var(--border); border-radius:20px;
    padding:32px; width:500px; max-width:95vw; max-height:90vh; overflow-y:auto;
    box-shadow:var(--shadow); animation:slideUp 0.3s ease;
  }
  .modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .modal-title  { font-family:'Fraunces',serif; font-size:20px; }
  .modal-close  {
    background:var(--surface2); border:none; width:32px; height:32px; border-radius:50%;
    cursor:pointer; color:var(--muted); font-size:18px;
    display:flex; align-items:center; justify-content:center;
  }
  .modal-close:hover { background:var(--border); color:var(--text); }
  .form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  .profile-hero {
    background:var(--surface); border:1px solid var(--border); border-radius:var(--radius);
    padding:28px; display:flex; gap:24px; align-items:flex-start; margin-bottom:20px;
    position:relative; overflow:hidden;
  }
  .profile-hero::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,rgba(91,141,238,0.05) 0%,transparent 60%);
    pointer-events:none;
  }
  .profile-name { font-family:'Fraunces',serif; font-size:26px; font-weight:700; margin-bottom:4px; }
  .profile-role { color:var(--muted); font-size:14px; margin-bottom:14px; }
  .profile-tags { display:flex; gap:8px; flex-wrap:wrap; }
  .profile-details-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; }
  .detail-card  { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius-sm); padding:16px; }
  .detail-label { font-size:11px; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
  .detail-value { font-size:15px; font-weight:500; }

  .ann-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:18px 22px; margin-bottom:12px; transition:border-color 0.2s; }
  .ann-card:hover { border-color:var(--accent); }
  .ann-title { font-weight:600; font-size:15px; flex:1; }
  .ann-body  { font-size:13px; color:var(--muted); line-height:1.6; }
  .ann-date  { font-size:11px; color:var(--muted); margin-top:10px; }
  .dept-pill { display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:100px; font-size:12px; font-weight:500; }
  .dept-dot  { width:6px; height:6px; border-radius:50%; }

  .toast {
    position:fixed; bottom:28px; right:28px; background:var(--surface);
    border:1px solid var(--border); border-radius:var(--radius-sm); padding:14px 18px;
    font-size:13px; font-weight:500; box-shadow:var(--shadow); z-index:9999;
    display:flex; align-items:center; gap:10px; animation:slideUp 0.3s ease;
  }
  .toast-success { border-left:3px solid var(--success); }
  .toast-error   { border-left:3px solid var(--danger); }
  .empty-state      { text-align:center; padding:60px 20px; color:var(--muted); }
  .empty-state-icon { font-size:48px; margin-bottom:16px; opacity:0.5; }

  @media (max-width:768px) {
    .sidebar { width:56px; }
    .sidebar-logo-name,.sidebar-logo-tagline,.user-chip-name,
    .user-chip-role,.nav-section-label { display:none; }
    .nav-item span:not(.nav-icon) { display:none; }
    .nav-item { justify-content:center; }
    .main-content { padding:20px; }
    .form-grid { grid-template-columns:1fr; }
    .profile-hero { flex-direction:column; }
  }
`;

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`toast toast-${type}`}><span>{type==="success"?"✅":"❌"}</span>{msg}</div>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function AvatarIcon({ initials, dept, size="" }) {
  const color = getDeptColor(dept||"");
  return (
    <div className={`avatar ${size}`} style={{background:`${color}22`,color,border:`2px solid ${color}44`}}>
      {initials}
    </div>
  );
}

function DeptPill({ dept }) {
  const color = getDeptColor(dept);
  return (
    <span className="dept-pill" style={{background:`${color}18`,color}}>
      <span className="dept-dot" style={{background:color}}/>{dept}
    </span>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const handleLogin = () => {
    const user = USERS.find(u => u.username===username && u.password===password);
    if (user) { setError(""); onLogin(user); }
    else setError("Invalid credentials. Please check your username and password.");
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">EP</div>
          <div>
            <div className="login-logo-text">CorpHQ</div>
            <div className="login-logo-sub">Internal Employee Portal</div>
          </div>
        </div>
        <div className="login-heading">Welcome back 👋</div>
        <div className="login-sub">Sign in to access your dashboard</div>
        {error && <div className="error-msg">⚠️ {error}</div>}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" placeholder="Enter username" value={username}
            onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Enter password" value={password}
            onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} />
        </div>
        <button className="btn btn-primary" onClick={handleLogin}>Sign In →</button>
        <div className="login-hints">
          <div className="hint-title">Demo Credentials</div>
          <div className="hint-row"><span>HR Admin:</span><span className="hint-cred">admin / admin123</span></div>
          <div className="hint-row"><span>Employee 1:</span><span className="hint-cred">emp1 / emp123</span></div>
          <div className="hint-row"><span>Employee 2:</span><span className="hint-cred">emp2 / emp456</span></div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ user, activePage, setActivePage, onLogout }) {
  const isAdmin = user.role==="HR Admin";
  const navItems = [
    { id:"dashboard",     icon:"⚡", label:"Dashboard" },
    { id:"profile",       icon:"👤", label:"My Profile" },
    ...(isAdmin?[
      { id:"employees",    icon:"👥", label:"Employees" },
      { id:"add-employee", icon:"➕", label:"Add Employee" },
    ]:[]),
    { id:"announcements", icon:"📢", label:"Announcements" },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">EP</div>
        <div>
          <div className="sidebar-logo-name">CorpHQ</div>
          <div className="sidebar-logo-tagline">Employee Portal</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item=>(
          <div key={item.id} className={`nav-item ${activePage===item.id?"active":""}`}
            onClick={()=>setActivePage(item.id)}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          <AvatarIcon initials={user.avatar} dept={user.dept}/>
          <div className="user-chip-info">
            <div className="user-chip-name">{user.name}</div>
            <div className="user-chip-role">{user.role}</div>
          </div>
        </div>
        <button className="btn btn-ghost" style={{width:"100%",justifyContent:"flex-start",fontSize:13}} onClick={onLogout}>
          🚪 <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function Dashboard({ user, employees, setActivePage }) {
  const isAdmin = user.role==="HR Admin";
  const depts   = [...new Set(employees.map(e=>e.dept))];
  const stats = isAdmin ? [
    { icon:"👥", label:"Total Employees", value:employees.length, color:"#5b8dee" },
    { icon:"🏢", label:"Departments",     value:depts.length,     color:"#22c55e" },
    { icon:"✅", label:"Active Staff",    value:employees.filter(e=>e.status==="Active").length, color:"#f59e0b" },
    { icon:"📋", label:"Joined 2022",     value:employees.filter(e=>new Date(e.joined).getFullYear()===2022).length, color:"#ec4899" },
  ] : [
    { icon:"👤", label:"My Department", value:user.dept,              color:"#5b8dee" },
    { icon:"📅", label:"Joined",        value:formatDate(user.joined), color:"#22c55e" },
    { icon:"✅", label:"Status",        value:user.status,             color:"#22c55e" },
    { icon:"🏷", label:"Role",          value:user.role,               color:"#f59e0b" },
  ];
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Good morning, {user.name.split(" ")[0]} 👋</div>
        <div className="page-subtitle">{new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
      </div>
      <div className="stats-grid">
        {stats.map((s,i)=>(
          <div key={i} className="stat-card" style={{color:s.color,animationDelay:`${i*0.08}s`}}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:isAdmin?"1fr 1fr":"1fr",gap:20}}>
        {isAdmin&&(
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15}}>Recent Employees</div>
              <button className="btn btn-ghost btn-sm" onClick={()=>setActivePage("employees")}>View all →</button>
            </div>
            {employees.slice(0,4).map(emp=>(
              <div key={emp.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)"}}>
                <AvatarIcon initials={emp.avatar} dept={emp.dept}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500}}>{emp.name}</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>{emp.dept}</div>
                </div>
                <span className="badge badge-green">✓ Active</span>
              </div>
            ))}
          </div>
        )}
        <div className="card">
          <div style={{fontWeight:600,fontSize:15,marginBottom:16}}>📢 Latest Announcements</div>
          {ANNOUNCEMENTS.slice(0,2).map(a=>(
            <div key={a.id} style={{padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600}}>{a.title}</span>
                <span className="badge badge-blue">{a.tag}</span>
              </div>
              <div style={{fontSize:12,color:"var(--muted)"}}>{a.body.slice(0,80)}…</div>
              <div style={{fontSize:11,color:"var(--muted)",marginTop:6}}>{formatDate(a.date)}</div>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" style={{marginTop:12}} onClick={()=>setActivePage("announcements")}>View all →</button>
        </div>
      </div>
    </div>
  );
}

function MyProfile({ user }) {
  const details = [
    {label:"Email",             value:user.email,             icon:"📧"},
    {label:"Phone",             value:user.phone,             icon:"📱"},
    {label:"Department",        value:user.dept,              icon:"🏢"},
    {label:"Date Joined",       value:formatDate(user.joined),icon:"📅"},
    {label:"Annual Salary",     value:user.salary,            icon:"💰"},
    {label:"Employment Status", value:user.status,            icon:"✅"},
  ];
  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-subtitle">Your personal & professional information</div>
      </div>
      <div className="profile-hero">
        <AvatarIcon initials={user.avatar} dept={user.dept} size="avatar-xl"/>
        <div>
          <div className="profile-name">{user.name}</div>
          <div className="profile-role">{user.email}</div>
          <div className="profile-tags">
            <DeptPill dept={user.dept}/>
            <span className="badge badge-green">✓ {user.status}</span>
            <span className="badge badge-purple">{user.role}</span>
          </div>
        </div>
      </div>
      <div className="profile-details-grid">
        {details.map((d,i)=>(
          <div key={i} className="detail-card">
            <div className="detail-label">{d.icon} {d.label}</div>
            <div className="detail-value">{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmployeeList({ employees, onDelete, onEdit }) {
  const [search,setSearch]         = useState("");
  const [deptFilter,setDeptFilter] = useState("All");
  const [viewEmp,setViewEmp]       = useState(null);
  const depts = ["All",...new Set(employees.map(e=>e.dept))];
  const filtered = employees.filter(emp=>{
    const q=search.toLowerCase();
    return (emp.name.toLowerCase().includes(q)||emp.dept.toLowerCase().includes(q)||emp.email.toLowerCase().includes(q))
      &&(deptFilter==="All"||emp.dept===deptFilter);
  });
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Employee Directory</div>
        <div className="page-subtitle">Manage all employee records</div>
      </div>
      <div className="toolbar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="form-input search-input" placeholder="Search by name, dept, email…"
            value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="form-input form-select" style={{width:"auto",minWidth:140}}
          value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
          {depts.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>
      <div className="card" style={{padding:0}}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Employee</th><th>Department</th><th>Email</th><th>Joined</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length===0
                ?<tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">🔍</div><div>No employees found</div></div></td></tr>
                :filtered.map(emp=>(
                <tr key={emp.id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <AvatarIcon initials={emp.avatar} dept={emp.dept}/>
                      <div>
                        <div style={{fontWeight:500,fontSize:14}}>{emp.name}</div>
                        <div style={{fontSize:12,color:"var(--muted)"}}>{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td><DeptPill dept={emp.dept}/></td>
                  <td style={{fontSize:13,color:"var(--muted)"}}>{emp.email}</td>
                  <td style={{fontSize:13}}>{formatDate(emp.joined)}</td>
                  <td><span className={`badge ${emp.status==="Active"?"badge-green":"badge-red"}`}>● {emp.status}</span></td>
                  <td>
                    <div style={{display:"flex",gap:6}}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>setViewEmp(emp)}>👁</button>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={()=>onEdit(emp)}>✏️</button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={()=>onDelete(emp.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {viewEmp&&(
        <Modal title="Employee Details" onClose={()=>setViewEmp(null)}>
          <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:24}}>
            <AvatarIcon initials={viewEmp.avatar} dept={viewEmp.dept} size="avatar-lg"/>
            <div>
              <div style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:700}}>{viewEmp.name}</div>
              <div style={{color:"var(--muted)",fontSize:13}}>{viewEmp.email}</div>
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <DeptPill dept={viewEmp.dept}/>
                <span className="badge badge-green">{viewEmp.status}</span>
              </div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{label:"Phone",value:viewEmp.phone},{label:"Joined",value:formatDate(viewEmp.joined)},
              {label:"Salary",value:viewEmp.salary},{label:"Role",value:viewEmp.role}].map((d,i)=>(
              <div key={i} className="detail-card">
                <div className="detail-label">{d.label}</div>
                <div className="detail-value">{d.value}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:24}}>
            <button className="btn btn-ghost" onClick={()=>setViewEmp(null)}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function EmployeeForm({ onSave, onCancel, editData }) {
  const blank = {name:"",username:"",password:"",role:"Employee",dept:"Engineering",email:"",phone:"",joined:"",salary:"",status:"Active"};
  const [form,setForm] = useState(editData?{...editData}:blank);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const handleSave = () => {
    if(!form.name||!form.email||!form.dept){alert("Name, Email, Department are required.");return;}
    onSave(form);
  };
  return (
    <div>
      <div className="page-header">
        <div className="page-title">{editData?"Edit Employee":"Add New Employee"}</div>
        <div className="page-subtitle">{editData?"Update employee information":"Fill in the details to onboard a new employee"}</div>
      </div>
      <div className="card">
        <div className="form-grid">
          {[
            {label:"Full Name *", key:"name",     type:"text",  placeholder:"e.g. Amit Joshi"},
            {label:"Username",    key:"username",  type:"text",  placeholder:"e.g. amit.joshi"},
            {label:"Email *",     key:"email",     type:"email", placeholder:"email@corp.in"},
            {label:"Phone",       key:"phone",     type:"text",  placeholder:"+91-XXXXXXXXXX"},
          ].map(f=>(
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input className="form-input" type={f.type} placeholder={f.placeholder}
                value={form[f.key]} onChange={e=>set(f.key,e.target.value)}/>
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Department *</label>
            <select className="form-input form-select" value={form.dept} onChange={e=>set("dept",e.target.value)}>
              {["Engineering","Human Resources","Marketing","Finance","Design","Operations"].map(d=><option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input form-select" value={form.role} onChange={e=>set("role",e.target.value)}>
              <option>Employee</option><option>HR Admin</option><option>Manager</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Date Joined</label>
            <input className="form-input" type="date" value={form.joined} onChange={e=>set("joined",e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Annual Salary</label>
            <input className="form-input" placeholder="₹X,XX,XXX" value={form.salary} onChange={e=>set("salary",e.target.value)}/>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input form-select" value={form.status} onChange={e=>set("status",e.target.value)}>
              <option>Active</option><option>Inactive</option><option>On Leave</option>
            </select>
          </div>
          {!editData&&(
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Set password" value={form.password} onChange={e=>set("password",e.target.value)}/>
            </div>
          )}
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:24,paddingTop:20,borderTop:"1px solid var(--border)"}}>
          {onCancel&&<button className="btn btn-ghost" onClick={onCancel}>Cancel</button>}
          <button className="btn btn-primary" style={{width:"auto"}} onClick={handleSave}>
            {editData?"💾 Save Changes":"➕ Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Announcements() {
  return (
    <div>
      <div className="page-header">
        <div className="page-title">Announcements</div>
        <div className="page-subtitle">Company-wide notices and updates</div>
      </div>
      {ANNOUNCEMENTS.map(a=>(
        <div key={a.id} className="ann-card">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div className="ann-title">{a.title}</div>
            <span className="badge badge-blue">{a.tag}</span>
          </div>
          <div className="ann-body">{a.body}</div>
          <div className="ann-date">📅 {formatDate(a.date)}</div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [user,       setUser]       = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [employees,  setEmployees]  = useState(USERS);
  const [editEmp,    setEditEmp]    = useState(null);
  const [toast,      setToast]      = useState(null);

  const showToast = (msg,type="success") => setToast({msg,type});

  const handleLogin  = (u) => { setUser(u); setActivePage("dashboard"); };
  const handleLogout = ()  => { setUser(null); setActivePage("dashboard"); };

  const handleDelete = (id) => {
    if(!window.confirm("Delete this employee record?")) return;
    setEmployees(e=>e.filter(emp=>emp.id!==id));
    showToast("Employee record deleted.");
  };

  const handleSave = (form) => {
    if(editEmp) {
      setEmployees(e=>e.map(emp=>emp.id===editEmp.id?{...emp,...form}:emp));
      showToast("Employee updated successfully!");
      setEditEmp(null);
    } else {
      setEmployees(e=>[...e,{...form,id:Date.now(),avatar:getInitials(form.name)}]);
      showToast("Employee added successfully!");
    }
    setActivePage("employees");
  };

  const handleEdit = (emp) => { setEditEmp(emp); setActivePage("add-employee"); };

  const renderPage = () => {
    if(editEmp && activePage==="add-employee")
      return <EmployeeForm editData={editEmp} onSave={handleSave} onCancel={()=>{setEditEmp(null);setActivePage("employees");}}/>;
    switch(activePage) {
      case "dashboard":    return <Dashboard user={user} employees={employees} setActivePage={setActivePage}/>;
      case "profile":      return <MyProfile user={user}/>;
      case "employees":    return <EmployeeList employees={employees} onDelete={handleDelete} onEdit={handleEdit}/>;
      case "add-employee": return <EmployeeForm onSave={handleSave} onCancel={()=>setActivePage("employees")}/>;
      case "announcements":return <Announcements/>;
      default:             return <Dashboard user={user} employees={employees} setActivePage={setActivePage}/>;
    }
  };

  if(!user) return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={handleLogin}/>
    </>
  );

  return (
    <>
      <style>{css}</style>
      <div className="portal-root">
        <Sidebar user={user} activePage={activePage}
          setActivePage={(p)=>{setEditEmp(null);setActivePage(p);}} onLogout={handleLogout}/>
        <main className="main-content">{renderPage()}</main>
      </div>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
    </>
  );
}