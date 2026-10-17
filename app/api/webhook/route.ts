import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { parseWebhookMessage, sendTextMessage, WhatsAppWebhookBody } from '@/lib/whatsapp'
import { processMessage } from '@/lib/claude'
import { getConversationHistory, saveMessage, upsertLead } from '@/lib/db'

// GET — verificação do webhook pelo Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }

  return new NextResponse('Forbidden', { status: 403 })
}

// Confere a assinatura X-Hub-Signature-256 (HMAC-SHA256 do corpo com o App Secret da Meta)
function hasValidSignature(rawBody: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret || !header?.startsWith('sha256=')) return false
  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'))
  const given = Buffer.from(header.slice('sha256='.length))
  return given.length === expected.length && timingSafeEqual(given, expected)
}

// POST — recebe mensagens do WhatsApp
export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  if (!hasValidSignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    return new NextResponse('Invalid signature', { status: 401 })
  }

  try {
    const body: WhatsAppWebhookBody = JSON.parse(rawBody)

    // Confirma recebimento imediatamente (Meta exige resposta < 20s)
    const message = parseWebhookMessage(body)
    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok' })
    }

    const { from, text } = message

    // Busca histórico da conversa
    const history = await getConversationHistory(from)

    // Salva mensagem do usuário
    await saveMessage(from, 'user', text)

    // Processa com Claude
    const { reply, leadData } = await processMessage(text, history)

    // Salva resposta do assistente
    await saveMessage(from, 'assistant', reply)

    // Atualiza dados do lead se identificados
    if (leadData && Object.keys(leadData).length > 0) {
      await upsertLead(from, {
        ...leadData,
        status: leadData.email && leadData.name ? 'qualificado' : 'novo',
      })
    } else {
      // Garante que o lead existe mesmo sem dados coletados ainda
      await upsertLead(from, { status: 'novo' })
    }

    // Envia resposta via WhatsApp
    await sendTextMessage(from, reply)

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    // Retorna 200 para evitar reenvios do Meta
    return NextResponse.json({ status: 'ok' })
  }
}
