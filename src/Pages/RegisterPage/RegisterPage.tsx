import React, { useState } from 'react';
import { NextUIProvider, Card, CardHeader, CardBody, Switch, Input, Button, Divider } from "@nextui-org/react";
import { Sun, Moon, Mail, User, Users, CreditCard, Lock, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
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

    if (name === 'confirmPassword') {
      setConfirmPassword(value);
      setPasswordsMatch(formData.usuario.contrasena === value);
      return;
    }

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

      // Validar confirmación de contraseña si estamos cambiando la contraseña
      if (name === 'contrasena') {
        setPasswordsMatch(value === confirmPassword);
      }
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
    // Verificar que las contraseñas coincidan antes de enviar
    if (formData.usuario.contrasena !== confirmPassword) {
      setPasswordsMatch(false);
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      console.log(error);
      const response = await axios.post('https://qr-efficient-backend.onrender.com/api/cliente', formData);
      console.log(response.data);
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta del servidor:', error);
        setError(error.response?.data.errors[0].msg);
      } else {
        console.error('Error inesperado:', error);
      }
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
              <h3 className="text-xl font-medium mb-1">Crea tu cuenta</h3>
              <p className="text-default-500 text-sm">Completa tus datos para registrarte</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                isRequired
                type="email"
                label="Email"
                name="email"
                placeholder="cliente@gmail.com"
                value={formData.usuario.email}
                onChange={handleInputChange}
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
                isRequired
                type="text"
                label="Nombre"
                name="nombre"
                placeholder="Juan"
                value={formData.persona.nombre}
                onChange={handleInputChange}
                variant="bordered"
                radius="sm"
                startContent={
                  <User className="text-default-400" size={18} />
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: "border-2 border-orange-200 dark:border-purple-800 focus-within:!border-orange-500 dark:focus-within:!border-purple-500"
                }}
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
                radius="sm"
                startContent={
                  <Users className="text-default-400" size={18} />
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: "border-2 border-orange-200 dark:border-purple-800 focus-within:!border-orange-500 dark:focus-within:!border-purple-500"
                }}
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
                radius="sm"
                startContent={
                  <CreditCard className="text-default-400" size={18} />
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: "border-2 border-orange-200 dark:border-purple-800 focus-within:!border-orange-500 dark:focus-within:!border-purple-500"
                }}
              />

              <Input
                isRequired
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                value={formData.usuario.contrasena}
                onChange={handleInputChange}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-default-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg> :
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-default-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    }
                  </button>
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: "border-2 border-orange-200 dark:border-purple-800 focus-within:!border-orange-500 dark:focus-within:!border-purple-500"
                }}
              />

              {/* Nuevo campo de confirmación de contraseña */}
              <Input
                isRequired
                type={showConfirmPassword ? "text" : "password"}
                label="Confirmar Contraseña"
                name="confirmPassword"
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={handleInputChange}
                variant="bordered"
                radius="sm"
                color={!passwordsMatch && confirmPassword ? "danger" : "default"}
                description={!passwordsMatch && confirmPassword ? "Las contraseñas no coinciden" : ""}
                startContent={
                  <Lock className="text-default-400" size={18} />
                }
                endContent={
                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ?
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-default-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg> :
                      <svg xmlns="http://www.w3.org/2000/svg" className="text-default-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    }
                  </button>
                }
                classNames={{
                  input: "pl-1",
                  inputWrapper: `border-2 ${!passwordsMatch && confirmPassword ? 'border-red-300 dark:border-red-700' : 'border-orange-200 dark:border-purple-800'} focus-within:!border-orange-500 dark:focus-within:!border-purple-500`
                }}
              />

              <Button
                type="submit"
                color="warning"
                className="w-full font-semibold bg-gradient-to-r from-orange-400 to-red-400 dark:from-purple-500 dark:to-pink-400 text-white shadow-lg transition-transform hover:scale-[1.02] mt-2"
                size="lg"
                isDisabled={!passwordsMatch && confirmPassword.length > 0}
              >
                Registrarse
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
              ¿Ya tienes una cuenta?{' '}
              <Button
                as="a"
                color="warning"
                variant="light"
                onPress={() => navigate('/login')}
                className="font-semibold text-orange-600 dark:text-purple-400 pl-1"
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

export default SignupPage;