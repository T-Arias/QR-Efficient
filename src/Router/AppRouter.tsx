import { Route, Routes } from "react-router-dom";
import { LoginPage, RegisterPage, DashboardPage, MeseroPage, MenuPage, MesaPage, MesasPage, MesaBarPage, GestionComandasPage, CuentaPage, ComandasPage, AuditoryPage, CategoryReportPage, EarningsReportPage, ClientDashboardPage, ClientOrderPage, ClientTablePage, QRScannerPage, ClientUserPage, ClientConditionsPage } from "../Pages";
import ProtectedRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Rutas para Administradores y meseros */}
      <Route element={<ProtectedRoute allowedRoles={["Admin", "Mesero"]} />}>
        <Route path="/mesasBar" element={<MesasPage />} />
        <Route path="/comandas" element={<ComandasPage />} />
        <Route path="/mesasBar/:mesaId" element={<MesaBarPage />} />
        <Route path="/mesasBar/:mesaId/gestionComandas" element={<GestionComandasPage />} />
        <Route path="/mesasBar/:mesaId/cuenta" element={<CuentaPage />} />
      </Route>

      {/* Rutas para ADMIN */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meseros" element={<MeseroPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/mesas" element={<MesaPage />} />
        <Route path="/auditorias" element={<AuditoryPage />} />
        <Route path="/reporte/ventas" element={<EarningsReportPage />} />
        <Route path="/reporte/productos" element={<CategoryReportPage />} />
      </Route>

      {/* Rutas para CLIENTES */}
      <Route element={<ProtectedRoute allowedRoles={["Cliente"]} />}>
        <Route path="/client/dashboard" element={<ClientDashboardPage />} />
        <Route path="/client/table/:mesaId" element={<ClientTablePage />} />
        <Route path="/client/order/:mesaId" element={<ClientOrderPage />} />
        <Route path="/client/qrscanner" element={<QRScannerPage />} />
        <Route path="/client/user" element={<ClientUserPage />} />
        <Route path="/client/conditions" element={<ClientConditionsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
