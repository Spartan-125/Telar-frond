import { dataService } from "./data-service"

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
    borderWidth?: number
  }>
}

export interface ChartRequest {
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar'
  metric: 'sales' | 'stock' | 'revenue'
  groupBy: 'category' | 'region' | 'date'
  timeRange?: {
    start: string
    end: string
  }
}

const DEFAULT_COLORS = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
]

export async function generateChartData(request: ChartRequest): Promise<ChartData> {
  let labels: string[] = []
  let values: number[] = []

  if (request.metric === 'sales' || request.metric === 'revenue') {
    const sales = await dataService.getSales(
      request.timeRange?.start,
      request.timeRange?.end
    )

    // Agrupar los datos según el criterio
    const groupedData = new Map<string, number>()
    
    sales.forEach(sale => {
      const key = request.groupBy === 'category' ? sale.category :
                 request.groupBy === 'region' ? sale.region :
                 sale.date
      
      const value = request.metric === 'sales' ? 1 : sale.amount
      groupedData.set(key, (groupedData.get(key) || 0) + value)
    })

    // Convertir el Map a arrays ordenados
    const sortedEntries = Array.from(groupedData.entries())
      .sort((a, b) => b[1] - a[1])

    labels = sortedEntries.map(([key]) => key)
    values = sortedEntries.map(([_, value]) => value)
  } else if (request.metric === 'stock') {
    const inventory = await dataService.getInventory()
    const groupedData = new Map<string, number>()

    inventory.forEach(item => {
      const key = item.category
      groupedData.set(key, (groupedData.get(key) || 0) + item.stock)
    })

    const sortedEntries = Array.from(groupedData.entries())
      .sort((a, b) => b[1] - a[1])

    labels = sortedEntries.map(([key]) => key)
    values = sortedEntries.map(([_, value]) => value)
  }

  return {
    labels,
    datasets: [{
      label: getMetricLabel(request.metric),
      data: values,
      backgroundColor: DEFAULT_COLORS.slice(0, values.length),
      borderColor: request.type === 'line' ? [DEFAULT_COLORS[0]] : undefined,
      borderWidth: 1
    }]
  }
}

function getMetricLabel(metric: ChartRequest['metric']): string {
  switch (metric) {
    case 'sales':
      return 'Ventas (unidades)'
    case 'revenue':
      return 'Ingresos ($)'
    case 'stock':
      return 'Stock disponible'
    default:
      return 'Valor'
  }
}

export function parseChartRequest(input: string): ChartRequest | null {
  const lowerInput = input.toLowerCase()

  // Detectar tipo de gráfica
  let type: ChartRequest['type'] = 'bar'
  if (lowerInput.includes('línea')) type = 'line'
  else if (lowerInput.includes('pastel') || lowerInput.includes('pie')) type = 'pie'
  else if (lowerInput.includes('área')) type = 'area'
  else if (lowerInput.includes('radar')) type = 'radar'

  // Detectar métrica
  let metric: ChartRequest['metric'] = 'sales'
  if (lowerInput.includes('ingreso') || lowerInput.includes('revenue')) metric = 'revenue'
  else if (lowerInput.includes('stock') || lowerInput.includes('inventario')) metric = 'stock'

  // Detectar agrupación
  let groupBy: ChartRequest['groupBy'] = 'category'
  if (lowerInput.includes('región') || lowerInput.includes('region')) groupBy = 'region'
  else if (lowerInput.includes('tiempo') || lowerInput.includes('fecha')) groupBy = 'date'

  return { type, metric, groupBy }
}