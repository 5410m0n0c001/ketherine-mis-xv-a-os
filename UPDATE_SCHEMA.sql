-- 1. Crear la tabla de invitados avanzada
CREATE TABLE IF NOT EXISTS guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  guest_group TEXT, -- Familia / Grupo
  status TEXT DEFAULT 'pendiente', -- 'confirmado', 'pendiente', 'cancelado'
  adults INTEGER DEFAULT 0,
  kids INTEGER DEFAULT 0,
  total_guests INTEGER DEFAULT 0,
  passes_assigned INTEGER DEFAULT 0,
  passes_used INTEGER DEFAULT 0,
  table_number TEXT,
  dietary_restrictions TEXT,
  phone TEXT,
  invite_url TEXT,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Habilitar Seguridad de Nivel de Fila (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- 3. Crear políticas de acceso (Ajustar según necesidad de seguridad)
-- Para este proyecto, permitiremos acceso total para simplificar la administración.
CREATE POLICY "Acceso público total" ON guests FOR ALL USING (true) WITH CHECK (true);

-- 4. Opcional: Crear un índice para búsquedas rápidas por nombre
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests (name);
