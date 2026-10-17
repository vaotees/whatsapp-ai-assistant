import Anthropic from '@anthropic-ai/sdk'
import { Message } from './db'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `Você é um assistente virtual da EM Soluções Digitais, especializada em Design e Web Design.

Seu papel é:
1. Responder dúvidas sobre os serviços oferecidos (criação de sites, identidade visual, design gráfico, etc.)
2. Qualificar leads de forma natural durante a conversa

Para qualificar um lead, colete gradualmente:
- Nome completo
- E-mail de contato
- Interesse principal (qual serviço deseja)

Regras importantes:
- Seja cordial, objetivo e profissional
- Não peça todos os dados de uma vez — colete naturalmente ao longo da conversa
- Quando tiver nome, email e interesse, encerre com uma mensagem confirmando que um especialista entrará em contato
- Responda sempre em português brasileiro
- Mensagens curtas e diretas (máximo 3 parágrafos)
- Nunca invente preços — diga que depende do projeto e que um especialista irá analisar

Quando identificar nome, email ou interesse do usuário na conversa, inclua no FINAL da sua resposta (invisível para o usuário) uma linha assim:
[LEAD_DATA: name="Nome" email="email@example.com" interest="Interesse identificado"]

Inclua apenas os campos que você tiver certeza. Exemplo:
[LEAD_DATA: name="Maria Souza"]
[LEAD_DATA: email="maria@example.com" interest="criação de site"]`

export async function processMessage(
  userMessage: string,
  history: Message[]
): Promise<{ reply: string; leadData: LeadData | null }> {
  const messages = [
    ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: userMessage },
  ]

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  })

  const fullText = response.content[0].type === 'text' ? response.content[0].text : ''

  // Extrai dados do lead se presentes
  const leadData = extractLeadData(fullText)

  // Remove a linha [LEAD_DATA: ...] da resposta enviada ao usuário
  const reply = fullText.replace(/\[LEAD_DATA:[^\]]*\]/g, '').trim()

  return { reply, leadData }
}

interface LeadData {
  name?: string
  email?: string
  interest?: string
}

function extractLeadData(text: string): LeadData | null {
  const match = text.match(/\[LEAD_DATA:([^\]]*)\]/)
  if (!match) return null

  const data: LeadData = {}
  const nameMatch = match[1].match(/name="([^"]*)"/)
  const emailMatch = match[1].match(/email="([^"]*)"/)
  const interestMatch = match[1].match(/interest="([^"]*)"/)

  if (nameMatch) data.name = nameMatch[1]
  if (emailMatch) data.email = emailMatch[1]
  if (interestMatch) data.interest = interestMatch[1]

  return Object.keys(data).length > 0 ? data : null
}
