import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  DateRangePicker,
  Button
} from '@nextui-org/react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Users, Coffee, ShoppingBag, Printer } from 'lucide-react';
import axios from 'axios';
import { Header } from '../../Components';
import { getLocalTimeZone, parseDate } from '@internationalized/date';
import { format } from 'date-fns';
import { useAuthStore } from '../../Store/useAuthStore';

interface MetricasGenerales {
  ventasTotales: number;
  productosVendidos: number;
  mesasAtendidas: number;
  ticketPromedio: number;
}

interface ProductoVendido {
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
}

interface VentaPorCategoria {
  categoria: string;
  total: number;
  cantidad: number;
}

interface Categoria {
  id_categoria: number;
  nombre: string;
}

const api = axios.create({
  baseURL: 'https://192.168.1.5:3010/api'
});

function CategoryReportPage() {
  const [dateRange, setDateRange] = useState<Date[]>([new Date(), new Date()]);
  const [metricas, setMetricas] = useState<MetricasGenerales | null>(null);
  const [ventasPorCategoria, setVentasPorCategoria] = useState<VentaPorCategoria[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoVendido[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const id_restaurante = useAuthStore.getState().id_restaurante;
  // Filtrado de productos según la categoría seleccionada
  const getProductosFiltrados = () => {
    if (!categoriaSeleccionada) {
      return productosMasVendidos
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
    }
    return productosMasVendidos
      .filter(producto => producto.categoria === categoriaSeleccionada)
      .sort((a, b) => b.cantidad - a.cantidad);
  };

  const fetchMetricas = async (dateRange: Date[]) => {
    try {
      const response = await api.get('/reporte/metricas', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        }
      });
      setMetricas(response.data);
    } catch (error) {
      console.error('Error fetching metricas:', error);
    }
  };

  const fetchVentasPorCategoria = async (dateRange: Date[]) => {
    try {
      const response = await api.get('/reporte/ventas-categoria', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        }
      });

      const categoriasProcesadas = response.data.map((item: VentaPorCategoria) => ({
        ...item,
        total: Number(item.total),
        cantidad: Number(item.cantidad)
      }));
      setVentasPorCategoria(categoriasProcesadas);
    } catch (error) {
      console.error('Error fetching ventas por categoria:', error);
    }
  };

  const fetchProductosMasVendidos = async (dateRange: Date[]) => {
    try {
      const response = await api.get('/reporte/productos-vendidos', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        }
      });

      setProductosMasVendidos(response.data);
    } catch (error) {
      console.error('Error fetching productos más vendidos:', error);
    }
  };

  const fetchCategorias = async () => {
    try {
      const response = await axios.get<Categoria[]>("https://192.168.1.5:3010/api/categoria");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchMetricas(dateRange);
    fetchVentasPorCategoria(dateRange);
    fetchProductosMasVendidos(dateRange);
  }, [dateRange]);

  // Cálculo de la categoría más solicitada (con mayor cantidad de ventas)
  const categoriaMasSolicitada =
    ventasPorCategoria && ventasPorCategoria.length > 0
      ? ventasPorCategoria.reduce((prev, current) =>
        current.cantidad > prev.cantidad ? current : prev
      )
      : null;

  // Filtrado de productos y obtención del producto más vendido
  const productosFiltrados = getProductosFiltrados();
  const productoMasVendido =
    productosFiltrados && productosFiltrados.length > 0 ? productosFiltrados[0] : null;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#FF0000'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
    <Header title="Reporte por Categoría" />
    <div className="p-6">
      {/* Cabecera del reporte */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="w-full md:w-auto">
          <h2 className="text-xl font-bold mb-2">Periodo del reporte</h2>
          <DateRangePicker
            aria-label="Date Range Picker"
            defaultValue={{
              start: parseDate(format(dateRange[0], 'yyyy-MM-dd')),
              end: parseDate(format(dateRange[1], 'yyyy-MM-dd'))
            }}
            onChange={(value) => {
              setDateRange([
                value.start.toDate(getLocalTimeZone()),
                value.end.toDate(getLocalTimeZone())
              ]);
            }}
            className="w-full md:w-auto"
          />
        </div>

        <Button 
          color="primary"
          size="md"
          startContent={<Printer size={20} />}
          onClick={handlePrint}
          className="w-full md:w-auto"
        >
          Imprimir Reporte
        </Button>
      </div>

        {/* Tarjetas de métricas actualizadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {/* Productos Vendidos */}
          <Card>
            <CardBody className="flex items-center">
              <ShoppingBag className="w-8 h-8 text-success" />
              <div className="ml-4">
                <p className="text-sm">Productos Vendidos</p>
                <p className="text-xl font-bold text-center">
                  {metricas?.productosVendidos}
                </p>
              </div>
            </CardBody>
          </Card>

          {/* Categoría Más Solicitada */}
          {categoriaMasSolicitada && (
            <Card>
              <CardBody className="flex items-center">
                <Users className="w-8 h-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm">Categoría Más Solicitada</p>
                  <p className="text-xl font-bold text-center">
                    {categoriaMasSolicitada.categoria} ({categoriaMasSolicitada.cantidad})
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Producto Más Vendido */}
          {productoMasVendido && (
            <Card>
              <CardBody className="flex items-center">
                <Coffee className="w-8 h-8 text-warning" />
                <div className="ml-4">
                  <p className="text-sm">Producto Más Vendido</p>
                  <p className="text-xl font-bold text-center">
                    {productoMasVendido.descripcion} ({productoMasVendido.cantidad})
                  </p>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-center">
                Ventas por Categoría
              </h3>
            </CardHeader>
            <CardBody className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ventasPorCategoria}
                    dataKey="cantidad"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {ventasPorCategoria.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-col w-full gap-4">
                <h3 className="text-xl font-bold text-center">
                  Productos Más Vendidos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  <Card
                    isPressable
                    className={categoriaSeleccionada === null ? "bg-primary text-white" : ""}
                    onPress={() => setCategoriaSeleccionada(null)}
                  >
                    <CardBody className="p-3">
                      <p className="text-center">Todas</p>
                    </CardBody>
                  </Card>
                  {categorias.map((categoria) => (
                    <Card
                      key={categoria.id_categoria}
                      isPressable
                      className={categoriaSeleccionada === categoria.nombre ? "bg-primary text-white" : ""}
                      onPress={() => setCategoriaSeleccionada(categoria.nombre)}
                    >
                      <CardBody className="p-3">
                        <p className="text-center">{categoria.nombre}</p>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Table aria-label="Productos Más Vendidos">
                <TableHeader>
                  <TableColumn>Producto</TableColumn>
                  <TableColumn>Categoria</TableColumn>
                  <TableColumn>Cantidad</TableColumn>
                  <TableColumn>Precio</TableColumn>
                </TableHeader>
                <TableBody>
                  {getProductosFiltrados().map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>{producto.descripcion}</TableCell>
                      <TableCell>{producto.categoria}</TableCell>
                      <TableCell>{producto.cantidad}</TableCell>
                      <TableCell>${producto.precio}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default CategoryReportPage;
