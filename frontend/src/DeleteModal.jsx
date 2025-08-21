import React from "react";

function DeleteModal({ task, onClose, onDelete }) {
  if (!task) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
    }}>
      <div style={{
        width: "400px", background: "#fff", padding: "30px",
        borderRadius: "12px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
      }}>
        <h3 style={{ marginBottom: "20px", color: "#333" }}>Confirm Delete</h3>
        <p>Are you sure you want to delete <strong>{task.title}</strong>?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "25px" }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#ccc", color: "#fff", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#d32f2f", color: "#fff", cursor: "pointer" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;