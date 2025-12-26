import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileDown, Calendar } from 'lucide-react';

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const fetchMonthlyReport = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reports/monthly', {
        params: { month: selectedMonth, year: selectedYear }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      alert('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!reportData || reportData.tasks.length === 0) {
      alert('No hay datos para generar el reporte');
      return;
    }

    const doc = new jsPDF();
    const monthName = months[selectedMonth - 1];
    const monthNameUpper = monthName.toUpperCase();
    
    // Número de informe incremental (puedes ajustarlo según necesites)
    const informeNumero = `${String(selectedMonth).padStart(3, '0')}-${selectedYear}`;

    // Encabezado formal
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`INFORME GENERAL Nº ${informeNumero}-EPO`, 105, 20, { align: 'center' });

    // Línea separadora
    doc.setLineWidth(0.3);
    doc.line(20, 25, 190, 25);

    // Sección DE/PARA
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('DE:', 20, 35);
    doc.setFont('helvetica', 'normal');
    doc.text('RODRIGO LIRA ALVAREZ', 40, 35);
    doc.setFontSize(9);
    doc.text('Practicante del Comité de Mejora Continua', 40, 40);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('PARA:', 20, 50);
    doc.setFont('helvetica', 'normal');
    doc.text('ANGELA AQUIZE DIAZ', 40, 50);
    doc.setFontSize(9);
    doc.text('Jefa del Comité de Mejora Continua', 40, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ASUNTO:', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Informe de Actividades - ${monthName} ${selectedYear}`, 40, 65);

    doc.setFont('helvetica', 'bold');
    doc.text('FECHA:', 20, 75);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date().toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    }), 40, 75);

    // Línea separadora
    doc.line(20, 80, 190, 80);

    // Cuerpo del informe
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const introText = `Es grato dirigirme a Usted, para informarle sobre las actividades realizadas en el mes de ${monthName.toLowerCase()} como practicante del Comité de Mejora Continua de la Escuela Profesional de Odontología:`;
    
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, 90);

    // Lista de actividades
    let currentY = 90 + (splitIntro.length * 5) + 5;
    
    reportData.tasks.forEach((task, index) => {
      // Verificar si necesitamos nueva página
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      const taskText = `${index + 1}. ${task.title}${task.description ? ': ' + task.description : ''}`;
      const splitTask = doc.splitTextToSize(taskText, 170);
      doc.text(splitTask, 25, currentY);
      currentY += splitTask.length * 5 + 3;
    });

    // Mensaje de cierre
    currentY += 5;
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.text('Es todo lo que informo para su conocimiento.', 20, currentY);
    currentY += 10;

    doc.setFont('helvetica', 'normal');
    doc.text('Atentamente,', 20, currentY);
    currentY += 5;

    // Cargar e insertar imagen de firma
    try {
      const firmaImg = new Image();
      firmaImg.src = '/firma-rodrigo.png';
      
      await new Promise((resolve, reject) => {
        firmaImg.onload = () => {
          // Insertar imagen de firma (ajusta tamaño según necesites)
          doc.addImage(firmaImg, 'PNG', 20, currentY, 50, 15);
          resolve();
        };
        firmaImg.onerror = () => {
          // Si no se encuentra la imagen, continuamos sin ella
          console.warn('No se pudo cargar la imagen de firma');
          resolve();
        };
      });
      
      currentY += 15;
    } catch (error) {
      console.warn('Error al cargar firma:', error);
      currentY += 15;
    }

    // Línea y nombre del practicante
    currentY += 5;
    doc.line(20, currentY, 80, currentY);
    currentY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('RODRIGO LIRA ALVAREZ', 20, currentY);
    currentY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Practicante', 20, currentY);

    // Pie de página en la última página
    doc.setFontSize(7);
    doc.setTextColor(128);
    doc.text('Escuela Profesional de Odontología - Comité de Mejora Continua', 105, 285, { align: 'center' });

    // Guardar PDF
    const fileName = `INFORME_${informeNumero}_EPO.pdf`;
    doc.save(fileName);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="px-4 sm:px-0">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Reportes Mensuales</h2>

        {/* Selector de mes y año */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Generar Reporte Mensual
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mes
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="input-field"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="input-field"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchMonthlyReport}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cargando...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Reporte
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Vista previa del reporte */}
        {reportData && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {months[selectedMonth - 1]} {selectedYear}
                </h3>
                <p className="text-gray-600 mt-1">
                  Total de tareas completadas: <span className="font-bold">{reportData.totalTasks}</span>
                </p>
              </div>
              
              {reportData.totalTasks > 0 && (
                <button
                  onClick={generatePDF}
                  className="btn-primary flex items-center"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Descargar PDF
                </button>
              )}
            </div>

            {reportData.totalTasks === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  No hay tareas completadas en este período
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarea
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completada
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.tasks.map((task, index) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {task.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {task.description || 'Sin descripción'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={
                              task.priority === 'alta' ? 'badge-alta' : 'badge-normal'
                            }
                          >
                            {task.priority === 'alta' ? 'Alta' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(task.completedAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
