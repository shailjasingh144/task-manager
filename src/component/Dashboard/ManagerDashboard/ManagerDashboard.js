import React, { useState, useEffect } from "react";
import { getProjects, addProject, addTask, getTasksForProject } from "../../../firestoreService";
import { getUsersByRole } from "../../../firestoreService"; // Import the function to get users by role
import { getAuth, signOut } from "firebase/auth"; // Firebase authentication for logging out
import { useNavigate } from "react-router-dom";
import EmployeeDashboard from "../EmployeeDashboard/EmployeeDashboard";

function ManagerDashboard() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]); // State to store employees
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", description: "", assignedTo: "" }); // New task data
  const [projectId, setProjectId] = useState(""); // Track current project for task assignment
  const [showAssignTask, setShowAssignTask] = useState(false); // State to control visibility of task assignment form
  const auth = getAuth();
  const navigate = useNavigate();

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects); // Save fetched projects to state
      } catch (e) {
        console.error("Error fetching projects: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch employees from Firestore (role: "Employee")
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const fetchedEmployees = await getUsersByRole("Employee"); // Fetch employees
        setEmployees(fetchedEmployees); // Save employees to state
      } catch (e) {
        console.error("Error fetching employees: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Function to handle adding a new project
  const handleAddProject = async () => {
    const newProject = {
      name: "New Project",
      description: "Description of the new project",
      tasks: [],
    };

    try {
      const projectId = await addProject(newProject); // Add project to Firestore
      setProjects((prev) => [...prev, { ...newProject, id: projectId }]); // Update state with new project
    } catch (e) {
      console.error("Error adding project: ", e);
    }
  };

  // Function to handle adding a task to a project
  const handleAddTask = async () => {
    if (!newTask.name || !newTask.description || !newTask.assignedTo || !projectId) {
      alert("Please fill all fields and select a project.");
      return;
    }

    const taskData = {
      name: newTask.name,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
    };

    try {
      await addTask(projectId, taskData); // Add task to Firestore under the selected project
      alert("Task added successfully!");

      // Clear task input fields after adding the task
      setNewTask({ name: "", description: "", assignedTo: "" });

      // Optionally, fetch updated tasks for the selected project
      const updatedTasks = await getTasksForProject(projectId);
      console.log(updatedTasks); // You can update the UI with these tasks if needed

      // Hide the task assignment form after task is added
      setShowAssignTask(false);
    } catch (e) {
      console.error("Error adding task: ", e);
    }
  };

  // Function to handle log out
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      navigate("/"); // Redirect to login page after logging out
    } catch (e) {
      console.error("Error signing out: ", e);
    }
  };

  return (
    <>
    <div>
      <h1>Manager Dashboard</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
      <button onClick={handleAddProject} disabled={loading}>
        {loading ? "Adding..." : "Add New Project"}
      </button>

      <h2>Projects</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.name}</strong>: {project.description}
            {/* Select project to add tasks */}
            <button onClick={() => {
              console.log("Selected Project ID:", project.id); 
              setProjectId(project.id); 
              setShowAssignTask(true); // Show task assignment form when project is selected 
            }}>Select Project</button>
          </li>
        ))}
      </ul>

      {/* Task Assignment */}
      {showAssignTask && projectId && (
        <div>
          <h3>Assign Task to Project</h3>
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.email}>
                {employee.username} ({employee.email})
              </option>
            ))}
          </select>
          <button onClick={handleAddTask} disabled={loading}>
            {loading ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      )}
    </div>
   

    </>
  );
}

export default ManagerDashboard;
