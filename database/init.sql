CREATE TABLE IF NOT EXISTS servicios (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(80)  NOT NULL UNIQUE,
    descripcion  VARCHAR(200),
    precio       INT          NOT NULL,                 -- pesos colombianos
    duracion_min INT          NOT NULL DEFAULT 30,
    activo       BOOLEAN      NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS barberos (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(80)  NOT NULL,
    telefono     VARCHAR(20),
    especialidad VARCHAR(100),
    activo       BOOLEAN      NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS usuarios (                  -- cuentas del personal
    id            INT AUTO_INCREMENT PRIMARY KEY,
    usuario       VARCHAR(50)  NOT NULL UNIQUE,
    password_hash VARCHAR(200) NOT NULL,
    rol           VARCHAR(20)  NOT NULL,               -- admin | barbero
    id_barbero    INT NULL,
    FOREIGN KEY (id_barbero) REFERENCES barberos(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clientes (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    nombre   VARCHAR(80)  NOT NULL,
    telefono VARCHAR(20)  NOT NULL UNIQUE,
    email    VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS citas (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente  INT      NOT NULL,
    id_barbero  INT      NOT NULL,
    id_servicio INT      NOT NULL,
    inicio      DATETIME NOT NULL,
    fin         DATETIME NOT NULL,
    estado      VARCHAR(20) NOT NULL DEFAULT 'pendiente',  -- pendiente | confirmada | completada | cancelada
    notas       VARCHAR(200),
    creada      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente)  REFERENCES clientes(id),
    FOREIGN KEY (id_barbero)  REFERENCES barberos(id),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id),
    INDEX idx_citas_barbero (id_barbero),
    INDEX idx_citas_inicio (inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales (solo se insertan si las tablas están vacías)
INSERT INTO servicios (nombre, descripcion, precio, duracion_min)
SELECT * FROM (
    SELECT 'Corte clásico' AS nombre, 'Corte a tijera o máquina con acabado a navaja' AS descripcion, 25000 AS precio, 30 AS duracion_min
    UNION ALL SELECT 'Barba', 'Perfilado y arreglo de barba con toalla caliente', 20000, 30
    UNION ALL SELECT 'Corte + barba', 'Combo completo de corte y barba', 40000, 60
    UNION ALL SELECT 'Corte niño', 'Para menores de 12 años', 18000, 30
    UNION ALL SELECT 'Afeitado clásico', 'Afeitado con navaja y toalla caliente', 22000, 30
) AS nuevos
WHERE NOT EXISTS (SELECT 1 FROM servicios);

INSERT INTO barberos (nombre, especialidad)
SELECT * FROM (
    SELECT 'Carlos' AS nombre, 'Fade y cortes modernos' AS especialidad
    UNION ALL SELECT 'Andrés', 'Barba y afeitado clásico'
    UNION ALL SELECT 'Miguel', 'Cortes clásicos y niños'
) AS nuevos
WHERE NOT EXISTS (SELECT 1 FROM barberos);
