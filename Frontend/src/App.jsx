import {Routes,Route} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "../features/Auth/Pages/Home";
import Login from "../features/Auth/Pages/Login";
import Register from "../features/Auth/Pages/Register";
import OtpSubmit from "../features/Auth/Pages/OtpSubmit";
import DashBoard from "../features/mis/Pages/DashBoard";
import Protected from "../features/Auth/component/Protected";

function App() {
  return (
    <>
    <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/register' element={<Register/>}></Route>
        <Route path='/verify-otp' element={<OtpSubmit/>}></Route>
        <Route path='/dashboard' element={<Protected><DashBoard/></Protected>}></Route>
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