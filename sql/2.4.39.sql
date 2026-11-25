ALTER TABLE documentos_pago
ADD COLUMN hashPdf CHAR(64) DEFAULT NULL,
ADD UNIQUE KEY uk_documentos_pago_hashPdf (hashPdf);

ALTER TABLE `notasweb`   
	ADD COLUMN `fechaCreacion` DATE NULL AFTER `tipo`,
	ADD COLUMN `fechaEdicion` DATE NULL AFTER `fechaCreacion`;
