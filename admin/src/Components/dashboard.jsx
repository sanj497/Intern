import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "/api";
const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });
const STATUS_OPTIONS = ["pending","confirmed","processing","shipped","delivered","cancelled"];
const STATUS_COLORS  = { pending:"#e65100", confirmed:"#2e7d32", processing:"#1565c0", shipped:"#6a1b9a", delivered:"#1b5e20", cancelled:"#b71c1c" };

const pink    = "#d96fa6";
const pinkBg  = "#fff0f6";
const pinkLight = "#fce4ec";

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
      <div style={{ background:"#fff", borderRadius:20, width:"100%", maxWidth:620, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(217,111,166,0.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", borderBottom:`2px solid ${pinkLight}`, position:"sticky", top:0, background:"#fff", borderRadius:"20px 20px 0 0" }}>
          <h3 style={{ margin:0, fontSize:"1.1rem", color:"#1e293b", fontWeight:700 }}>{title}</h3>
          <button onClick={onClose} style={{ background:pinkBg, border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", color:pink, fontWeight:700, fontSize:"1rem" }}>✕</button>
        </div>
        <div style={{ padding:"20px 24px" }}>{children}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, num, label, color }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, padding:"1.4rem", textAlign:"center", boxShadow:"0 4px 15px rgba(0,0,0,0.06)", borderTop:`4px solid ${color}` }}>
      <div style={{ fontSize:"2rem", marginBottom:4 }}>{icon}</div>
      <div style={{ fontSize:"1.6rem", fontWeight:700, color }}>{num}</div>
      <div style={{ color:"#94a3b8", fontSize:"0.8rem", marginTop:2 }}>{label}</div>
    </div>
  );
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({});
  const [saving, setSaving]     = useState(false);
  const [search, setSearch]     = useState("");
  const [msg, setMsg]           = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/products`, { headers: authHeaders() });
      setProducts(res.data.data || []);
    } catch { alert("Failed to load products"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const save = async () => {
    setSaving(true);
    try {
      // ── FIX: save both Stock (capital, existing DB field) and stock (lowercase) ──
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),   // lowercase — for new schema
        Stock: Number(form.stock),   // capital  — for existing DB documents
        Price: Number(form.price),
        ProductName: form.productName || form.ProductName,
        Thumbnail: form.thumbnail || form.Thumbnail,
        Description: form.description || form.Description,
      };
      if (modal === "add") {
        await axios.post(`${API}/admin/products`, payload, { headers: authHeaders() });
      } else {
        await axios.put(`${API}/admin/products/${form._id}`, payload, { headers: authHeaders() });
      }
      setModal(null); fetchProducts();
      showMsg(modal === "add" ? "✅ Product added!" : "✅ Product updated!");
    } catch (err) { showMsg("❌ " + (err.response?.data?.message || "Save failed")); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`${API}/admin/products/${id}`, { headers: authHeaders() });
      fetchProducts(); showMsg("✅ Product deleted!");
    } catch { showMsg("❌ Delete failed"); }
  };

  const filtered = products.filter(p =>
    (p.productName||p.ProductName||"").toLowerCase().includes(search.toLowerCase()) ||
    (p.productCode||"").toLowerCase().includes(search.toLowerCase())
  );

  const inp = { padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.9rem", width:"100%", boxSizing:"border-box", outline:"none" };

  return (
    <div>
      <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:"#333", marginBottom:"1.2rem" }}>🧶 Manage Products</h1>
      {msg && <div style={{ marginBottom:16, padding:"10px 16px", borderRadius:10, background:msg.startsWith("✅")?"#e8f5e9":"#ffebee", color:msg.startsWith("✅")?"#2e7d32":"#b71c1c", fontWeight:500 }}>{msg}</div>}

      <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center" }}>
        <input placeholder="🔍 Search by name or code..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.92rem", outline:"none" }} />
        <button onClick={() => { setForm({ productName:"", productCode:"", price:"", stock:"", thumbnail:"", description:"" }); setModal("add"); }}
          style={{ padding:"10px 22px", background:pink, color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:"0.9rem", whiteSpace:"nowrap" }}>
          + Add Product
        </button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { label:"Total",          num:products.length,                                                                             color:pink },
          { label:"In Stock",       num:products.filter(p=>Number(p.Stock??p.stock??0)>0).length,                                   color:"#2e7d32" },
          { label:"Low Stock (<5)", num:products.filter(p=>Number(p.Stock??p.stock??0)<5&&Number(p.Stock??p.stock??0)>0).length,     color:"#e65100" },
          { label:"Out of Stock",   num:products.filter(p=>Number(p.Stock??p.stock??0)===0).length,                                  color:"#b71c1c" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"1rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:"1.4rem", fontWeight:700, color:s.color }}>{s.num}</div>
            <div style={{ fontSize:"0.78rem", color:"#888" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? <p style={{ textAlign:"center", color:"#888", padding:40 }}>Loading...</p> : (
        <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.07)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:pinkLight }}>
                {["Product","Code","Price","Stock","Image","Actions"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"0.8rem", fontWeight:700, color:"#c2185b", borderBottom:`2px solid #f8bbd0` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"#aaa" }}>No products found</td></tr>
              ) : filtered.map(p => {
                const name  = p.productName || p.ProductName;
                const price = p.price || p.Price || 0;
                const stock = p.Stock !== undefined ? p.Stock : (p.stock ?? 0);
                const thumb = p.thumbnail || p.Thumbnail;
                const desc  = p.description || p.Description || "";
                return (
                  <tr key={p._id} style={{ borderBottom:"1px solid #f9f0f5", transition:"background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background=pinkBg}
                    onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ fontWeight:600, color:"#222", fontSize:"0.9rem" }}>{name}</div>
                      <div style={{ color:"#aaa", fontSize:"0.78rem", marginTop:2 }}>{desc.slice(0,50)}{desc.length>50?"...":""}</div>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <code style={{ background:pinkBg, color:pink, padding:"2px 8px", borderRadius:6, fontSize:"0.78rem" }}>{p.productCode}</code>
                    </td>
                    <td style={{ padding:"12px 16px", fontWeight:700, color:pink }}>Rs. {Number(price).toLocaleString()}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ color:Number(stock)<5?"#dc2626":"#16a34a", fontWeight:700 }}>{stock}</span>
                      {Number(stock) < 5 && <span style={{ fontSize:"0.68rem", background:"#fee2e2", color:"#dc2626", padding:"1px 6px", borderRadius:8, marginLeft:5 }}>Low</span>}
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      {thumb ? <img src={thumb} alt="" style={{ width:44, height:44, objectFit:"cover", borderRadius:10, border:`2px solid ${pinkLight}` }} onError={e => e.target.src="https://placehold.co/44"} /> : "—"}
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <button onClick={() => { setForm({ ...p, price, stock, productName: name, thumbnail: thumb, description: desc }); setModal("edit"); }}
                        style={{ background:pinkBg, color:pink, border:`1px solid #f8bbd0`, padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.8rem", fontWeight:600, marginRight:6 }}>Edit</button>
                      <button onClick={() => del(p._id)}
                        style={{ background:"#ffebee", color:"#b71c1c", border:"1px solid #ffcdd2", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.8rem", fontWeight:600 }}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal==="add" ? "➕ Add New Product" : "✏️ Edit Product"} onClose={() => setModal(null)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[
              { label:"Product Name", name:"productName" },
              { label:"Product Code", name:"productCode" },
              { label:"Price (Rs.)",  name:"price",  type:"number" },
              { label:"Stock",        name:"stock",  type:"number" },
              { label:"Thumbnail URL",name:"thumbnail" },
            ].map(f => (
              <div key={f.name} style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <label style={{ fontSize:"0.82rem", fontWeight:600, color:"#374151" }}>{f.label}</label>
                <input type={f.type||"text"} name={f.name} value={form[f.name]||""} required
                  onChange={e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  style={inp} onFocus={e=>e.target.style.borderColor=pink} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              </div>
            ))}
            <div style={{ display:"flex", flexDirection:"column", gap:5, gridColumn:"1/-1" }}>
              <label style={{ fontSize:"0.82rem", fontWeight:600, color:"#374151" }}>Description</label>
              <textarea rows={3} name="description" value={form.description||""} required
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                style={{ ...inp, resize:"vertical" }} onFocus={e=>e.target.style.borderColor=pink} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
            </div>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:16, marginTop:8, borderTop:`1px solid ${pinkLight}` }}>
            <button onClick={() => setModal(null)} style={{ padding:"10px 20px", background:"#f8f9fa", border:"none", borderRadius:10, cursor:"pointer", fontWeight:500 }}>Cancel</button>
            <button onClick={save} disabled={saving} style={{ padding:"10px 28px", background:pink, color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, opacity:saving?0.7:1 }}>
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function UsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState({});
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");
  const [search, setSearch]   = useState("");

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/users`, { headers: authHeaders() });
      setUsers(res.data.users || res.data || []);
    } catch { alert("Failed to load users"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/users/${form._id}`, { username: form.username, email: form.email, role: form.role }, { headers: authHeaders() });
      setModal(false); fetchUsers(); showMsg("✅ User updated!");
    } catch { showMsg("❌ Update failed"); }
    finally { setSaving(false); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`${API}/admin/users/${id}`, { headers: authHeaders() });
      fetchUsers(); showMsg("✅ User deleted!");
    } catch { showMsg("❌ Delete failed"); }
  };

  const filtered = users.filter(u =>
    (u.username||"").toLowerCase().includes(search.toLowerCase()) ||
    (u.email||"").toLowerCase().includes(search.toLowerCase())
  );

  const inp = { padding:"10px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.9rem", width:"100%", boxSizing:"border-box", outline:"none" };

  return (
    <div>
      <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:"#333", marginBottom:"1.2rem" }}>👥 Manage Users</h1>
      {msg && <div style={{ marginBottom:16, padding:"10px 16px", borderRadius:10, background:msg.startsWith("✅")?"#e8f5e9":"#ffebee", color:msg.startsWith("✅")?"#2e7d32":"#b71c1c", fontWeight:500 }}>{msg}</div>}

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Users", num:users.length, color:pink },
          { label:"Admins",      num:users.filter(u=>u.role==="admin").length, color:"#6a1b9a" },
          { label:"Customers",   num:users.filter(u=>u.role==="user").length,  color:"#1565c0" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"1rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:"1.4rem", fontWeight:700, color:s.color }}>{s.num}</div>
            <div style={{ fontSize:"0.78rem", color:"#888" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <input placeholder="🔍 Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.92rem", outline:"none", marginBottom:16, boxSizing:"border-box" }} />

      {loading ? <p style={{ textAlign:"center", color:"#888", padding:40 }}>Loading...</p> : (
        <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.07)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:pinkLight }}>
                {["User","Email","Role","Joined","Actions"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"0.8rem", fontWeight:700, color:"#c2185b", borderBottom:`2px solid #f8bbd0` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding:40, textAlign:"center", color:"#aaa" }}>No users found</td></tr>
              ) : filtered.map(u => (
                <tr key={u._id} style={{ borderBottom:"1px solid #f9f0f5" }}
                  onMouseEnter={e => e.currentTarget.style.background=pinkBg}
                  onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                  <td style={{ padding:"12px 16px" }}><div style={{ fontWeight:600, color:"#222" }}>{u.username}</div></td>
                  <td style={{ padding:"12px 16px", color:"#666", fontSize:"0.88rem" }}>{u.email}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ background:u.role==="admin"?"#f3e5f5":"#e3f2fd", color:u.role==="admin"?"#6a1b9a":"#1565c0", padding:"3px 10px", borderRadius:20, fontSize:"0.78rem", fontWeight:600 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px", color:"#888", fontSize:"0.82rem" }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <button onClick={() => { setForm({ ...u }); setModal(true); }}
                      style={{ background:pinkBg, color:pink, border:`1px solid #f8bbd0`, padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.8rem", fontWeight:600, marginRight:6 }}>Edit</button>
                    <button onClick={() => deleteUser(u._id)}
                      style={{ background:"#ffebee", color:"#b71c1c", border:"1px solid #ffcdd2", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.8rem", fontWeight:600 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title="✏️ Edit User" onClose={() => setModal(false)}>
          {[{ label:"Username", name:"username", type:"text" }, { label:"Email", name:"email", type:"email" }].map(f => (
            <div key={f.name} style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:"0.82rem", fontWeight:600, color:"#374151", marginBottom:5 }}>{f.label}</label>
              <input type={f.type} value={form[f.name]||""} onChange={e => setForm({...form,[f.name]:e.target.value})}
                style={inp} onFocus={e=>e.target.style.borderColor=pink} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
            </div>
          ))}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:"0.82rem", fontWeight:600, color:"#374151", marginBottom:5 }}>Role</label>
            <select value={form.role||"user"} onChange={e => setForm({...form,role:e.target.value})} style={{ ...inp }}>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div style={{ display:"flex", justifyContent:"flex-end", gap:10, paddingTop:12, borderTop:`1px solid ${pinkLight}` }}>
            <button onClick={() => setModal(false)} style={{ padding:"10px 20px", background:"#f8f9fa", border:"none", borderRadius:10, cursor:"pointer" }}>Cancel</button>
            <button onClick={updateUser} disabled={saving} style={{ padding:"10px 28px", background:pink, color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:700 }}>
              {saving ? "Saving..." : "Update User"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/orders`, { headers: authHeaders() });
      setOrders(res.data.orders || []);
    } catch { alert("Failed to load orders"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/admin/orders/${id}/status`, { status }, { headers: authHeaders() });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch { alert("Failed to update status"); }
  };

  const filtered = orders.filter(o =>
    (o.user?.username||"").toLowerCase().includes(search.toLowerCase()) ||
    o._id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:"#333", marginBottom:"1.2rem" }}>📦 Manage Orders</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12, marginBottom:20 }}>
        {[
          { label:"Total",     num:orders.length,                                        color:pink },
          { label:"Pending",   num:orders.filter(o=>o.status==="pending").length,         color:"#e65100" },
          { label:"Shipped",   num:orders.filter(o=>o.status==="shipped").length,         color:"#6a1b9a" },
          { label:"Delivered", num:orders.filter(o=>o.status==="delivered").length,       color:"#2e7d32" },
          { label:"Cancelled", num:orders.filter(o=>o.status==="cancelled").length,       color:"#b71c1c" },
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", borderRadius:12, padding:"1rem", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", borderLeft:`4px solid ${s.color}` }}>
            <div style={{ fontSize:"1.4rem", fontWeight:700, color:s.color }}>{s.num}</div>
            <div style={{ fontSize:"0.78rem", color:"#888" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <input placeholder="🔍 Search by customer or order ID..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.92rem", outline:"none", marginBottom:16, boxSizing:"border-box" }} />
      {loading ? <p style={{ textAlign:"center", color:"#888", padding:40 }}>Loading...</p> : (
        <div style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 4px 15px rgba(0,0,0,0.07)" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:pinkLight }}>
                {["Order ID","Customer","Items","Total","Payment","Status","Update"].map(h => (
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:"0.8rem", fontWeight:700, color:"#c2185b", borderBottom:`2px solid #f8bbd0` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:40, textAlign:"center", color:"#aaa" }}>No orders found</td></tr>
              ) : filtered.map(o => (
                <tr key={o._id} style={{ borderBottom:"1px solid #f9f0f5" }}
                  onMouseEnter={e => e.currentTarget.style.background=pinkBg}
                  onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                  <td style={{ padding:"12px 16px" }}><code style={{ background:pinkBg, color:pink, padding:"2px 8px", borderRadius:6, fontSize:"0.78rem" }}>#{o._id.slice(-8).toUpperCase()}</code></td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ fontWeight:600, fontSize:"0.88rem" }}>{o.user?.username||"N/A"}</div>
                    <div style={{ fontSize:"0.75rem", color:"#aaa" }}>{o.user?.email}</div>
                  </td>
                  <td style={{ padding:"12px 16px", color:"#666" }}>{o.items?.length} item{o.items?.length!==1?"s":""}</td>
                  <td style={{ padding:"12px 16px", fontWeight:700, color:pink }}>Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ color:o.paymentStatus==="paid"?"#2e7d32":"#e65100", fontWeight:600, fontSize:"0.82rem" }}>
                      {o.paymentStatus==="paid" ? "✅ Paid" : "⏳ " + o.paymentMethod?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <span style={{ background:(STATUS_COLORS[o.status]||"#333")+"22", color:STATUS_COLORS[o.status]||"#333", padding:"3px 10px", borderRadius:20, fontSize:"0.77rem", fontWeight:600 }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding:"12px 16px" }}>
                    <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                      style={{ padding:"6px 10px", borderRadius:8, border:`1.5px solid #f8bbd0`, fontSize:"0.82rem", cursor:"pointer", background:"#fff", color:"#333", outline:"none" }}>
                      {STATUS_OPTIONS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/messages`, { headers: authHeaders() });
      setMessages(res.data.messages || []);
    } catch { alert("Failed to load messages"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const markRead = async (id) => {
    try {
      await axios.put(`${API}/admin/messages/${id}/read`, {}, { headers: authHeaders() });
      setMessages(prev => prev.map(m => m._id===id ? { ...m, isRead:true } : m));
    } catch {}
  };
  const del = async (id) => {
    try {
      await axios.delete(`${API}/admin/messages/${id}`, { headers: authHeaders() });
      setMessages(prev => prev.filter(m => m._id!==id));
    } catch {}
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div>
      <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:"#333", marginBottom:"1.2rem" }}>
        💬 Customer Messages
        {unread > 0 && <span style={{ background:"#e91e63", color:"#fff", borderRadius:15, padding:"3px 12px", fontSize:"0.85rem", marginLeft:10, verticalAlign:"middle" }}>{unread} new</span>}
      </h1>
      {loading ? <p style={{ textAlign:"center", padding:40, color:"#888" }}>Loading...</p>
      : messages.length === 0 ? (
        <div style={{ background:"#fff", borderRadius:16, padding:"4rem", textAlign:"center", boxShadow:"0 4px 15px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:"3rem", marginBottom:12 }}>💬</div>
          <p style={{ color:"#aaa" }}>No messages yet</p>
        </div>
      ) : messages.map(m => (
        <div key={m._id} style={{ background:"#fff", borderRadius:16, padding:"1.4rem", marginBottom:"0.8rem", boxShadow:"0 4px 15px rgba(0,0,0,0.06)", borderLeft:`4px solid ${m.isRead?"#e0e0e0":pink}`, opacity:m.isRead?0.75:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"1rem" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, color:"#222", marginBottom:2 }}>
                {m.name}
                {!m.isRead && <span style={{ background:pinkBg, color:pink, fontSize:"0.7rem", padding:"2px 8px", borderRadius:10, marginLeft:8 }}>NEW</span>}
              </div>
              <div style={{ color:"#888", fontSize:"0.82rem", marginBottom:8 }}>{m.email}</div>
              <p style={{ color:"#555", lineHeight:1.6, margin:0 }}>{m.message}</p>
              <div style={{ color:"#bbb", fontSize:"0.75rem", marginTop:6 }}>{new Date(m.createdAt).toLocaleString()}</div>
            </div>
            <div style={{ display:"flex", gap:6, flexShrink:0 }}>
              {!m.isRead && <button onClick={() => markRead(m._id)} style={{ background:"#e8f5e9", color:"#2e7d32", border:"1px solid #a5d6a7", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.78rem", fontWeight:600 }}>✓ Read</button>}
              <button onClick={() => del(m._id)} style={{ background:"#ffebee", color:"#b71c1c", border:"1px solid #ffcdd2", padding:"6px 12px", borderRadius:8, cursor:"pointer", fontSize:"0.78rem", fontWeight:600 }}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OverviewPage() {
  const [stats, setStats] = useState({ orders:[], products:[], users:[], messages:[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/admin/orders`,   { headers: authHeaders() }),
      axios.get(`${API}/admin/products`, { headers: authHeaders() }),
      axios.get(`${API}/admin/users`,    { headers: authHeaders() }),
      axios.get(`${API}/admin/messages`, { headers: authHeaders() }),
    ]).then(([o,p,u,m]) => {
      setStats({ orders:o.data.orders||[], products:p.data.data||[], users:u.data.users||u.data||[], messages:m.data.messages||[] });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign:"center", padding:40, color:"#888" }}>Loading...</p>;
  const revenue = stats.orders.filter(o=>o.paymentStatus==="paid").reduce((s,o)=>s+o.totalAmount,0);

  return (
    <div>
      <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:"#333", marginBottom:"1.5rem" }}>📊 Overview</h1>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:"1rem", marginBottom:"2rem" }}>
        <StatCard icon="📦" num={stats.orders.length}                                    label="Total Orders"   color="#1565c0" />
        <StatCard icon="⏳" num={stats.orders.filter(o=>o.status==="pending").length}     label="Pending Orders" color="#e65100" />
        <StatCard icon="🧶" num={stats.products.length}                                  label="Products"       color="#6a1b9a" />
        <StatCard icon="👥" num={stats.users.length}                                     label="Customers"      color={pink}    />
        <StatCard icon="💰" num={`Rs.${revenue.toLocaleString()}`}                       label="Paid Revenue"   color="#2e7d32" />
        <StatCard icon="💬" num={stats.messages.filter(m=>!m.isRead).length}             label="Unread Msgs"    color="#e91e63" />
      </div>
      <div style={{ background:"#fff", borderRadius:16, padding:"1.5rem", boxShadow:"0 4px 15px rgba(0,0,0,0.07)" }}>
        <h2 style={{ fontWeight:700, fontSize:"1rem", marginBottom:"1rem", color:"#333" }}>Recent Orders</h2>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:pinkLight }}>
              {["Order ID","Customer","Total","Status","Payment"].map(h=>(
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:"0.8rem", fontWeight:700, color:"#c2185b", borderBottom:`2px solid #f8bbd0` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.orders.slice(0,6).map(o=>(
              <tr key={o._id} style={{ borderBottom:"1px solid #f9f0f5" }}>
                <td style={{ padding:"10px 14px" }}><code style={{ background:pinkBg, color:pink, padding:"2px 7px", borderRadius:6, fontSize:"0.77rem" }}>#{o._id.slice(-7).toUpperCase()}</code></td>
                <td style={{ padding:"10px 14px", fontWeight:600, fontSize:"0.88rem" }}>{o.user?.username||"N/A"}</td>
                <td style={{ padding:"10px 14px", color:pink, fontWeight:700 }}>Rs.{o.totalAmount}</td>
                <td style={{ padding:"10px 14px" }}><span style={{ background:(STATUS_COLORS[o.status]||"#333")+"22", color:STATUS_COLORS[o.status]||"#333", padding:"3px 9px", borderRadius:20, fontSize:"0.76rem", fontWeight:600 }}>{o.status}</span></td>
                <td style={{ padding:"10px 14px" }}><span style={{ color:o.paymentStatus==="paid"?"#2e7d32":"#e65100", fontWeight:600, fontSize:"0.82rem" }}>{o.paymentStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── FIX: width:100vw + overflow:hidden on the outer wrapper ──
function Dashboard() {
  const [tab, setTab] = useState("overview");
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const tabs = [
    { key:"overview",  icon:"📊", label:"Overview" },
    { key:"orders",    icon:"📦", label:"Orders" },
    { key:"products",  icon:"🧶", label:"Products" },
    { key:"users",     icon:"👥", label:"Users" },
    { key:"messages",  icon:"💬", label:"Messages" },
  ];

  return (
    // ── KEY FIX: width:100vw, overflow:hidden so flex children fill full screen ──
    <div style={{ display:"flex", width:"100vw", minHeight:"100vh", overflow:"hidden", fontFamily:"'Segoe UI',sans-serif", background:"#fff5f8" }}>

      {/* Sidebar — fixed width, never shrinks */}
      <aside style={{ width:230, minWidth:230, background:"#1e1e2d", color:"#fff", display:"flex", flexDirection:"column", boxShadow:"4px 0 20px rgba(0,0,0,0.15)" }}>
        <div style={{ padding:"1.5rem 1.5rem 1rem" }}>
          <div style={{ fontSize:"1.7rem", fontFamily:"'Brush Script MT',cursive", color:"#f48fb1", marginBottom:"0.8rem" }}>🧵 granny_SB</div>
          <div style={{ background:"rgba(217,111,166,0.15)", borderRadius:10, padding:"0.7rem 0.9rem", border:"1px solid rgba(217,111,166,0.3)" }}>
            <div style={{ fontSize:"0.7rem", color:"#f48fb1", fontWeight:600, letterSpacing:1, textTransform:"uppercase" }}>Admin</div>
            <div style={{ fontWeight:700, color:"#fff", fontSize:"0.95rem" }}>{adminUser.username||"Admin"}</div>
            <div style={{ fontSize:"0.72rem", color:"#aaa", marginTop:2 }}>{adminUser.email}</div>
          </div>
        </div>
        <nav style={{ flex:1, padding:"0.5rem 0.8rem" }}>
          {tabs.map(t => (
            <div key={t.key} onClick={() => setTab(t.key)}
              style={{ display:"flex", alignItems:"center", gap:"0.7rem", padding:"11px 14px", cursor:"pointer", borderRadius:10, marginBottom:3, background:tab===t.key?pink:"transparent", color:tab===t.key?"#fff":"#aaa", fontWeight:tab===t.key?700:400, fontSize:"0.9rem", transition:"all 0.2s" }}
              onMouseEnter={e => { if(tab!==t.key) e.currentTarget.style.background="rgba(217,111,166,0.15)"; }}
              onMouseLeave={e => { if(tab!==t.key) e.currentTarget.style.background="transparent"; }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding:"1rem 1.5rem" }}>
          <button onClick={logout}
            style={{ width:"100%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", color:"#ccc", padding:"10px", borderRadius:10, cursor:"pointer", fontSize:"0.87rem" }}
            onMouseEnter={e => e.target.style.background="rgba(217,111,166,0.3)"}
            onMouseLeave={e => e.target.style.background="rgba(255,255,255,0.08)"}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main — takes ALL remaining width */}
      <main style={{ flex:1, minWidth:0, padding:"2rem 2.5rem", overflowY:"auto" }}>
        {tab === "overview"  && <OverviewPage />}
        {tab === "orders"    && <OrdersPage />}
        {tab === "products"  && <ProductsPage />}
        {tab === "users"     && <UsersPage />}
        {tab === "messages"  && <MessagesPage />}
      </main>
    </div>
  );
}

export default Dashboard;
