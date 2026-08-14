import API_URL from '../config';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NotificationBell from "../components/NotificationBell";

function Reports() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  //const name = localStorage.getItem("name");
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stockLogs, setStockLogs] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [med, sup, logs, orders] = await Promise.all([
        axios.get(`${API_URL}/api/medicines`),
        axios.get(`${API_URL}/api/suppliers`),
        axios.get(`${API_URL}/api/stock-logs`),
        axios.get(`${API_URL}/api/purchase-orders`),
      ]);
      setMedicines(med.data);
      setSuppliers(sup.data);
      setStockLogs(logs.data);
      setPurchaseOrders(orders.data);
    } catch (error) {
      console.error("Error:", error);
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

  // Generate Medicine Report PDF
  const generateMedicineReport = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(233, 69, 96);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("MediStock", 14, 15);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Medicine Inventory Report", 14, 25);
      doc.setFontSize(10);
      doc.text(
        "Generated: " + new Date().toLocaleString(),
        14, 32
      );

      // Summary
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 45);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Medicines: ${medicines.length}`, 14, 53);
      doc.text(
        `In Stock: ${medicines.filter(m => m.status === "IN_STOCK").length}`,
        14, 60
      );
      doc.text(
        `Low Stock: ${medicines.filter(m => m.status === "LOW_STOCK").length}`,
        80, 60
      );
      doc.text(
        `Out of Stock: ${medicines.filter(m => m.status === "OUT_OF_STOCK").length}`,
        150, 60
      );

      // Table
      autoTable(doc, {
        startY: 70,
        head: [["Name", "Batch", "Category",
          "Supplier", "Qty", "Expiry", "Price", "Status"]],
        body: medicines.map(m => [
          m.name || "",
          m.batchNumber || "",
          m.category || "",
          m.supplier || "",
          m.quantity || 0,
          m.expiryDate || "",
          "₹" + (m.price || 0),
          m.status || ""
        ]),
        headStyles: {
          fillColor: [26, 26, 46],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [248, 249, 255]
        },
        styles: { fontSize: 8 },
        didDrawCell: (data) => {
          if (data.column.index === 7 &&
              data.section === "body") {
            const status = data.cell.text[0];
            if (status === "OUT_OF_STOCK") {
              doc.setTextColor(229, 62, 62);
            } else if (status === "LOW_STOCK") {
              doc.setTextColor(246, 173, 85);
            } else {
              doc.setTextColor(104, 211, 145);
            }
          }
        }
      });

      doc.save("MediStock_Medicine_Report.pdf");
      setMessage("Medicine report downloaded successfully!");
    } catch (error) {
      setMessage("Failed to generate report!");
    }
    setLoading(false);
  };

  // Generate Supplier Report PDF
  const generateSupplierReport = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(233, 69, 96);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("MediStock", 14, 15);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Supplier Report", 14, 25);
      doc.setFontSize(10);
      doc.text(
        "Generated: " + new Date().toLocaleString(),
        14, 32
      );

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 45);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Suppliers: ${suppliers.length}`, 14, 53);

      autoTable(doc, {
        startY: 65,
        head: [["Name", "Contact", "Email",
          "Address", "Supplied Medicines"]],
        body: suppliers.map(s => [
          s.name || "",
          s.contactNumber || "",
          s.email || "",
          s.address || "",
          s.suppliedMedicines || ""
        ]),
        headStyles: {
          fillColor: [26, 26, 46],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [248, 249, 255]
        },
        styles: { fontSize: 9 }
      });

      doc.save("MediStock_Supplier_Report.pdf");
      setMessage("Supplier report downloaded successfully!");
    } catch (error) {
      setMessage("Failed to generate report!");
    }
    setLoading(false);
  };

  // Generate Stock History Report
  const generateStockReport = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(233, 69, 96);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("MediStock", 14, 15);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Stock History Report", 14, 25);
      doc.setFontSize(10);
      doc.text(
        "Generated: " + new Date().toLocaleString(),
        14, 32
      );

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 45);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Stock Movements: ${stockLogs.length}`, 14, 53);

      autoTable(doc, {
        startY: 65,
        head: [["Medicine", "Action", "Previous Qty",
          "Change", "New Qty", "Performed By", "Date"]],
        body: stockLogs.slice(0, 50).map(log => [
          log.medicineName || "",
          log.actionType || "",
          log.previousQuantity || 0,
          (log.quantityChanged >= 0 ? "+" : "") +
            (log.quantityChanged || 0),
          log.newQuantity || 0,
          log.performedBy || "",
          log.createdAt ?
            new Date(log.createdAt).toLocaleDateString()
            : ""
        ]),
        headStyles: {
          fillColor: [26, 26, 46],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [248, 249, 255]
        },
        styles: { fontSize: 8 }
      });

      doc.save("MediStock_Stock_Report.pdf");
      setMessage("Stock report downloaded successfully!");
    } catch (error) {
      setMessage("Failed to generate report!");
    }
    setLoading(false);
  };

  // Generate Purchase Orders Report
  const generatePurchaseReport = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(233, 69, 96);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("MediStock", 14, 15);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Purchase Orders Report", 14, 25);
      doc.setFontSize(10);
      doc.text(
        "Generated: " + new Date().toLocaleString(),
        14, 32
      );

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Summary", 14, 45);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total Orders: ${purchaseOrders.length}`, 14, 53);
      doc.text(
        `Pending: ${purchaseOrders.filter(o => o.status === "PENDING").length}`,
        14, 60
      );
      doc.text(
        `Delivered: ${purchaseOrders.filter(o => o.status === "DELIVERED").length}`,
        80, 60
      );

      autoTable(doc, {
        startY: 70,
        head: [["Order ID", "Supplier", "Medicine",
          "Quantity", "Amount", "Status", "Date"]],
        body: purchaseOrders.map(o => [
          "#PO" + o.id,
          o.supplierName || "",
          o.medicineName || "",
          o.quantity || 0,
          "₹" + (o.totalAmount || 0),
          o.status || "",
          o.orderDate || ""
        ]),
        headStyles: {
          fillColor: [26, 26, 46],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        alternateRowStyles: {
          fillColor: [248, 249, 255]
        },
        styles: { fontSize: 9 }
      });

      doc.save("MediStock_Purchase_Report.pdf");
      setMessage("Purchase orders report downloaded!");
    } catch (error) {
      setMessage("Failed to generate report!");
    }
    setLoading(false);
  };

  // Generate Expiry Report
  const generateExpiryReport = () => {
    setLoading(true);
    try {
      const doc = new jsPDF();
      const today = new Date();

      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 35, "F");
      doc.setTextColor(233, 69, 96);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("MediStock", 14, 15);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("Expiry Report", 14, 25);
      doc.setFontSize(10);
      doc.text(
        "Generated: " + new Date().toLocaleString(),
        14, 32
      );

      const expiring = medicines.filter(m => {
        if (!m.expiryDate) return false;
        const expiry = new Date(m.expiryDate);
        const diffDays = (expiry - today) /
          (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 30;
      });

      const expired = medicines.filter(m => {
        if (!m.expiryDate) return false;
        return new Date(m.expiryDate) < today;
      });

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Expiring in 30 days: ${expiring.length}`,
        14, 45
      );
      doc.text(
        `Already Expired: ${expired.length}`,
        14, 52
      );

      // Expiring Soon Table
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("⚠️ Expiring Within 30 Days", 14, 65);

      autoTable(doc, {
        startY: 70,
        head: [["Medicine", "Batch", "Category",
          "Expiry Date", "Days Left"]],
        body: expiring.map(m => {
          const expiry = new Date(m.expiryDate);
          const days = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
          );
          return [
            m.name || "",
            m.batchNumber || "",
            m.category || "",
            m.expiryDate || "",
            days + " days"
          ];
        }),
        headStyles: {
          fillColor: [246, 173, 85],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        styles: { fontSize: 9 }
      });

      // Expired Table
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(229, 62, 62);
      doc.text("❌ Already Expired", 14, finalY);

      autoTable(doc, {
        startY: finalY + 5,
        head: [["Medicine", "Batch", "Category",
          "Expiry Date", "Days Overdue"]],
        body: expired.map(m => {
          const expiry = new Date(m.expiryDate);
          const days = Math.ceil(
            (today - expiry) / (1000 * 60 * 60 * 24)
          );
          return [
            m.name || "",
            m.batchNumber || "",
            m.category || "",
            m.expiryDate || "",
            days + " days overdue"
          ];
        }),
        headStyles: {
          fillColor: [229, 62, 62],
          textColor: [255, 255, 255],
          fontStyle: "bold"
        },
        styles: { fontSize: 9 }
      });

      doc.save("MediStock_Expiry_Report.pdf");
      setMessage("Expiry report downloaded successfully!");
    } catch (error) {
      setMessage("Failed to generate report!");
    }
    setLoading(false);
  };

  const reportCards = [
    {
      title: "Medicine Inventory Report",
      description: "Complete list of all medicines with stock status, expiry dates and prices",
      icon: "💊",
      color: "#e94560",
      count: `${medicines.length} medicines`,
      action: generateMedicineReport
    },
    {
      title: "Supplier Report",
      description: "All supplier details including contact information and supplied medicines",
      icon: "🏢",
      color: "#63b3ed",
      count: `${suppliers.length} suppliers`,
      action: generateSupplierReport
    },
    {
      title: "Stock History Report",
      description: "Complete stock movement history with all additions, updates and deletions",
      icon: "📋",
      color: "#68d391",
      count: `${stockLogs.length} movements`,
      action: generateStockReport
    },
    {
      title: "Purchase Orders Report",
      description: "All purchase orders with supplier details, quantities and delivery status",
      icon: "🛒",
      color: "#9f7aea",
      count: `${purchaseOrders.length} orders`,
      action: generatePurchaseReport
    },
    {
      title: "Expiry Report",
      description: "Medicines expiring soon and already expired medicines with days remaining",
      icon: "⏰",
      color: "#f6ad55",
      count: `${medicines.filter(m => m.expiryDate && new Date(m.expiryDate) < new Date()).length} expired`,
      action: generateExpiryReport
    },
  ];

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
              📄 Reports & Data Export
            </h1>
            <p style={{
              color: "#718096", margin: "5px 0 0 0",
              fontSize: "14px"
            }}>
              Download PDF reports for all inventory data
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

        {/* Message */}
        {message && (
          <div style={{
            padding: "12px", borderRadius: "8px",
            marginBottom: "20px",
            background: message.includes("successfully") ||
              message.includes("downloaded")
              ? "#f0fff4" : "#fff5f5",
            color: message.includes("successfully") ||
              message.includes("downloaded")
              ? "green" : "red",
            border: message.includes("successfully") ||
              message.includes("downloaded")
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

        {/* Report Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px", marginBottom: "30px"
        }}>
          {reportCards.map((report, index) => (
            <div key={index} style={{
              background: "white", padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
              borderTop: `4px solid ${report.color}`,
              display: "flex",
              flexDirection: "column",
              gap: "15px"
            }}>
              <div style={{
                display: "flex", alignItems: "center",
                gap: "12px"
              }}>
                <div style={{
                  width: "50px", height: "50px",
                  background: report.color + "15",
                  borderRadius: "12px",
                  display: "flex", alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px"
                }}>
                  {report.icon}
                </div>
                <div>
                  <h3 style={{
                    color: "#1a1a2e", margin: 0,
                    fontSize: "15px"
                  }}>
                    {report.title}
                  </h3>
                  <span style={{
                    color: report.color,
                    fontSize: "12px",
                    fontWeight: "600"
                  }}>
                    {report.count}
                  </span>
                </div>
              </div>

              <p style={{
                color: "#718096", fontSize: "13px",
                margin: 0, lineHeight: "1.5"
              }}>
                {report.description}
              </p>

              <button
                onClick={report.action}
                disabled={loading}
                style={{
                  padding: "12px",
                  background: loading
                    ? "#a0aec0"
                    : `linear-gradient(135deg, #1a1a2e, ${report.color})`,
                  color: "white", border: "none",
                  borderRadius: "10px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "14px", fontWeight: "600",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", gap: "8px"
                }}>
                {loading ? "Generating..." : "📥 Download PDF"}
              </button>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div style={{
          background: "white", padding: "25px",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ color: "#1a1a2e", marginBottom: "15px" }}>
            ℹ️ Report Information
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "15px"
          }}>
            {[
              {
                icon: "💊",
                label: "Medicine Report",
                info: "Includes all medicine details, stock status and expiry dates"
              },
              {
                icon: "🏢",
                label: "Supplier Report",
                info: "Includes supplier contact details and supplied medicines list"
              },
              {
                icon: "⏰",
                label: "Expiry Report",
                info: "Shows medicines expiring in 30 days and already expired ones"
              },
            ].map((item, index) => (
              <div key={index} style={{
                padding: "15px",
                background: "#f7fafc",
                borderRadius: "10px"
              }}>
                <p style={{
                  margin: "0 0 5px 0",
                  fontWeight: "600",
                  color: "#1a1a2e",
                  fontSize: "14px"
                }}>
                  {item.icon} {item.label}
                </p>
                <p style={{
                  margin: 0, color: "#718096",
                  fontSize: "12px"
                }}>
                  {item.info}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;