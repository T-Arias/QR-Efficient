import React, { useState, useEffect } from 'react'
import { NextUIProvider, Navbar, Button, Card, Input, Badge, NavbarContent, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react"
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuthStore } from '../../Store/useAuthStore'

interface DetalleComandaPost {
    id_menu: number;
    cantidad: number;
    precio_unitario: number;
    producto?: Menu;
}

interface Categoria {
    id_categoria: number;
    nombre: string;
}

interface Menu {
    id_menu: number;
    descripcion: string;
    foto: string | null;
    precio: number;
    activo: boolean;
    id_categoria: number;
    id_restaurante: number;
    categoria: {
        id_categoria: number;
        nombre: string;
    };
}

interface Comanda {
    id_mesa_atendida: number;
    id_persona: number;
    observaciones?: string;
    id_estado_comanda: number;
    total: number;
    detallesComanda: DetalleComandaPost[];
}

const ClientOrderPage: React.FC = () => {
    const navigate = useNavigate();
    const { mesaId } = useParams();
    let id_restaurante = useAuthStore.getState().id_restaurante || 0;
    const id_persona = useAuthStore.getState().id_persona || 0;
    const [activeCategory, setActiveCategory] = useState<Categoria | null>({ id_categoria: 1, nombre: "Pizzas" });
    const [menus, setMenus] = useState<Menu[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
    const [cart, setCart] = useState<DetalleComandaPost[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [comanda, setComanda] = useState<Comanda>({
        id_mesa_atendida: 0,
        id_persona: id_persona,
        id_estado_comanda: 1,
        total: 0,
        detallesComanda: []
    });

    // Fetch data on component mount
    useEffect(() => {
        fetchMesaAtendida()
        fetchCategorias()
        fetchMenus()
    }, [])

    // Filter menus when category or menus change
    useEffect(() => {
        filterMenus()
    }, [activeCategory, menus])

    const fetchMenus = async () => {
        try {
            const response = await axios.get<Menu[]>(`https://qr-efficient-backend.onrender.com/api/menu/restaurante/${id_restaurante}`);
            setMenus(response.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const response = await axios.get<Categoria[]>("https://qr-efficient-backend.onrender.com/api/categoria");
            setCategorias(response.data);
        } catch (error) {
            console.error("Error fetching categorias:", error);
        }
    };

    const fetchMesaAtendida = async () => {
        try {
            const response = await axios.get(
                `https://qr-efficient-backend.onrender.com/api/mesas/mesa-atendida/${mesaId}`
            );
            setComanda((prevComanda) => ({
                ...prevComanda,
                id_mesa_atendida: response.data.id_mesa_atendida,
            }));
        } catch (error) {
            console.error("Error fetching mesa atendida:", error);
        }
    };

    const filterMenus = () => {
        if (!activeCategory) return setFilteredMenus(menus);
        setFilteredMenus(menus.filter((menu) => menu.id_categoria === activeCategory.id_categoria));
    };

    // Cart and Order Methods
    const addToCart = (menu: Menu) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id_menu === menu.id_menu)
            if (existingItem) {
                return prevCart.map(item =>
                    item.id_menu === menu.id_menu
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            } else {
                return [...prevCart, {
                    id_menu: menu.id_menu,
                    cantidad: 1,
                    precio_unitario: menu.precio,
                    producto: menu
                }]
            }
        })
    }

    const updateCartItemQuantity = (id_menu: number, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity === 0) {
                return prevCart.filter(item => item.id_menu !== id_menu)
            }
            return prevCart.map(item =>
                item.id_menu === id_menu ? { ...item, cantidad: newQuantity } : item
            )
        })
    }

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0)
    }

    const handleFinishOrder = async () => {
        try {
            const comandaActualizada = {
                ...comanda,
                total: getTotalPrice(),
                detallesComanda: cart.map(({ id_menu, cantidad, precio_unitario }) => ({
                    id_menu,
                    cantidad,
                    precio_unitario
                }))
            };
            if (comandaActualizada.detallesComanda.length > 0) {
                await axios.post("https://qr-efficient-backend.onrender.com/api/comanda", comandaActualizada);
                await axios.put(`https://qr-efficient-backend.onrender.com/api/mesas/${comanda.id_mesa_atendida}`, { id_estado_mesa: 6 });
                navigate(`/client/table/${mesaId}`);
            }
        } catch (error) {
            console.error("Error finalizando pedido:", error);
        }
        setCart([])
        setIsCartOpen(false)
    }

    return (
        <NextUIProvider className="dark text-foreground bg-background min-h-screen">
            <div className="min-h-screen bg-gray-100 bg-gray-900 flex flex-col">
                <Navbar isBordered className="bg-white bg-gray-800 border-gray-700">
                    <NavbarContent>
                        <Button className="text-gray-100" onPress={() => navigate(-1)}>
                            <ArrowLeft size={24} />
                        </Button>
                    </NavbarContent>
                    <NavbarContent>
                        <h2 className="text-gray-100">
                            Realizar Pedido
                        </h2>
                    </NavbarContent>
                    <NavbarContent>
                        <Button className="text-gray-100" onClick={() => setIsCartOpen(true)}>
                            <Badge color="primary" content={cart.length} shape="circle">
                                <ShoppingCart size={24} />
                            </Badge>
                        </Button>
                    </NavbarContent>
                </Navbar>

                <div className="flex overflow-x-auto pb-2 mb-4 bg-gray-900">
                    {categorias.map(categoria => (
                        <Button
                            key={categoria.id_categoria}
                            variant={activeCategory?.id_categoria !== categoria.id_categoria ? "light" : "solid"}
                            onPress={() => setActiveCategory(categoria)}
                            className="whitespace-nowrap text-gray-100"
                        >
                            {categoria.nombre}
                        </Button>
                    ))}
                </div>

                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenus.map(menu => (
                        <Card key={menu.id_menu} className="p-4 bg-gray-800 border-gray-700">
                            <div className="flex items-center space-x-4">
                                {menu.foto && (
                                    <img
                                        src={menu.foto}
                                        alt={menu.descripcion}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <p className="text-lg font-medium text-gray-100">
                                        {menu.descripcion}
                                    </p>
                                    <p className="text-sm text-gray-300">${menu.precio}</p>
                                </div>
                                <Button
                                    color="primary"
                                    className="ml-auto bg-blue-600 hover:bg-blue-700"
                                    startContent={<Plus size={18} />}
                                    onPress={() => addToCart(menu)}
                                >
                                    Agregar
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                <Modal
                    isOpen={isCartOpen}
                    placement="bottom"
                    onOpenChange={setIsCartOpen}
                    className="h-[90vh] sm:h-auto"
                >
                    <ModalContent className="bg-gray-800">
                        <ModalHeader className="flex justify-between items-center border-b border-gray-700">
                            <h4 className="text-lg font-semibold text-gray-100">Carrito</h4>
                        </ModalHeader>

                        <ModalBody className="flex flex-col h-[calc(100vh-200px)] sm:h-auto">
                            <div className="flex-1 overflow-y-auto">
                                <div className="space-y-3">
                                    {cart.map(item => (
                                        <Card key={item.id_menu} className="p-3 shadow-sm bg-gray-700">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col flex-1 min-w-0 pr-2">
                                                    <p className="text-sm font-medium truncate text-gray-100">
                                                        {item.producto?.descripcion}
                                                    </p>
                                                    <p className="text-sm text-gray-300">
                                                        ${(item.precio_unitario * item.cantidad)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="danger"
                                                        startContent={<Minus size={16} />}
                                                        onPress={() => updateCartItemQuantity(item.id_menu, item.cantidad - 1)}
                                                    />
                                                    <Input
                                                        className="w-8 bg-gray-600 text-gray-100"
                                                        size="sm"
                                                        type="number"
                                                        isDisabled={true}
                                                        value={item.cantidad.toString()}
                                                    />
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        color="success"
                                                        startContent={<Plus size={16} />}
                                                        onPress={() => updateCartItemQuantity(item.id_menu, item.cantidad + 1)}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Textarea
                                    placeholder="Observaciones"
                                    value={comanda.observaciones}
                                    onChange={(e) => setComanda({ ...comanda, observaciones: e.target.value })}
                                    className="w-full bg-gray-700 text-gray-100"
                                    minRows={2}
                                />

                                <div className="flex justify-between items-center py-2 border-t border-gray-700">
                                    <span className="text-lg font-semibold text-gray-100">Total:</span>
                                    <span className="text-lg text-gray-100">${getTotalPrice()}</span>
                                </div>
                            </div>
                        </ModalBody>

                        <ModalFooter className="pt-2 border-t border-gray-700">
                            <Button
                                color="primary"
                                isDisabled={cart.length === 0}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700"
                                onPress={handleFinishOrder}
                            >
                                Finalizar Pedido
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </NextUIProvider>
    );
}

export default ClientOrderPage;