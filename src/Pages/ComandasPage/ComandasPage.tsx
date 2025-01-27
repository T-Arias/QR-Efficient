import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Check, RotateCcw, Trash2 } from 'lucide-react';
import axios from 'axios';
import Header from '../../Components/Navbar/Navbar';
import { useAuthStore } from '../../Store/useAuthStore';

interface Menu {
    id_menu: number;
    descripcion: string;
}

interface DetalleComanda {
    id_detalle: number;
    id_comanda: number;
    id_menu: number;
    cantidad: number;
    precio_unitario: number;
    Menu: Menu;
}

interface Mesa {
    descripcion: string;
    numero: number;
}

interface MesaAtendida {
    Mesa: Mesa;
}

interface Cuenta {
    MesaAtendida: MesaAtendida;
}

interface Comanda {
    id_comanda: number;
    id_estado_comanda: number;
    id_cuenta: number;
    id_mesa_atendida: number;
    observaciones: string;
    total: number;
    DetallesComanda: DetalleComanda[];
    Cuenta: Cuenta;
}

const ComandasPage: React.FC = () => {
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const id_restaurante = useAuthStore.getState().id_restaurante;

    useEffect(() => {
        fetchComandas();
    }, []);

    const fetchComandas = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/comanda/restaurante/${id_restaurante}`);
            setComandas(response.data);
        } catch (error) {
            console.error('Error al obtener comandas:', error);
        }
    };

    const handleFinalizarComanda = async (id_comanda: number) => {
        try {
            await axios.put(`http://localhost:3001/api/comanda/${id_comanda}`, {
                id_estado_comanda: 3 // Estado Finalizado
            });
            fetchComandas(); // Recargar comandas
        } catch (error) {
            console.error('Error al finalizar comanda:', error);
        }
    };

    const handleRevertirComanda = async (id_comanda: number) => {
        try {
            await axios.put(`http://localhost:3001/api/comanda/${id_comanda}`, {
                id_estado_comanda: 2, // Estado Aceptado
            });
            fetchComandas();
        } catch (error) {
            console.error('Error al revertir comanda:', error);
        }
    };

    const handleBorrarComanda = async (id_comanda: number) => {
        try {
            await axios.put(`http://localhost:3001/api/comanda/${id_comanda}`, {
                id_estado_comanda: 6, // Estado Entregado
            });
            fetchComandas();
        } catch (error) {
            console.error('Error al revertir comanda:', error);
        }
    };

    const getCardColor = (estado: number) => {
        switch (estado) {
            case 2: // Aceptado
                return 'bg-yellow-100';
            case 3: // Finalizado
                return 'bg-green-100';
            default:
                return 'bg-white';
        }
    };

    return (
        <>
            <Header title="Comandas" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">Lista de Comandas</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {comandas.map((comanda) => (
                        <Card
                            key={comanda.id_comanda}
                            className={`${getCardColor(comanda.id_estado_comanda)} flex flex-col justify-between`}
                        >
                            <CardBody className="flex flex-col h-full">
                                <div className="">
                                    <h2 className="text-xl font-bold mb-2">
                                        Mesa {comanda.Cuenta.MesaAtendida.Mesa.descripcion} - Comanda #{comanda.id_comanda}
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-4 mb-3">
                                    {comanda.DetallesComanda.map((detalle,key) => (
                                        <div
                                            key={key}
                                            className="flex justify-between items-center border-b-1 border-gray-400 pb-2"
                                        >
                                            <span className="text-sm font-medium">{detalle.Menu.descripcion}</span>
                                            <span className="font-semibold text-gray-700">x{detalle.cantidad}</span>
                                        </div>
                                    ))}
                                    {comanda.observaciones && (
                                        <p className="text-sm font-medium text-gray-600">
                                            Observaciones: {comanda.observaciones}
                                        </p>
                                    )}
                                </div>


                                <div className="flex justify-center gap-2 mt-auto">
                                    {comanda.id_estado_comanda === 2 && (
                                        <Button
                                            color="success"
                                            startContent={<Check />}
                                            onClick={() => handleFinalizarComanda(comanda.id_comanda)}
                                        >
                                            Finalizar
                                        </Button>
                                    )}
                                    {comanda.id_estado_comanda === 3 && (
                                        <>
                                            <Button
                                                color="warning"
                                                startContent={<RotateCcw />}
                                                onClick={() => handleRevertirComanda(comanda.id_comanda)}
                                            >
                                                Revertir
                                            </Button>
                                            <Button
                                                color="danger"
                                                startContent={<Trash2 />}
                                                onClick={() => handleBorrarComanda(comanda.id_comanda)}
                                            >
                                                Borrar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ComandasPage;