// Tipos de intenciones que puede tener el usuario
export type IntentType = 
  | "PLATFORM_DATA" // Quiere datos de la plataforma
  | "NAVIGATION"    // Quiere navegar a alguna página
  | "CHART"         // Quiere ver una gráfica
  | "FILTER"        // Quiere filtrar datos
  | "CHAT"         // Conversación general
  | "REPORT"       // Solicitud de reporte
  | "HELP"         // Necesita ayuda

export interface Intent {
  type: IntentType
  confidence: number
  data?: {
    chartType?: string
    reportType?: string
    filter?: Record<string, any>
    path?: string
    dates?: {
      start?: string
      end?: string
    }
  }
}

const NAVIGATION_COMMANDS = {
  inventario: "/dashboard/inventory",
  inventory: "/dashboard/inventory",
  analytics: "/dashboard/analytics",
  analíticas: "/dashboard/analytics",
  dashboard: "/dashboard",
  inicio: "/dashboard",
  upload: "/dashboard/upload",
  settings: "/dashboard/settings",
  configuración: "/dashboard/settings",
  ajustes: "/dashboard/settings"
}

const INTENT_INDICATORS = {
  NAVIGATION: [
    { words: ["llévame", "ir", "navega", "muestra", "abre"], weight: 0.7 },
    { words: ["página", "vista", "sección"], weight: 0.5 },
    { words: Object.keys(NAVIGATION_COMMANDS), weight: 1.0 }
  ],
  PLATFORM_DATA: [
    { words: ["datos", "información", "métricas", "estadísticas"], weight: 0.6 },
    { words: ["cuánto", "cuántos", "total", "cantidad"], weight: 0.4 },
    { words: ["ventas", "stock", "productos", "categorías"], weight: 0.5 }
  ],
  CHART: [
    { words: ["gráfica", "gráfico", "chart", "visualización"], weight: 0.8 },
    { words: ["barras", "pie", "pastel", "líneas", "radar", "área"], weight: 1.0 }
  ],
  FILTER: [
    { words: ["filtrar", "buscar", "encontrar"], weight: 0.7 },
    { words: ["categoría", "tipo", "talla", "marca", "precio", "color"], weight: 0.5 }
  ],
  HELP: [
    { words: ["ayuda", "help", "cómo", "qué puedes", "funciones"], weight: 1.0 }
  ]
}

export function detectNavigation(input: string): { path: string; confidence: number } | null {
  const lowerInput = input.toLowerCase()
  
  // Primero buscar coincidencias directas con comandos de navegación
  for (const [key, path] of Object.entries(NAVIGATION_COMMANDS)) {
    if (lowerInput.includes(key)) {
      return { path, confidence: 1.0 }
    }
  }

  return null
}

export async function parseIntent(input: string): Promise<Intent> {
  const lowerInput = input.toLowerCase()
  let maxConfidence = 0
  let detectedType: IntentType = "CHAT"
  
  // Primero verificar si es un comando de navegación
  const navigation = detectNavigation(input)
  if (navigation && navigation.confidence > 0.8) {
    return {
      type: "NAVIGATION",
      confidence: navigation.confidence,
      data: { path: navigation.path }
    }
  }
  
  // Analizar cada tipo de intención con pesos
  for (const [type, indicators] of Object.entries(INTENT_INDICATORS)) {
    let typeConfidence = 0
    let matchCount = 0
    
    for (const { words, weight } of indicators) {
      const matches = words.filter(word => lowerInput.includes(word))
      if (matches.length > 0) {
        typeConfidence += (matches.length / words.length) * weight
        matchCount++
      }
    }
    
    // Normalizar la confianza por el número de grupos de indicadores
    if (matchCount > 0) {
      typeConfidence = typeConfidence / indicators.length
      
      if (typeConfidence > maxConfidence) {
        maxConfidence = typeConfidence
        detectedType = type as IntentType
      }
    }
  }

  // Si no hay una intención clara, asumimos que es chat general
  if (maxConfidence < 0.3) {
    return {
      type: "CHAT",
      confidence: 1.0
    }
  }

  // Extraer datos adicionales según el tipo de intención
  const data: Intent["data"] = {}
  
  if (detectedType === "CHART") {
    if (lowerInput.includes("barra")) data.chartType = "bar"
    else if (lowerInput.includes("pie") || lowerInput.includes("pastel")) data.chartType = "pie"
    else if (lowerInput.includes("línea")) data.chartType = "line"
    else if (lowerInput.includes("área")) data.chartType = "area"
    else if (lowerInput.includes("radar")) data.chartType = "radar"
  }
  
  if (detectedType === "PLATFORM_DATA" || detectedType === "REPORT") {
    if (lowerInput.includes("venta")) data.reportType = "sales"
    else if (lowerInput.includes("inventario")) data.reportType = "inventory"
    else if (lowerInput.includes("métrica")) data.reportType = "metrics"
  }

  return {
    type: detectedType,
    confidence: maxConfidence,
    data
  }
}