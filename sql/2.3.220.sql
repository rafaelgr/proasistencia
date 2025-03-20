//CAPITULOS TECNICOS

ALTER TABLE `grupo_articulo`   
	ADD COLUMN `esTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `departamentoId`;

ALTER TABLE `grupo_articulo`   
	ADD COLUMN `aplicarFormula` TINYINT(1) DEFAULT 0 NULL AFTER `esTecnico`,
	ADD COLUMN `limiteImpObra` DECIMAL(12,2) NULL AFTER `aplicarFormula`,
	ADD COLUMN `porcen1` DECIMAL(12,2) NULL AFTER `limiteImpObra`,
	ADD COLUMN `porcen2` DECIMAL(12,2) NULL AFTER `porcen1`,
	ADD COLUMN `porcen3` DECIMAL(12,2) NULL AFTER `porcen2`,
	ADD COLUMN `porcen4` DECIMAL(12,2) NULL AFTER `porcen3`;

  ALTER TABLE `grupo_articulo`   
	CHANGE `limiteImpObra` `limiteImpObra` DECIMAL(12,2) DEFAULT 0 NULL,
	CHANGE `porcen1` `porcen1` DECIMAL(12,2) DEFAULT 0 NULL,
	CHANGE `porcen2` `porcen2` DECIMAL(12,2) DEFAULT 0 NULL,
	CHANGE `porcen3` `porcen3` DECIMAL(12,2) DEFAULT 0 NULL,
	CHANGE `porcen4` `porcen4` DECIMAL(12,2) DEFAULT 0 NULL;


ALTER TABLE `parametros`   
	ADD COLUMN `indiceCorrector` DECIMAL(12,2) NULL AFTER `raiz_url_server`;


INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, esTecnico )
VALUES
(
    0,'CERTIFICADOS TÉCNICOS', 5, 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId, esTecnico )
VALUES
(
    0,'Dirección facultativa', 5, 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId , esTecnico )
VALUES
(
    0,'CERTIFICADO EFICIENCIA ENERGÉTICA', 5, 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId , esTecnico )
VALUES
(
    0,'ORGANISMO DE CONTROL AUTORIZADO', 5, 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId , esTecnico )
VALUES
(
    0,'Proyectos y memorias', 5, 1
);

INSERT INTO grupo_articulo( grupoArticuloId,nombre, departamentoId , esTecnico )
VALUES
(
    0,'TRAMITACIÓN DE LICENCIAS', 5, 1
);

CREATE TABLE `estados_expediente` (  
  `estadoExpedienteId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`estadoExpedienteId`) 
);
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Solicitud');
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Estudio'); 
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Enviado');
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Adjudicado'); 
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Iniciado'); 
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Finalizado'); 
INSERT INTO `estados_expediente` (`nombre`) VALUES ('Denegado'); 

CREATE TABLE `expedientes` (  
  `expedienteId` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255),
  `referencia` VARCHAR(255),
  `fecha` DATE,
  `empresaId` INT(11),
  `clienteId` INT(11),
  `estadoExpedienteId` INT(11),
  `direccion` VARCHAR(255),
  `direccionTrabajo` VARCHAR(255),
  `departamentoId` INT(11),
  `contacto` VARCHAR(255),
  `observaciones` TEXT,
  `agenteId` INT(11),
  `comercialId` INT(11),
  `jefeGrupoId` INT(11),
  `jefeObrasId` INT(11),
  `oficinaTecnicaId` INT(11),
  `asesorTecnicoId` INT(11),
  PRIMARY KEY (`expedienteId`) ,
  CONSTRAINT `exp_empresaFK` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`),
  CONSTRAINT `exp_clienteFK` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`clienteId`),
  CONSTRAINT `exp_depatamentoFK` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`),
  CONSTRAINT `exp_agenteFK` FOREIGN KEY (`agenteId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `exp_comercialFK` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `exp_tecnicoFK` FOREIGN KEY (`asesorTecnicoId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `exp_jefeGrupoFK` FOREIGN KEY (`jefeGrupoId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `exp_jefeObrasFK` FOREIGN KEY (`jefeObrasId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `exp_oficinaTecnicaFK` FOREIGN KEY (`oficinaTecnicaId`) REFERENCES `comerciales`(`comercialId`),
  CONSTRAINT `exp_estadoFK` FOREIGN KEY (`estadoExpedienteId`) REFERENCES `estados_expediente`(`estadoExpedienteId`)
);


ALTER TABLE `expedientes`   
	ADD COLUMN `tipoViaId` INT(11) NULL AFTER `referencia`,
	CHANGE `direccion` `direccion` VARCHAR(255) CHARSET latin1 COLLATE latin1_swedish_ci NULL  AFTER `tipoViaId`,
	ADD COLUMN `poblacion` VARCHAR(255) NULL AFTER `direccion`,
	ADD COLUMN `provincia` VARCHAR(255) NULL AFTER `poblacion`,
	ADD COLUMN `codPostal` VARCHAR(255) NULL AFTER `provincia`,
  ADD CONSTRAINT `exp_tipoViaFK` FOREIGN KEY (`tipoViaId`) REFERENCES `tipos_via`(`tipoViaId`);

  ALTER TABLE `expedientes`   
	ADD COLUMN `tipoProyectoId` INT(11) NULL AFTER `asesorTecnicoId`;

  ALTER TABLE `expedientes`  
  ADD CONSTRAINT `exp_tipoProyectoFK` FOREIGN KEY (`tipoProyectoId`) REFERENCES `proasistencia`.`tipos_proyecto`(`tipoProyectoId`);

  ALTER TABLE `expedientes`   
	ADD COLUMN `importeObra` DECIMAL(12,2) NULL AFTER `tipoProyectoId`;




  ALTER TABLE `ofertas`   
	ADD COLUMN `expedienteId` INT(11) NULL AFTER `beneficioLineal`,
  ADD CONSTRAINT `of_expediente` FOREIGN KEY (`expedienteId`) REFERENCES  `expedientes`(`expedienteId`);

  ALTER TABLE `ofertas`   
	ADD COLUMN `esCoste` TINYINT(1) DEFAULT 0 NULL AFTER `expedienteId`;

  ALTER TABLE ofertas 
  ADD COLUMN `comercialId` INT(11) AFTER esCoste,
  ADD COLUMN  `jefeGrupoId` INT(11) AFTER comercialId,
  ADD COLUMN `jefeObrasId` INT(11) AFTER jefeGrupoId,
  ADD COLUMN  `oficinaTecnicaId` INT(11) AFTER jefeObrasId,
  ADD COLUMN  `asesorTecnicoId` INT(11) AFTER oficinaTecnicaId,
  ADD CONSTRAINT `of_comercialFK` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`),
  ADD CONSTRAINT `of_tecnicoFK` FOREIGN KEY (`asesorTecnicoId`) REFERENCES `comerciales`(`comercialId`),
  ADD CONSTRAINT `of_jefeGrupoFK` FOREIGN KEY (`jefeGrupoId`) REFERENCES `comerciales`(`comercialId`),
  ADD CONSTRAINT `of_jefeObrasFK` FOREIGN KEY (`jefeObrasId`) REFERENCES `comerciales`(`comercialId`),
  ADD CONSTRAINT `of_oficinaTecnicaFK` FOREIGN KEY (`oficinaTecnicaId`) REFERENCES `comerciales`(`comercialId`);

  ALTER TABLE `ofertas`   
	ADD COLUMN `valorado` TINYINT(1) DEFAULT 0 NULL AFTER `asesorTecnicoId`;

  ALTER TABLE `tipos_proyecto`   
	ADD COLUMN `esTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `visibleApp`;


INSERT INTO tipos_proyecto( tipoProyectoId,nombre, tipoMantenimientoId, abrev, esTecnico, visibleApp, activo)
VALUES
(
    0,'CERTIFICADOS TÉCNICOS',5, 'CT', 1, 0, 1
);

INSERT INTO tipos_proyecto( tipoProyectoId,nombre, tipoMantenimientoId, abrev, esTecnico, visibleApp, activo)
VALUES
(
    0,'Dirección facultativa', 5, 'DF', 1, 0, 1
);

INSERT INTO tipos_proyecto( tipoProyectoId,nombre, tipoMantenimientoId, abrev , esTecnico, visibleApp, activo)
VALUES
(
    0,'CERTIFICADO EFICIENCIA ENERGÉTICA', 5, 'INF', 1, 0, 1
);

INSERT INTO tipos_proyecto( tipoProyectoId,nombre, tipoMantenimientoId, abrev , esTecnico, visibleApp, activo )
VALUES
(
    0,'ORGANISMO DE CONTROL AUTORIZADO', 5, 'OCA', 1, 0, 1
);

INSERT INTO tipos_proyecto( tipoProyectoId,nombre, tipoMantenimientoId, abrev , esTecnico, visibleApp, activo)
VALUES
(
    0,'Proyectos y memorias', 5,'PYT', 1, 0, 1
);

INSERT INTO tipos_proyecto( tipoProyectoId,nombre, tipoMantenimientoId, abrev , esTecnico, visibleApp, activo )
VALUES
(
    0,'TRAMITACIÓN DE LICENCIAS', 5, 'TL', 1, 0, 1
);


ALTER TABLE `grupo_articulo`   
	ADD COLUMN `tipoProyectoId` INT(11) NULL AFTER `departamentoId`,
  ADD CONSTRAINT `capitulos_tipo_proyectoFK` FOREIGN KEY (`tipoProyectoId`) REFERENCES `proasistencia`.`tipos_proyecto`(`tipoProyectoId`);

UPDATE grupo_articulo AS g
INNER JOIN tipos_proyecto  AS t ON t.nombre = g.nombre
SET g.tipoProyectoId = t.tipoProyectoId
WHERE t.esTecnico = 1;

#EN ESTE PUNTO EJECUTAR 2.3.220_insert_articulos_tecnicos.sql

UPDATE articulos AS a
INNER JOIN tipos_proyecto AS t ON t.abrev = a.codigoBarras
LEFT JOIN grupo_articulo AS g ON g.tipoProyectoId = t.tipoProyectoId
SET a.grupoArticuloId = g.grupoArticuloId
WHERE NOT g.grupoArticuloId IS NULL 


ALTER TABLE `articulos`   
	ADD COLUMN `esTecnico` TINYINT(1) DEFAULT 0 NULL AFTER `administracion`;

UPDATE articulos 
SET esTecnico = 1
WHERE NOT codigoBarras IS NULL AND codigoBarras <> '';

ALTER TABLE `grupo_articulo`   
	ADD COLUMN `aplicarFormula` TINYINT(1) DEFAULT 0 NULL AFTER `esTecnico`,
	ADD COLUMN `limiteImpObra` DECIMAL(12,2) NULL AFTER `aplicarFormula`,
	ADD COLUMN `porcen1` DECIMAL(12,2) NULL AFTER `limiteImpObra`,
	ADD COLUMN `porcen2` DECIMAL(12,2) NULL AFTER `porcen1`,
	ADD COLUMN `porcen3` DECIMAL(12,2) NULL AFTER `porcen2`,
	ADD COLUMN `porcen4` DECIMAL(12,2) NULL AFTER `porcen3`;

