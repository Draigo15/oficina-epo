import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileDown, Calendar, Eye, FileText } from 'lucide-react';

const Reports = () => {
  const { isJefa } = useAuth();
  const { error: toastError, success: toastSuccess, warning: toastWarning } = useToast();
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
      if (response.data.totalTasks === 0) {
        toastWarning('No se encontraron datos para este período');
      } else {
        toastSuccess('Reporte cargado correctamente');
      }
    } catch (error) {
      console.error('Error al cargar reporte:', error);
      toastError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!reportData || reportData.tasks.length === 0) {
      toastWarning('No hay datos para generar el reporte');
      return;
    }

    try {
      toastSuccess('Generando PDF...');
      const doc = new jsPDF();
      const monthName = months[selectedMonth - 1];
    
      // Cargar logo UPT
      try {
        const logoImg = new Image();
        logoImg.src = '/logo_upt.png';
        await new Promise((resolve) => {
          logoImg.onload = () => {
            doc.addImage(logoImg, 'PNG', 15, 10, 25, 25);
            resolve();
          };
          logoImg.onerror = resolve;
        });
      } catch (e) {
        console.warn('No se pudo cargar el logo');
      }

      // Slogan (Centrado, Italic)
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(200, 30, 30); // Color rojo oscuro similar a la imagen (opcional, o negro)
      doc.setTextColor(0); // Mejor negro estándar
      doc.text('"Año de la recuperación y consolidación de la economía peruana"', 105, 25, { align: 'center' });

      // Número de informe
      const informeNumero = `${String(selectedMonth).padStart(3, '0')}-${selectedYear}`;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`INFORME GENERAL N.º ${informeNumero}-EPO`, 105, 40, { align: 'center' });
      // Subrayado del título
      const textWidth = doc.getTextWidth(`INFORME GENERAL N.º ${informeNumero}-EPO`);
      doc.line(105 - textWidth/2, 41, 105 + textWidth/2, 41);

      // Configuración de márgenes para sección A/DE
      const labelX = 25;
      const colonX = 55;
      const valueX = 60;
      let currentY = 55;

      // Sección A
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('A', labelX, currentY);
      doc.text(':', colonX, currentY);
      
      doc.text('Dra. Nelly Kuong Gómez', valueX, currentY);
      currentY += 5;
      doc.setFont('helvetica', 'italic');
      doc.text('Directora De La Escuela Profesional de Odontología. Dra.', valueX, currentY);
      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.text('Angela Aquize Diaz', valueX, currentY);
      currentY += 5;
      doc.setFont('helvetica', 'italic');
      doc.text('Secretaria Técnica CMC - EPO', valueX, currentY);
      
      currentY += 10;

      // Sección DE
      doc.setFont('helvetica', 'normal');
      doc.text('DE', labelX, currentY);
      doc.text(':', colonX, currentY);
      doc.text('Rodrigo Samael Adonai Lira Alvarez', valueX, currentY);
      currentY += 5;
      doc.setFont('helvetica', 'italic');
      doc.text('Practicante Soporte Técnico CMC-EPO', valueX, currentY);

      currentY += 10;

      // Sección ASUNTO
      doc.setFont('helvetica', 'normal');
      doc.text('ASUNTO', labelX, currentY);
      doc.text(':', colonX, currentY);
      doc.text(`INFORME DE ACTIVIDADES DEL MES DE ${monthName.toUpperCase()}`, valueX, currentY);

      currentY += 10;

      // Sección FECHA
      doc.text('FECHA', labelX, currentY);
      doc.text(':', colonX, currentY);
      const fechaStr = new Date().toLocaleDateString('es-PE', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      doc.text(`${fechaStr}`, valueX, currentY);

      currentY += 5;
      // Línea separadora
      doc.setLineWidth(0.5);
      doc.line(25, currentY, 185, currentY);

      currentY += 15;

      // Cuerpo del informe
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const introText = `Es grato dirigirme a Usted, para informarle sobre las actividades realizadas en el mes de ${monthName.toLowerCase()} como practicante del Comité de Mejora Continua de la Escuela Profesional de Odontología:`;
      
      const splitIntro = doc.splitTextToSize(introText, 160);
      doc.text(splitIntro, 25, currentY);

      // Lista de actividades
      currentY += (splitIntro.length * 6) + 5;
      
      reportData.tasks.forEach((task) => {
        // Verificar espacio
        if (currentY > 250) {
          doc.addPage();
          currentY = 30;
        }

        // Título de la actividad (Italic)
        doc.setFont('helvetica', 'italic');
        const titleText = `o   ${task.title}`;
        const splitTitle = doc.splitTextToSize(titleText, 160);
        doc.text(splitTitle, 30, currentY);
        currentY += splitTitle.length * 5;

        // Descripción (Indented, Italic)
        if (task.description) {
          doc.setFontSize(10);
          const descText = task.description;
          const splitDesc = doc.splitTextToSize(descText, 150);
          doc.text(splitDesc, 40, currentY);
          currentY += splitDesc.length * 5 + 5; // Espacio extra entre items
          doc.setFontSize(11);
        } else {
          currentY += 5;
        }
      });

      // Mensaje de cierre
      currentY += 5;
      if (currentY > 240) {
        doc.addPage();
        currentY = 30;
      }
      
      doc.setFont('helvetica', 'italic');
      doc.text('Es todo lo que informo para su conocimiento.', 105, currentY, { align: 'center' });
      currentY += 10;

      doc.setFont('helvetica', 'normal');
      doc.text('Atentamente,', 25, currentY);
      currentY += 5;

      // Cargar e insertar imagen de firma
      try {
        const firmaImg = new Image();
        firmaImg.src = '/firma-rodrigo.png';
        
        await new Promise((resolve) => {
          firmaImg.onload = () => {
            // Centrar firma
            doc.addImage(firmaImg, 'PNG', 80, currentY, 50, 25);
            resolve();
          };
          firmaImg.onerror = () => {
            console.warn('No se pudo cargar la imagen de firma');
            resolve();
          };
        });
        
        currentY += 30;
      } catch (error) {
        console.warn('Error al cargar firma:', error);
        currentY += 30;
      }

      // Línea y nombre del practicante (Centrado)
      doc.line(75, currentY, 135, currentY);
      currentY += 5;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('Rodrigo Samael Adonai Lira Alvarez', 105, currentY, { align: 'center' });
      currentY += 5;
      doc.text('Practicante Soporte Técnico CMC-EPO', 105, currentY, { align: 'center' });

      // Pie de página con datos bancarios (Bottom Left)
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('Nota: Scotiabank', 25, pageHeight - 25);
      doc.setFont('helvetica', 'normal');
      doc.text('Nro. de Cuenta: 740- 8432420', 25, pageHeight - 20);
      doc.text('CCI: 009-417-207408432420-74', 25, pageHeight - 15);

      // Guardar PDF
      const fileName = `INFORME_${informeNumero}_RSALA.pdf`;
      doc.save(fileName);
      toastSuccess('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toastError('Error al generar el PDF');
    }
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
      <div className="px-4 sm:px-0 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-purple-600 dark:text-purple-400" />
            Reportes Mensuales
          </h2>
        </div>

        {/* Mensaje informativo según el rol */}
        {isJefa() ? (
          <div className="rounded-xl p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 flex items-center shadow-sm">
            <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg mr-4">
              <Eye className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
            <p className="font-medium text-purple-800 dark:text-purple-200">
              Como Jefa, puedes visualizar los informes generados por el asistente para supervisión.
            </p>
          </div>
        ) : (
          <div className="rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center shadow-sm">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg mr-4">
              <FileDown className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
            <p className="font-medium text-blue-800 dark:text-blue-200">
              Genera tu informe mensual de actividades para presentar al comité.
            </p>
          </div>
        )}

        {/* Selector de mes y año */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
            {isJefa() ? 'Ver Reporte Mensual' : 'Generar Reporte Mensual'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mes
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Año
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
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
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg shadow-purple-600/30 hover:shadow-purple-600/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {months[selectedMonth - 1]} {selectedYear}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Total de tareas completadas: <span className="font-bold text-purple-600 dark:text-purple-400">{reportData.totalTasks}</span>
                </p>
              </div>
              
              {reportData.totalTasks > 0 && !isJefa() && (
                <button
                  onClick={generatePDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Descargar PDF
                </button>
              )}

              {reportData.totalTasks > 0 && isJefa() && (
                <div className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Solo visualización</span>
                  </div>
                </div>
              )}
            </div>

            {reportData.totalTasks === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 dark:bg-gray-700/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                  No hay tareas completadas en este período
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tarea
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Prioridad
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Completada
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.tasks.map((task, index) => (
                      <tr key={task._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          {task.title}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {task.description || <span className="text-gray-400 italic">Sin descripción</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.priority === 'alta' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                            }`}
                          >
                            {task.priority === 'alta' ? 'Alta' : 'Normal'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
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
