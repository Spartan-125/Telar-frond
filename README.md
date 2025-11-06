# Telar - Sistema de Gestión de Inventario con IA

Sistema inteligente de gestión de inventario para el sector retail de moda, potenciado por IA con Google Gemini, desarrollado con Next.js 16 y React 19.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?style=flat-square&logo=tailwind-css)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Conexión a Servidor con Axios](#-conexión-a-servidor-con-axios)
- [API Endpoints](#-api-endpoints)
- [Componentes Principales](#-componentes-principales)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

## ✨ Características

### Gestión de Inventario
- ✅ Visualización completa del inventario con tabla interactiva
- 🔍 Búsqueda y filtrado avanzado por categoría, SKU, nombre, tamaño y género
- ➕ Agregar, editar y eliminar productos
- 📊 Indicadores de estado (En Stock, Stock Bajo, Agotado)
- 🔔 Alertas de stock bajo automáticas

### Analytics y Reportes
- 📈 Dashboard con KPIs en tiempo real
- 📊 5 tipos de gráficos interactivos (Línea, Barra, Área, Pie, Radar)
- 💰 Análisis de ingresos y gastos
- 🌎 Distribución de ventas por región
- ⏰ Análisis de tráfico por hora
- 📥 Exportación de reportes a Excel con gráficos

### Asistente IA
- 🤖 Chat inteligente con Google Gemini
- 💬 Procesamiento de lenguaje natural en español
- 🎯 Navegación por comandos de voz
- 📊 Generación dinámica de gráficos
- 🔍 Filtrado inteligente de inventario
- 📄 Generación automática de reportes

### Gestión de Archivos
- 📤 Carga masiva de productos mediante Excel
- 🎨 Drag & Drop para archivos
- ✅ Validación de formatos (.xlsx, .xls)
- 📊 Historial de cargas
- 📥 Descarga de plantillas

### Configuración y Personalización
- 🌓 Modo oscuro/claro
- 👤 Perfil de usuario personalizable
- 🔔 Preferencias de notificaciones
- 🔐 Configuración de seguridad (2FA)
- 🌍 Selección de zona horaria

## 🚀 Tecnologías

### Framework y Core
- **Next.js 16** - Framework React con App Router y Turbopack
- **React 19.2** - Biblioteca de interfaz de usuario
- **TypeScript 5.9** - Superset tipado de JavaScript

### Estado y Formularios
- **Zustand 5.0** - Gestión de estado ligera con persistencia
- **React Hook Form 7.60** - Gestión de formularios performante
- **Zod 3.25** - Validación de esquemas TypeScript-first

### UI y Estilos
- **Tailwind CSS 4.1** - Framework CSS utility-first
- **Radix UI** - Componentes accesibles y sin estilos (25+ componentes)
- **Framer Motion 12.23** - Biblioteca de animaciones
- **Lucide React** - Iconos SVG modulares (200+ iconos)

### Visualización de Datos
- **Recharts 2.15** - Biblioteca de gráficos para React
  - Gráficos de línea, barra, área, pie y radar
  - Totalmente responsive
  - Tooltips y leyendas personalizables

### Integración IA
- **Google Generative AI 0.24** - SDK oficial de Gemini
  - Modelo: `gemini-2.0-flash`
  - Procesamiento de lenguaje natural
  - Generación de respuestas estructuradas

### Manejo de Archivos
- **XLSX 0.18** - Lectura y escritura de archivos Excel
- **File Saver 2.0** - Descarga de archivos en el navegador
- **DOM to Image More 3.7** - Captura de elementos DOM como imágenes

### HTTP Client
- **Axios 1.13** - Cliente HTTP para peticiones al backend
  - Interceptores de request/response
  - Manejo automático de tokens
  - Retry logic para errores 401

### Herramientas de Desarrollo
- **ESLint** - Linter de código JavaScript/TypeScript
- **PostCSS 8.5** - Transformación de CSS
- **Autoprefixer** - Prefijos CSS automáticos

## 📦 Requisitos Previos

- Node.js >= 18.x
- npm o yarn o pnpm
- Git

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/telar-front.git
cd telar-front
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

> **Nota:** Se usa `--legacy-peer-deps` debido a algunas dependencias que aún no son totalmente compatibles con React 19.

3. **Crear archivo de variables de entorno**
```bash
cp .env.example .env
```

4. **Configurar variables de entorno** (ver sección [Configuración](#-configuración))

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# API de Google Gemini
NEXT_PUBLIC_GEMINI_API_KEY=tu_api_key_aqui

# URL del backend (opcional si usas datos mock)
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Entorno
NODE_ENV=development
```

### Obtener API Key de Google Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Crea una nueva API Key
4. Copia la key y pégala en `.env`

### Configuración del Backend (Opcional)

Si deseas conectar a un backend real en lugar de usar datos mock:

1. Asegúrate de tener tu servidor backend corriendo
2. Configura `NEXT_PUBLIC_API_URL` en `.env`
3. Implementa los endpoints según la especificación en [API Endpoints](#-api-endpoints)

## 🎯 Uso

### Modo Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
telar-front/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Página de inicio
│   ├── login/
│   │   └── page.tsx            # Página de login
│   └── dashboard/               # Dashboard protegido
│       ├── layout.tsx           # Layout del dashboard
│       ├── page.tsx             # Vista general
│       ├── inventory/           # Gestión de inventario
│       ├── analytics/           # Analytics y reportes
│       ├── upload/              # Carga de archivos
│       └── settings/            # Configuración
│
├── components/                   # Componentes React
│   ├── ui/                      # Componentes UI de Radix
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ... (25+ componentes)
│   ├── ai-chat-sidebar.tsx      # Chat IA
│   ├── chart-components.tsx     # Componentes de gráficos
│   ├── login-form.tsx           # Formulario de login
│   └── logo.tsx                 # Logo de la app
│
├── lib/                          # Lógica de negocio
│   ├── store.ts                 # Estado global (Zustand)
│   ├── api-client.ts            # Cliente Axios configurado
│   ├── api-services.ts          # Servicios de API
│   ├── data-service.ts          # Servicio de datos mock
│   ├── gemini.ts                # Integración con Gemini
│   ├── gemini-types.ts          # Tipos de Gemini
│   ├── auth.ts                  # Lógica de autenticación
│   ├── chart-data.ts            # Generación de datos de gráficos
│   ├── intent-parser.ts         # Parser de intenciones IA
│   ├── excel-export.ts          # Exportación a Excel
│   └── utils.ts                 # Utilidades generales
│
├── public/                       # Archivos estáticos
├── types/                        # Tipos TypeScript
├── .env                          # Variables de entorno
├── next.config.ts               # Configuración de Next.js
├── tailwind.config.ts           # Configuración de Tailwind
├── tsconfig.json                # Configuración de TypeScript
├── vercel.json                  # Configuración de Vercel
└── package.json                 # Dependencias del proyecto
```

## 🌐 Conexión a Servidor con Axios

El proyecto incluye una capa de abstracción completa para realizar peticiones HTTP al backend mediante Axios.

### Cliente HTTP Configurado

**Archivo:** [lib/api-client.ts](lib/api-client.ts)

```typescript
import { api, endpoints } from './api-client';

// Realizar peticiones
const response = await api.get('/inventory');
const data = await api.post('/inventory', { name: 'Producto' });
```

### Características del Cliente Axios

#### 1. Configuración Base
- URL base configurable mediante `NEXT_PUBLIC_API_URL`
- Timeout de 30 segundos
- Headers por defecto: `Content-Type: application/json`

#### 2. Interceptores de Request
- ✅ Inyección automática de token de autenticación
- 📝 Logging de peticiones en desarrollo
- 🔐 Manejo de Bearer tokens desde localStorage

#### 3. Interceptores de Response
- ✅ Logging de respuestas en desarrollo
- 🔄 Retry automático en errores 401 con refresh token
- 🚪 Redirección automática a login si falla la autenticación
- ⚠️ Manejo de errores 403 (Prohibido) y 500 (Servidor)

#### 4. Métodos HTTP Disponibles
```typescript
// GET
await api.get('/endpoint', { params: { id: 1 } });

// POST
await api.post('/endpoint', { data: 'value' });

// PUT
await api.put('/endpoint/1', { data: 'updated' });

// PATCH
await api.patch('/endpoint/1', { field: 'value' });

// DELETE
await api.delete('/endpoint/1');
```

### Servicios de API

**Archivo:** [lib/api-services.ts](lib/api-services.ts)

El proyecto incluye servicios pre-construidos para todas las entidades:

#### Servicio de Autenticación
```typescript
import { AuthService } from '@/lib/api-services';

// Login
const { user, token } = await AuthService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Logout
await AuthService.logout();

// Obtener usuario actual
const user = await AuthService.getCurrentUser();
```

#### Servicio de Inventario
```typescript
import { InventoryService } from '@/lib/api-services';

// Obtener inventario
const { items, total } = await InventoryService.getInventory({
  category: 'ABRIGO',
  page: 1,
  limit: 10
});

// Crear producto
const newItem = await InventoryService.createItem({
  name: 'Chaqueta de Cuero',
  sku: 'JKT-001',
  category: 'ABRIGO',
  price: 299.99,
  stock: 50,
  lowStockThreshold: 10
});

// Actualizar producto
const updated = await InventoryService.updateItem('id-123', {
  stock: 45
});

// Eliminar producto
await InventoryService.deleteItem('id-123');

// Buscar productos
const results = await InventoryService.searchItems('chaqueta');

// Obtener productos con stock bajo
const lowStock = await InventoryService.getLowStockItems();
```

#### Servicio de Ventas
```typescript
import { SalesService } from '@/lib/api-services';

// Obtener ventas
const sales = await SalesService.getSales({
  startDate: '2025-01-01',
  endDate: '2025-01-31',
  category: 'ABRIGO'
});

// Crear venta
const newSale = await SalesService.createSale({
  date: '2025-01-15',
  amount: 599.99,
  category: 'ABRIGO',
  region: 'North',
  items: 2
});

// Obtener métricas
const metrics = await SalesService.getSalesMetrics('month');
```

#### Servicio de Analytics
```typescript
import { AnalyticsService } from '@/lib/api-services';

// Dashboard data
const dashboard = await AnalyticsService.getDashboardData();

// Análisis de ingresos
const revenue = await AnalyticsService.getRevenueAnalysis('month');

// Performance por categorías
const categories = await AnalyticsService.getCategoryPerformance();

// Ventas por región
const regions = await AnalyticsService.getRegionalSales();
```

#### Servicio de Reportes
```typescript
import { ReportService } from '@/lib/api-services';

// Generar reporte
const { reportId, url } = await ReportService.generateReport({
  type: 'sales',
  format: 'xlsx',
  dateRange: { start: '2025-01-01', end: '2025-01-31' }
});

// Descargar reporte
const blob = await ReportService.downloadReport(reportId);

// Listar reportes
const reports = await ReportService.getReports();
```

#### Servicio de Archivos
```typescript
import { FileService } from '@/lib/api-services';

// Subir archivo
const file = document.querySelector('input[type="file"]').files[0];
const { fileId, url } = await FileService.uploadFile(file, 'inventory');

// Descargar archivo
const blob = await FileService.downloadFile(fileId);
```

### Manejo de Errores

```typescript
import { AxiosError } from 'axios';
import { api } from '@/lib/api-client';

try {
  const response = await api.get('/endpoint');
  console.log(response.data);
} catch (error) {
  if (error instanceof AxiosError) {
    // Error de respuesta del servidor
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    // Error de petición
    else if (error.request) {
      console.error('No se recibió respuesta del servidor');
    }
    // Error de configuración
    else {
      console.error('Error:', error.message);
    }
  }
}
```

### Integración con el Estado Global

```typescript
'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { InventoryService } from '@/lib/api-services';

export default function InventoryPage() {
  const { inventoryData, setInventoryData } = useStore();

  useEffect(() => {
    async function loadInventory() {
      try {
        const { items } = await InventoryService.getInventory();
        // Actualizar estado global
        setInventoryData(items);
      } catch (error) {
        console.error('Error loading inventory:', error);
      }
    }

    loadInventory();
  }, []);

  return (
    <div>
      {inventoryData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## 🔌 API Endpoints

El backend debe implementar los siguientes endpoints:

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/refresh` | Refrescar token |
| GET | `/api/auth/me` | Obtener usuario actual |

### Inventario

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/inventory` | Listar inventario |
| POST | `/api/inventory` | Crear producto |
| PUT | `/api/inventory/:id` | Actualizar producto |
| DELETE | `/api/inventory/:id` | Eliminar producto |
| GET | `/api/inventory/search` | Buscar productos |
| GET | `/api/inventory/low-stock` | Productos con stock bajo |

### Ventas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sales` | Listar ventas |
| POST | `/api/sales` | Crear venta |
| PUT | `/api/sales/:id` | Actualizar venta |
| DELETE | `/api/sales/:id` | Eliminar venta |
| GET | `/api/sales/metrics` | Métricas de ventas |
| GET | `/api/sales/by-period` | Ventas por período |

### Analytics

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard` | Datos del dashboard |
| GET | `/api/analytics/revenue` | Análisis de ingresos |
| GET | `/api/analytics/categories` | Performance por categorías |
| GET | `/api/analytics/regions` | Ventas por región |
| GET | `/api/analytics/trends` | Tendencias |

### Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/reports/generate` | Generar reporte |
| GET | `/api/reports/:id/download` | Descargar reporte |
| GET | `/api/reports` | Listar reportes |

### Archivos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/files/upload` | Subir archivo |
| GET | `/api/files/:id/download` | Descargar archivo |

## 🧩 Componentes Principales

### AiChatSidebar
Panel deslizante con chat de IA que permite:
- Conversación en lenguaje natural
- Navegación por comandos
- Filtrado de inventario
- Generación de gráficos
- Creación de reportes

**Ubicación:** [components/ai-chat-sidebar.tsx](components/ai-chat-sidebar.tsx)

### ChartComponents
Colección de componentes de visualización:
- BarChartComponent
- LineChartComponent
- AreaChartComponent
- PieChartComponent
- RadarChartComponent

**Ubicación:** [components/chart-components.tsx](components/chart-components.tsx)

### LoginForm
Formulario de autenticación con validación:
- Validación de email
- Requisitos de contraseña (6+ caracteres, mayúscula, número)
- Estados de carga
- Manejo de errores

**Ubicación:** [components/login-form.tsx](components/login-form.tsx)

### DashboardLayout
Layout principal del dashboard con:
- Sidebar de navegación
- Header con botón de IA
- Perfil de usuario
- Diseño responsive

**Ubicación:** [app/dashboard/layout.tsx](app/dashboard/layout.tsx)

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev           # Inicia servidor de desarrollo

# Producción
npm run build         # Genera build de producción
npm start             # Inicia servidor de producción

# Calidad de código
npm run lint          # Ejecuta ESLint
```

## 🚢 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio**
```bash
# Instalar CLI de Vercel
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

2. **Configurar variables de entorno en Vercel**
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega `NEXT_PUBLIC_GEMINI_API_KEY` y `NEXT_PUBLIC_API_URL`

3. **Deploy automático**
   - Cada push a `main` desplegará automáticamente

### Otros Servicios

El proyecto también puede desplegarse en:
- **Netlify**: Requiere configurar build command: `npm run build`
- **Railway**: Compatible con despliegue Docker
- **AWS Amplify**: Compatible con Next.js SSR
- **Digital Ocean App Platform**: Soporte para Next.js

### Configuración de Build

El proyecto está configurado con:
- **Output mode:** `standalone` (optimizado para Vercel)
- **Build command:** `npm run build`
- **Output directory:** `.next`
- **Install command:** `npm install --legacy-peer-deps`

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guía de Estilo

- Usa TypeScript para todos los archivos
- Sigue las reglas de ESLint
- Documenta funciones complejas
- Escribe componentes funcionales con hooks
- Usa Tailwind CSS para estilos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial* - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Radix UI](https://www.radix-ui.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Google Gemini](https://deepmind.google/technologies/gemini/) - IA generativa
- [Recharts](https://recharts.org/) - Biblioteca de gráficos
- [Vercel](https://vercel.com/) - Plataforma de despliegue

## 📞 Contacto

- Email: tu-email@ejemplo.com
- Twitter: [@tu_usuario](https://twitter.com/tu_usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un [issue](https://github.com/tu-usuario/telar-front/issues) con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Screenshots (si aplica)
- Información del navegador/OS

---

Hecho con ❤️ por [Tu Nombre]
