import {Routes,Route} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../features/Auth/Pages/Home";
import Login from "../features/Auth/Pages/Login";
import Register from "../features/Auth/Pages/Register";
import OtpSubmit from "../features/Auth/Pages/OtpSubmit";
import DashBoard from "../features/Business/Pages/DashBoard";
import Protected from "../features/Auth/component/Protected";
import Role from "../features/Auth/component/Role";
import BusinessDashboard from "../features/Business/Pages/BusinessDashboard";
import BusinessProfile from "../features/Business/Pages/BusinessProfile";
import StudentDashboard from "../features/Student/Pages/StudentDashboard";
import StudentProfile from "../features/Student/Pages/StudentProfile";

function App() {
  return (
    <>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/verify-otp' element={<OtpSubmit/>}></Route>
        <Route path='/dashboard' element={<Protected><DashBoard/></Protected>}></Route>
        <Route path='/business/dashboard' element={<Role allowedRoles={['business']}><BusinessDashboard/></Role>}></Route>
        <Route path='/business/tasks' element={<Role allowedRoles={['business']}><BusinessDashboard/></Role>}></Route>
        <Route path='/business/profile' element={<Role allowedRoles={['business']}><BusinessProfile/></Role>}></Route>
        <Route path='/student/dashboard' element={<Role allowedRoles={['student']}><StudentDashboard/></Role>}></Route>
        <Route path='/student/tasks' element={<Role allowedRoles={['student']}><StudentDashboard/></Role>}></Route>
        <Route path='/student/profile' element={<Role allowedRoles={['student']}><StudentProfile/></Role>}></Route>
        <Route path='/student/portfolio' element={<Role allowedRoles={['student']}><StudentProfile/></Role>}></Route>
      </Routes>
      {/* for error alerts */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"/>
    </>
  )
}

export default App