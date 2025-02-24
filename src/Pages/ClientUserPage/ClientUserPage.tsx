import React, { useEffect, useState } from 'react';
import {
  NextUIProvider,
  Navbar,
  Card,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  CardBody,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Store/useAuthStore';
import FooterCliente from '../../Components/FooterCliente/FooterCliente';
import axios from 'axios';

const ClientUserPage: React.FC = () => {
  const navigate = useNavigate();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const id_persona = useAuthStore.getState().id_persona;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    id_persona: 0,
    id_cliente: 0,
    Persona: {
      email: '',
      nombre: '',
      apellido: '',
      dni: ''
    },
    Usuario: {
      email: '',
      contrasena: undefined as string | undefined,
    },
    confirmarContrasena: ''
  });

  useEffect(() => {
    getPersona();
  }, []);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const getPersona = async () => {
    try {
      const response = await axios.get(`https://192.168.1.5:3010/api/cliente/${id_persona}`);
      setFormData({
        id_cliente: response.data.id_cliente,
        id_persona: response.data.id_persona,
        Persona: {
          email: response.data.Persona.email,
          nombre: response.data.Persona.nombre,
          apellido: response.data.Persona.apellido,
          dni: response.data.Persona.dni
        },
        Usuario: {
          email: response.data.Persona.email,
          contrasena: ''
        },
        confirmarContrasena: ''
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta del servidor:', error.response?.data);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmarContrasena') {
      setFormData(prevState => ({
        ...prevState,
        confirmarContrasena: value
      }));
    } else if (name === 'contrasena') {
      setFormData(prevState => ({
        ...prevState,
        Usuario: {
          ...prevState.Usuario,
          contrasena: value
        }
      }));
    } else if (name === 'email') {
      setFormData(prevState => ({
        ...prevState,
        Usuario: {
          ...prevState.Usuario,
          email: value
        },
        Persona: {
          ...prevState.Persona,
          email: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        Persona: {
          ...prevState.Persona,
          [name]: value
        }
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData.Usuario.contrasena, formData.confirmarContrasena);
    if (formData.Usuario.contrasena !== formData.confirmarContrasena && formData.Usuario.contrasena !== undefined) {
      setError('Las contraseñas no coinciden.');
      setIsModalOpen(true);
      return;
    }

    try {
      if (formData.Usuario.contrasena === '') {
        delete formData.Usuario.contrasena;
      }
      console.log(formData.Usuario.email);
      await axios.put(`https://192.168.1.5:3010/api/cliente/${formData.id_cliente}`, formData);
      setIsSuccessModalOpen(true);
      navigate('/client/dashboard');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta del servidor:', error.response?.data);
        setError(error.response?.data.errors[0]?.msg || 'Error al actualizar los datos.');
        setIsModalOpen(true);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };

  return (
    <NextUIProvider className="dark text-foreground bg-background min-h-screen">
      <div className="flex flex-col min-h-screen">
      <Navbar isBordered>
          <NavbarBrand>
            <h1 className="text-lg font-bold">QR-Efficient</h1>
          </NavbarBrand>
          <NavbarContent justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar isBordered as="button" color="secondary" size="sm" name="User" />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem textValue="Profile" key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Bienvenido</p>
                  <p className="font-semibold">{formData.Persona.email}</p>
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

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Editar Perfil</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="cliente@gmail.com"
                  value={formData.Persona.email}
                  onChange={handleInputChange}
                  variant="bordered"
                />
                <Input
                  type="text"
                  label="Nombre"
                  name="nombre"
                  placeholder="Juan"
                  value={formData.Persona.nombre}
                  onChange={handleInputChange}
                  variant="bordered"
                />
                <Input
                  type="text"
                  label="Apellido"
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.Persona.apellido}
                  onChange={handleInputChange}
                  variant="bordered"
                />
                <Input
                  type="text"
                  label="DNI"
                  name="dni"
                  placeholder="43767827"
                  value={formData.Persona.dni}
                  onChange={handleInputChange}
                  variant="bordered"
                />
                <Input
                  type="password"
                  label="Contraseña"
                  name="contrasena"
                  placeholder="Ingrese su contraseña"
                  onChange={handleInputChange}
                  variant="bordered"
                />
                <Input
                  type="password"
                  label="Confirmar contraseña"
                  name="confirmarContrasena"
                  placeholder="Confirme su contraseña"
                  value={formData.confirmarContrasena}
                  onChange={handleInputChange}
                  variant="bordered"
                />
                <Button type="submit" color="secondary" className="w-full mt-4">
                  Guardar Cambios
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <Modal isOpen={isModalOpen} placement="center" onOpenChange={setIsModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Error</ModalHeader>
                <ModalBody>{error}</ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal isOpen={isSuccessModalOpen} placement="center" onOpenChange={setIsSuccessModalOpen}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Éxito</ModalHeader>
                <ModalBody>Los datos del usuario se modificaron con éxito.</ModalBody>
                <ModalFooter>
                  <Button color="success" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <FooterCliente />
      </div>
    </NextUIProvider>
  );
};

export default ClientUserPage;