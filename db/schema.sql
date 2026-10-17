-- Schema isolado para o bot WhatsApp
CREATE SCHEMA IF NOT EXISTS whatsapp;

-- Tabela de leads qualificados
CREATE TABLE IF NOT EXISTS whatsapp.leads (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255),
  interest TEXT,
  status VARCHAR(50) DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'perdido', 'convertido')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de conversa
CREATE TABLE IF NOT EXISTS whatsapp.conversations (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por telefone
CREATE INDEX IF NOT EXISTS idx_conversations_phone ON whatsapp.conversations(phone);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON whatsapp.leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_status ON whatsapp.leads(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION whatsapp.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON whatsapp.leads
  FOR EACH ROW
  EXECUTE FUNCTION whatsapp.update_updated_at_column();
