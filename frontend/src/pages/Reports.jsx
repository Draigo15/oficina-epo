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
      const doc = new jsPDF('p', 'mm', 'a4');
      const monthName = months[selectedMonth - 1];

      // Layout
      const pageWidth  = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginLeft  = 25;
      const marginRight = pageWidth - 25;
      const contentWidth = marginRight - marginLeft;

      // Columnas del bloque de cabecera (A / DE / ASUNTO / FECHA)
      const colColon = marginLeft + 22;   // posición del ":"
      const colValue = marginLeft + 27;   // posición del valor

      // Número de informe
      const informeNumero = `${String(selectedMonth).padStart(3, '0')}-${selectedYear}`;

      // ── Lema gubernamental ──────────────────────────────────────────────
      doc.setFont('times', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(0);
      doc.text(
        '"Año de la recuperación y consolidación de la economía peruana"',
        pageWidth / 2, 15, { align: 'center' }
      );

      // ── Título ─────────────────────────────────────────────────────────
      const titulo = `INFORME N.º ${informeNumero}-EPO`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(titulo, pageWidth / 2, 24, { align: 'center' });
      const tW = doc.getTextWidth(titulo);
      doc.setLineWidth(0.35);
      doc.line((pageWidth / 2) - tW / 2, 25.5, (pageWidth / 2) + tW / 2, 25.5);

      // ── Línea separadora superior ───────────────────────────────────────
      doc.setLineWidth(0.4);
      doc.line(marginLeft, 31, marginRight, 31);

      // ── Bloque A / DE / ASUNTO / FECHA ─────────────────────────────────
      let y = 38;
      const lineH    = 5.5;   // interlineado normal
      const subLineH = 5;     // interlineado para subtítulo en itálica

      const printLabel = (text) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(text, marginLeft, y);
        doc.text(':', colColon, y);
      };
      const printValue = (text) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(text, colValue, y);
      };
      const printSub = (text) => {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text(text, colValue, y);
      };

      // A :
      printLabel('A');
      printValue('Dra. Nelly Kuong Gómez');
      y += subLineH;
      printSub('Directora De La Escuela Profesional de Odontología. Dra.');
      y += lineH + 1;
      // segunda destinataria (sin etiqueta)
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text('Angela Aquize Diaz', colValue, y); y += subLineH;
      printSub('Secretaria Técnica CMC - EPO');
      y += lineH + 2;

      // DE :
      printLabel('DE');
      printValue('Rodrigo Samael Adonai Lira Alvarez');
      y += subLineH;
      printSub('Practicante del Comité de Mejora Continua');
      y += lineH + 3;

      // ASUNTO :
      printLabel('ASUNTO');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text(
        `INFORME DE ACTIVIDADES DEL MES DE ${monthName.toUpperCase()}`,
        colValue, y
      );
      y += lineH + 3;

      // FECHA :
      printLabel('FECHA');
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text(
        new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }),
        colValue, y
      );
      y += lineH + 5;

      // ── Línea separadora inferior de cabecera ───────────────────────────
      doc.setLineWidth(0.4);
      doc.line(marginLeft, y, marginRight, y);
      y += 8;

      // ── Párrafo introductorio ───────────────────────────────────────────
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const introText =
        `Es grato dirigirme a Usted, para informarle sobre las actividades realizadas ` +
        `en el mes de ${monthName.toLowerCase()} como practicante del Comité de Mejora ` +
        `Continua de la Escuela Profesional de Odontología:`;
      const introLines = doc.splitTextToSize(introText, contentWidth);
      doc.text(introLines, marginLeft, y);
      y += introLines.length * 5.2 + 6;

      // ── Bullets ─────────────────────────────────────────────────────────
      const bulletIndent = 8;   // sangría del texto tras el círculo
      const descIndent   = 9;   // sangría adicional de la descripción

      const drawBullet = (title, description) => {
        const descLines = description
          ? doc.splitTextToSize(description, contentWidth - descIndent)
          : [];
        const estHeight = 8 + descLines.length * 5.2 + 5;

        if (y + estHeight > pageHeight - 45) {
          doc.addPage();
          y = 20;
        }

        // Círculo ○
        doc.setDrawColor(0); doc.setFillColor(255);
        doc.circle(marginLeft + 2.5, y - 1.8, 2, 'S');

        // Título en negrita
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        // Ajustar título si es muy largo
        const titleLines = doc.splitTextToSize(title, contentWidth - bulletIndent);
        doc.text(titleLines, marginLeft + bulletIndent, y);
        y += titleLines.length * 5.5 + 1;

        // Descripción
        if (descLines.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.text(descLines, marginLeft + descIndent, y);
          y += descLines.length * 5.2 + 6;
        } else {
          y += 4;
        }
      };

      reportData.tasks.forEach((task) => {
        drawBullet(task.title, task.description || '');
      });

      // ── Cierre ─────────────────────────────────────────────────────────
      y += 2;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Es todo lo que informo para su conocimiento.', marginLeft, y);
      y += 6;

      // ── Bloque de firma ─────────────────────────────────────────────────
      const notaAreaHeight = 30;   // mm reservados para la nota al pie
      const firmaBlockH    = 62;   // altura del bloque firma completo

      // En página 1: empujar la firma hacia la zona baja para que no quede pegada al texto.
      // En páginas siguientes: colocarla justo después del contenido (evita el hueco enorme).
      const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
      let sigY;
      if (currentPage === 1) {
        // Página única: firma en la parte baja, mínimo a 2/3 de la página
        const firmaStartMin = Math.max(pageHeight * 0.62, pageHeight - notaAreaHeight - firmaBlockH);
        sigY = Math.max(y + 10, firmaStartMin);
      } else {
        // Página 2+: firma justo después del contenido con espacio razonable
        sigY = y + 18;
      }

      // Si la firma + nota no caben, añadir página
      if (sigY + firmaBlockH + notaAreaHeight > pageHeight) {
        doc.addPage();
        sigY = 40;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Atentamente,', pageWidth / 2, sigY, { align: 'center' });
      sigY += 10;

      // Imagen de firma
      try {
        const firmaImg = new Image();
        firmaImg.src = '/firma-rodrigo.png';
        await new Promise((resolve) => {
          firmaImg.onload = resolve;
          firmaImg.onerror = resolve;
        });
        if (firmaImg.width && firmaImg.height) {
          const fw = 55, fh = 24;
          doc.addImage(firmaImg, 'PNG', (pageWidth / 2) - fw / 2, sigY, fw, fh);
          sigY += fh + 2;
        } else {
          sigY += 20; // espacio si no hay imagen
        }
      } catch (_) { sigY += 20; }

      // Línea
      const halfLine = 38;
      doc.setLineWidth(0.3);
      doc.line((pageWidth / 2) - halfLine, sigY, (pageWidth / 2) + halfLine, sigY);
      sigY += 6;

      // Nombre en itálica
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('Rodrigo Samael Adonai Lira Alvarez', pageWidth / 2, sigY, { align: 'center' });
      sigY += 5;

      // Cargo en itálica
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.text('Practicante Soporte Técnico CMC-EPO', pageWidth / 2, sigY, { align: 'center' });

      // ── Nota bancaria — siempre al pie de la última página ──────────────
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8.5);
      doc.setTextColor(60);
      const notaY = pageHeight - notaAreaHeight + 6;
      doc.text('Nota: Scotiabank',             marginLeft, notaY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('Nro. de Cuenta:  740- 8432420',  marginLeft, notaY + 5);
      doc.text('CCI: 009-417-207408432420-74',   marginLeft, notaY + 10);
      doc.setTextColor(0);

      // ── Guardar ──────────────────────────────────────────────────────────
      doc.save(`INFORME_${informeNumero}_EPO.pdf`);
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
              
              {reportData.totalTasks > 0 && (
                <button
                  onClick={generatePDF}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-lg shadow-green-600/30 transition-all duration-200 flex items-center"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Descargar PDF
                </button>
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
