//CAPITULOS TECNICOS

ALTER TABLE `grupo_articulo`   
	ADD COLUMN `referencia` VARCHAR(255) NULL AFTER `departamentoId`,
	ADD COLUMN `esTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `referencia`;


INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, referencia, esTecnico )
VALUES
(
    0,'CERTIFICADOS TÉCNICOS',5, 'CE', 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, referencia, esTecnico )
VALUES
(
    0,'Dirección facultativa', 5, 'DF', 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, referencia , esTecnico )
VALUES
(
    0,'CERTIFICADO EFICIENCIA ENERGÉTICA', 5, 'CEE', 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, referencia , esTecnico )
VALUES
(
    0,'ORGANISMO DE CONTROL AUTORIZADO', 5, 'OCA', 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, referencia , esTecnico )
VALUES
(
    0,'Proyectos y memorias', 5,'PYT', 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, referencia , esTecnico )
VALUES
(
    0,'TRAMITACIÓN DE LICENCIAS', 5, 'TL', 1
);

