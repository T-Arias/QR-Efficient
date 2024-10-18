import { Route, Routes } from "react-router-dom"
import {LoginPage, RegisterPage, DashboardPage, MeseroPage, MenuPage} from "../Pages"


const AppRouter = () => {
  return<>
    <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/meseros" element={<MeseroPage/>} />
        <Route path="/menu" element={<MenuPage/>} />
    </Routes>
    </>
}

export default AppRouter