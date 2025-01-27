import React, { useState } from 'react';
import { NextUIProvider, Button, Input, Card, CardBody, CardHeader, Switch } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from "../../Store/useAuthStore";

interface LoginUser {
  Persona: Persona;
  Usuario: Usuario;
}

interface Persona {
  id_persona: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  Mesero: Mesero | null;
  Cliente: Cliente | null;
  Usuario: Usuario | null;
}

interface Cliente {
  id_cliente: number;
}

interface Mesero {
  id_mesero: number;
  id_restaurante: number;
}

interface Usuario {
  id_usuario: number;
  email: string;
  grupoId: number | null;
}

const LoginPage: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { setAuthData } = useAuthStore();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contrasena = password;
      const response = await axios.post('http://localhost:3001/api/login', { email, contrasena });
      const user: LoginUser = response.data;


      if (user.Persona.Mesero) {
        console.log('Es mesero');
        setAuthData(user.Persona.id_persona, user.Persona.Mesero.id_restaurante);
        navigate('/mesasBar');
      } else {
        console.log('Es cliente');
        setAuthData(user.Persona.id_persona);
        navigate('/client/dashboard');
      }
    } catch (error: unknown) {
      console.error('Error en el login:', error);
      setError('Error al iniciar sesión');
    }
  };

  return (
    <NextUIProvider>
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-600 dark:from-gray-800 dark:to-gray-900 p-4 ${isDark ? 'dark' : ''}`}>
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">QR-Efficient</h2>
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
            <p className="text-default-500">Enter your credentials to login</p>
            <form onSubmit={handleLogin}>
              <Input
                type="email"
                label="Email"
                placeholder="bartender@qr-efficient.com"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                className="mb-4"
              />
              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                className="mb-4"
              />
              <Button type="submit" color="secondary" className="w-full">
                Log in
              </Button>
            </form>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold text-sm">{error}</strong>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={() => setError('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
              </span>
            </div>}
            <p className="text-center text-small">
              Don't have an account?{' '}
              <Button
                as="a"
                color="secondary"
                variant="light"
                onPress={() => navigate('/signup')}
              >
                Sign up
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

export default LoginPage;