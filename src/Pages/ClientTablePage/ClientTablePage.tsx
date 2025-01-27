import React, { useState, useEffect } from 'react'
import { NextUIProvider, Navbar, Button, Card, NavbarContent, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react"
import { ArrowLeft, Receipt, Divide, Bell, PlusCircle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../../Store/useAuthStore'

interface Comanda {
    id_comanda: number,
    id_estado_comanda: number,
    id_cuenta: number,
    id_persona: number,
    total: number,
    observaciones: string,
    Persona: {
        id_persona: number,
        email: string,
        nombre: string,
        apellido: string,
        dni: string
    },
    EstadoComanda: {
        id_estado_comanda: number,
        descripcion: string
    }
    DetallesComanda: DetalleComanda[]
}

interface DetalleComanda {
    id_menu: number;
    cantidad: number;
    precio_unitario: number;
    Menu?: Menu;
}

interface Menu {
    id_menu: number;
    descripcion: string;
}

interface Mesa {
    id_mesa_atendida: number;
    id_estado_mesa: number;
    Mesa: {
        numero: number;
        descripcion: string;
    };
    Mesero: {
        Persona: {
            nombre: string;
        };
    };
    Estado_mesa: {
        descripcion: string;
    };
}

const ClientTablePage: React.FC = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const { mesaId } = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [totalCuenta, setTotalCuenta] = useState<number>(0);
    const [personas, setPersonas] = useState<number>(1);
    const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null);
    const [showDivideModal, setShowDivideModal] = useState<boolean>(false);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [mesa, setMesa] = useState<Mesa | null>(null);
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const [modalMessage, setModalMessage] = useState<string>("");

    const api = axios.create({
        baseURL: 'http://localhost:3001/api',
    });

    useEffect(() => {
        fetchPedidos();
        fetchMesa();
    }, [mesaId]);

    useEffect(() => {
        const nuevoTotal = comandas.reduce((total, comanda) => total + Number(comanda.EstadoComanda.id_estado_comanda !== 5 ? comanda.total : 0), 0);
        setTotalCuenta(nuevoTotal);
    }, [comandas]);

    const fetchPedidos = async () => {
        try {
            const response = await api.get(`/comanda/mesa/${mesaId}`);
            setComandas(response.data);
        } catch (error) {
            console.error('Error al obtener pedidos:', error);
        }
    };

    const fetchMesa = async () => {
        try {
            const response = await api.get(`/mesas/mesa-atendida/${mesaId}`);
            const currentPersonId = useAuthStore.getState().id_persona;
            if (currentPersonId !== null) {
                authStore.setAuthData(currentPersonId, response.data.Mesa.id_restaurante);
            }
            setMesa(response.data);
        } catch (error) {
            console.error('Error al obtener mesa:', error);
        }
    };

    const getStatusColor = (estadoComanda: string) => {
        switch (estadoComanda.toLowerCase()) {
            case 'pendiente': return 'bg-yellow-100 text-yellow-800'
            case 'aceptado': return 'bg-blue-100 text-blue-800'
            case 'finalizado': return 'bg-green-100 text-green-800'
            case 'cancelado': return 'bg-red-100 text-red-800'
            case 'entregado': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const handleChangeStateMesa = async (estado: number) => {
        try {
            const mensaje = estado === 5
                ? "Cuenta solicitada con éxito."
                : "Mesero llamado con éxito.";

            await api.put(`/mesas/${mesa?.id_mesa_atendida}`, { id_estado_mesa: estado });

            setModalMessage(mensaje);
            onOpen();
        } catch (error) {
            console.error('Error al cambiar estado de mesa:', error);
        }
    };

    const handleNewOrder = () => {
        navigate(`/client/order/${mesaId}`);
    };

    //calcular total
    const calcularTotalPorPersona = () => {
        let total = totalCuenta;
        return (total / personas);
    };

    const handleDivide = () => {
        setShowDivideModal(true);
    };

    const handleCloseModal = () => {
        setShowDivideModal(false);
    };

    const handleShowDetail = (comanda: Comanda) => {
        setSelectedComanda(comanda);
        setShowDetailModal(true);
    }

    return (
        <NextUIProvider className="dark text-foreground bg-background min-h-screen">
            <div className="bg-gray-900 text-gray-100 flex flex-col">
                <Navbar isBordered className="bg-gray-800 border-b border-gray-700">
                    <NavbarContent>
                        <Button className="text-gray-100" onPress={() => navigate('/client/dashboard')}>
                            <ArrowLeft size={24} />
                        </Button>
                    </NavbarContent>
                    <NavbarContent>
                        <h2 className="text-gray-100">
                            Mesa {mesa?.Mesa.descripcion}
                        </h2>
                    </NavbarContent>
                    <NavbarContent className="text-center">
                        <p className="text-sm text-gray-400">
                            Mesero {mesa?.Mesero.Persona.nombre}
                        </p>
                    </NavbarContent>
                </Navbar>

                <div className="flex-grow px-4 overflow-y-auto">
                    <h4 className="my-4 text-gray-200">Comandas</h4>
                    {comandas.map((comanda) => (
                        <Card key={comanda.id_comanda} className="mb-4 bg-gray-800 border border-gray-700">
                            <CardBody>
                                <div onClick={() => handleShowDetail(comanda)} className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-100">{`Pedido #${comanda.id_comanda}`}</p>
                                        <p className="text-sm text-gray-400">
                                            {`${comanda.Persona.nombre} ${comanda.Persona.apellido}`}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Total: ${comanda.total}
                                        </p>
                                        {comanda.observaciones && (
                                            <p className="text-sm text-gray-400">
                                                Observaciones: {comanda.observaciones}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            comanda.EstadoComanda.descripcion
                                        )}`}
                                    >
                                        {comanda.EstadoComanda.descripcion}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                <div className="bg-gray-800 border-t border-gray-700 p-4 grid grid-cols-2 gap-4 fixed bottom-0 w-full">
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-gray-100"
                        startContent={<Receipt size={18} />}
                        onPress={() => handleChangeStateMesa(5)}
                    >
                        Solicitar Cuenta
                    </Button>
                    <Button
                        className="bg-purple-600 hover:bg-purple-700 text-gray-100"
                        startContent={<Divide size={18} />}
                        onPress={() => handleDivide()}
                    >
                        Dividir Total
                    </Button>
                    <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-gray-100"
                        startContent={<Bell size={18} />}
                        onPress={() => handleChangeStateMesa(4)}
                    >
                        Llamar Mesero
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700 text-gray-100"
                        startContent={<PlusCircle size={18} />}
                        onPress={() => handleNewOrder()}
                    >
                        Realizar Pedido
                    </Button>
                </div>

                {/* Modal */}
                <Modal isOpen={isOpen} placement="bottom" onOpenChange={onOpenChange}>
                    <ModalContent className="bg-gray-800 text-gray-100">
                        {(onClose) => (
                            <>
                                <ModalHeader>Acción realizada</ModalHeader>
                                <ModalBody>
                                    <p>{modalMessage}</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button className="text-red-500" variant="light" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal isOpen={showDetailModal} placement="center" onOpenChange={setShowDetailModal}>
                    <ModalContent className="bg-gray-800 text-gray-100">
                        {(onClose) => (
                            <>
                                <ModalHeader>{`Pedido #${selectedComanda?.id_comanda}`}</ModalHeader>
                                <ModalBody>
                                    {selectedComanda?.observaciones && (
                                        <p>
                                            <b>Observaciones:</b> {selectedComanda?.observaciones}
                                        </p>
                                    )}
                                    <p className="font-semibold">Detalles:</p>
                                    <ul className="list-disc pl-5">
                                        {selectedComanda?.DetallesComanda.map((detalle, index) => (
                                            <li key={index} className="flex justify-between">
                                                <span>
                                                    {detalle.cantidad}x{" "}
                                                    {detalle.Menu?.descripcion}{" ($" + detalle.precio_unitario + ")"}
                                                </span>
                                                <span>${detalle.cantidad * detalle.precio_unitario}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </ModalBody>
                                <ModalFooter>
                                    <Button className="text-red-500" variant="light" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>

                <Modal isOpen={showDivideModal} placement="center" onOpenChange={setShowDivideModal}>
                    <ModalContent className="bg-gray-800 text-gray-100">
                        <ModalHeader>Dividir Total</ModalHeader>
                        <ModalBody>
                            <div>
                                <p className="pb-2">Total de la cuenta: ${totalCuenta.toFixed(2)}</p>
                                <Input
                                    type="number"
                                    label="Número de personas"
                                    onChange={(e) => setPersonas(Number(e.target.value) || 1)}
                                    fullWidth
                                />
                                <p className="pt-2">
                                    Total por persona: ${calcularTotalPorPersona().toFixed(2)}
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="bg-purple-600 hover:bg-purple-700 text-gray-100"
                                onPress={() => {
                                    handleCloseModal();
                                    setPersonas(1);
                                }}
                            >
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </NextUIProvider>
    );
};

export default ClientTablePage;
