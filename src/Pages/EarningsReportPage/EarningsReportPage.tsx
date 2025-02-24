import { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardBody,
  DateRangePicker,
  Button,
} from '@nextui-org/react';
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, DollarSign, Printer } from 'lucide-react';
import axios from 'axios';
import { Header } from '../../Components';
import { getLocalTimeZone, parseDate } from '@internationalized/date';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import { useAuthStore } from '../../Store/useAuthStore';

interface MetricasGenerales {
  ventasTotales: number;
  productosVendidos: number;
  mesasAtendidas: number;
  ticketPromedio: number;
}

interface DesempenoMesero {
  nombre: string;
  ventas: number;
  cuentas: number;
}

interface VentaDiaria {
  rawFecha: Date;
  fecha: string;
  total: number;
}

const api = axios.create({
  baseURL: 'https://192.168.1.5:3010/api',
});

function EarningsReportPage() {
  const [dateRange, setDateRange] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);
  const [metricas, setMetricas] = useState<MetricasGenerales | null>(null);
  const [ventasDiarias, setVentasDiarias] = useState<VentaDiaria[]>([]);
  const [desempenoMeseros, setDesempenoMeseros] = useState<DesempenoMesero[]>([]);
  const [groupBy, setGroupBy] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const id_restaurante = useAuthStore.getState().id_restaurante;

  const fetchMetricas = async (dateRange: Date[]) => {
    try {
      const response = await api.get('/reporte/metricas', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        },
      });
      setMetricas(response.data);
    } catch (error) {
      console.error('Error fetching metricas:', error);
    }
  };

  const fetchVentasDiarias = async (dateRange: Date[]) => {
    try {
      const response = await api.get('/reporte/ventas-diarias', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        },
      });
      const data = response.data.map((venta: any) => ({
        rawFecha: new Date(venta.fecha),
        fecha: format(new Date(venta.fecha), 'dd/MM/yyyy'),
        total: Number(venta.total),
      }));

      setVentasDiarias(data);
    } catch (error) {
      console.error('Error fetching ventas diarias:', error);
    }
  };

  const fetchDesempenoMeseros = async (dateRange: Date[]) => {
    try {
      const response = await api.get('/reporte/desempeno-meseros', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        },
      });

      const data = response.data.map((mesero: any) => ({
        nombre: mesero.nombre,
        ventas: Number(mesero.ventas),
        cuentas: Number(mesero.cuentas),
      }));

      setDesempenoMeseros(data);
    } catch (error) {
      console.error('Error fetching desempeño meseros:', error);
    }
  };

  useEffect(() => {
    fetchMetricas(dateRange);
    fetchVentasDiarias(dateRange);
    fetchDesempenoMeseros(dateRange);
  }, [dateRange]);

  const groupedVentas = useMemo(() => {
    if (groupBy === 'daily') {
      return ventasDiarias.map((v) => ({
        fecha: v.fecha,
        total: v.total,
      }));
    } else if (groupBy === 'weekly') {
      const weeklyMap: Record<string, number> = {};
      ventasDiarias.forEach((venta) => {
        const weekStart = startOfWeek(venta.rawFecha, { weekStartsOn: 1 });
        const key = format(weekStart, 'dd/MM/yyyy');
        weeklyMap[key] = (weeklyMap[key] || 0) + venta.total;
      });
      const weeklyArray = Object.entries(weeklyMap).map(([key, total]) => ({
        fecha: key,
        total,
      }));
      weeklyArray.sort(
        (a, b) =>
          new Date(a.fecha.split('/').reverse().join('-')).getTime() -
          new Date(b.fecha.split('/').reverse().join('-')).getTime()
      );
      return weeklyArray;
    } else if (groupBy === 'monthly') {
      const monthlyMap: Record<string, number> = {};
      ventasDiarias.forEach((venta) => {
        const monthStart = startOfMonth(venta.rawFecha);
        const key = format(monthStart, 'MM/yyyy');
        monthlyMap[key] = (monthlyMap[key] || 0) + venta.total;
      });
      const monthlyArray = Object.entries(monthlyMap).map(([key, total]) => ({
        fecha: key,
        total,
      }));
      monthlyArray.sort((a, b) => {
        const [monthA, yearA] = a.fecha.split('/').map(Number);
        const [monthB, yearB] = b.fecha.split('/').map(Number);
        return yearA - yearB || monthA - monthB;
      });
      return monthlyArray;
    }
    return ventasDiarias;
  }, [groupBy, ventasDiarias]);

  // Función para imprimir la pantalla
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Header: Se oculta al imprimir */}
      <div className="no-print">
        <Header title="Reporte de Ingresos" />
      </div>

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

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <Card aria-label="Ingresos Totales">
            <CardBody className="flex items-center">
              <DollarSign className="w-8 h-8 text-primary text-center" />
              <div className="ml-4">
                <p className="text-sm">Ingresos Totales</p>
                <p className="text-xl font-bold text-center">
                  ${metricas?.ventasTotales ?? 0}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center">
              <Users className="w-8 h-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm">Cuentas emitidas</p>
                <p className="text-xl font-bold text-center">
                  {metricas?.mesasAtendidas ?? 0}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center">
              <TrendingUp className="w-8 h-8 text-danger" />
              <div className="ml-4">
                <p className="text-sm">Ticket Promedio</p>
                <h3 className="text-xl font-bold">
                  {metricas
                    ? `$${metricas.ticketPromedio.toFixed(2)}`
                    : '$0.00'}
                </h3>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Gráfico de ventas */}
        <div className="mb-6">
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <h3 className="text-xl font-bold">Tendencia de Ventas</h3>
            {/* Filtro de agrupación */}
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button
                size="sm"
                color={groupBy === 'daily' ? 'primary' : 'default'}
                onClick={() => setGroupBy('daily')}
              >
                Diario
              </Button>
              <Button
                size="sm"
                color={groupBy === 'monthly' ? 'primary' : 'default'}
                onClick={() => setGroupBy('monthly')}
              >
                Mensual
              </Button>
            </div>
          </div>
          <Card>
            <CardBody>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={groupedVentas}>
                    <XAxis dataKey="fecha" />
                    <YAxis
                      domain={[
                        groupedVentas.length > 0
                          ? groupedVentas.reduce(
                            (min, venta) => Math.min(min, venta.total),
                            Infinity
                          )
                          : 0,
                        groupedVentas.length > 0
                          ? groupedVentas.reduce(
                            (max, venta) => Math.max(max, venta.total),
                            -Infinity
                          )
                          : 0,
                      ]}
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Gráfico de desempeño de meseros */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Desempeño de Meseros</h3>
          <Card>
            <CardBody>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={desempenoMeseros}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis yAxisId="ventas" domain={[0, 'dataMax+30']} />
                    <YAxis yAxisId="cuentas" orientation="right" domain={[0, 'dataMax+10']} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" label={{ position: 'top' }} fill="#8884d8" name="Ventas" yAxisId="ventas" />
                    <Bar dataKey="cuentas" label={{ position: 'top' }} fill="#82ca9d" name="cuentas emitidas" yAxisId="cuentas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default EarningsReportPage;
