import React from 'react'
import { NextUIProvider, Navbar, Card, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, CardBody } from "@nextui-org/react"
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../Store/useAuthStore'
import FooterCliente from '../../Components/FooterCliente/FooterCliente'

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <NextUIProvider className="dark text-foreground bg-background">
      <div className="min-h-screen flex flex-col">
      <Navbar isBordered>
          <NavbarBrand>
            <h1 color="inherit" className="text-lg font-bold">
              QR-Efficient
            </h1>
          </NavbarBrand>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  size="sm"
                  name="User"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem textValue="Profile" key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Bienvenido</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/client/user')} key="settings">Configuración</DropdownItem>
                <DropdownItem onClick={() => navigate('/client/conditions')} key="help_and_feedback">Usos y condiciones</DropdownItem>
                <DropdownItem onClick={handleLogout} key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>

        <div className="flex-grow p-4 overflow-y-auto">

          <h4 className="mb-2">Novedades</h4>
          <Card className="p-4 mb-4">
            <p>Nueva reserva</p>
          </Card>
          <Card className="p-4 mb-4">
            <p>Nueva actualización:</p>
            <CardBody>
              <ul>
                <li>Se permite puede agregar una observación con el pedido</li>
                <li>Nuevos codigos QR ofrecidos por los establecimientos</li>
              </ul>
            </CardBody>
          </Card>
        </div>

        <FooterCliente />
      </div>

    </NextUIProvider>
  )
}

export default ClientDashboardPage;