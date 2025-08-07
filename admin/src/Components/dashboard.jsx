import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'products'

  // Users state
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // user object being edited

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // product object being edited

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      alert("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      alert("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchProducts();
    }
  }, [activeTab]);

  // Edit handlers (generic for users and products)
  const handleInputChange = (e, setEditingItem) => {
    const { name, value } = e.target;
    setEditingItem(prev => ({ ...prev, [name]: value }));
  };

  // Save edited user
  const saveUser = async () => {
    try {
      await axios.put(`/api/users/${editingUser._id}`, editingUser);
      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch {
      alert("Failed to update user");
    }
  };

  // Save edited product
  const saveProduct = async () => {
    try {
      await axios.put(`/api/products/${editingProduct._id}`, editingProduct);
      alert("Product updated successfully");
      setEditingProduct(null);
      fetchProducts();
    } catch {
      alert("Failed to update product");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      alert("User deleted");
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      alert("Product deleted");
      fetchProducts();
    } catch {
      alert("Failed to delete product");
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Admin Panel</h2>
        <nav style={styles.nav}>
          <button
            style={activeTab === "users" ? styles.activeNavLink : styles.navLink}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            style={activeTab === "products" ? styles.activeNavLink : styles.navLink}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        </header>

        {activeTab === "users" && (
          <section>
            <h2>Users</h2>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username || user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <button onClick={() => setEditingUser(user)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => deleteUser(user._id)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {editingUser && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3>Edit User</h3>
                  <label>
                    Name:
                    <input
                      name="username"
                      value={editingUser.username || ""}
                      onChange={(e) => handleInputChange(e, setEditingUser)}
                      style={styles.input}
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      name="email"
                      value={editingUser.email || ""}
                      onChange={(e) => handleInputChange(e, setEditingUser)}
                      style={styles.input}
                    />
                  </label>
                  <label>
                    Role:
                    <select
                      name="role"
                      value={editingUser.role || ""}
                      onChange={(e) => handleInputChange(e, setEditingUser)}
                      style={styles.input}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                  <div style={styles.modalActions}>
                    <button onClick={saveUser} style={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditingUser(null)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab === "products" && (
          <section>
            <h2>Products</h2>
            {loadingProducts ? (
              <p>Loading products...</p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price (Rs.)</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.ProductName || product.name}</td>
                      <td>{product.Description || product.description}</td>
                      <td>{product.Price || product.price}</td>
                      <td>{product.Stock || product.stock}</td>
                      <td>
                        <button onClick={() => setEditingProduct(product)} style={styles.editBtn}>Edit</button>
                        <button onClick={() => deleteProduct(product._id)} style={styles.deleteBtn}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {editingProduct && (
              <div style={styles.modal}>
                <div style={styles.modalContent}>
                  <h3>Edit Product</h3>
                  <label>
                    Name:
                    <input
                      name="ProductName"
                      value={editingProduct.ProductName || ""}
                      onChange={(e) => handleInputChange(e, setEditingProduct)}
                      style={styles.input}
                    />
                  </label>
                  <label>
                    Description:
                    <textarea
                      name="Description"
                      value={editingProduct.Description || ""}
                      onChange={(e) => handleInputChange(e, setEditingProduct)}
                      style={{ ...styles.input, height: "60px" }}
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="number"
                      name="Price"
                      value={editingProduct.Price || ""}
                      onChange={(e) => handleInputChange(e, setEditingProduct)}
                      style={styles.input}
                    />
                  </label>
                  <label>
                    Stock:
                    <input
                      type="number"
                      name="Stock"
                      value={editingProduct.Stock || ""}
                      onChange={(e) => handleInputChange(e, setEditingProduct)}
                      style={styles.input}
                    />
                  </label>
                  <div style={styles.modalActions}>
                    <button onClick={saveProduct} style={styles.saveBtn}>Save</button>
                    <button onClick={() => setEditingProduct(null)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f4f6f8",
  },
  sidebar: {
    width: "240px",
    backgroundColor: "#34495e",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sidebarTitle: {
    fontSize: "1.75rem",
    fontWeight: "bold",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
  },
  navLink: {
    background: "none",
    border: "none",
    color: "white",
    padding: "10px 15px",
    fontSize: "1.1rem",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "10px",
    transition: "background-color 0.2s",
  },
  activeNavLink: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    padding: "10px 15px",
    fontSize: "1.1rem",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  header: {
    marginBottom: "25px",
  },
  headerTitle: {
    fontSize: "2rem",
    color: "#2c3e50",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  editBtn: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "6px 12px",
    marginRight: "8px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "25px 30px",
    borderRadius: "10px",
    minWidth: "320px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    marginTop: "6px",
    marginBottom: "15px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  saveBtn: {
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Dashboard;
