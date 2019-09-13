ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `colaboradorId` INT(11) NULL AFTER `tarifaId`,
  ADD CONSTRAINT `ref_cliente_colaborador` FOREIGN KEY (`colaboradorId`) REFERENCES `proasistencia`.`comerciales`(`comercialId`);


UPDATE clientes AS cli
INNER JOIN clientes_comisionistas AS cc ON cc.clienteId = cli.clienteId
SET cli.colaboradorId = cc.comercialId 

DROP TABLE IF EXISTS `agentes_colaboradores`;

CREATE TABLE `agentes_colaboradores` (
  `agenteColaboradorId` int(11) NOT NULL auto_increment,
  `agenteId` int(11) default NULL,
  `colaboradorId` int(11) default NULL,
  `fechaCambio` date default NULL,
  PRIMARY KEY  (`agenteColaboradorId`),
  KEY `agente_comercialFK` (`agenteId`),
  KEY `colaboradorFK` (`colaboradorId`),
  CONSTRAINT `agente_comercialFK` FOREIGN KEY (`agenteId`) REFERENCES `comerciales` (`comercialId`),
  CONSTRAINT `colaboradorFK` FOREIGN KEY (`colaboradorId`) REFERENCES `comerciales` (`comercialId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `clientes`   
  ADD COLUMN `tipoIvaId` INT(11) NULL AFTER `colaboradorId`,
  ADD CONSTRAINT `ref_cliente_tipoIva` FOREIGN KEY (`tipoIvaId`) REFERENCES `tipos_iva`(`tipoIvaId`);


ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `facturarPorEmail` TINYINT(1) DEFAULT 1 NULL AFTER `tipoIvaId`;

  ALTER TABLE `clientes`   
  ADD COLUMN `limiteCredito` DECIMAL(12,2) NULL AFTER `facturarPorEmail`;

  ALTER TABLE `clientes` DROP FOREIGN KEY `ref_cliente_colaborador`;

ALTER TABLE `clientes` ADD CONSTRAINT `ref_cliente_colaborador` FOREIGN KEY (`colaboradorId`) REFERENCES `comerciales`(`comercialId`) ON UPDATE CASCADE ON DELETE NO ACTION;
