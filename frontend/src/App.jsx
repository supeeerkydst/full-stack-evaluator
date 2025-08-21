import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Tasks from "./Tasks";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login onLoginSuccess={setUser} />} // ✅ Pass a function
        />
        <Route 
          path="/tasks" 
          element={user ? <Tasks /> : <Navigate to="/" />} // redirect if not logged in
        />
      </Routes>
    </Router>
  );
}

export default App;
