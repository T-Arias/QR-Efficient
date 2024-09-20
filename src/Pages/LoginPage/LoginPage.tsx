import React, { useState } from 'react';
import { NextUIProvider, Button, Input, Card, CardBody, CardHeader, Switch } from "@nextui-org/react";

const LoginPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <NextUIProvider>
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-600 dark:from-gray-800 dark:to-gray-900 p-4 ${isDark ? 'dark' : ''}`}>
        <Card className="w-full max-w-md">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">QR-Efficient</h2>
            <Switch
              checked={isDark}
              onChange={toggleDarkMode}
              size="lg"
              color="secondary"
              startContent={<SunIcon />}
              endContent={<MoonIcon />}
            />
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-default-500">Enter your credentials to login</p>
            <Input
              type="email"
              label="Email"
              placeholder="bartender@qr-efficient.com"
              variant="bordered"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              variant="bordered"
            />
            <Button color="secondary" className="w-full">
              Log in
            </Button>
            <p className="text-center text-small">
              Don't have an account?{' '}
              <a href="#" className="text-secondary">Sign up</a>
            </p>
          </CardBody>
        </Card>
      </div>
    </NextUIProvider>
  );
};

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
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

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export default LoginPage;