import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"
import { dataService } from "./data-service"
import { 
  GeminiActionResponse, 
  SYSTEM_PROMPT,
  NavigationResponse,
  ChartResponse,
  ReportResponse,
  FilterResponse,
  ChatResponse
} from "./gemini-types"

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(API_KEY)
let model: GenerativeModel

async function initModel() {
  if (!model) {
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    await model.generateContent(SYSTEM_PROMPT)
  }
  return model
}

export async function geminiGenerate(prompt: string): Promise<GeminiActionResponse> {
  try {
    // Inicializar el modelo si no está inicializado
    const model = await initModel()
    
    // Enviar el prompt con el contexto del sistema
    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: prompt }
    ])
    
    // Intentar parsear la respuesta como JSON
    const responseText = result.response.text()
    try {
      const response = JSON.parse(responseText) as GeminiActionResponse

      // Si es una acción que requiere datos
      if (response.action === 'grafica' || response.action === 'reporte') {
        const data = await dataService.generateReportData(
          response.action === 'grafica' ? response.data.metric : response.type
        )
        
        // Generar un análisis más detallado con los datos
        const analysisPrompt = `
        Analiza estos datos y actualiza tu respuesta:
        ${JSON.stringify(data, null, 2)}
        
        Mantén el mismo formato JSON pero incluye análisis relevantes en el mensaje.
        `
        
        const analysisResult = await model.generateContent(analysisPrompt)
        const updatedResponse = JSON.parse(analysisResult.response.text()) as GeminiActionResponse
        return updatedResponse
      }

      return response
    } catch (parseError) {
      // Si no se puede parsear como JSON, devolver como chat
      return {
        action: 'chat',
        response: responseText,
        message: responseText.slice(0, 100) + '...'
      }
    }
  } catch (err) {
    console.error("Error en geminiGenerate:", err)
    return {
      action: 'chat',
      response: "Lo siento, hubo un error procesando tu solicitud.",
      message: "Error de procesamiento"
    }
  }
}
