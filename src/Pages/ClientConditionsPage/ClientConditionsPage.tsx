import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Divider, NavbarBrand, Navbar, NavbarContent, Dropdown, DropdownTrigger, Avatar, DropdownMenu, DropdownItem, NextUIProvider } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Store/useAuthStore';
import axios from 'axios';
import FooterCliente from '../../Components/FooterCliente/FooterCliente';

const ClientConditionsPage: React.FC = () => {
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
        <NextUIProvider className='dark text-foreground bg-background '>
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


                <Card className="m-2">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-xl font-bold">Términos y Condiciones</p>
                            <p className="text-small text-default-500">Última actualización: 24 de febrero de 2025</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="text-sm overflow-auto">
                        <h2 className="font-bold text-lg mb-2">1. Introducción</h2>
                        <p className="mb-4">
                            Bienvenido a nuestra aplicación. Al acceder o utilizar nuestro servicio, usted acepta estar sujeto a estos términos y condiciones. Por favor, lea estos términos cuidadosamente antes de utilizar la aplicación.
                        </p>

                        <h2 className="font-bold text-lg mb-2">2. Uso del Servicio</h2>
                        <p className="mb-4">
                            Nuestro servicio le permite realizar pedidos de comida, revisar menús y gestionar sus preferencias gastronómicas. Usted se compromete a utilizar el servicio únicamente para fines legales y de acuerdo con estos términos.
                        </p>

                        <h2 className="font-bold text-lg mb-2">3. Cuenta de Usuario</h2>
                        <p className="mb-4">
                            Para utilizar ciertas funciones de nuestra aplicación, es posible que deba crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, y acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta.
                        </p>

                        <h2 className="font-bold text-lg mb-2">4. Política de Privacidad</h2>
                        <p className="mb-4">
                            Su privacidad es importante para nosotros. Nuestra Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal. Al utilizar nuestro servicio, usted acepta nuestra política de privacidad.
                        </p>

                        <h2 className="font-bold text-lg mb-2">5. Propiedad Intelectual</h2>
                        <p className="mb-4">
                            El contenido, logotipos, software, diseños y demás materiales en la aplicación están protegidos por derechos de autor y otras leyes de propiedad intelectual. No puede utilizar, copiar o distribuir ninguno de estos materiales sin nuestro permiso previo por escrito.
                        </p>

                        <h2 className="font-bold text-lg mb-2">6. Responsabilidad</h2>
                        <p className="mb-4">
                            Ofrecemos nuestra aplicación "tal cual" y no garantizamos que sea libre de errores o esté disponible en todo momento. No seremos responsables por daños indirectos, incidentales o consecuentes resultantes del uso o la imposibilidad de utilizar nuestro servicio.
                        </p>

                        <h2 className="font-bold text-lg mb-2">7. Modificaciones</h2>
                        <p className="mb-4">
                            Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación. Su uso continuado de la aplicación después de dichas modificaciones constituirá su aceptación de los nuevos términos.
                        </p>

                        <h2 className="font-bold text-lg mb-2">8. Contacto</h2>
                        <p className="mb-4">
                            Si tiene alguna pregunta sobre estos términos, póngase en contacto con nosotros a través de soporte@qrEfficient.com.
                        </p>

                        <div className="mb-2 border-t pt-4">
                            <p className="font-bold">Al utilizar esta aplicación, usted confirma que ha leído, entendido y aceptado estos términos y condiciones.</p>
                        </div>
                    </CardBody>
                </Card>
                <div className='sticky bottom-0 bg-black'>
                    <FooterCliente />

                </div>
            </div>
        </NextUIProvider>
    );
};

export default ClientConditionsPage;