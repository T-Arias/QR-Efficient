import React, { useEffect, useState } from 'react'
import { NextUIProvider, Navbar, Card, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, CardBody } from "@nextui-org/react"
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../Store/useAuthStore'
import FooterCliente from '../../Components/FooterCliente/FooterCliente'
import axios from 'axios'

const ClientDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const id_persona = useAuthStore.getState().id_persona;
  const [email, setEmail] = useState('');
  const clearAuthData = useAuthStore((state) => state.clearAuthData);

    useEffect(() => {
      getPersona();
    }, []);

    const getPersona = async () => {
      try {
        const response = await axios.get(`https://qr-efficient-backend.onrender.com/api/cliente/${id_persona}`);
        setEmail(response.data.Persona.email);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Error en la respuesta del servidor:', error.response?.data);
        } else {
          console.error('Error inesperado:', error);
        }
      }
    };

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
                  <p className="font-semibold">{email}</p>
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