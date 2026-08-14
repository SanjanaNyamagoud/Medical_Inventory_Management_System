import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import NotificationBell from "../components/NotificationBell";

function Analytics() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  //const name = localStorage.getItem("name");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/medicines`
      );
      setAnalytics(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const menuItems = role === "ADMIN" ? [
    { icon: "📊", label: "Dashboard", path: "/dashboard" },
    { icon: "💊", label: "Inventory", path: "/inventory" },
    { icon: "🏢", label: "Suppliers", path: "/suppliers" },
    { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
    { icon: "📋", label: "Stock History", path: "/stock-history" },
    { icon: "👥", label: "User Management", path: "/user-management" },
    { icon: "📈", label: "Analytics", path: "/analytics" },
    { icon: "📄", label: "Reports", path: "/reports" },
    { icon: "🔔", label: "Notifications", path: "/notifications" },
  ] : [
    { icon: "📊", label: "Dashboard", path: "/pharmacist-dashboard" },
    { icon: "💊", label: "Inventory", path: "/inventory" },
    { icon: "🏢", label: "Suppliers", path: "/suppliers" },
    { icon: "🛒", label: "Purchase Orders", path: "/purchase-orders" },
    { icon: "📋", label: "Stock History", path: "/stock-history" },
    { icon: "📈", label: "Analytics", path: "/analytics" },
    { icon: "📄", label: "Reports", path: "/reports" },
    { icon: "🔔", label: "Notifications", path: "/notifications" },
  ];

  // Pie chart colors
  const STOCK_COLORS = ["#68d391", "#f6ad55", "#e53e3e"];
  const CATEGORY_COLORS = [
    "#e94560", "#63b3ed", "#68d391",
    "#f6ad55", "#9f7aea", "#fc8181"
  ];
  const PURCHASE_COLORS = ["#f6ad55", "#68d391", "#e53e3e"];

  // Prepare chart data
  const stockData = analytics ? [
    { name: "In Stock", value: analytics.stockDistribution?.IN_STOCK || 0 },
    { name: "Low Stock", value: analytics.stockDistribution?.LOW_STOCK || 0 },
    { name: "Out of Stock", value: analytics.stockDistribution?.OUT_OF_STOCK || 0 },
  ] : [];

  const categoryData = analytics ?
    Object.entries(analytics.categoryWise || {}).map(
      ([name, value]) => ({ name, value })
    ) : [];

  const supplierData = analytics ?
    Object.entries(analytics.supplierWise || {}).map(
      ([name, value]) => ({ name, value })
    ) : [];

  const purchaseData = analytics ? [
    { name: "Pending", value: analytics.purchaseStats?.PENDING || 0 },
    { name: "Delivered", value: analytics.purchaseStats?.DELIVERED || 0 },
    { name: "Cancelled", value: analytics.purchaseStats?.CANCELLED || 0 },
  ] : [];

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#f7fafc"
    }}>

      {/* Sidebar */}
      <div style={{
        width: "240px",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "white", padding: "25px 15px",
        display: "flex", flexDirection: "column"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "35px" }}>💊</div>
          <h2 style={{
            color: "#e94560", fontSize: "22px",
            fontWeight: "800", margin: "5px 0 0 0"
          }}>
            MediStock
          </h2>
        </div>
        <div style={{ flex: 1 }}>
          {menuItems.map((item, index) => (
            <div key={index}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: "12px", padding: "12px 15px",
                marginBottom: "5px", borderRadius: "10px",
                cursor: "pointer",
                background: window.location.pathname === item.path
                  ? "rgba(233,69,96,0.2)" : "transparent",
                borderLeft: window.location.pathname === item.path
                  ? "3px solid #e94560" : "3px solid transparent"
              }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "14px", color: "#e2e8f0" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <button onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
          style={{
            width: "100%", padding: "12px",
            background: "rgba(233,69,96,0.15)",
            color: "#e94560", border: "1px solid #e94560",
            borderRadius: "10px", cursor: "pointer",
            fontSize: "14px", fontWeight: "600"
          }}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>

        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "30px"
        }}>
          <div>
            <h1 style={{
              color: "#1a1a2e", fontSize: "26px",
              fontWeight: "700", margin: 0
            }}>
              📈 Analytics Dashboard
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              Complete inventory analytics and insights
            </p>
          </div>
          <div style={{
            display: "flex", gap: "15px",
            alignItems: "center"
          }}>
            <NotificationBell />
            <div style={{
              background: "white", padding: "10px 20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              color: "#718096", fontSize: "13px"
            }}>
              📅 {new Date().toDateString()}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{
            textAlign: "center", padding: "100px",
            color: "#718096"
          }}>
            <div style={{ fontSize: "40px" }}>📊</div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px", marginBottom: "30px"
            }}>
              {[
                {
                  label: "Total Medicines",
                  value: analytics?.totalMedicines || 0,
                  icon: "💊", color: "#e94560"
                },
                {
                  label: "Total Suppliers",
                  value: analytics?.totalSuppliers || 0,
                  icon: "🏢", color: "#63b3ed"
                },
                {
                  label: "Expiring Soon",
                  value: analytics?.expiringSoon || 0,
                  icon: "⏰", color: "#f6ad55"
                },
                {
                  label: "Already Expired",
                  value: analytics?.alreadyExpired || 0,
                  icon: "❌", color: "#e53e3e"
                },
              ].map((stat, index) => (
                <div key={index} style={{
                  background: "white", padding: "25px",
                  borderRadius: "16px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                  borderTop: `4px solid ${stat.color}`
                }}>
                  <div style={{
                    fontSize: "30px", marginBottom: "10px"
                  }}>
                    {stat.icon}
                  </div>
                  <h2 style={{
                    color: stat.color, fontSize: "32px",
                    fontWeight: "700", margin: "0 0 5px 0"
                  }}>
                    {stat.value}
                  </h2>
                  <p style={{
                    color: "#718096", fontSize: "13px",
                    margin: 0
                  }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Row 1 */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px", marginBottom: "20px"
            }}>

              {/* Stock Distribution Pie Chart */}
              <div style={{
                background: "white", padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{
                  color: "#1a1a2e", marginBottom: "20px"
                }}>
                  📊 Stock Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stockData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                    >
                      {stockData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={STOCK_COLORS[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Purchase Orders Pie Chart */}
              <div style={{
                background: "white", padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{
                  color: "#1a1a2e", marginBottom: "20px"
                }}>
                  🛒 Purchase Orders Status
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={purchaseData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) =>
                        `${name}: ${value}`
                      }
                    >
                      {purchaseData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={PURCHASE_COLORS[index]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px", marginBottom: "20px"
            }}>

              {/* Category Bar Chart */}
              <div style={{
                background: "white", padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{
                  color: "#1a1a2e", marginBottom: "20px"
                }}>
                  📁 Medicines by Category
                </h3>
                {categoryData.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#a0aec0"
                  }}>
                    No category data yet!
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Medicines">
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={CATEGORY_COLORS[
                              index % CATEGORY_COLORS.length
                            ]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Supplier Bar Chart */}
              <div style={{
                background: "white", padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{
                  color: "#1a1a2e", marginBottom: "20px"
                }}>
                  🏢 Medicines by Supplier
                </h3>
                {supplierData.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "50px",
                    color: "#a0aec0"
                  }}>
                    No supplier data yet!
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={supplierData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Medicines">
                        {supplierData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={CATEGORY_COLORS[
                              index % CATEGORY_COLORS.length
                            ]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Expiry Summary */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px"
            }}>
              <div style={{
                background: "white", padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                border: "1px solid #fef3c7"
              }}>
                <h3 style={{
                  color: "#744210", marginBottom: "10px"
                }}>
                  ⚠️ Expiry Summary
                </h3>
                <div style={{
                  display: "flex", gap: "20px"
                }}>
                  <div style={{
                    flex: 1, padding: "15px",
                    background: "#fffaf0",
                    borderRadius: "10px",
                    textAlign: "center"
                  }}>
                    <h2 style={{
                      color: "#f6ad55", fontSize: "28px",
                      margin: "0 0 5px 0"
                    }}>
                      {analytics?.expiringSoon || 0}
                    </h2>
                    <p style={{
                      color: "#744210", fontSize: "13px",
                      margin: 0
                    }}>
                      Expiring in 30 days
                    </p>
                  </div>
                  <div style={{
                    flex: 1, padding: "15px",
                    background: "#fff5f5",
                    borderRadius: "10px",
                    textAlign: "center"
                  }}>
                    <h2 style={{
                      color: "#e53e3e", fontSize: "28px",
                      margin: "0 0 5px 0"
                    }}>
                      {analytics?.alreadyExpired || 0}
                    </h2>
                    <p style={{
                      color: "#742a2a", fontSize: "13px",
                      margin: 0
                    }}>
                      Already Expired
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                background: "white", padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                border: "1px solid #c6f6d5"
              }}>
                <h3 style={{
                  color: "#276749", marginBottom: "10px"
                }}>
                  📋 Stock Logs Summary
                </h3>
                <div style={{
                  padding: "15px",
                  background: "#f0fff4",
                  borderRadius: "10px",
                  textAlign: "center"
                }}>
                  <h2 style={{
                    color: "#68d391", fontSize: "28px",
                    margin: "0 0 5px 0"
                  }}>
                    {analytics?.totalStockLogs || 0}
                  </h2>
                  <p style={{
                    color: "#276749", fontSize: "13px",
                    margin: 0
                  }}>
                    Total Stock Movements Recorded
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;