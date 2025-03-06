import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, DateRangePicker, Button, Input, Checkbox } from '@nextui-org/react';
import { useAuthStore } from '../../Store/useAuthStore';
import Header from '../../Components/Navbar/Navbar';
import { getLocalTimeZone, parseDate } from '@internationalized/date';
import { format } from 'date-fns';
import { Printer } from 'lucide-react';
import './AuditoryPage.css';

interface Auditoria {
  id_auditoria: number;
  fecha_accion: string;
  tipo_accion: string;
  precio_anterior: number;
  precio_nuevo: number;
  Menu: {
    descripcion: string;
    categoria: {
      nombre: string;
    };
  };
  Persona: {
    nombre: string;
    apellido: string;
  };
}

const api = axios.create({
  baseURL: 'https://qr-efficient-backend.onrender.com/api'
});

function AuditoryPage() {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [dateRange, setDateRange] = useState<Date[]>([new Date(), new Date()]);
  const id_restaurante = useAuthStore.getState().id_restaurante;
  const [searchMenu, setSearchMenu] = useState('');
  const [filteredActions, setFilteredActions] = useState({
    CREATE: false,
    UPDATE: false,
    ACTIVAR: false,
    DESACTIVAR: false
  });

  const handlePrint = () => {
    window.print();
  };

  const fetchAuditorias = async () => {
    try {
      const response = await api.get('/auditoria/menu', {
        params: {
          fechaInicio: dateRange[0].toISOString(),
          fechaFin: dateRange[1].toISOString(),
          id_restaurante
        }
      });
      console.log('Auditorías:', response.data);
      setAuditorias(response.data);
    } catch (error) {
      console.error('Error al obtener auditorías:', error);
    }
  };

  const filteredAuditorias = auditorias.filter(auditoria => {
    const matchesSearch = auditoria.Menu.descripcion.toLowerCase().includes(searchMenu.toLowerCase());
    const matchesAction = Object.entries(filteredActions).some(([action, isChecked]) =>
      isChecked ? auditoria.tipo_accion === action : false
    ) || !Object.values(filteredActions).some(value => value);
    return matchesSearch && matchesAction;
  });

  useEffect(() => {
    fetchAuditorias();
  }, [dateRange]);

  return (
    <>
      <div className="no-print">
        <Header title="Auditoria de Precios" />
      </div>

      <Card className="p-6">
        {/* Container principal */}
        <div className="flex flex-col gap-6 mb-6">
          {/* Primera fila: controles con distribución específica */}
          <div className="flex items-center justify-between">
            <div className="w-[300px]">
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
              />
            </div>
            <div className="w-[300px]">
              <Input
                type="text"
                label="Buscar por nombre del menú"
                value={searchMenu}
                onChange={(e) => setSearchMenu(e.target.value)}
                size="sm"
              />
            </div>
            <Button
              color="primary"
              size="sm"
              startContent={<Printer size={16} />}
              onClick={handlePrint}
              className="h-[40px]"
            >
              Imprimir auditoría
            </Button>
          </div>

          {/* Segunda fila: Checkboxes */}
          <div className="flex items-center gap-8">
            <Checkbox
              isSelected={filteredActions.CREATE}
              onValueChange={(checked) =>
                setFilteredActions(prev => ({ ...prev, CREATE: checked }))
              }
              size="sm"
            >
              CREATE
            </Checkbox>
            <Checkbox
              isSelected={filteredActions.UPDATE}
              onValueChange={(checked) =>
                setFilteredActions(prev => ({ ...prev, UPDATE: checked }))
              }
              size="sm"
            >
              UPDATE
            </Checkbox>
            <Checkbox
              isSelected={filteredActions.ACTIVAR}
              onValueChange={(checked) =>
                setFilteredActions(prev => ({ ...prev, ACTIVAR: checked }))
              }
              size="sm"
            >
              ACTIVAR
            </Checkbox>
            <Checkbox
              isSelected={filteredActions.DESACTIVAR}
              onValueChange={(checked) =>
                setFilteredActions(prev => ({ ...prev, DESACTIVAR: checked }))
              }
              size="sm"
            >
              DESACTIVAR
            </Checkbox>
          </div>
        </div>

        <Table
          aria-label="Tabla de Auditorías"
          className="mt-4"
        >
          <TableHeader>
            <TableColumn>Usuario</TableColumn>
            <TableColumn>Fecha</TableColumn>
            <TableColumn>Acción</TableColumn>
            <TableColumn>Producto</TableColumn>
            <TableColumn>Categoría</TableColumn>
            <TableColumn>Precio Anterior</TableColumn>
            <TableColumn>Precio Nuevo</TableColumn>
          </TableHeader>
          <TableBody>
            {filteredAuditorias.map((auditoria) => (
              <TableRow key={auditoria.id_auditoria}>
                <TableCell>
                  {`${auditoria.Persona.nombre} ${auditoria.Persona.apellido}`}
                </TableCell>
                <TableCell>
                  {new Date(auditoria.fecha_accion).toLocaleDateString()}
                </TableCell>
                <TableCell>{auditoria.tipo_accion}</TableCell>
                <TableCell>{auditoria.Menu.descripcion}</TableCell>
                <TableCell>{auditoria.Menu.categoria.nombre}</TableCell>
                <TableCell>${auditoria.precio_anterior}</TableCell>
                <TableCell>${auditoria.precio_nuevo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}

export default AuditoryPage;