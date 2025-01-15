import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../Components/Navbar/Navbar';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination } from '@nextui-org/react';
import { Check, DollarSign, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

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
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const MesaPage: React.FC = () => {
  const { mesaId } = useParams<{ mesaId: string }>();
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPedidos();
  }, [mesaId]);

  const fetchPedidos = async () => {
    try {
      const response = await api.get(`/comanda/mesa/${mesaId}`);
      setComandas(response.data);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
    }
  };

  const handleAddPedido = async () => {
    try {
      navigate(`/mesasBar/${mesaId}/gestionComandas`);
    } catch (error) {
      console.error('Error al agregar pedido:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(comandas.length / itemsPerPage);
  const currentPageItems = comandas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (comanda: Comanda) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este pedido?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/comanda/${comanda.id_comanda}`);
      fetchPedidos();
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
    }
  };

  const handleAccept = async (comanda: Comanda) => {
    try {
      await axios.put(`http://localhost:3001/api/comanda/${comanda.id_comanda}`, {
        id_estado_comanda: 2, // Estado Aceptado
    });
      fetchPedidos();
    } catch (error) {
      console.error('Error al aceptar pedido:', error);
    }
  };

  const handleViewCuenta = async () => {
    try {
      navigate(`/mesasBar/${mesaId}/cuenta`);
    } catch (error) {
      console.error('Error al ver cuenta:', error);
    }
  };


  return (
    <>
      <Header title="QR-Efficient" />
      <div className="flex justify-between items-center mt-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">Mesa {mesaId}</h1>
        <div>
          {comandas.length > 0 &&
            <Button color="secondary" startContent={<DollarSign />} onClick={handleViewCuenta} className="bg-green-500 hover:bg-green-600 text-white mr-1">
              Cuenta
            </Button>
          }
          <Button color="primary" startContent={<Plus />} onClick={handleAddPedido} className="bg-blue-500 hover:bg-blue-600 text-white">
            Agregar pedido
          </Button>
        </div>
      </div>
      <div className="mt-6 px-6">
        <Table aria-label="Gestion de mesa">
          <TableHeader>
            <TableColumn className="text-gray-600">Estado</TableColumn>
            <TableColumn className="text-gray-600">Pedido</TableColumn>
            <TableColumn className="text-gray-600">Total</TableColumn>
            <TableColumn className="text-gray-600">ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {currentPageItems.map((comanda) => (
              <TableRow key={comanda.id_comanda} className="hover:bg-gray-100">
                <TableCell className="py-2 px-4">{comanda.EstadoComanda.descripcion}</TableCell>
                <TableCell className="py-2 px-4">{comanda.Persona.nombre + ' ' + comanda.Persona.apellido}</TableCell>
                <TableCell className="py-2 px-4">${comanda.total}</TableCell>
                <TableCell>
                {(comanda.EstadoComanda.descripcion === 'Pendiente') &&
                    <Button
                    className='mr-2'
                      color='success'
                      onClick={() => handleAccept(comanda)}
                      startContent={<Check />}
                    >
                      Aceptar
                    </Button>
                  }
                  {(comanda.EstadoComanda.descripcion === 'Pendiente' || comanda.EstadoComanda.descripcion === 'Aceptado') &&
                    <Button
                      color="danger"
                      onClick={() => handleDelete(comanda)}
                      startContent={<Trash2 />}
                    >
                      Eliminar
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          total={totalPages}
          initialPage={currentPage}
          onChange={handlePageChange}
          className="mt-4 flex justify-center"
        />
      </div>
    </>
  );
};

export default MesaPage;