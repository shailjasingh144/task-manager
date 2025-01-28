import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../firebase"; 
import { getDatabase, ref, set } from "firebase/database"; // Removed get for Realtime DB
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Adjusted imports for Firestore
import "./SignUp.css"; 
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [role, setRole] = useState("Employee"); 
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(""); // State to handle success message

  const auth = getAuth(app); 
  const database = getDatabase(app); 
  const navigate = useNavigate();
  const firestore = getFirestore(app);

  // Sign Up Logic
  const handleSignUpClick = async () => {
    setIsLoading(true);
    setError(""); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user);

      // Store user's data in Realtime Database
      const userRef = ref(database, 'users/' + user.uid); 
      await set(userRef, {
        username: name,
        email: email,
        uid: user.uid,
        role: role,
      });

      // Store data in Firestore
      const userRefFirestore = doc(firestore, "users", user.uid); 
      await setDoc(userRefFirestore, {
        username: name,
        email: email,
        uid: user.uid,
        role: role,
      });

      console.log("User data saved to database");

      // After sign-up, redirect to sign-in panel
      setIsRightPanelActive(true); 

    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error.message);
    }
    setIsLoading(false);
  };

  // Sign In Logic
  const handleSignInClick = async () => {
    setIsLoading(true);
    setError(""); 
    setSuccessMessage(""); // Clear any existing success messages

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed in:", user);

      // Fetch user data (role) from Firestore
      const userRef = doc(firestore, 'users', user.uid); // Firestore reference
      const docSnap = await getDoc(userRef); // Use getDoc to fetch a single document
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Display success message
        setSuccessMessage("Signed in successfully!");

        // Navigate after 2 seconds
        setTimeout(() => {
          // Navigate based on role after success message is shown
          if (userData.role.toLowerCase() === "project manager") {
            navigate("/project-manager-dashboard");
          } else {
            navigate("/employee-dashboard");
          }

          // Redirect to the sign-in section after the message is shown
          setIsRightPanelActive(false);
        }, 2000); // Show the success message for 2 seconds
      } else {
        console.error("No such user in Firestore!");
        setError("User data not found!");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error signing in:", error.message);
    }
    setIsLoading(false);
  };

  return (
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
      {/* Sign Up Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Sign Up</h1>
          <input 
            type="text" 
            placeholder="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
         <input 
            type="text" 
            placeholder="Enter your role (Employee/Project Manager)" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            required 
          />
          <button onClick={handleSignUpClick} disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </div>

      {/* Sign In Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1>Sign In</h1>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <a href="#">Forgot your password?</a>
          <button onClick={handleSignInClick} disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>

        {/* Success Message */}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>

      {/* Overlay Container */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To stay connected with us <br/> please login with your personal info</p>
            <button className="ghost" onClick={() => setIsRightPanelActive(false)}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details <br/> and start your journey with us</p>
            <button className="ghost" onClick={() => setIsRightPanelActive(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
