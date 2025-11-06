"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { exportChartsToExcel } from "@/lib/excel-export"
import * as htmlToImage from 'html-to-image'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 12600, profit: 4200, expenses: 8400 },
  { month: "Feb", revenue: 11400, profit: 3800, expenses: 7600 },
  { month: "Mar", revenue: 15300, profit: 5100, expenses: 10200 },
  { month: "Apr", revenue: 13800, profit: 4600, expenses: 9200 },
  { month: "May", revenue: 17700, profit: 5900, expenses: 11800 },
  { month: "Jun", revenue: 19200, profit: 6400, expenses: 12800 },
  { month: "Jul", revenue: 21500, profit: 7200, expenses: 14300 },
]

const categoryPerformance = [
  { category: "Dresses", sales: 245, revenue: 22050, growth: 12 },
  { category: "Tops", sales: 189, revenue: 4725, growth: 8 },
  { category: "Pants", sales: 156, revenue: 12480, growth: -3 },
  { category: "Accessories", sales: 98, revenue: 12740, growth: 15 },
  { category: "Shoes", sales: 87, revenue: 13050, growth: 5 },
]

const salesByRegion = [
  { name: "North America", value: 4200, color: "hsl(var(--chart-1))" },
  { name: "Europe", value: 3100, color: "hsl(var(--chart-2))" },
  { name: "Asia", value: 2800, color: "hsl(var(--chart-3))" },
  { name: "South America", value: 1200, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 900, color: "hsl(var(--chart-5))" },
]

const customerMetrics = [
  { metric: "Satisfaction", value: 85 },
  { metric: "Retention", value: 78 },
  { metric: "Engagement", value: 92 },
  { metric: "Loyalty", value: 73 },
  { metric: "Referral", value: 68 },
]

const hourlyTraffic = [
  { hour: "12am", visits: 120 },
  { hour: "3am", visits: 80 },
  { hour: "6am", visits: 150 },
  { hour: "9am", visits: 420 },
  { hour: "12pm", visits: 680 },
  { hour: "3pm", visits: 590 },
  { hour: "6pm", visits: 750 },
  { hour: "9pm", visits: 480 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [isExporting, setIsExporting] = useState(false)
  
  // Referencias para los contenedores de gráficos
  const revenueChartRef = useRef(null)
  const categoryChartRef = useRef(null)
  const regionChartRef = useRef(null)
  const customerChartRef = useRef(null)
  const trafficChartRef = useRef(null)

  const captureChart = async (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const dataUrl = await htmlToImage.toPng(ref.current)
      const binaryString = atob(dataUrl.split(',')[1])
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes
    }
    return null
  }

  const exportToExcel = async () => {
    try {
      setIsExporting(true)
      
      if (!revenueChartRef.current || !categoryChartRef.current || !regionChartRef.current || 
          !customerChartRef.current || !trafficChartRef.current) {
        throw new Error('No se pudieron encontrar los elementos de los gráficos')
      }

      const charts = [
        { 
          element: revenueChartRef.current, 
          name: 'Revenue Analysis', 
          data: revenueData 
        },
        { 
          element: categoryChartRef.current, 
          name: 'Category Performance', 
          data: categoryPerformance 
        },
        { 
          element: regionChartRef.current, 
          name: 'Regional Sales', 
          data: salesByRegion 
        },
        { 
          element: customerChartRef.current, 
          name: 'Customer Metrics', 
          data: customerMetrics 
        },
        { 
          element: trafficChartRef.current, 
          name: 'Hourly Traffic', 
          data: hourlyTraffic 
        }
      ]

      // Exportar los gráficos y datos a Excel
      await exportChartsToExcel(charts)
    } catch (error) {
      console.error('Error al exportar a Excel:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Analytics</h1>
          <p className="text-muted-foreground text-pretty">Deep insights into your business performance and trends</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="size-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={exportToExcel}
            isLoading={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$111,500</div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <TrendingUpIcon className="size-3 text-green-500" />
              <span className="text-green-500 font-medium">+18.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33.4%</div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <TrendingUpIcon className="size-3 text-green-500" />
              <span className="text-green-500 font-medium">+2.1%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$142.50</div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <TrendingDownIcon className="size-3 text-red-500" />
              <span className="text-red-500 font-medium">-3.2%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              <TrendingUpIcon className="size-3 text-green-500" />
              <span className="text-green-500 font-medium">+0.9%</span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Profit Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Profit Analysis</CardTitle>
          <CardDescription>Monthly breakdown of revenue, profit, and expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={revenueChartRef}>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  strokeWidth={2}
                  name="Profit ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Performance & Regional Sales */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Sales and revenue by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={categoryChartRef}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="category" type="category" className="text-xs" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
            <CardDescription>Geographic distribution of sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={regionChartRef}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesByRegion}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
          </CardContent>
        </Card>
      </div>

      {/* Customer Metrics & Hourly Traffic */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Metrics</CardTitle>
            <CardDescription>Key customer satisfaction and engagement indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={customerChartRef}>
              <ResponsiveContainer width="100%" height={300}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Traffic</CardTitle>
            <CardDescription>Website visits throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={trafficChartRef}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" className="text-xs" />
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
                    dataKey="visits"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--accent))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Items */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Items</CardTitle>
          <CardDescription>Best selling products this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Summer Floral Dress", sales: 245, revenue: 22050, trend: 12 },
              { name: "Leather Crossbody Bag", sales: 189, revenue: 24570, trend: 15 },
              { name: "Ankle Boots", sales: 156, revenue: 23400, trend: 8 },
              { name: "Classic White T-Shirt", sales: 142, revenue: 3550, trend: -3 },
              { name: "Denim Skinny Jeans", sales: 128, revenue: 10240, trend: 5 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sales} sales</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">${item.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs">
                      {item.trend > 0 ? (
                        <>
                          <TrendingUpIcon className="size-3 text-green-500" />
                          <span className="text-green-500">+{item.trend}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDownIcon className="size-3 text-red-500" />
                          <span className="text-red-500">{item.trend}%</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
