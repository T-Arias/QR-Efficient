import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Switch } from "@nextui-org/react";
import { Header } from "../../Components";
import axios from "axios";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useAuthStore } from "../../Store/useAuthStore";

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

const MeseroPage: React.FC = () => {
  const [meseros, setMeseros] = useState<Mesero[]>([]);
  const id_restaurante = useAuthStore.getState().id_restaurante;
  const [error, setError] = useState('');
  const [editingMesero, setEditingMesero] = useState<Mesero | null>(null);
  const [deleteMesero, setDeleteMesero] = useState<Mesero | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_restaurante: id_restaurante,
    id_mesero: 0,
    id_persona:0,
    persona: {
      email: "",
      nombre: "",
      apellido: "",
      dni: ""
    },
    usuario: {
      email: "",
      contrasena: undefined as string | undefined,
      activo: true,
      grupoId: null as number | null
    }
  });

  useEffect(() => {
    fetchMeseros();
  }, []);

  const fetchMeseros = async () => {
    try {
      const response = await axios.get<Mesero[]>(`http://localhost:3001/api/mesero/restaurante/${id_restaurante}`);
      setMeseros(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching meseros:", error);
    }
  };

  const handleAdd = () => {
    setEditingMesero(null);
    setFormData({
      id_restaurante: id_restaurante,
      id_mesero: 0,
      id_persona:0,
      persona: { email: "", nombre: "", apellido: "", dni: "" },
      usuario: { email: "", contrasena: "", activo: true, grupoId: null }
    });
    setIsFormVisible(true);
  };

  const handleEdit = (mesero: Mesero) => {
    setEditingMesero(mesero);
    setFormData({
      id_restaurante: id_restaurante,
      id_mesero: mesero.id_mesero,
      id_persona: mesero.id_persona,
      persona: { ...mesero.persona },
      usuario: {
        ...mesero.usuario,
        contrasena: "" // No mostramos la contraseña actual por seguridad
      }
    });
    setIsFormVisible(true);
  };

  const handleDelete = async (mesero: Mesero) => {
    setDeleteMesero({
      ...mesero, // Hacemos una copia del objeto mesero
      usuario: {
        ...mesero.usuario, // Hacemos una copia del objeto usuario dentro de mesero
        activo: false // Cambiamos solo la propiedad activo
      }
    });

    if (window.confirm("¿Estás seguro de que quieres eliminar este mesero?")) {
      try {
        await axios.put(`http://localhost:3001/api/mesero/${mesero.id_mesero}`, deleteMesero);
        fetchMeseros();
      } catch (error) {
        console.error("Error deleting mesero:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMesero) {
        console.log(formData);
        const cleanedFormData = { ...formData };

        // Si la contraseña está vacía, eliminarla del objeto usuario
        if (!cleanedFormData.usuario.contrasena) {
          delete cleanedFormData.usuario.contrasena;
        }
        await axios.put(`http://localhost:3001/api/mesero/${editingMesero.id_mesero}`, formData);
      } else {
        await axios.post("http://localhost:3001/api/mesero", formData);
      }
      fetchMeseros();
      setIsFormVisible(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta del servidor:', error.response?.data.errors);
        setError(error.response?.data.errors[0].msg);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };

  return (
    <>

      <Header title="QR-Efficient Dashboard" />
      <div className="p-4 h-screen flex flex-col">
        <div className="flex-grow overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Meseros</h1>
            <Button color="primary" onClick={handleAdd} startContent={<Plus />}>
              Agregar Mesero
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table aria-label="Tabla de meseros">
              <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>APELLIDO</TableColumn>
                <TableColumn>EMAIL</TableColumn>
                <TableColumn>DNI</TableColumn>
                <TableColumn>ACTIVO</TableColumn>
                <TableColumn>GRUPO ID</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {meseros.map((mesero) => (
                  <TableRow key={mesero.id_mesero}>
                    <TableCell>{mesero.persona.nombre}</TableCell>
                    <TableCell>{mesero.persona.apellido}</TableCell>
                    <TableCell>{mesero.persona.email}</TableCell>
                    <TableCell>{mesero.persona.dni}</TableCell>
                    <TableCell>{mesero.usuario.activo ? "Sí" : "No"}</TableCell>
                    <TableCell>{mesero.usuario.grupoId || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        color="warning"
                        onClick={() => handleEdit(mesero)}
                        className="mr-2 mb-2 sm:mb-0"
                        startContent={<Edit />}
                      >
                        Editar
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleDelete(mesero)}
                        startContent={<Trash2 />}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingMesero ? "Editar Mesero" : "Agregar Mesero"}</h2>
                <Button color="default" onClick={() => setIsFormVisible(false)} isIconOnly>
                  <X />
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={formData.persona.nombre}
                  onChange={(e) => setFormData({ ...formData, persona: { ...formData.persona, nombre: e.target.value } })}
                />
                <Input
                  label="Apellido"
                  value={formData.persona.apellido}
                  onChange={(e) => setFormData({ ...formData, persona: { ...formData.persona, apellido: e.target.value } })}
                />
                <Input
                  label="Email"
                  value={formData.persona.email}
                  onChange={(e) => setFormData({ ...formData, persona: { ...formData.persona, email: e.target.value }, usuario: { ...formData.usuario, email: e.target.value } })}
                />
                <Input
                  label="DNI"
                  value={formData.persona.dni}
                  onChange={(e) => setFormData({ ...formData, persona: { ...formData.persona, dni: e.target.value } })}
                />
                <Input
                  label="Contraseña"
                  type="password"
                  value={formData.usuario.contrasena}
                  onChange={(e) => setFormData({ ...formData, usuario: { ...formData.usuario,...(e.target.value ? { contrasena: e.target.value } : {}) } })}
                />
                <Input
                  label="Grupo ID"
                  type="number"
                  value={formData.usuario.grupoId?.toString() || ""}
                  onChange={(e) => setFormData({ ...formData, usuario: { ...formData.usuario, grupoId: e.target.value ? Number(e.target.value) : null } })}
                />
                <div className="flex items-center">
                  <Switch
                    defaultSelected={formData.usuario.activo}
                    onChange={(e) => setFormData({ ...formData, usuario: { ...formData.usuario, activo: e.target.checked } })}
                  />
                  <span className="ml-2">Activo</span>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button color="primary" type="submit">
                    {editingMesero ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold text-sm">{error}</strong>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg onClick={() => setError('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                  </span>
                </div>}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MeseroPage;