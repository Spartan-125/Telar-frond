// Interfaz para representar los datos de ventas
export interface SalesData {
  date: string
  amount: number
  category: string
  region: string
}

// Interfaz para representar los datos de inventario
export interface InventoryItem {
  id: string
  name: string
  category: string
  size?: string
  gender?: string
  stock: number
  price: number
}

// Interfaz para métricas del negocio
export interface BusinessMetrics {
  totalSales: number
  averageOrderValue: number
  topCategories: { category: string; sales: number }[]
  stockLevels: { category: string; stock: number }[]
  regionalPerformance: { region: string; sales: number }[]
}

class DataService {
 
  private mockInventory: InventoryItem[] = [
   {
      "id": "101",
      "name": "Abrigo de Lana",
      "category": "ABRIGO",
      "size": "S",
      "gender": "Mujer",
      "stock": 45,
      "price": 189.99
    },
    {
      "id": "102",
      "name": "Buzo Deportivo",
      "category": "BUZOS",
      "size": "M",
      "gender": "Mujer",
      "stock": 80,
      "price": 55.50
    },
    {
      "id": "103",
      "name": "Jeans Slim Fit",
      "category": "JEANS TERMINADOS",
      "size": "L",
      "gender": "Hombre",
      "stock": 12,
      "price": 79.90
    },
    {
      "id": "104",
      "name": "Polo Clásico",
      "category": "POLOS",
      "size": "XL",
      "gender": "Hombre",
      "stock": 65,
      "price": 35.00
    },
    {
      "id": "105",
      "name": "Vestido Floral",
      "category": "VESTIDOS",
      "size": "XS",
      "gender": "Mujer",
      "stock": 30,
      "price": 95.99
    },
    {
      "id": "106",
      "name": "Bermuda de Baño",
      "category": "ROPA DE BAÑO",
      "size": "10",
      "gender": "Niño",
      "stock": 70,
      "price": 25.99
    },
    {
      "id": "107",
      "name": "Falda Plisada",
      "category": "FALDA",
      "size": "8",
      "gender": "Niña",
      "stock": 40,
      "price": 38.50
    },
    {
      "id": "108",
      "name": "Pijama Algodón",
      "category": "PIJAMAS",
      "size": "XXS",
      "gender": "Mujer",
      "stock": 25,
      "price": 45.00
    }
    
  ]

  private mockSales: SalesData[] = [
    {
      "date": "2025-11-06",
      "amount": 4274.75,
      "category": "ABRIGO",
      "region": "Norte"
    },
    {
      "date": "2025-11-05",
      "amount": 1150.00,
      "category": "BUZOS",
      "region": "Sur"
    },
    {
      "date": "2025-11-06",
      "amount": 259.90,
      "category": "ROPA DE BAÑO",
      "region": "Este"
    },
    {
      "date": "2025-11-04",
      "amount": 383.50,
      "category": "FALDA",
      "region": "Oeste"
    },
    {
      "date": "2025-11-03",
      "amount": 1200.00,
      "category": "POLOS",
      "region": "Centro"
    }
    
  ]

  // Métodos para obtener datos de inventario
  async getInventory(filter?: Partial<InventoryItem>): Promise<InventoryItem[]> {
    if (!filter) return this.mockInventory

    return this.mockInventory.filter(item => {
      return Object.entries(filter).every(([key, value]) => 
        item[key as keyof InventoryItem] === value
      )
    })
  }

  // Método para obtener datos de ventas
  async getSales(startDate?: string, endDate?: string): Promise<SalesData[]> {
    if (!startDate || !endDate) return this.mockSales

    return this.mockSales.filter(sale => {
      const saleDate = new Date(sale.date)
      return saleDate >= new Date(startDate) && saleDate <= new Date(endDate)
    })
  }

  // Método para obtener métricas del negocio
  async getBusinessMetrics(startDate?: string, endDate?: string): Promise<BusinessMetrics> {
    const sales = await this.getSales(startDate, endDate)
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
    const averageOrderValue = totalSales / sales.length

    // Agrupar ventas por categoría
    const categoryMap = new Map<string, number>()
    sales.forEach(sale => {
      const current = categoryMap.get(sale.category) || 0
      categoryMap.set(sale.category, current + sale.amount)
    })

    // Agrupar ventas por región
    const regionMap = new Map<string, number>()
    sales.forEach(sale => {
      const current = regionMap.get(sale.region) || 0
      regionMap.set(sale.region, current + sale.amount)
    })

    // Calcular niveles de stock por categoría
    const stockMap = new Map<string, number>()
    this.mockInventory.forEach(item => {
      const current = stockMap.get(item.category) || 0
      stockMap.set(item.category, current + item.stock)
    })

    return {
      totalSales,
      averageOrderValue,
      topCategories: Array.from(categoryMap.entries())
        .map(([category, sales]) => ({ category, sales }))
        .sort((a, b) => b.sales - a.sales),
      stockLevels: Array.from(stockMap.entries())
        .map(([category, stock]) => ({ category, stock })),
      regionalPerformance: Array.from(regionMap.entries())
        .map(([region, sales]) => ({ region, sales }))
        .sort((a, b) => b.sales - a.sales)
    }
  }

  // Método para generar un reporte basado en los datos
  async generateReportData(reportType: string): Promise<any> {
    switch (reportType.toLowerCase()) {
      case "inventory":
        return await this.getInventory()
      case "sales":
        return await this.getSales()
      case "metrics":
        return await this.getBusinessMetrics()
      default:
        throw new Error(`Tipo de reporte no soportado: ${reportType}`)
    }
  }
}

// Exportar una instancia singleton del servicio
export const dataService = new DataService()