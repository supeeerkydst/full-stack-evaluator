import { useEffect, useState } from 'react';
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Load tasks
  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));

    api.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle create task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo) return alert("Please fill all fields");

    const newTask = {
      title,
      isDone: false,
      userId: parseInt(assignedTo)
    };

    try {
      const res = await api.post('/tasks', newTask);
      setTasks([...tasks, res.data]);
      setTitle("");
      setAssignedTo("");
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  return (
    <div className="card">
      <h2>Task Manager</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign to user</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>

        <button type="submit">Add Task</button>
      </form>

      {/* Task list */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.title} — <b>{task.user?.email || "Unassigned"}</b></span>
            <span className="task-status">{task.isDone ? '✅' : '❌'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;