import { Route, Routes } from "react-router-dom"
import {LoginPage, RegisterPage} from "../Pages"


const AppRouter = () => {
  return<>
    <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<RegisterPage/>} />
    </Routes>
    </>
}

export default AppRouter