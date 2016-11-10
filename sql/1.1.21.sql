CREATE TABLE `proasistencia`.`motivos_baja`(  
  `motivoBajaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`motivoBajaId`)
);

ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `motivoBajaId` INT(11) NULL AFTER `tipoViaId2`,
  ADD CONSTRAINT `ref_cliente_motivos` FOREIGN KEY (`motivoBajaId`) REFERENCES `proasistencia`.`motivos_baja`(`motivoBajaId`);
