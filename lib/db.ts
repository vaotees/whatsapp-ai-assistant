import { neon } from '@neondatabase/serverless'
import { Lead, Message } from './types'

export type { Lead, Message }

const sql = neon(process.env.DATABASE_URL!)

export async function getConversationHistory(phone: string, limit = 20): Promise<Message[]> {
  const rows = await sql`
    SELECT role, content FROM whatsapp.conversations
    WHERE phone = ${phone}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `
  return (rows as Message[]).reverse()
}

export async function saveMessage(phone: string, role: 'user' | 'assistant', content: string) {
  await sql`
    INSERT INTO whatsapp.conversations (phone, role, content)
    VALUES (${phone}, ${role}, ${content})
  `
}

export async function getLead(phone: string): Promise<Lead | null> {
  const rows = await sql`
    SELECT * FROM whatsapp.leads WHERE phone = ${phone}
  `
  return (rows[0] as Lead) || null
}

export async function upsertLead(phone: string, data: Partial<Lead>) {
  const { name, email, interest, status, notes } = data
  await sql`
    INSERT INTO whatsapp.leads (phone, name, email, interest, status, notes)
    VALUES (${phone}, ${name ?? null}, ${email ?? null}, ${interest ?? null}, ${status ?? 'novo'}, ${notes ?? null})
    ON CONFLICT (phone) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, leads.name),
      email = COALESCE(EXCLUDED.email, leads.email),
      interest = COALESCE(EXCLUDED.interest, leads.interest),
      status = COALESCE(EXCLUDED.status, leads.status),
      notes = COALESCE(EXCLUDED.notes, leads.notes),
      updated_at = NOW()
  `
}

export async function getAllLeads(): Promise<Lead[]> {
  const rows = await sql`
    SELECT * FROM whatsapp.leads ORDER BY created_at DESC
  `
  return rows as Lead[]
}
