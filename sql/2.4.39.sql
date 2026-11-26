ALTER TABLE documentos_pago
ADD COLUMN hashPdf CHAR(64) DEFAULT NULL,
ADD UNIQUE KEY uk_documentos_pago_hashPdf (hashPdf);

ALTER TABLE `notasweb`   
	ADD COLUMN `fechaCreacion` DATE NULL AFTER `tipo`,
	ADD COLUMN `fechaEdicion` DATE NULL AFTER `fechaCreacion`;

CREATE TABLE agente_ia_consumos (
    consumoId INT NOT NULL AUTO_INCREMENT,
    usuarioId INT DEFAULT NULL,
    fecha DATETIME NOT NULL,
    operacion VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    respuestaId VARCHAR(150) DEFAULT NULL,
    tokensEntrada INT NOT NULL DEFAULT 0,
    tokensCache INT NOT NULL DEFAULT 0,
    tokensSalida INT NOT NULL DEFAULT 0,
    tokensTotal INT NOT NULL DEFAULT 0,
    costeUsd DECIMAL(16,10) DEFAULT NULL,
    estado VARCHAR(30) DEFAULT NULL,
    PRIMARY KEY (consumoId),
    UNIQUE KEY uk_respuestaId (respuestaId),
    KEY idx_usuarioId (usuarioId),
    KEY idx_fecha (fecha),
    KEY idx_operacion (operacion)
) ENGINE=INNODB DEFAULT CHARSET=latin1;

CREATE TABLE agente_ia_tarifas (
    tarifaId INT NOT NULL AUTO_INCREMENT,
    modelo VARCHAR(100) NOT NULL,
    fechaDesde DATETIME NOT NULL,
    precioEntrada DECIMAL(12,6) NOT NULL,
    precioCache DECIMAL(12,6) DEFAULT NULL,
    precioSalida DECIMAL(12,6) NOT NULL,
    PRIMARY KEY (tarifaId),
    UNIQUE KEY uk_modelo_fecha (modelo, fechaDesde)
) ENGINE=INNODB DEFAULT CHARSET=latin1;

CREATE TABLE agente_ia_usuarios (
    usuarioId INT(11) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (usuarioId),
    CONSTRAINT fk_agente_ia_usuario
        FOREIGN KEY (usuarioId)
        REFERENCES usuarios (usuarioId)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;