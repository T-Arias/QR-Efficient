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

interface NavbarClienteProps {
  title: string;
}

interface MenuItem {
  name: string;
  path: string;
}

const NavbarCliente: React.FC<NavbarClienteProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { name: "Meseros", path: "/meseros" },
    { name: "Menu", path: "/menu" },
    { name: "Mesas", path: "/mesas" },
  ];

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-gray-800 text-white"
      maxWidth="full"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">{title}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-white"
                radius="sm"
                variant="light"
              >
                Restaurante
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="Restaurant Options">
            {menuItems.map((item) => (
              <DropdownItem key={item.name.toLowerCase()}>
                <Link
                  to={item.path}
                  className="text-black w-full block"
                >
                  {item.name}
                </Link>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <NavbarItem>
          <Link
            to="http://localhost:5173/mesasBar"
            className="w-full block"
          >
            Mesas
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            to="http://localhost:5173/comandas"
            className="w-full block"
          >
            Comandas
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            color="danger"
            variant="flat"
            onPress={() => navigate('/login')}
          >
            Cerrar Sesión
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarCliente;