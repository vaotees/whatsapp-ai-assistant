const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0'
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!

export async function sendTextMessage(to: string, text: string) {
  const response = await fetch(`${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: text },
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
  }

  return response.json()
}

export function parseWebhookMessage(body: WhatsAppWebhookBody) {
  try {
    const entry = body.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const message = value?.messages?.[0]

    if (!message) return null

    return {
      from: message.from,
      messageId: message.id,
      text: message.type === 'text' ? message.text?.body : null,
      type: message.type,
      timestamp: message.timestamp,
    }
  } catch {
    return null
  }
}

export interface WhatsAppWebhookBody {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: { phone_number_id: string }
        messages?: Array<{
          from: string
          id: string
          type: string
          timestamp: string
          text?: { body: string }
        }>
      }
      field: string
    }>
  }>
}
