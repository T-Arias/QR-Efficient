import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from "../../Store/useAuthStore";
import { NextUIProvider, Card, CardHeader, CardBody, Switch, Input, Button, Divider, Link } from "@nextui-org/react";
import { Sun, Moon, Mail, Lock, Eye, EyeOff, LogIn, X } from "lucide-react";

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
  grupo: string;
  email: string;
}

const LoginPage: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post('https://qr-efficient-backend.onrender.com/api/login', { email, contrasena });
      console.log('Response:', response.data);
      const user: LoginUser = response.data;

      if (user.Usuario.grupo === 'Admin' || user.Usuario.grupo === 'Mesero') {
        setAuthData(user.Persona.id_persona, user.Usuario.grupo, user.Persona.Mesero?.id_restaurante);
        navigate('/mesasBar');
      } else {
        setAuthData(user.Persona.id_persona, user.Usuario.grupo);
        navigate('/client/dashboard');
      }
    } catch (error: unknown) {
      console.error('Error en el login:', error);
      setError('Error al iniciar sesión, verifique sus credenciales');
    }
  };

  return (
    <NextUIProvider>
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-200 via-orange-300 to-red-300 dark:from-gray-900 dark:via-purple-900/70 dark:to-gray-800 p-4 ${isDark ? 'dark' : ''}`}>
        <Card className="w-full max-w-md border-none shadow-xl backdrop-blur-sm bg-white/90 dark:bg-gray-800/90">
          <CardHeader className="flex flex-col gap-2 pb-0">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 dark:from-purple-500 dark:to-pink-400 rounded-lg flex items-center justify-center text-white font-bold">
                  QR
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 dark:from-purple-400 dark:to-pink-500 text-transparent bg-clip-text">QR-Efficient</h2>
              </div>
              <Switch
                isSelected={isDark}
                onValueChange={toggleDarkMode}
                size="lg"
                color="warning"
                startContent={<Sun size={18} className="text-amber-500" />}
                endContent={<Moon size={18} className="text-purple-400" />}
              />
            </div>
            <Divider className="my-2" />
          </CardHeader>
          <CardBody className="space-y-6 px-6 py-4">
            <div className="text-center">
              <h3 className="text-xl font-medium mb-1">¡Bienvenido!</h3>
              <p className="text-default-500 text-sm">Accede a tu cuenta para tener una experiencia única</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                type="email"
                label="Email"
                placeholder="bartender@qr-efficient.com"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                radius="sm"
                startContent={
                  <Mail className="text-default-400" size={18} />
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: "border-2 border-orange-200 dark:border-purple-800 focus-within:!border-orange-500 dark:focus-within:!border-purple-500"
                }}
              />

              <Input
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                placeholder="Introduce tu contraseña"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                radius="sm"
                startContent={
                  <Lock className="text-default-400" size={18} />
                }
                endContent={
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ?
                      <EyeOff className="text-default-400" size={18} /> :
                      <Eye className="text-default-400" size={18} />
                    }
                  </button>
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: "border-2 border-orange-200 dark:border-purple-800 focus-within:!border-orange-500 dark:focus-within:!border-purple-500"
                }}
              />

              <div className="flex justify-between items-center">
                {/* <Checkbox size="sm">Recordarme</Checkbox> */}
                <Link /* href="/forgot-password" */ className="text-sm text-orange-600 dark:text-purple-400 cursor-pointer hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                color="warning"
                className="w-full font-semibold bg-gradient-to-r from-orange-400 to-red-400 dark:from-purple-500 dark:to-pink-400 text-white shadow-lg transition-transform hover:scale-[1.02]"
                startContent={<LogIn size={18} />}
                size="lg"
              >
                Iniciar sesión
              </Button>
            </form>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold text-sm">{error}</strong>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                  <X
                    onClick={() => setError('')}
                    className="text-red-500 cursor-pointer"
                    size={20}
                  />
                </span>
              </div>
            )}

            <Divider className="my-2" />

            <p className="text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Button
                as="a"
                color="warning"
                variant="light"
                onPress={() => navigate('/signup')}
                className="font-semibold text-orange-600 dark:text-purple-400 pl-1"
              >
                Regístrate ahora
              </Button>
            </p>
          </CardBody>
        </Card>
      </div>
    </NextUIProvider>
  );
}

export default LoginPage;