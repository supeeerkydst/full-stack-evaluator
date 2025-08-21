import { useEffect, useState } from "react";
import api from "./api/axios";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Fetch tasks and users
  useEffect(() => {
    api.get("/tasks").then(res => setTasks(res.data)).catch(console.error);
    api.get("/users").then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTask = { title, isDone: false, userId: parseInt(assignedTo) };
    try {
      const res = await api.post("/tasks", newTask);
      setTasks([...tasks, res.data]);
      setTitle(""); setAssignedTo("");
    } catch (err) { console.error(err); }
  };

  // Edit Task handlers
  const openEditModal = (task) => { setEditingTask(task); setIsModalOpen(true); };
  const closeModal = () => { setEditingTask(null); setIsModalOpen(false); };
  const toggleStatus = () => { if (!editingTask.isDone) setEditingTask({ ...editingTask, isDone: true }); };
  const handleSave = async (task, saveToAPI) => {
    setEditingTask(task);
    if (saveToAPI) {
      try {
        const res = await api.put(`/tasks/${task.id}`, task);
        setTasks(tasks.map(t => t.id === res.data.id ? res.data : t));
        closeModal();
      } catch (err) { console.error(err); }
    }
  };

  // Delete Task handlers
  const openDeleteModal = (task) => { setTaskToDelete(task); setIsDeleteModalOpen(true); };
  const closeDeleteModal = () => { setTaskToDelete(null); setIsDeleteModalOpen(false); };
  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      setTasks(tasks.filter(t => t.id !== taskToDelete.id));
      closeDeleteModal();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ display: "flex", gap: "20px", fontFamily: "Roboto, sans-serif" }}>
      {/* Left Column */}
      <div style={{ width: "50%", height: "200px", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Create Task</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "15px" }}>
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", flex: 1 }} />
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}>
            <option value="">-- Assign User --</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.email}</option>)}
          </select>
          <button type="submit" style={{ padding: "12px", borderRadius: "8px", background: "#1976d2", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>Add Task</button>
        </form>
      </div>

      {/* Right Column */}
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
                    {!task.isDone && <button onClick={() => openEditModal(task)} style={{ padding: "6px 12px", borderRadius: "6px", background: "#ffa000", border: "none", color: "#fff", cursor: "pointer" }}>Edit</button>}
                    <button onClick={() => openDeleteModal(task)} style={{ padding: "6px 12px", borderRadius: "6px", background: "#d32f2f", border: "none", color: "#fff", cursor: "pointer" }}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <EditModal task={editingTask} users={users} onClose={closeModal} onSave={handleSave} onToggleStatus={toggleStatus} />
      <DeleteModal task={taskToDelete} onClose={closeDeleteModal} onDelete={handleDelete} />
    </div>
  );
}

export default Tasks;