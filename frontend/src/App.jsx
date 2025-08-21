import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import UserTask from "./UserTask";
import Tasks from "./Tasks";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Helper to check if current user is admin
  const isAdmin = user && user.email === "admin" && user.id === 0;

  return (
    <Router>
      <Routes>
        {/* Root login route */}
        <Route
          path="/"
          element={
            user
              ? isAdmin
                ? <Navigate to="/tasks" />
                : <Navigate to={`/tasks/usertasks/${user.id}`} />
              : <Login onLoginSuccess={setUser} />
          }
        />

        {/* User tasks route */}
        <Route
          path="/tasks/usertasks/:userId"
          element={user ? <UserTask /> : <Navigate to="/" />}
        />

        {/* Admin tasks route */}
        <Route
          path="/tasks"
          element={
            user
              ? isAdmin
                ? <Tasks />
                : <Navigate to={`/tasks/usertasks/${user.id}`} />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
