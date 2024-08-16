import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = (): JSX.Element => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [loginStatus, setLoginStatus] = useState<string | null>(null);

  const onSubmit = (data: LoginFormData) => {
    // Aquí simularemos un "login exitoso"
    console.log('Datos de login:', data);
    setLoginStatus('Login exitoso (simulado)');
    
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'El email es requerido'
            })}
          />
          {errors.email?.type && (<span className="error">{errors.email.message}</span>)}
        </div>
        
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'La contraseña es requerida'
            })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>
        
        <button type="submit">Iniciar Sesión</button>
      </form>
      
      {loginStatus && <p className="status">{loginStatus}</p>}
    </div>
  );
};

export default Login;