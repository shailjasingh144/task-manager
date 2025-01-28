import React, { useState, useEffect } from "react";
import { getTasksForProject } from "../../../firestoreService";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState(""); // Store the current user's email
  const navigate = useNavigate(); // For navigation after logging out

  // Get the logged-in user's email
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUserEmail(user.email); // Set the user's email
    }
  }, []);

  // Fetch tasks for a specific project
  useEffect(() => {
    console.log("useEffect triggered");
    console.log("Project ID:", projectId);
    const fetchTasks = async () => {
      if (!projectId) return; // Ensure projectId exists
      setLoading(true);
      try {
        // Fetch tasks and filter them based on the current user's email (assignedTo)
        const fetchedTasks = await getTasksForProject(projectId);
        console.log("Fetched tasks:", fetchedTasks);
        console.log("Current user email:", currentUserEmail);
        const filteredTasks = fetchedTasks.filter(
          (task) => task.assignedTo === currentUserEmail
        ); // Only show tasks assigned to the current user
        setTasks(filteredTasks); // Store tasks in state
      } catch (e) {
        console.error("Error fetching tasks: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, currentUserEmail]); // Depend on projectId and currentUserEmail

  // Logout logic
  const handleLogout = async () => {
    try {
      await signOut(getAuth()); // Sign out the user
      console.log("User logged out");
      navigate("/"); // Redirect to login page after logout
    } catch (e) {
      console.error("Error logging out: ", e);
    }
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      {loading && <p>Loading tasks...</p>}
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <strong>{task.name}</strong>: {task.description} (Status: {task.status})
            </li>
          ))
        ) : (
          <p>No tasks assigned.</p>
        )}
      </ul>
      {/* Logout Button */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default EmployeeDashboard;
