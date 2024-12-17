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
    descripcion: 'Libre' | 'Ocupada' | 'Cerrada' | 'Cuenta' | 'Mesero solicitado'; // Si representa el estado, asegúrate de que los valores coincidan con los de colorClasses
    nombre: string;
  };
}

const colorClasses = {
  Libre: 'bg-green-500',
  Ocupada: 'bg-red-500',
  Cerrada: 'bg-gray-500',
  Cuenta: 'bg-yellow-500',
  'Mesero solicitado': 'bg-blue-500',
};

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

  const handleMesaClick = (mesa: Mesa) => {
    navigate(`/mesasBar/${mesa.numero}`);
    console.log('Mesa:', mesa);
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
              className={`cursor-pointer ${colorClasses[mesa.MesaAtendida.descripcion]}`}
              onClick={() => handleMesaClick(mesa)}
            >
              <CardBody className="flex flex-col items-center justify-center text-center">
                {/* <LucideIcon name="coffee" className="mr-2" /> */}
                <h4 className="text-lg font-bold text-white">
                  Mesa {mesa.descripcion}
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
