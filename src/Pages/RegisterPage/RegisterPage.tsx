import React, { useState } from 'react';
import { NextUIProvider, Button, Input, Card, CardBody, CardHeader, Switch } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    persona: {
      email: '',
      nombre: '',
      apellido: '',
      dni: ''
    },
    usuario: {
      email: '',
      contrasena: ''
    }
  });
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'contrasena') {
      setFormData(prevState => ({
        ...prevState,
        usuario: {
          ...prevState.usuario,
          [name]: value
        },
        persona: {
          ...prevState.persona,
          email: name === 'email' ? value : prevState.persona.email
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        persona: {
          ...prevState.persona,
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(error);
      const response = await axios.post('http://localhost:3001/api/cliente', formData);
      console.log(response.data);
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta del servidor:', error.response?.data);
        setError(error.response?.data.errors[0].msg);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };

  return (
    <NextUIProvider>
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-600 dark:from-gray-800 dark:to-gray-900 p-4 ${isDark ? 'dark' : ''}`}>
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">QR-Efficient Signup</h2>
            <Switch
              isSelected={isDark}
              onValueChange={toggleDarkMode}
              size="lg"
              color="secondary"
              startContent={<SunIcon />}
              endContent={<MoonIcon />}
            />
          </CardHeader>
          <CardBody className="space-y-4">
            <form onSubmit={handleSubmit}>
              <Input
                isRequired
                type="email"
                label="Email"
                name="email"
                placeholder="cliente@gmail.com"
                value={formData.usuario.email}
                onChange={handleInputChange}
                variant="bordered"
                className="mb-4"
              />
              <Input
                isRequired
                type="text"
                label="Nombre"
                name="nombre"
                placeholder="Juan"
                value={formData.persona.nombre}
                onChange={handleInputChange}
                variant="bordered"
                className="mb-4"
              />
              <Input
                isRequired
                type="text"
                label="Apellido"
                name="apellido"
                placeholder="Apellido"
                value={formData.persona.apellido}
                onChange={handleInputChange}
                variant="bordered"
                className="mb-4"
              />
              <Input
                isRequired
                type="text"
                label="DNI"
                name="dni"
                placeholder="43767827"
                value={formData.persona.dni}
                onChange={handleInputChange}
                variant="bordered"
                className="mb-4"
              />
              <Input
                isRequired
                type="password"
                label="Contraseña"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                value={formData.usuario.contrasena}
                onChange={handleInputChange}
                variant="bordered"
                className="mb-4"
              />
              <Button type="submit" color="secondary" className="w-full">
                Registrarse
              </Button>
            </form>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold text-sm">{error}</strong>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={() =>setError('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>}
            <p className="text-center text-small">
              ¿Ya tienes una cuenta?{' '}
              <Button
                as="a"
                color="secondary"
                variant="light"
                onPress={() => navigate('/login')}
              >
                Iniciar sesión
              </Button>
            </p>
          </CardBody>
        </Card>
      </div>
    </NextUIProvider>
  );
};

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export default SignupPage;