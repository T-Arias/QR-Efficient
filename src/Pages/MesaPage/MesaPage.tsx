import { useState, useEffect } from 'react'
import { Header } from '../../Components'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { Plus, Clock, X } from 'lucide-react'
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
interface Mesa {
  numero: number;
  descripcion: string,
  MesaAtendida: {
    id_mesa_atendida: number,
    fecha_inicio: Date,
    descripcion: string,
    nombre: string
  }
}

const api = axios.create({
  baseURL: 'http://localhost:3001/api'
});

const MesaPage: React.FC = () => {
  const [mesasAtendidas, setMesasAtendidas] = useState<Mesa[]>([]);
  const [meseros, setMeseros] = useState<Mesero[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentMesa, setCurrentMesa] = useState<Mesa | null>(null);
  const [formData, setFormData] = useState({
    id_mesa_atendida: 0,
    id_mesero: 0,
    id_mesa: 0,
    id_estado_mesa: 0,
    ocupado: false,
    fecha_cierre: new Date()
  }
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular el total de páginas
  const totalPages = Math.max(1, Math.ceil(mesasAtendidas.length / itemsPerPage));

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mesasAtendidas.slice(startIndex, endIndex);
  };

  // Manejador para cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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

  const handleAsignarMesero = async (mesaAtendida: Mesa, meseroId: number) => {
    try {
      await api.post("/mesas/", {
        id_mesa: mesaAtendida.numero,
        id_mesero: meseroId,
        ocupado: true
      });
      fetchMesasAtendidas();
    } catch (error) {
      console.error('Error al asignar mesero:', error);
    }
  };

  const handleCerrarMesa = async (mesaAtendida: Mesa) => {
    try {
      await api.put(`/mesas/${mesaAtendida.MesaAtendida.id_mesa_atendida}`, {
        fecha_cierre: new Date().toISOString(),
        id_estado_mesa: 3
      });
      fetchMesasAtendidas();
    } catch (error) {
      console.error('Error al cerrar mesa:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.id_mesero) {
      alert('Debes seleccionar un mesero');
      return;
    }
    if (currentMesa) {
      handleAsignarMesero(currentMesa, Number(formData.id_mesero));
    }
    setIsFormVisible(false);
  };

  return (
    <>
      <Header title="QR-Efficient" />
      <div className="p-4 h-screen flex flex-col">
        <div className="flex-grow overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Gestión de Mesas</h1>
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
                {getCurrentPageItems().map((mesa) => (
                  <TableRow key={mesa.numero}>
                    <TableCell>{mesa.descripcion}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${mesa.MesaAtendida.descripcion == 'Libre' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {mesa.MesaAtendida.descripcion}
                      </span>
                    </TableCell>
                    <TableCell>
                      {mesa.MesaAtendida.nombre}
                    </TableCell>
                    <TableCell>{mesa.MesaAtendida.fecha_inicio != null ? format(mesa.MesaAtendida.fecha_inicio.toString(), 'dd/MM/yyyy HH:mm') : ''}</TableCell>

                    <TableCell className="flex gap-2">
                      {mesa.MesaAtendida.descripcion == 'Cerrada' && (
                        <Button
                          color="primary"
                          size="sm"
                          startContent={<Plus size={16} />}
                          onClick={() => {
                            setCurrentMesa(mesa);
                            setIsFormVisible(true);
                          }}
                        >
                          Asignar Mesero
                        </Button>
                      )}
                      {mesa.MesaAtendida.descripcion != 'Cerrada' && (
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
          <div className="flex justify-center mt-4">
            <Pagination
              total={totalPages}
              initialPage={currentPage}
              onChange={handlePageChange}
              color="primary"
              showControls
            />
          </div>
        </div>
        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Agregar mesero</h2>
                <Button color="default" onClick={() => setIsFormVisible(false)} isIconOnly>
                  <X />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="flat" className="w-full justify-start">
                      {formData.id_mesero
                        ? `${meseros.find((m) => m.id_mesero === formData.id_mesero)?.persona.nombre} ${meseros.find((m) => m.id_mesero === formData.id_mesero)?.persona.apellido
                        }`
                        : 'Seleccionar mesero'}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Selección de mesero"
                    className="w-full"
                    onAction={(key) => setFormData({ ...formData, id_mesero: Number(key) })}
                  >
                    {meseros.map((mesero) => (
                      <DropdownItem key={mesero.id_mesero}>{`${mesero.persona.nombre} ${mesero.persona.apellido}`}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <div className="md:col-span-2 flex justify-end">
                  <Button color="primary" type="submit" isDisabled={!formData.id_mesero}>
                    Agregar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default MesaPage;