import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Switch,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
} from "@nextui-org/react";
import { Header } from "../../Components";
import axios from "axios";
import { Plus, Edit, Trash2, X } from "lucide-react";

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

interface Categoria {
  id_categoria: number;
  nombre: string;
}

const MenuPage: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [error, setError] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    foto: "",
    precio: "",
    activo: true,
    id_categoria: "",
    id_restaurante: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular el total de páginas
  const totalPages = Math.max(1, Math.ceil(filteredMenus.length / itemsPerPage));

  // Obtener los items de la página actual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMenus.slice(startIndex, endIndex);
  };

  // Manejador para cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchMenus();
    fetchCategorias();
  }, []);

  useEffect(() => {
    filterMenus();
  }, [selectedCategoria, menus]);

  const fetchMenus = async () => {
    try {
      const response = await axios.get<Menu[]>("http://localhost:3001/api/menu/restaurante/1");
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get<Categoria[]>(
        "http://localhost:3001/api/categoria"
      );
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  const filterMenus = () => {
    if (selectedCategoria === "todas") {
      setFilteredMenus(menus);
    } else {
      setFilteredMenus(
        menus.filter(
          (menu) => menu.categoria.id_categoria === parseInt(selectedCategoria)
        )
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Validar tamaño de archivo (5MB máximo)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError("La imagen es demasiado grande. El tamaño máximo es 5MB.");
            return;
        }

        // Reducir el tamaño de la imagen usando canvas
        const reader = new FileReader();
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const maxWidth = 800; // Ancho máximo deseado
                const maxHeight = 800; // Alto máximo deseado
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, width, height);
                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // Ajusta la calidad si es necesario
                    setFormData({ ...formData, foto: compressedBase64 });
                    setImagePreview(compressedBase64);
                }
            };
        };
        reader.readAsDataURL(file);
    }
};

  const handleAdd = () => {
    setCurrentMenu(null);
    setFormData({
      descripcion: "",
      foto: "",
      precio: "",
      activo: true,
      id_categoria: "",
      id_restaurante: 1,
    });
    setImagePreview(null);
    setIsFormVisible(true);
  };

  const handleEdit = (menu: Menu) => {
    setCurrentMenu(menu);
    setFormData({
      descripcion: menu.descripcion,
      foto: menu.foto || "",
      precio: menu.precio.toString(),
      activo: menu.activo,
      id_categoria: menu.id_categoria.toString(),
      id_restaurante: 1,
    });
    setImagePreview(menu.foto);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este menú?")) {
      try {
        await axios.delete(`http://localhost:3001/api/menu/${id}`);
        fetchMenus();
      } catch (error) {
        console.error("Error deleting menu:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const menuData = {
      ...formData,
      precio: parseFloat(formData.precio),
      id_categoria: parseInt(formData.id_categoria),
    };

    try {
      if (currentMenu) {
        await axios.put(
          `http://localhost:3001/api/menu/${currentMenu.id_menu}`,
          menuData
        );
      } else {
        await axios.post("http://localhost:3001/api/menu", menuData);
      }
      fetchMenus();
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
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Menú</h1>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered">
                    {selectedCategoria === "todas"
                      ? "Todas las categorías"
                      : categorias.find(
                        (cat) =>
                          cat.id_categoria.toString() === selectedCategoria
                      )?.nombre || "Seleccionar categoría"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Categorías"
                  onAction={(key) => setSelectedCategoria(key.toString())}
                  items={[
                    { key: "todas", label: "Todas las categorías" },
                    ...categorias.map((categoria) => ({
                      key: categoria.id_categoria.toString(),
                      label: categoria.nombre,
                    })),
                  ]}
                >
                  {(item) => (
                    <DropdownItem key={item.key}>{item.label}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <Button color="primary" onClick={handleAdd} startContent={<Plus />}>
              Agregar Menú
            </Button>
          </div>

          <Table aria-label="Tabla de menús">
            <TableHeader>
              <TableColumn>DESCRIPCIÓN</TableColumn>
              <TableColumn>FOTO</TableColumn>
              <TableColumn>PRECIO</TableColumn>
              <TableColumn>CATEGORÍA</TableColumn>
              <TableColumn>ACTIVO</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {getCurrentPageItems().map((menu) => (
                <TableRow key={menu.id_menu}>
                  <TableCell>{menu.descripcion}</TableCell>
                  <TableCell>
                    {menu.foto && (
                      <img
                        src={menu.foto}
                        alt={menu.descripcion}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>${menu.precio}</TableCell>
                  <TableCell>{menu.categoria.nombre}</TableCell>
                  <TableCell>{menu.activo ? "Sí" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      color="warning"
                      onClick={() => handleEdit(menu)}
                      className="mr-2"
                      startContent={<Edit />}
                    >
                      Editar
                    </Button>
                    <Button
                      color="danger"
                      onClick={() => handleDelete(menu.id_menu)}
                      startContent={<Trash2 />}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {currentMenu ? "Editar Menú" : "Agregar Menú"}
                </h2>
                <Button
                  color="default"
                  onClick={() => setIsFormVisible(false)}
                  isIconOnly
                >
                  <X />
                </Button>
              </div>
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Input
                  label="Descripción"
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Foto</label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded mt-2"
                    />
                  )}
                </div>
                <Input
                  label="Precio"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                />
                <select
                  className="border rounded p-2"
                  value={formData.id_categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, id_categoria: e.target.value })
                  }
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.id_categoria}
                      value={categoria.id_categoria}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                <div className="flex items-center">
                  <Switch
                    defaultSelected={formData.activo}
                    onChange={(e) =>
                      setFormData({ ...formData, activo: e.target.checked })
                    }
                  />
                  <span className="ml-2">Activo</span>
                </div>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold text-sm">{error}</strong>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg onClick={() => setError('')} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                  </span>
                </div>}
                <div className="md:col-span-2 flex justify-end">
                  <Button color="primary" type="submit">
                    {currentMenu ? "Actualizar" : "Agregar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuPage;