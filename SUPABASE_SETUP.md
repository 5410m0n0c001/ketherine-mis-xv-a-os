# Configuración de Supabase para Invitaciones XV Años

Sigue estos pasos para conectar tu aplicación con Supabase y habilitar el sistema de boletos con QR.

## 1. Crear la Tabla en Supabase

Accede al **SQL Editor** en tu panel de Supabase y ejecuta el siguiente script:

```sql
-- Crear la tabla de invitados
CREATE TABLE invitados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT now(),
  estado TEXT DEFAULT 'pendiente'
);

-- Habilitar acceso público (Solo para lectura/escritura básica)
-- NOTA: En un entorno real, deberías configurar políticas RLS más estrictas.
ALTER TABLE invitados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserción pública" 
ON invitados FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir lectura pública por ID" 
ON invitados FOR SELECT 
USING (true);
```

## 2. Obtener Credenciales API

1. Ve a **Project Settings** -> **API**.
2. Copia la `Project URL`.
3. Copia la `anon` key.

## 4. Configurar en el Código

Abre el archivo `js/script.js` y busca las líneas:

```javascript
const SUPABASE_URL = 'TU_SUPABASE_URL'; 
const SUPABASE_ANON_KEY = 'TU_SUPABASE_ANON_KEY';
```

Reemplaza los valores con tus credenciales reales.

## 5. Cómo usar el Panel de Admin

1. Abre tu invitación en el navegador.
2. Haz **clic 5 veces seguidas** sobre el nombre de **"Katherine"** en la portada (Hero section).
3. Se abrirá el formulario para ingresar el nombre del invitado y la cantidad de pases.
4. Al guardar, se generará el boleto con QR automáticamente.
5. Puedes enviar el enlace generado (ej. `index.html?id=...`) a tus invitados para que vean su boleto personalizado.
