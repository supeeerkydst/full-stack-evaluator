import { useEffect, useState } from "react";
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // fetch tasks
  useEffect(() => {
    api.get("/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));

    // fetch users
    api.get("/users")
      //.then(res => setUsers(res.data))
      .then(res => {
        console.log("User fetched: ", res.data)
        setUsers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      title: title,
      isDone: false,
      userId: parseInt(assignedTo) // ✅ important: send userId, not email
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
    <div className="container">
      <h2>Tasks</h2>

      {/* Task Form */}
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        >
          <option value="">-- Assign User --</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <button type="submit">Add Task</button>
      </form>

      {/* Task List */}
      <ul
        className="task-list"
        style={{
          maxHeight: "300px", // adjust height as needed
          overflowY: "auto",
          padding: "0",
          margin: "0",
          listStyle: "none",
          border: "1px solid #ccc", // optional, for visual boundary
          borderRadius: "8px",
        }}
      >
        {tasks.map(task => (
          <li key={task.id} style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
            {task.title} — {task.userId}
            <span>{task.isDone ? "✅ Done" : "❌ Pending"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;