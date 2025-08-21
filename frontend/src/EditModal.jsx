import React from "react";

function EditModal({ task, users, onClose, onSave, onToggleStatus }) {
  if (!task) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{
        width: "400px", background: "#fff", padding: "30px",
        borderRadius: "12px", position: "relative"
      }}>
        <h2>Edit Task</h2>
        
        <p><strong>Title:</strong></p>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onSave({ ...task, title: e.target.value }, false)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }}
        />

        <p><strong>Assigned User:</strong></p>
        <select
          value={task.userId}
          onChange={(e) => onSave({ ...task, userId: parseInt(e.target.value) }, false)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>

        <p><strong>Status:</strong></p>
        <button
          onClick={onToggleStatus}
          disabled={task.isDone}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            background: task.isDone ? "#ccc" : "#4caf50",
            border: "none",
            color: "#fff",
            cursor: task.isDone ? "not-allowed" : "pointer",
            marginBottom: "20px"
          }}
        >
          {task.isDone ? "✅ Done" : "❌ Pending"}
        </button>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#d32f2f", color: "#fff" }}>Cancel</button>
          <button onClick={() => onSave(task, true)} style={{ padding: "8px 16px", borderRadius: "8px", border: "none", background: "#1976d2", color: "#fff" }}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
