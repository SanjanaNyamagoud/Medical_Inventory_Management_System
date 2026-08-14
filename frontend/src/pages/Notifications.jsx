import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

function Notifications() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  //const name = localStorage.getItem("name");
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/notifications`
      );
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/mark-all-read`
      );
      setMessage("All notifications marked as read!");
      fetchNotifications();
    } catch (error) {
      setMessage("Failed to mark as read!");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/${id}/read`
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/notifications/${id}`
      );
      setMessage("Notification deleted!");
      fetchNotifications();
    } catch (error) {
      setMessage("Failed to delete!");
    }
  };

  const handleGenerateAlerts = async () => {
    try {
      await axios.post(
        `${API_URL}/api/notifications/generate-alerts`
      );
      setMessage("Alerts generated successfully!");
      fetchNotifications();
    } catch (error) {
      setMessage("Failed to generate alerts!");
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm(
      "Are you sure you want to delete all notifications?"
    )) {
      try {
        await Promise.all(
          notifications.map(n =>
            axios.delete(
              `${API_URL}/api/notifications/${n.id}`
            )
          )
        );
        setMessage("All notifications deleted!");
        fetchNotifications();
      } catch (error) {
        setMessage("Failed to delete all!");
      }
    }
  };

  const filteredNotifications = notifications.filter(n =>
    filterType === "ALL" || n.type === filterType
  );

  const getTypeColor = (type) => {
    if (type === "OUT_OF_STOCK") return "#e53e3e";
    if (type === "LOW_STOCK") return "#f6ad55";
    if (type === "EXPIRY") return "#fc8181";
    if (type === "PURCHASE") return "#68d391";
    return "#63b3ed";
  };

  const getTypeIcon = (type) => {
    if (type === "OUT_OF_STOCK") return "❌";
    if (type === "LOW_STOCK") return "⚠️";
    if (type === "EXPIRY") return "⏰";
    if (type === "PURCHASE") return "🛒";
    return "🔔";
  };

  const getTypeBg = (type) => {
    if (type === "OUT_OF_STOCK") return "#fff5f5";
    if (type === "LOW_STOCK") return "#fffaf0";
    if (type === "EXPIRY") return "#fff5f5";
    if (type === "PURCHASE") return "#f0fff4";
    return "#f0f8ff";
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

  // Stats
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(
    n => !n.isRead
  ).length;
  const lowStockCount = notifications.filter(
    n => n.type === "LOW_STOCK"
  ).length;
  const expiryCount = notifications.filter(
    n => n.type === "EXPIRY"
  ).length;
  const outOfStockCount = notifications.filter(
    n => n.type === "OUT_OF_STOCK"
  ).length;

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
          alignItems: "center", marginBottom: "25px"
        }}>
          <div>
            <h1 style={{
              color: "#1a1a2e", fontSize: "26px",
              fontWeight: "700", margin: 0
            }}>
              🔔 Notifications
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              All system alerts and notifications
            </p>
          </div>
          <div style={{
            display: "flex", gap: "10px",
            alignItems: "center"
          }}>
            <NotificationBell />
            <button onClick={handleGenerateAlerts}
              style={{
                padding: "10px 15px",
                background: "#f0f0ff",
                color: "#1a1a2e",
                border: "1px solid #e0e0ff",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "13px", fontWeight: "600"
              }}>
              🔄 Refresh Alerts
            </button>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead}
                style={{
                  padding: "10px 15px",
                  background: "#f0fff4",
                  color: "#276749",
                  border: "1px solid #9ae6b4",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "13px", fontWeight: "600"
                }}>
                ✅ Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={handleDeleteAll}
                style={{
                  padding: "10px 15px",
                  background: "#fff5f5",
                  color: "#e53e3e",
                  border: "1px solid #fed7d7",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "13px", fontWeight: "600"
                }}>
                🗑️ Clear All
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "15px", marginBottom: "25px"
        }}>
          {[
            {
              label: "Total",
              value: totalCount,
              icon: "🔔", color: "#63b3ed"
            },
            {
              label: "Unread",
              value: unreadCount,
              icon: "📬", color: "#e94560"
            },
            {
              label: "Low Stock",
              value: lowStockCount,
              icon: "⚠️", color: "#f6ad55"
            },
            {
              label: "Expiry",
              value: expiryCount,
              icon: "⏰", color: "#fc8181"
            },
            {
              label: "Out of Stock",
              value: outOfStockCount,
              icon: "❌", color: "#e53e3e"
            },
          ].map((stat, index) => (
            <div key={index} style={{
              background: "white", padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              borderTop: `4px solid ${stat.color}`,
              textAlign: "center",
              cursor: "pointer"
            }}
              onClick={() => {
                if (stat.label === "Low Stock")
                  setFilterType("LOW_STOCK");
                else if (stat.label === "Expiry")
                  setFilterType("EXPIRY");
                else if (stat.label === "Out of Stock")
                  setFilterType("OUT_OF_STOCK");
                else setFilterType("ALL");
              }}>
              <div style={{ fontSize: "25px", marginBottom: "8px" }}>
                {stat.icon}
              </div>
              <h2 style={{
                color: stat.color, fontSize: "24px",
                fontWeight: "700", margin: "0 0 5px 0"
              }}>
                {stat.value}
              </h2>
              <p style={{
                color: "#718096", fontSize: "12px", margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: "12px", borderRadius: "8px",
            marginBottom: "15px",
            background: message.includes("successfully") ||
              message.includes("marked") ||
              message.includes("deleted")
              ? "#f0fff4" : "#fff5f5",
            color: message.includes("successfully") ||
              message.includes("marked") ||
              message.includes("deleted")
              ? "green" : "red",
            border: message.includes("successfully") ||
              message.includes("marked") ||
              message.includes("deleted")
              ? "1px solid #9ae6b4" : "1px solid #fed7d7"
          }}>
            {message}
            <button onClick={() => setMessage("")}
              style={{
                float: "right", background: "none",
                border: "none", cursor: "pointer",
                fontSize: "16px"
              }}>
              ✕
            </button>
          </div>
        )}

        {/* Filter */}
        <div style={{
          display: "flex", gap: "10px",
          marginBottom: "20px", flexWrap: "wrap"
        }}>
          {[
            { label: "All", value: "ALL", icon: "🔔" },
            { label: "Low Stock", value: "LOW_STOCK", icon: "⚠️" },
            { label: "Out of Stock", value: "OUT_OF_STOCK", icon: "❌" },
            { label: "Expiry", value: "EXPIRY", icon: "⏰" },
            { label: "Purchase", value: "PURCHASE", icon: "🛒" },
          ].map((filter, index) => (
            <button key={index}
              onClick={() => setFilterType(filter.value)}
              style={{
                padding: "8px 15px",
                background: filterType === filter.value
                  ? "#1a1a2e" : "white",
                color: filterType === filter.value
                  ? "white" : "#718096",
                border: filterType === filter.value
                  ? "none" : "1px solid #e2e8f0",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "13px", fontWeight: "600"
              }}>
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div style={{
          background: "white", borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "15px 20px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex", justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h3 style={{ color: "#1a1a2e", margin: 0 }}>
              Notifications ({filteredNotifications.length})
            </h3>
            {unreadCount > 0 && (
              <span style={{
                background: "#e94560", color: "white",
                padding: "4px 12px", borderRadius: "20px",
                fontSize: "12px", fontWeight: "600"
              }}>
                {unreadCount} unread
              </span>
            )}
          </div>

          {loading ? (
            <div style={{
              textAlign: "center", padding: "50px",
              color: "#a0aec0"
            }}>
              <div style={{ fontSize: "40px" }}>🔔</div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px",
              color: "#a0aec0"
            }}>
              <div style={{ fontSize: "50px" }}>🔔</div>
              <h3 style={{ color: "#718096" }}>
                No notifications!
              </h3>
              <p>Click Refresh Alerts to generate new alerts</p>
              <button onClick={handleGenerateAlerts}
                style={{
                  padding: "12px 25px",
                  background: "linear-gradient(135deg, #1a1a2e, #e94560)",
                  color: "white", border: "none",
                  borderRadius: "10px", cursor: "pointer",
                  fontWeight: "600", marginTop: "10px"
                }}>
                🔄 Generate Alerts Now
              </button>
            </div>
          ) : (
            filteredNotifications.map((notif, index) => (
              <div key={notif.id} style={{
                padding: "20px",
                borderBottom: "1px solid #f0f0f0",
                background: notif.isRead
                  ? "white" : getTypeBg(notif.type),
                display: "flex",
                gap: "15px",
                alignItems: "flex-start",
                transition: "background 0.2s"
              }}>
                {/* Icon */}
                <div style={{
                  width: "45px", height: "45px",
                  background: getTypeColor(notif.type) + "20",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px", flexShrink: 0
                }}>
                  {getTypeIcon(notif.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "10px", marginBottom: "5px"
                  }}>
                    <h4 style={{
                      margin: 0,
                      color: "#1a1a2e",
                      fontWeight: notif.isRead ? "400" : "700",
                      fontSize: "15px"
                    }}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span style={{
                        background: "#e94560",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "10px",
                        fontWeight: "700"
                      }}>
                        NEW
                      </span>
                    )}
                    <span style={{
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "11px",
                      fontWeight: "600",
                      background: getTypeColor(notif.type) + "20",
                      color: getTypeColor(notif.type)
                    }}>
                      {notif.type}
                    </span>
                  </div>
                  <p style={{
                    margin: "0 0 8px 0",
                    color: "#4a5568",
                    fontSize: "14px",
                    lineHeight: "1.5"
                  }}>
                    {notif.message}
                  </p>
                  <p style={{
                    margin: 0, color: "#a0aec0",
                    fontSize: "12px"
                  }}>
                    🕐 {notif.createdAt ?
                      new Date(notif.createdAt).toLocaleString()
                      : "Just now"}
                  </p>
                </div>

                {/* Actions */}
                <div style={{
                  display: "flex", gap: "8px",
                  flexShrink: 0
                }}>
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      style={{
                        padding: "6px 12px",
                        background: "#f0fff4",
                        color: "#276749",
                        border: "1px solid #9ae6b4",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px", fontWeight: "600"
                      }}>
                      ✓ Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    style={{
                      padding: "6px 12px",
                      background: "#fff5f5",
                      color: "#e53e3e",
                      border: "1px solid #fed7d7",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifications;