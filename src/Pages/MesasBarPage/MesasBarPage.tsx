import React, { useState, useEffect } from 'react';
import { Header } from '../../Components';
import { Card, CardBody } from '@nextui-org/react'; // Importación de NextUI
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Store/useAuthStore';

interface Mesa {
  numero: number;
  descripcion: string;
  MesaAtendida: {
    id_mesa_atendida: number;
    fecha_inicio: Date;
    descripcion: string;
    nombre: string;
  };
}

const getStatusColor = (estadoComanda: string) => {
  switch (estadoComanda) {
    case 'Ocupada': return 'bg-red-500'
    case 'Libre': return 'bg-blue-500'
    case 'Cerrada': return 'bg-gray-500'
    case 'Cuenta solicitada': return 'bg-green-500'
    case 'Mesero solicitado': return 'bg-amber-400'
    case 'Nuevo pedido': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

const MesasBarPage: React.FC = () => {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const id_restaurante = useAuthStore.getState().id_restaurante;
  const navigate = useNavigate();

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    try {
      const response = await api.get(`/mesas/restaurante/${id_restaurante}`);
      setMesas(response.data);
    } catch (error) {
      console.error('Error al obtener mesas:', error);
    }
  };

  const actionDescription = (mesa: string) => {
    switch (mesa) {
      case 'Cuenta solicitada':
        return ': Cuenta solicitada';
      case 'Mesero solicitado':
        return ': Mesero solicitado';
      case 'Nuevo pedido':
        return ': Nuevo pedido cliente';
      default:
        return '';
    }
  }

  const handleMesaClick = async (mesa: Mesa) => {
    if (mesa.MesaAtendida.descripcion === 'Cuenta solicitada' || mesa.MesaAtendida.descripcion === 'Mesero solicitado') {
      await api.put(`/mesas/${mesa.MesaAtendida.id_mesa_atendida}`, { id_estado_mesa: 2 });
      fetchMesas();
    } else {
      if (mesa.MesaAtendida.descripcion === 'Nuevo pedido') {
        await api.put(`/mesas/${mesa.MesaAtendida.id_mesa_atendida}`, { id_estado_mesa: 2 });
      }
      navigate(`/mesasBar/${mesa.numero}`);
    }
  };

  return (
    <>
      <Header title="Mesas" />
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4">
          {mesas.map((mesa) => (
            <Card
              key={mesa.numero}
              isPressable={mesa.MesaAtendida.descripcion !== 'Cerrada'}
              className={`cursor-pointer ${getStatusColor(mesa.MesaAtendida.descripcion)}`}
              onClick={() => handleMesaClick(mesa)}
            >
              <CardBody className="flex flex-col items-center justify-center text-center">
                <h4 className="text-lg font-bold text-white">
                  Mesa {mesa.descripcion + ' ' + actionDescription(mesa.MesaAtendida.descripcion)}
                </h4>
                <p className="text-white">{mesa.MesaAtendida.nombre}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default MesasBarPage;
