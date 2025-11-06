/**
 * API Services
 *
 * Servicios para interactuar con el backend mediante Axios.
 * Estos servicios reemplazan el mock DataService cuando se conecta a un backend real.
 */

import { api, endpoints } from './api-client';

// Tipos de datos
export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  size?: string;
  color?: string;
  gender?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: string;
  updatedAt: string;
}

export interface SalesData {
  id: string;
  date: string;
  amount: number;
  category: string;
  region: string;
  items: number;
}

export interface BusinessMetrics {
  totalRevenue: number;
  totalItems: number;
  lowStockItems: number;
  revenueChange: number;
  itemsChange: number;
  salesByCategory: Array<{ category: string; sales: number; revenue: number }>;
  salesByRegion: Array<{ region: string; sales: number }>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  avatar?: string;
}

/**
 * Servicio de Autenticación
 */
export class AuthService {
  /**
   * Iniciar sesión
   */
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post(endpoints.auth.login, credentials);
    return response.data;
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    await api.post(endpoints.auth.logout);
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(userData: {
    name: string;
    email: string;
    password: string;
    company?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  }

  /**
   * Obtener información del usuario actual
   */
  static async getCurrentUser(): Promise<User> {
    const response = await api.get(endpoints.auth.me);
    return response.data;
  }
}

/**
 * Servicio de Inventario
 */
export class InventoryService {
  /**
   * Obtener lista de inventario
   */
  static async getInventory(filters?: {
    category?: string;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: InventoryItem[]; total: number }> {
    const response = await api.get(endpoints.inventory.list, { params: filters });
    return response.data;
  }

  /**
   * Crear nuevo item de inventario
   */
  static async createItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem> {
    const response = await api.post(endpoints.inventory.create, item);
    return response.data;
  }

  /**
   * Actualizar item de inventario
   */
  static async updateItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await api.put(endpoints.inventory.update(id), updates);
    return response.data;
  }

  /**
   * Eliminar item de inventario
   */
  static async deleteItem(id: string): Promise<void> {
    await api.delete(endpoints.inventory.delete(id));
  }

  /**
   * Buscar items de inventario
   */
  static async searchItems(query: string): Promise<InventoryItem[]> {
    const response = await api.get(endpoints.inventory.search, { params: { q: query } });
    return response.data;
  }

  /**
   * Obtener items con stock bajo
   */
  static async getLowStockItems(): Promise<InventoryItem[]> {
    const response = await api.get(endpoints.inventory.lowStock);
    return response.data;
  }
}

/**
 * Servicio de Ventas
 */
export class SalesService {
  /**
   * Obtener lista de ventas
   */
  static async getSales(filters?: {
    startDate?: string;
    endDate?: string;
    category?: string;
    region?: string;
  }): Promise<SalesData[]> {
    const response = await api.get(endpoints.sales.list, { params: filters });
    return response.data;
  }

  /**
   * Crear nueva venta
   */
  static async createSale(sale: Omit<SalesData, 'id'>): Promise<SalesData> {
    const response = await api.post(endpoints.sales.create, sale);
    return response.data;
  }

  /**
   * Obtener métricas de ventas
   */
  static async getSalesMetrics(period?: string): Promise<BusinessMetrics> {
    const response = await api.get(endpoints.sales.metrics, { params: { period } });
    return response.data;
  }

  /**
   * Obtener ventas por período
   */
  static async getSalesByPeriod(startDate: string, endDate: string): Promise<SalesData[]> {
    const response = await api.get(endpoints.sales.byPeriod, {
      params: { startDate, endDate },
    });
    return response.data;
  }
}

/**
 * Servicio de Analytics
 */
export class AnalyticsService {
  /**
   * Obtener datos del dashboard
   */
  static async getDashboardData(): Promise<{
    kpis: {
      totalItems: number;
      totalRevenue: number;
      lowStockItems: number;
      trendingItems: number;
    };
    charts: {
      salesTrend: Array<{ date: string; sales: number; revenue: number }>;
      categoryDistribution: Array<{ category: string; value: number }>;
    };
  }> {
    const response = await api.get(endpoints.analytics.dashboard);
    return response.data;
  }

  /**
   * Obtener análisis de ingresos
   */
  static async getRevenueAnalysis(period: string): Promise<{
    total: number;
    trend: Array<{ date: string; revenue: number; profit: number }>;
  }> {
    const response = await api.get(endpoints.analytics.revenue, { params: { period } });
    return response.data;
  }

  /**
   * Obtener rendimiento por categorías
   */
  static async getCategoryPerformance(): Promise<
    Array<{ category: string; sales: number; revenue: number; growth: number }>
  > {
    const response = await api.get(endpoints.analytics.categories);
    return response.data;
  }

  /**
   * Obtener ventas por región
   */
  static async getRegionalSales(): Promise<Array<{ region: string; sales: number; percentage: number }>> {
    const response = await api.get(endpoints.analytics.regions);
    return response.data;
  }
}

/**
 * Servicio de Reportes
 */
export class ReportService {
  /**
   * Generar reporte
   */
  static async generateReport(params: {
    type: 'inventory' | 'sales' | 'analytics';
    format: 'pdf' | 'xlsx' | 'csv';
    dateRange?: { start: string; end: string };
    filters?: Record<string, any>;
  }): Promise<{ reportId: string; url: string }> {
    const response = await api.post(endpoints.reports.generate, params);
    return response.data;
  }

  /**
   * Descargar reporte
   */
  static async downloadReport(reportId: string): Promise<Blob> {
    const response = await api.get(endpoints.reports.download(reportId), {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Obtener lista de reportes generados
   */
  static async getReports(): Promise<
    Array<{
      id: string;
      type: string;
      format: string;
      createdAt: string;
      url: string;
    }>
  > {
    const response = await api.get(endpoints.reports.list);
    return response.data;
  }
}

/**
 * Servicio de Archivos
 */
export class FileService {
  /**
   * Subir archivo (Excel, imágenes, etc.)
   */
  static async uploadFile(file: File, type: 'inventory' | 'image' | 'document'): Promise<{
    fileId: string;
    url: string;
    filename: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post(endpoints.files.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Descargar archivo
   */
  static async downloadFile(fileId: string): Promise<Blob> {
    const response = await api.get(endpoints.files.download(fileId), {
      responseType: 'blob',
    });
    return response.data;
  }
}

// Exportar todos los servicios
export default {
  auth: AuthService,
  inventory: InventoryService,
  sales: SalesService,
  analytics: AnalyticsService,
  reports: ReportService,
  files: FileService,
};
