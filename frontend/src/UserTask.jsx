import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api/axios";

function UserTask() {
  const { userId } = useParams();
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/usertasks/${userId}`);
        // filter only pending tasks
        const pendingTasks = res.data.filter(task => !task.isDone);
        setTasks(pendingTasks);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [userId]);

  const toggleStatus = async (task) => {
    try {
      const res = await api.put(`/tasks/${task.id}`, {
        title: task.title,
        isDone: !task.isDone
      });

      // remove the task from the list if marked done
      if (res.data.isDone) {
        setTasks(tasks.filter(t => t.id !== task.id));
      } else {
        setTasks(tasks.map(t => t.id === task.id ? res.data : t));
      }

    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>User Tasks</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No pending tasks.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Task Title</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={task.id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                <td style={tdStyle}>{index + 1}</td>
                <td style={{ ...tdStyle, textDecoration: task.isDone ? "line-through" : "none" }}>
                  {task.title}
                </td>
                <td style={tdStyle}>{task.isDone ? "Done" : "Pending"}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => toggleStatus(task)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "5px",
                      backgroundColor: task.isDone ? "#f44336" : "#4caf50",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {task.isDone ? "Undo" : "Done"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { border: "1px solid #ddd", padding: "10px", textAlign: "left", backgroundColor: "#1976d2", color: "#fff" };
const tdStyle = { border: "1px solid #ddd", padding: "10px" };

export default UserTask;
