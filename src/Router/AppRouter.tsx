import { Route, Routes } from "react-router-dom"
import {LoginPage, RegisterPage, DashboardPage, MeseroPage} from "../Pages"


const AppRouter = () => {
  return<>
    <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/mesero" element={<MeseroPage/>} />
    </Routes>
    </>
}

export default AppRouter