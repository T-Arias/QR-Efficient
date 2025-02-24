import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../Components/Navbar/Navbar';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from '@nextui-org/react';
import { Printer, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

interface Comanda {
    id_comanda: number;
    id_estado_comanda: number;
    id_cuenta: number;
    id_persona: number;
    total: number;
    observaciones: string;
    DetallesComanda: [
        {
            id_detalle: number;
            id_comanda: number;
            id_menu: number;
            cantidad: number;
            precio_unitario: number;
            Menu: {
                id_menu: number;
                descripcion: string;
                precio: number;
            };
        }
    ];
}

const api = axios.create({
    baseURL: 'https://192.168.1.5:3010/api',
});

const CuentaPage: React.FC = () => {
    const { mesaId } = useParams<{ mesaId: string }>();
    const [comandas, setComandas] = useState<Comanda[]>([]);
    const [total, setTotal] = useState(0);
    const [isPrinting, setIsPrinting] = useState(false);
    const navigate = useNavigate();
    const currentDateTime = format(new Date(), 'dd/MM/yyyy HH:mm');

    useEffect(() => {
        fetchComandas();
    }, [mesaId]);

    const fetchComandas = async () => {
        try {
            const response = await api.get(`/comanda/mesa/detalle/${mesaId}`);
            setComandas(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error('Error al obtener comandas:', error);
        }
    };

    const calculateTotal = (comandas: Comanda[]) => {
        const totalAmount = comandas.reduce((acc, comanda) => {
            return acc + comanda.DetallesComanda.reduce((acc, detalle) => {
                return acc + detalle.precio_unitario * detalle.cantidad;
            }, 0);
        }, 0);
        setTotal(totalAmount);
    };

    const handlePrint = () => {
        return new Promise<void>((resolve) => {
            setIsPrinting(true);
            setTimeout(() => {
                window.print();
                setIsPrinting(false);
                resolve();
            }, 1000);
        });
    };

    const handlePay = async () => {
        try {
            // Primero pagamos
            await api.put(`/cuenta/${comandas[0].id_cuenta}`, {
                total: total,
            });
            await handlePrint();
            navigate('/mesasBar');

        } catch (error) {
            console.error('Error al pagar cuenta:', error);
        }
    };

    return (
        <>
            {/* Vista normal */}
            {!isPrinting && (
                <>
                    <Header title="Detalle de la Cuenta" />
                    <div className="flex justify-between items-center mt-4 px-6">
                        <h1 className="text-2xl font-bold text-gray-800">Cuenta</h1>
                    </div>
                    <div className="mt-6 px-6">
                        <Table aria-label="Detalle de consumo">
                            <TableHeader>
                                <TableColumn>Producto</TableColumn>
                                <TableColumn>Cantidad</TableColumn>
                                <TableColumn>Precio</TableColumn>
                                <TableColumn>Total</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {comandas.flatMap((comanda) =>
                                    comanda.DetallesComanda.map((detalle) => (
                                        <TableRow key={detalle.id_detalle}>
                                            <TableCell>{detalle.Menu.descripcion}</TableCell>
                                            <TableCell>{detalle.cantidad}</TableCell>
                                            <TableCell>${detalle.precio_unitario}</TableCell>
                                            <TableCell>${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between items-center mt-4">
                            <h2 className="text-xl font-semibold">Total a Pagar: ${total.toFixed(2)}</h2>
                            <div className="flex space-x-4">
                                <Button
                                    color="primary"
                                    startContent={<Printer />}
                                    onClick={handlePrint}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    Imprimir
                                </Button>
                                <Button
                                    color="success"
                                    startContent={<CreditCard />}
                                    onClick={handlePay}
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                    Pagar
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Vista de impresión */}
            {isPrinting && (
                <div className="ticket-format">
                    <div className="ticket-header">
                        <h1 className="text-center text-xl font-bold">QR-Efficient</h1>
                        <p className="text-center">{currentDateTime}</p>
                        <p className="text-center">Número: {comandas[0].id_cuenta}</p>
                    </div>

                    <Table
                        aria-label="Detalle de consumo"
                        removeWrapper
                        layout="fixed"
                    >
                        <TableHeader>
                            <TableColumn>Producto</TableColumn>
                            <TableColumn>Cant.</TableColumn>
                            <TableColumn>Precio</TableColumn>
                            <TableColumn>Total</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {comandas.flatMap((comanda) =>
                                comanda.DetallesComanda.map((detalle) => (
                                    <TableRow key={detalle.id_detalle}>
                                        <TableCell>{detalle.Menu.descripcion}</TableCell>
                                        <TableCell>{detalle.cantidad}</TableCell>
                                        <TableCell>${detalle.precio_unitario}</TableCell>
                                        <TableCell>${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="text-center font-bold mt-4">
                        Total a Pagar: ${total.toFixed(2)}
                    </div>
                </div>
            )}
        </>
    );
}

export default CuentaPage;
