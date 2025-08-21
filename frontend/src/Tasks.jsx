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

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [filter, setFilter] = useState("all"); // "all" | "pending" | "done"

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

  // Add User handlers
  const openAddUserModal = () => setIsAddUserModalOpen(true);
  const closeAddUserModal = () => { setNewUserEmail(""); setEmailError(""); setIsAddUserModalOpen(false); };
  const handleEmailChange = (e) => {
    const email = e.target.value;
    setNewUserEmail(email);

    // Live email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) setEmailError("Email is required.");
    else if (!emailRegex.test(email)) setEmailError("Invalid email format.");
    else setEmailError("");
  };

  const handleAddUser = async () => {
  const email = newUserEmail.trim();
  if (!email) {
    setEmailError("Email is required.");
    return;
  }
  if (emailError) return; // prevent invalid

  try {
    // generate default password hash or plain password (hashed on server ideally)
      const defaultPasswordHash = "default123"; // can be hashed server-side
      const res = await api.post("/users", { email, passwordHash: defaultPasswordHash });

      setUsers([...users, res.data]);
      setAssignedTo(res.data.id);
      closeAddUserModal();

      alert(`User ${res.data.email} added successfully!`); // 👈 display success message
    } catch (err) {
      if (err.response?.status === 400) {
        const data = err.response.data;
        if (typeof data === "object") {
          const message = data.title || JSON.stringify(data.errors || data);
          setEmailError(message);
        } else setEmailError(data);
      } else console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "pending") return !task.isDone;
    if (filter === "done") return task.isDone;
  });

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      fontFamily: "Roboto, sans-serif"
    }}>
      {/* Left Column */}
      <div style={{
        flex: "1 1 280px",
        minWidth: "280px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Create Task</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required
            style={{ flex: "1 1 150px", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }} />

          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required
            style={{ flex: "1 1 150px", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}>
            <option value="">-- Assign User --</option>
            {users.map(user => <option key={user.id} value={user.id}>{user.email}</option>)}
          </select>

          <a onClick={openAddUserModal} style={{ color: "#1976d2", cursor: "pointer", fontSize: "14px", textDecoration: "underline", alignSelf: "center" }}>
            + Add New User
          </a>

          <button type="submit" style={{ padding: "12px", borderRadius: "8px", background: "#1976d2", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer" }}>Add Task</button>
        </form>
      </div>

      {/* Right Column */}
      <div style={{
        flex: "2 1 500px",
        minWidth: "300px",
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        overflowX: "auto",
        minHeight: "400px", // ensures the card doesn't shrink too much
        maxHeight: "80vh",  // responsive max height to fit screen
        display: "flex",
        flexDirection: "column"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Task List</h2>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px", gap: "10px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: filter === "all" ? "#1976d2" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: filter === "pending" ? "#1976d2" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("done")}
            style={{
              padding: "6px 12px",
              borderRadius: "6px",
              background: filter === "done" ? "#1976d2" : "#ccc",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Done
          </button>
        </div>
        <div style={{ overflowY: "auto", flex: "1 1 auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", minWidth: "400px" }}>
            <thead style={{ background: "#f1f3f4", textAlign: "left" }}>
              <tr>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Title</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Assigned User</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Status</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd", width: "130px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => {
                const user = users.find(u => u.id === task.userId);
                return (
                  <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{task.id}</td>
                    <td style={{ padding: "12px" }}>{task.title}</td>
                    <td style={{ padding: "12px" }}>{user?.email || "N/A"}</td>
                    <td style={{ padding: "12px" }}>{task.isDone ? "✅ Done" : "❌ Pending"}</td>
                    <td style={{
                      padding: "12px",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      minWidth: "130px"
                    }}>
                      {!task.isDone ? (
                        <>
                          <button
                            onClick={() => openEditModal(task)}
                            style={{
                              flex: 1,
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#ffa000",
                              border: "none",
                              color: "#fff",
                              cursor: "pointer"
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(task)}
                            style={{
                              flex: 1,
                              padding: "6px 12px",
                              borderRadius: "6px",
                              background: "#d32f2f",
                              border: "none",
                              color: "#fff",
                              cursor: "pointer"
                            }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => openDeleteModal(task)}
                          style={{
                            flex: 1,
                            padding: "6px 12px",
                            borderRadius: "6px",
                            background: "#d32f2f",
                            border: "none",
                            color: "#fff",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal task={editingTask} users={users} onClose={closeModal} onSave={handleSave} onToggleStatus={toggleStatus} />
      <DeleteModal task={taskToDelete} onClose={closeDeleteModal} onDelete={handleDelete} />

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)", // darker overlay for focus
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "15px", // small padding so mobile looks good
        }}>
          <div style={{
            width: "100%",
            maxWidth: "400px",
            background: "#fff",
            padding: "30px 25px",
            borderRadius: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            textAlign: "center",
            animation: "fadeIn 0.3s ease-in-out"
          }}>
            <h3 style={{ marginBottom: "20px", color: "#333", fontSize: "1.4rem" }}>Add New User</h3>

            <input
              type="email"
              placeholder="Enter user email"
              value={newUserEmail}
              onChange={handleEmailChange}
              style={{
                width: "80%",
                padding: "12px 15px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                marginBottom: "10px",
                fontSize: "14px",
                outline: "none",
                transition: "border 0.2s",
              }}
            />
            {emailError && <div style={{ color: "#d32f2f", fontSize: "12px", marginBottom: "15px" }}>{emailError}</div>}

            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={closeAddUserModal}
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  background: "#ccc",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "#b0b0b0"}
                onMouseLeave={e => e.target.style.background = "#ccc"}
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                style={{
                  padding: "10px 22px",
                  borderRadius: "10px",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.target.style.background = "#1565c0"}
                onMouseLeave={e => e.target.style.background = "#1976d2"}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
