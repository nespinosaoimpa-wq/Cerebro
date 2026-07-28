-- =====================================================================
-- ESQUEMA DE BASE DE DATOS POSTGRESQL PARA CEREBRO AC (SUPABASE)
-- Copia y ejecuta este script en el SQL Editor de tu proyecto Supabase.
-- =====================================================================

-- 1. TABLA DE OBJETIVOS / SOSPECHOSOS
CREATE TABLE IF NOT EXISTS suspects (
    id TEXT PRIMARY KEY,
    code_name TEXT NOT NULL,
    real_name TEXT NOT NULL,
    dni TEXT UNIQUE,
    cuit TEXT,
    dob TEXT,
    risk_level INT DEFAULT 50,
    recidivism_risk TEXT DEFAULT 'moderate',
    status TEXT DEFAULT 'Wanted',
    last_seen TEXT,
    image TEXT,
    affiliations JSONB DEFAULT '[]'::jsonb,
    addresses JSONB DEFAULT '[]'::jsonb,
    phones JSONB DEFAULT '[]'::jsonb,
    judicial_records JSONB DEFAULT '[]'::jsonb,
    family JSONB DEFAULT '[]'::jsonb,
    assets JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA DE TRANSACCIONES FINANCIERAS
CREATE TABLE IF NOT EXISTS financial_transactions (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    origin_account TEXT NOT NULL,
    origin_entity TEXT NOT NULL,
    destination_account TEXT NOT NULL,
    destination_entity TEXT NOT NULL,
    amount_ars NUMERIC DEFAULT 0,
    amount_usd NUMERIC DEFAULT 0,
    channel TEXT NOT NULL,
    suspicious_flag TEXT,
    risk_score INT DEFAULT 50,
    case_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA DE CUENTAS BANCARIAS Y CRIPTO
CREATE TABLE IF NOT EXISTS bank_accounts (
    id TEXT PRIMARY KEY,
    cbu_cvu TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    holder_cuit TEXT NOT NULL,
    linked_suspect_id TEXT REFERENCES suspects(id) ON DELETE SET NULL,
    balance_ars NUMERIC DEFAULT 0,
    balance_usd NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Activa',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA DE EMPRESAS FANTASMA / SOCIEDADES PANTALLA
CREATE TABLE IF NOT EXISTS shell_companies (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    cuit TEXT UNIQUE NOT NULL,
    legal_address TEXT,
    activity TEXT,
    registration_date TEXT,
    suspected_frontman TEXT,
    linked_suspect_ids JSONB DEFAULT '[]'::jsonb,
    total_movement_usd NUMERIC DEFAULT 0,
    risk_rating TEXT DEFAULT 'Media',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA DE PROYECTOS Y OPERACIONES
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    last_update TEXT,
    members JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT,
    progress INT DEFAULT 0,
    entity_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HABILITAR POLITICAS DE LECTURA Y ESCRITURA PUBLICA (DESARROLLO)
ALTER TABLE suspects ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shell_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a usuarios anonimos en suspects" ON suspects FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios anonimos en financial_transactions" ON financial_transactions FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios anonimos en bank_accounts" ON bank_accounts FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios anonimos en shell_companies" ON shell_companies FOR ALL USING (true);
CREATE POLICY "Permitir todo a usuarios anonimos en projects" ON projects FOR ALL USING (true);

-- 7. DATOS DE PRUEBA INICIALES (SEED DATA)
INSERT INTO suspects (id, code_name, real_name, dni, cuit, dob, risk_level, recidivism_risk, status, last_seen, image, affiliations)
VALUES 
('s1', 'CHAVO', 'GONZALEZ IGNACIO LEONEL', '42332598', '20-42332598-5', '22/10/1994', 98, 'imminent', 'Wanted', 'Barrio Fonavi San Jeronimo', 'https://i.pravatar.cc/150?u=chavo123', '["Banda de los Fonavi", "Colón La Negrada"]'::jsonb),
('s2', 'VIPER', 'Viktor K.', '39128374', '20-39128374-2', '15/03/1990', 95, 'high', 'Wanted', 'Rosario, SF', 'https://i.pravatar.cc/150?u=viper', '["Los Monos", "Cartel del Norte"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

INSERT INTO financial_transactions (id, date, origin_account, origin_entity, destination_account, destination_entity, amount_ars, amount_usd, channel, suspicious_flag, risk_score, case_id)
VALUES
('tx-001', '2026-07-24 14:32', '0170044520000003412984 (Mercado Pago)', 'GONZALEZ IGNACIO LEONEL (CHAVO)', '0720119288000001248721 (Santander)', 'AGROLOGISTICA DEL LITORAL S.R.L.', 14500000, 11600, 'Transferencia CBU/CVU', 'Incremento Injustificado', 92, 'p1'),
('tx-002', '2026-07-25 09:15', 'Wallet USDT (0x71C...4F9a)', 'DESCONOCIDO-22', 'Wallet USDT (0x99A...12B9)', 'Viktor K. (VIPER)', 42500000, 34000, 'Cripto USDT', 'Triangulación Offshore', 98, 'p2')
ON CONFLICT (id) DO NOTHING;
