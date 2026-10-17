export interface Lead {
  id: number
  phone: string
  name: string | null
  email: string | null
  interest: string | null
  status: 'novo' | 'qualificado' | 'perdido' | 'convertido'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
