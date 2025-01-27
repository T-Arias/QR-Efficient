import { Route, Routes } from "react-router-dom"
import {LoginPage, RegisterPage, DashboardPage, MeseroPage, MenuPage, MesaPage, MesasPage, MesaBarPage, GestionComandasPage, CuentaPage, ComandasPage, ClientDashboardPage, ClientOrderPage, ClientTablePage, QRScannerPage, ClientUserPage} from "../Pages"


const AppRouter = () => {
  return<>
    <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<RegisterPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/meseros" element={<MeseroPage/>} />
        <Route path="/menu" element={<MenuPage/>} />
        <Route path="/mesas" element={<MesaPage/>} />
        <Route path="/mesasBar" element={<MesasPage/>} />
        <Route path="/mesasBar/:mesaId" element={<MesaBarPage/>} />
        <Route path="/mesasBar/:mesaId/gestionComandas" element={<GestionComandasPage/>} />
        <Route path="/mesasBar/:mesaId/cuenta" element={<CuentaPage/>} />
        <Route path="/comandas" element={<ComandasPage/>} />

        {/* //cliente */}
        <Route path="/client/dashboard" element={<ClientDashboardPage/>} />
        <Route path="/client/table/:mesaId" element={<ClientTablePage/>} />
        <Route path="/client/order/:mesaId" element={<ClientOrderPage/>} />
        <Route path="/client/qrscanner" element={<QRScannerPage/>} />
        <Route path="/client/user" element={<ClientUserPage/>} />
    </Routes>
    </>
}

export default AppRouter