"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { geminiGenerate } from "@/lib/gemini"
import { parseIntent, detectNavigation } from "@/lib/intent-parser"
import { parseChartRequest, generateChartData } from "@/lib/chart-data"
import { motion, AnimatePresence } from "framer-motion"
import { useStore, type ChatMessage } from "@/lib/store"
import { InventoryItem, dataService} from "@/lib/data-service"
import { X, Send, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  AreaChartComponent,
  RadarChartComponent,
} from "@/components/chart-components"

export function AiChatSidebar() {
  const aiChatOpen = useStore((state) => state.aiChatOpen)
  const setAiChatOpen = useStore((state) => state.setAiChatOpen)
  const chatMessages = useStore((state) => state.chatMessages)
  const addChatMessage = useStore((state) => state.addChatMessage)
  const clearChat = useStore((state) => state.clearChat)
  const setInventoryFilter = useStore((state) => state.setInventoryFilter)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, isTyping])

  const parseCommand = (
    message: string,
  ): { response: string; action?: () => void; chartType?: ChatMessage["chartType"] } => {
    const lowerMessage = message.toLowerCase()

    // Chart commands
    if (
      lowerMessage.includes("gráfica de barras") ||
      lowerMessage.includes("grafica de barras") ||
      lowerMessage.includes("bar chart") ||
      lowerMessage.includes("gráfico de barras")
    ) {
      return {
        response: "Aquí está la gráfica de barras con las ventas por categoría:",
        chartType: "bar",
      }
    }

    if (
      lowerMessage.includes("gráfica de pastel") ||
      lowerMessage.includes("grafica de pastel") ||
      lowerMessage.includes("pie chart") ||
      lowerMessage.includes("gráfico circular") ||
      lowerMessage.includes("grafico circular")
    ) {
      return {
        response: "Aquí está la gráfica de pastel mostrando las ventas por región:",
        chartType: "pie",
      }
    }

    if (
      lowerMessage.includes("gráfica de líneas") ||
      lowerMessage.includes("grafica de lineas") ||
      lowerMessage.includes("line chart") ||
      lowerMessage.includes("gráfico de líneas")
    ) {
      return {
        response: "Aquí está la gráfica de líneas con los ingresos mensuales:",
        chartType: "line",
      }
    }

    if (
      lowerMessage.includes("gráfica de área") ||
      lowerMessage.includes("grafica de area") ||
      lowerMessage.includes("area chart") ||
      lowerMessage.includes("gráfico de área")
    ) {
      return {
        response: "Aquí está la gráfica de área mostrando la tendencia de ingresos:",
        chartType: "area",
      }
    }

    if (
      lowerMessage.includes("gráfica radar") ||
      lowerMessage.includes("grafica radar") ||
      lowerMessage.includes("radar chart") ||
      lowerMessage.includes("gráfico radar")
    ) {
      return {
        response: "Aquí está la gráfica radar con las métricas de clientes:",
        chartType: "radar",
      }
    }

    // Inventory filter commands
    if (
      lowerMessage.includes("camisa") ||
      lowerMessage.includes("pantalon") ||
      lowerMessage.includes("pantalón") ||
      lowerMessage.includes("vestido") ||
      lowerMessage.includes("zapato") ||
      lowerMessage.includes("accesorio") ||
      lowerMessage.includes("xl") ||
      lowerMessage.includes("hombre") ||
      lowerMessage.includes("mujer") ||
      lowerMessage.includes("dress") ||
      lowerMessage.includes("shirt") ||
      lowerMessage.includes("pants")
    ) {
      return {
        response: `Perfecto, te muestro el inventario filtrado por "${message}".`,
        action: () => {
          setInventoryFilter(message)
          router.push("/dashboard/inventory")
        },
      }
    }

    // Navigation commands
    if (lowerMessage.includes("inventory") || lowerMessage.includes("inventario")) {
      return {
        response: "Perfecto, te llevo a la página de inventario.",
        action: () => {
          setInventoryFilter("")
          router.push("/dashboard/inventory")
        },
      }
    }

    if (
      lowerMessage.includes("analytics") ||
      lowerMessage.includes("analíticas") ||
      lowerMessage.includes("graficas") ||
      lowerMessage.includes("gráficas") ||
      lowerMessage.includes("charts")
    ) {
      return {
        response: "Claro, te muestro las analíticas y gráficas.",
        action: () => router.push("/dashboard/analytics"),
      }
    }

    if (lowerMessage.includes("dashboard") || lowerMessage.includes("inicio") || lowerMessage.includes("home")) {
      return {
        response: "Te llevo al dashboard principal.",
        action: () => router.push("/dashboard"),
      }
    }

    if (
      lowerMessage.includes("upload") ||
      lowerMessage.includes("subir") ||
      lowerMessage.includes("cargar") ||
      lowerMessage.includes("excel")
    ) {
      return {
        response: "Te dirijo a la página de carga de datos.",
        action: () => router.push("/dashboard/upload"),
      }
    }

    if (
      lowerMessage.includes("settings") ||
      lowerMessage.includes("configuración") ||
      lowerMessage.includes("ajustes")
    ) {
      return {
        response: "Abriendo la configuración.",
        action: () => router.push("/dashboard/settings"),
      }
    }

    // Help commands
    if (lowerMessage.includes("ayuda") || lowerMessage.includes("help") || lowerMessage === "?") {
      return {
        response:
          "Puedo ayudarte a:\n• Navegar: 'Muéstrame el inventario'\n• Mostrar gráficas: 'Genera la gráfica de barras'\n• Filtrar inventario: 'Camisa XL para hombre'\n• Y mucho más!",
      }
    }

    // Greeting
    if (
      lowerMessage.includes("hola") ||
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey")
    ) {
      return {
        response:
          "¡Hola! Soy tu asistente de Telar. Puedo mostrarte gráficas, filtrar inventario y ayudarte a navegar. ¿Qué necesitas?",
      }
    }

    // Default response
    return {
      response:
        "Puedo ayudarte a navegar, mostrar gráficas específicas o filtrar el inventario. Prueba decir 'muéstrame la gráfica de barras' o 'camisa XL'.",
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    addChatMessage(userMessage)
    setInput("")
    setIsTyping(true)

    try {
      // Usar Gemini para interpretar la solicitud
      const response = await geminiGenerate(input)

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "",
        timestamp: new Date()
      }

      // Procesar según el tipo de acción que devolvió Gemini
      switch (response.action) {
        

        case 'chat':
          console.log('Respuesta de chat recibida:', response.action)
          // Para chat normal, mostrar solo la respuesta en lenguaje natural
          assistantMessage.content = response.response || "No entendí tu solicitud"
          break

        case 'navigate':
          console.log('Navegación solicitada a:', response.destination)
          // Redirigir a la página solicitada y mostrar mensaje amigable
          assistantMessage.content = response.message || `Te llevo a ${response.destination}`
          addChatMessage(assistantMessage)  // Enviamos el mensaje primero
          router.push(`/dashboard/${response.destination}`)  // Navegamos inmediatamente sin setTimeout
          return  // Retornamos para evitar el addChatMessage del final

        case 'grafica':
          try {
            console.log('Procesando solicitud de gráfica:', response)
            // Generar datos para la gráfica
            const chartData = await generateChartData({
              type: response.type,
              metric: response.data.metric,
              groupBy: response.data.groupBy
            })
            
            // Mostrar la gráfica con mensaje amigable
            assistantMessage.content = response.message || "Aquí tienes la gráfica que solicitaste"
            assistantMessage.chartType = response.type
            assistantMessage.chartData = chartData
          } catch (err) {
            console.error('Error generando gráfica:', err)
            assistantMessage.content = "Lo siento, hubo un error generando la gráfica."
          }
          break

        case 'filter':
          console.log('Aplicando filtro de inventario:', response.category)
          // Aplicar filtros y mostrar mensaje amigable
          assistantMessage.content = response.message || `Filtrando por: ${response.category}`
          setInventoryFilter(response.category)
          setTimeout(() => {
            router.push('/dashboard/inventory')
          }, 500)
          break

        case 'reporte':
          console.log('Generando reporte de tipo:', response.type)
          // Mostrar reporte con mensaje amigable
          const reportData: InventoryItem[] = await dataService.generateReportData(response.type);
          const response2 = await geminiGenerate("generame un reporte basado en estos datos chat: " + JSON.stringify(reportData))
          console.log('Generando reporte de tipo:',response2.message)

          assistantMessage.content = response.message || "Aquí tienes el reporte solicitado"

          break

        default:
          // Para cualquier otra acción no reconocida
          assistantMessage.content = "No pude procesar tu solicitud. ¿Podrías reformularla?"
      }

      // Agregar el mensaje del asistente al chat
      addChatMessage(assistantMessage)

    } catch (error) {
      console.error("Error en handleSend:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error procesando tu solicitud.",
        timestamp: new Date(),
      }
      addChatMessage(errorMessage)
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderChart = (chartType: ChatMessage["chartType"]) => {
    switch (chartType) {
      case "bar":
        return <BarChartComponent />
      case "pie":
        return <PieChartComponent />
      case "line":
        return <LineChartComponent />
      case "area":
        return <AreaChartComponent />
      case "radar":
        return <RadarChartComponent />
      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {aiChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setAiChatOpen(false)}
          />

          {/* Chat Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-background border-l border-border z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="size-5 text-primary" />
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-md"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">AI Assistant</h2>
                  <p className="text-xs text-muted-foreground">Siempre listo para ayudar</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={clearChat} title="Limpiar chat">
                  <Trash2 className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setAiChatOpen(false)}>
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="relative">
                    <Sparkles className="size-12 text-primary/50" />
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">¡Hola! Soy tu asistente</h3>
                    <p className="text-sm text-muted-foreground max-w-[280px]">
                      Puedo mostrarte gráficas, filtrar inventario y ayudarte a navegar. Prueba decir "muéstrame la
                      gráfica de barras"
                    </p>
                  </div>
                </div>
              )}

              {chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} gap-2`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.chartType && message.role === "assistant" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="w-full"
                    >
                      {renderChart(message.chartType)}
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-foreground/40 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-foreground/40 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-foreground/40 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button onClick={handleSend} size="icon" className="rounded-full shrink-0">
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}