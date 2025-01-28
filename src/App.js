import './App.css';
import EmployeeDashboard from './component/Dashboard/EmployeeDashboard/EmployeeDashboard';
import ManagerDashboard from './component/Dashboard/ManagerDashboard/ManagerDashboard';
import SignUp from './component/SignUp/SignUp';
import { app } from './firebase';
import { getAuth } from 'firebase/auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const auth = getAuth(app);

function App() {

  return (
    <Router> 
      <div className="App">
        <Routes>
         
          <Route path="/" element={<SignUp />} />
          <Route path="/project-manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
