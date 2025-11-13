-- Criar tabela para armazenar sugestões dos clientes
CREATE TABLE public.suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer pessoa insira sugestões
CREATE POLICY "Qualquer pessoa pode enviar sugestões"
ON public.suggestions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política para permitir leitura apenas por usuários autenticados (admins futuros)
CREATE POLICY "Apenas autenticados podem ver sugestões"
ON public.suggestions
FOR SELECT
TO authenticated
USING (true);

-- Criar índice para melhor performance nas consultas por data
CREATE INDEX idx_suggestions_created_at ON public.suggestions(created_at DESC);