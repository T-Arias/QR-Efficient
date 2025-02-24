import React, { useEffect, useState } from 'react';
import { Button, Card, CardBody, Input } from '@nextui-org/react';
import { Minus, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Navbar/Navbar';
import { useAuthStore } from '../../Store/useAuthStore';

interface DetalleComanda {
  id_menu: number;
  cantidad: number;
  precio_unitario: number;
  producto: Menu;
}

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

const GestionComandasPage: React.FC = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [detalle, setDetalle] = useState<DetalleComanda[]>([]);
  const { mesaId } = useParams<{ mesaId: string }>();
  const [comanda, setComanda] = useState<Comanda>({
    id_mesa_atendida: parseInt(mesaId || '0'),
    id_persona: 1,
    id_estado_comanda: 2,
    total: 0,
    detallesComanda: [],
  });
  const id_restaurante = useAuthStore.getState().id_restaurante;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
    fetchCategorias();
    fetchMesaAtendida();
  }, []);

  useEffect(() => {
    filterMenus();
  }, [categoriaSeleccionada]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get<Menu[]>(`https://192.168.1.5:3010/api/menu/restaurante/${id_restaurante}`);
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get<Categoria[]>(
        "https://192.168.1.5:3010/api/categoria"
      );
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const fetchMesaAtendida = async () => {
    try {
      const response = await axios.get(
        `https://192.168.1.5:3010/api/mesas/mesa-atendida/${mesaId}`
      );
      setComanda((prevComanda) => ({
        ...prevComanda,
        id_mesa_atendida: response.data.id_mesa_atendida,
      }));
    } catch (error) {
      console.error("Error fetching mesa atendida:", error);
    }
  };

  const agregarProducto = (producto: Menu) => {
    setDetalle((prevDetalle) => {
      const existe = prevDetalle.find((item) => item.id_menu === producto.id_menu);
      const nuevoDetalle = existe
        ? prevDetalle.map((item) =>
          item.id_menu === producto.id_menu
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
        : [...prevDetalle, {
          id_menu: producto.id_menu,
          cantidad: 1,
          precio_unitario: producto.precio,
          producto: producto
        }];

      // Calcular el nuevo total
      const nuevoTotal = nuevoDetalle.reduce(
        (suma, item) => suma + (item.precio_unitario * item.cantidad),
        0
      );
      setComanda({ ...comanda, total: nuevoTotal });

      return nuevoDetalle;
    });
  };

  const restarProducto = (id_menu: number) => {
    setDetalle((prevDetalle) => {
      const nuevoDetalle = prevDetalle
        .map((item) =>
          item.id_menu === id_menu
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0);

      // Calcular el nuevo total
      const nuevoTotal = nuevoDetalle.reduce(
        (suma, item) => suma + (item.precio_unitario * item.cantidad),
        0
      );
      setComanda({ ...comanda, total: nuevoTotal });

      return nuevoDetalle;
    });
  };

  const filterMenus = () => {
    if (!categoriaSeleccionada) return setFilteredMenus(menus);
    setFilteredMenus(menus.filter((menu) => menu.id_categoria === categoriaSeleccionada.id_categoria));
  };

  const finalizarPedido = async () => {
    try {
      const comandaActualizada = {
        ...comanda,
        detallesComanda: detalle.map(({ id_menu, cantidad, precio_unitario }) => ({
          id_menu,
          cantidad,
          precio_unitario
        }))
      };
      setComanda(comandaActualizada);

      await axios.post("https://192.168.1.5:3010/api/comanda", comandaActualizada);
      navigate(`/mesasBar/${mesaId}`);
    } catch (error) {
      console.error("Error finalizando pedido:", error);
    }
  }

  return (
    <>
      <Header title="QR-Efficient Dashboard" />
      <div className="flex h-screen">
        {/* Categorías */}
        <div className="w-1/4 p-4 bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Categorías</h2>
          {categorias.map((categoria) => (
            <Card
              key={categoria.id_categoria}
              isPressable
              onClick={() => setCategoriaSeleccionada(categoria)}
              className={`cursor-pointer my-2 ${categoriaSeleccionada === categoria ? 'bg-blue-500 text-white' : 'bg-white'
                }`}
            >
              <CardBody>
                <h3 className={`text-lg ${categoriaSeleccionada === categoria ? 'text-white' : 'text-black'
                  }`}>
                  {categoria.nombre}
                </h3>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Productos */}
        <div className="w-1/2 p-4">
          <h2 className="text-xl font-bold mb-4">Menu {categoriaSeleccionada?.nombre}</h2>
          <div className="grid grid-cols-2 gap-4">
            {filteredMenus.map((producto) => (
              <Card
                key={producto.id_menu}
                isHoverable
                isPressable
                onClick={() => agregarProducto(producto)}
                className="p-4 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-4">
                  {producto.foto && (
                    <img
                      src={producto.foto}
                      alt={producto.descripcion}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{producto.descripcion}</h3>
                    <p className="text-gray-500">${producto.precio}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Pedido */}
        <div className="w-1/4 p-4 bg-gray-100">
          <h2 className="text-xl font-bold mb-4">Pedido</h2>
          <div>
            {detalle.map((item) => (
              <Card key={item.id_menu} className="mb-2">
                <CardBody className="flex items-center justify-between">
                  <div>
                    <p>{item.producto.descripcion}</p>
                    <p className="text-sm text-gray-500 text-center">${item.producto.precio}</p>
                  </div>
                  <div className="flex items-center space-x-2 justify-center">
                    <Button
                      startContent={<Minus size={16} />}
                      onPress={() => restarProducto(item.producto.id_menu)}
                      className="text-black"
                    />
                    <Input
                      width="auto"
                      value={item.cantidad.toString()}
                      readOnly
                      size="sm"
                      className="text-center"
                    />
                    <Button
                      startContent={<Plus size={16} />}
                      onPress={() => agregarProducto(item.producto)}
                      className="text-black"
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              onChange={(e) => setComanda({ ...comanda, observaciones: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2"
              rows={3}
              placeholder="Agregar notas o instrucciones especiales..."
            />
          </div>

          <div className="mt-4 mb-4 p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-lg font-bold">${comanda.total}</span>
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-green-500 text-white"
            color="success"
            onPress={() => finalizarPedido()}
          >
            Finalizar
          </Button>
        </div>
      </div>
    </>
  );
};

export default GestionComandasPage;
