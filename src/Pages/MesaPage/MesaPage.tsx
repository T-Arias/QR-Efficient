import { useState, useEffect } from 'react'
import { Header } from '../../Components'
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { Plus, Clock, User } from 'lucide-react'
import axios from 'axios'
import { format } from 'date-fns'

interface Mesero {
  id_restaurante: number;
  id_mesero: number;
  id_persona: number;
  persona: {
    email: string;
    nombre: string;
    apellido: string;
    dni: string;
  };
  usuario: {
    id_usuario: number;
    email: string;
    contrasena?: string;
    activo: boolean;
    id_persona: number;
    grupoId: number | null;
  };
}

interface MesaAtendida {
  numero: number;
  MesaAtendida: {
    id_mesa_atendida: number,
    fecha_inicio: Date,
    descripcion: string,
    nombre: string
  }
}

interface Mesa {
  numero: number;
  MesaAtendida: {
    id_mesa_atendida: number,
    fecha_inicio: Date,
    descripcion: string,
    nombre: string
  }
}

interface EstadoMesa {
  id_estado_mesa: number;
  descripcion: string;
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const MesaPage: React.FC = () => {
  const [mesasAtendidas, setMesasAtendidas] = useState<MesaAtendida[]>([]);
  const [meseros, setMeseros] = useState<Mesero[]>([]);

  useEffect(() => {
    fetchMesasAtendidas();
    fetchMeseros();
  }, []);

  const fetchMesasAtendidas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/mesas/restaurante/1");
      setMesasAtendidas(response.data);
    } catch (error) {
      console.error("Error al obtener mesas atendidas:", error);
    }
  };

  const fetchMeseros = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/mesero/restaurante/1");
      setMeseros(response.data);
    } catch (error) {
      console.error("Error al obtener meseros:", error);
    }
  };

  const handleAsignarMesero = async (mesaAtendida: MesaAtendida, meseroId: number) => {
    try {
      await api.put(`/mesas/${mesaAtendida.MesaAtendida.id_mesa_atendida}`, {
        id_mesero: meseroId,
        ocupado: true
      });
      fetchMesasAtendidas();
    } catch (error) {
      console.error('Error al asignar mesero:', error);
    }
  };

  const handleCerrarMesa = async (mesaAtendida: MesaAtendida) => {
    try {
      await api.put(`/mesas/${mesaAtendida.MesaAtendida.id_mesa_atendida}`, {
        fecha_cierre: new Date().toISOString(),
        ocupado: false,
        id_estado_mesa: 3
      });
      fetchMesasAtendidas();
    } catch (error) {
      console.error('Error al cerrar mesa:', error);
    }
  };

  const formatDateTime = (date: string) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  };


  return (
    <>
      <Header title="QR-Efficient Dashboard" />
      <div className="p-4 h-screen flex flex-col">
        <div className="flex-grow overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Gestión de Mesas</h1>
            <Button
              color="primary"
              startContent={<Plus size={20} />}
            >
              Nueva Mesa
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table aria-label="Tabla de mesas">
              <TableHeader>
                <TableColumn>MESA #</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>MESERO</TableColumn>
                <TableColumn>INICIO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {mesasAtendidas.map((mesa) => (
                  <TableRow key={mesa.MesaAtendida.id_mesa_atendida}>
                    <TableCell>{mesa.numero}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${mesa.MesaAtendida.descripcion =='Libre' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {mesa.MesaAtendida.descripcion}
                      </span>
                    </TableCell>
                    <TableCell>
                      {mesa.MesaAtendida.nombre}
                    </TableCell>
                    <TableCell>{mesa.MesaAtendida.fecha_inicio != null ? format(mesa.MesaAtendida.fecha_inicio.toString(), 'dd/MM/yyyy HH:mm') : ''}</TableCell>

                    <TableCell className="flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        startContent={<User size={16} />}
                        onClick={() => {
                          // Aquí podrías abrir un dropdown o modal para asignar mesero
                        }}
                      >
                        Asignar Mesero
                      </Button>
                      {mesa.MesaAtendida.descripcion != 'Mesa cerrada' && (
                        <Button
                          color="danger"
                          size="sm"
                          startContent={<Clock size={16} />}
                          onClick={() => handleCerrarMesa(mesa)}
                        >
                          Cerrar Mesa
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}

export default MesaPage;