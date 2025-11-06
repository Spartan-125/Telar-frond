import domToImage from 'dom-to-image-more';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface ChartExport {
  element: HTMLElement;
  name: string;
  data: any[];
}

export async function exportChartsToExcel(charts: ChartExport[]) {
  try {
    // Crear un nuevo libro de Excel
    const workbook = XLSX.utils.book_new();
    
    // Para cada gráfico
    for (const chart of charts) {
      // Convertir los datos a una hoja de Excel
      const ws = XLSX.utils.json_to_sheet(chart.data);
      XLSX.utils.book_append_sheet(workbook, ws, chart.name);
      
      // Capturar el gráfico como imagen PNG
      const dataUrl = await domToImage.toPng(chart.element);
      
      // Crear una nueva hoja para la imagen
      const imageWs = XLSX.utils.aoa_to_sheet([['']]);
      XLSX.utils.book_append_sheet(workbook, imageWs, `${chart.name} Chart`);
    }
    
    // Guardar el archivo
    const date = new Date().toISOString().split('T')[0];
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `Analytics_Report_${date}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
}