import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from "../../Store/useAuthStore";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const navigate = useNavigate();
  const userRole = useAuthStore().grupo;

  // Menú visible solo para ADMIN
  const adminMenuItems = [
    { name: "Meseros", path: "/meseros" },
    { name: "Menu", path: "/menu" },
    { name: "Mesas", path: "/mesas" },
  ];

  const reportMenuItems = [
    { name: "Ventas", path: "/reporte/ventas" },
    { name: "Productos", path: "/reporte/productos" },
  ];

  const logOut = () => {
    clearAuthData();
    navigate("/login");
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-gray-800 text-white" maxWidth="full">
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" />
        <NavbarBrand>
          <p className="font-bold text-inherit">{title}</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Mostrar menú solo si hay sesión activa */}
      {userRole && (
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {/* Secciones disponibles para Admin */}
          {userRole === "Admin" && (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger className="cursor-pointer">
                  Restaurante
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu aria-label="Restaurant Options">
                {adminMenuItems.map((item) => (
                  <DropdownItem key={item.name.toLowerCase()} textValue={item.name}>
                    <Link to={item.path} className="text-black w-full block">
                      {item.name}
                    </Link>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

          {/* Secciones accesibles para Admin y Mesero */}
          {(userRole === "Admin" || userRole === "Mesero") && (
            <>
              <NavbarItem>
                <Link to="/mesasBar" className="w-full block">
                  Mesas
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link to="/comandas" className="w-full block">
                  Comandas
                </Link>
              </NavbarItem>
            </>
          )}

          {(userRole === "Admin") && (
            <>
              <NavbarItem>
                <Link to="/auditorias" className="w-full block">
                  Auditoria
                </Link>
              </NavbarItem>
            </>
          )}

          {/* Reportes solo para Admin */}
          {userRole === "Admin" && (
            <Dropdown>
              <NavbarItem>
                <DropdownTrigger className="cursor-pointer">
                  Reportes
                </DropdownTrigger>
              </NavbarItem>
              <DropdownMenu aria-label="Report Options">
                {reportMenuItems.map((item) => (
                  <DropdownItem key={item.name.toLowerCase()} textValue={item.name}>
                    <Link to={item.path} className="text-black w-full block">
                      {item.name}
                    </Link>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarContent>
      )}

      <NavbarContent justify="end">
        {userRole ? (
          <NavbarItem>
            <Button
              color="danger"
              onClick={() => {
                logOut();
              }}
            >
              Cerrar Sesión
            </Button>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button color="primary" onPress={() => navigate("/login")}>
              Iniciar Sesión
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;