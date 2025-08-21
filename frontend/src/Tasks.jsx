import { useEffect, useState } from "react";
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // fetch tasks and users
  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));

    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title,
      isDone: false,
      userId: parseInt(assignedTo),
    };

    try {
      const res = await api.post("/tasks", newTask);
      setTasks([...tasks, res.data]);
      setTitle("");
      setAssignedTo("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "", fontFamily: "Roboto, sans-serif" }}>
    <div style={{ width: "50%", height: "200px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Create Task</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "", gap: "15px" }}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
        >
          <option value="">-- Assign User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.email}</option>
          ))}
        </select>
        <button type="submit" style={{ padding: "12px", borderRadius: "8px", background: "#1976d2", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>
          Add Task
        </button>
      </form>
    </div>

    <div style={{ width: "100%", height: "80%", overflowY: "auto", background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Task List</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead style={{ background: "#f1f3f4", textAlign: "left" }}>
          <tr>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Title</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Assigned User</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const user = users.find(u => u.id === task.userId);
            return (
              <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{task.id}</td>
                <td style={{ padding: "12px" }}>{task.title}</td>
                <td style={{ padding: "12px" }}>{user?.email || "N/A"}</td>
                <td style={{ padding: "12px" }}>{task.isDone ? "✅ Done" : "❌ Pending"}</td>
                <td style={{ padding: "12px", display: "flex", gap: "10px" }}>
                  <button style={{ padding: "6px 12px", borderRadius: "6px", background: "#ffa000", border: "none", color: "#fff", cursor: "pointer" }}>Edit</button>
                  <button style={{ padding: "6px 12px", borderRadius: "6px", background: "#d32f2f", border: "none", color: "#fff", cursor: "pointer" }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
  );
}

export default Tasks;