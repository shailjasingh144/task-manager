// src/firebase/firestoreService.js

import { collection, addDoc, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase"; // Import the Firestore instance

// Function to add a project
export const addProject = async (projectData) => {
  try {
    const docRef = await addDoc(collection(db, "projects"), projectData);
    console.log("Project added with ID: ", docRef.id);
    return docRef.id; // Returning project ID
  } catch (e) {
    console.error("Error adding project: ", e);
    throw new Error(e.message);
  }
};

// Function to add a task to a project
export const addTask = async (projectId, taskData) => {
  try {
    // If taskData does not have an ID, generate one using a timestamp or another method
    if (!taskData.id) {
      taskData.id = `task-${new Date().getTime()}`; // Example ID generation based on timestamp
    }

    const projectRef = doc(db, "projects", projectId);
    const taskRef = doc(collection(projectRef, "tasks"), taskData.id); // Reference to the tasks sub-collection under the project

    // Setting the task data in Firestore
    await setDoc(taskRef, taskData);
    console.log("Task added to project!");
  } catch (e) {
    console.error("Error adding task: ", e);
    throw new Error(e.message);
  }
};

// Function to get all projects
export const getProjects = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projects = [];
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
  } catch (e) {
    console.error("Error fetching projects: ", e);
    throw new Error(e.message);
  }
};

// Function to get tasks of a specific project
export const getTasksForProject = async (projectId) => {
  try {
    const taskQuerySnapshot = await getDocs(collection(db, "projects", projectId, "tasks"));
    const tasks = [];
    taskQuerySnapshot.forEach((taskDoc) => {
      tasks.push({ id: taskDoc.id, ...taskDoc.data() });
    });
    return tasks;
  } catch (e) {
    console.error("Error fetching tasks: ", e);
    throw new Error(e.message);
  }
};


export const getUsersByRole = async (role) => {
    try {
      const usersQuery = query(collection(db, "users"), where("role", "==", role));
      const querySnapshot = await getDocs(usersQuery);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() }); // Push user data to users array
      });
      return users;
    } catch (e) {
      console.error("Error fetching users: ", e);
      throw new Error(e.message);
    }
  };