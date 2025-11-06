"use client"

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const categoryData = [
  { category: "Dresses", sales: 245 },
  { category: "Tops", sales: 189 },
  { category: "Pants", sales: 156 },
  { category: "Accessories", sales: 98 },
  { category: "Shoes", sales: 87 },
]

const salesByRegion = [
  { name: "North America", value: 4200, color: "hsl(var(--chart-1))" },
  { name: "Europe", value: 3100, color: "hsl(var(--chart-2))" },
  { name: "Asia", value: 2800, color: "hsl(var(--chart-3))" },
  { name: "South America", value: 1200, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 900, color: "hsl(var(--chart-5))" },
]

const revenueData = [
  { month: "Jan", revenue: 12600 },
  { month: "Feb", revenue: 11400 },
  { month: "Mar", revenue: 15300 },
  { month: "Apr", revenue: 13800 },
  { month: "May", revenue: 17700 },
  { month: "Jun", revenue: 19200 },
]

const customerMetrics = [
  { metric: "Satisfaction", value: 85 },
  { metric: "Retention", value: 78 },
  { metric: "Engagement", value: 92 },
  { metric: "Loyalty", value: 73 },
  { metric: "Referral", value: 68 },
]

export function BarChartComponent() {
  return (
    <div className="w-full h-[250px] bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">Ventas por Categoría</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={categoryData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="category" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChartComponent() {
  return (
    <div className="w-full h-[250px] bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">Ventas por Región</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={salesByRegion}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="hsl(var(--primary))"
            dataKey="value"
          >
            {salesByRegion.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChartComponent() {
  return (
    <div className="w-full h-[250px] bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">Ingresos Mensuales</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function AreaChartComponent() {
  return (
    <div className="w-full h-[250px] bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">Tendencia de Ingresos</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function RadarChartComponent() {
  return (
    <div className="w-full h-[250px] bg-card border border-border rounded-lg p-4">
      <h3 className="text-sm font-semibold mb-2">Métricas de Clientes</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={customerMetrics}>
          <PolarGrid className="stroke-muted" />
          <PolarAngleAxis dataKey="metric" className="text-xs" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
          <Radar
            name="Score"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
