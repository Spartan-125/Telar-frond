import { ChartResponse, GeminiActionResponse } from './gemini-types'

// Datos de ejemplo para las gráficas
const mockSalesData = {
  category: {
    labels: ['Camisas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Accesorios'],
    data: [120, 85, 95, 60, 45]
  },
  region: {
    labels: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
    data: [250, 180, 220, 190, 280]
  },
  date: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    data: [150, 165, 180, 170, 190, 210]
  }
}

const mockRevenueData = {
  category: {
    labels: ['Camisas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Accesorios'],
    data: [12000, 8500, 9500, 6000, 4500]
  },
  region: {
    labels: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
    data: [25000, 18000, 22000, 19000, 28000]
  },
  date: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    data: [15000, 16500, 18000, 17000, 19000, 21000]
  }
}

const mockStockData = {
  category: {
    labels: ['Camisas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Accesorios'],
    data: [500, 350, 400, 250, 600]
  },
  region: {
    labels: ['Norte', 'Sur', 'Este', 'Oeste', 'Centro'],
    data: [800, 600, 700, 500, 900]
  },
  date: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    data: [1000, 950, 900, 850, 800, 750]
  }
}

const DEFAULT_COLORS = [
  'rgba(255, 99, 132, 0.8)',   // Rosa
  'rgba(54, 162, 235, 0.8)',   // Azul
  'rgba(255, 206, 86, 0.8)',   // Amarillo
  'rgba(75, 192, 192, 0.8)',   // Verde agua
  'rgba(153, 102, 255, 0.8)',  // Morado
  'rgba(255, 159, 64, 0.8)',   // Naranja
]

export function processChartResponse(response: ChartResponse): GeminiActionResponse {
  const { type, data } = response
  const { metric, groupBy } = data

  // Seleccionar los datos según la métrica
  let sourceData
  switch (metric) {
    case 'sales':
      sourceData = mockSalesData[groupBy]
      break
    case 'revenue':
      sourceData = mockRevenueData[groupBy]
      break
    case 'stock':
      sourceData = mockStockData[groupBy]
      break
    default:
      throw new Error(`Métrica no soportada: ${metric}`)
  }

  // Preparar datos para la gráfica
  const chartData = {
    labels: sourceData.labels,
    datasets: [{
      label: getMetricLabel(metric),
      data: sourceData.data,
      backgroundColor: type === 'line' ? [DEFAULT_COLORS[0]] : DEFAULT_COLORS,
      borderColor: type === 'line' ? [DEFAULT_COLORS[0]] : DEFAULT_COLORS,
      fill: type === 'area'
    }]
  }

  // Preparar opciones de la gráfica
  const chartOptions = {
    title: `${getMetricLabel(metric)} por ${getGroupLabel(groupBy)}`,
    xAxisLabel: getGroupLabel(groupBy),
    yAxisLabel: getMetricLabel(metric),
    legend: true
  }

  // Devolver respuesta procesada
  return {
    ...response,
    data: {
      ...data,
      chartData
    },
    chartOptions
  }
}

function getMetricLabel(metric: string): string {
  switch (metric) {
    case 'sales':
      return 'Ventas (unidades)'
    case 'revenue':
      return 'Ingresos ($)'
    case 'stock':
      return 'Inventario'
    default:
      return 'Valor'
  }
}

function getGroupLabel(groupBy: string): string {
  switch (groupBy) {
    case 'category':
      return 'Categorías'
    case 'region':
      return 'Regiones'
    case 'date':
      return 'Período'
    default:
      return 'Grupo'
  }
}