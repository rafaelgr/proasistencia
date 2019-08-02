CREATE TABLE `audit_facturas` (
  `auditFacturasId` INT(11) NOT NULL AUTO_INCREMENT,
  `facturaId` INT(11) NOT NULL,
  `numFactu` VARCHAR(255) NOT NULL,
  `tipo` ENUM('NEW','EDIT','DELETE') NOT NULL,
  `procesado` TINYINT(1) NOT NULL DEFAULT '0',
  `cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`auditFacturasId`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;


CREATE TABLE `audit_facproves` (
  `auditFacprovesId` INT(11) NOT NULL AUTO_INCREMENT,
  `facproveId` INT(11) NOT NULL,
  `numFactu` VARCHAR(255) NOT NULL,
  `tipo` ENUM('NEW','EDIT','DELETE') NOT NULL,
  `procesado` TINYINT(1) NOT NULL DEFAULT '0',
  `cambio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`auditFacprovesId`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

DELIMITER $$

USE `proasistencia`$$



CREATE
    /*!50017 DEFINER = 'root'@'localhost' */
    TRIGGER `facprove_after_delete` BEFORE DELETE ON `facprove` 
    FOR EACH ROW BEGIN
	SET @tipo = 'DELETE';
	
	INSERT INTO audit_facproves (facproveId, numFactu,tipo) VALUES (OLD.facproveId, OLD.numeroFacturaProveedor,@tipo);
    END;
$$

DELIMITER ;


DELIMITER $$

USE `proasistencia`$$


CREATE
    /*!50017 DEFINER = 'root'@'localhost' */
    TRIGGER `facprove_after_update` AFTER UPDATE ON `facprove` 
    FOR EACH ROW BEGIN
	SET @tipo = 'EDIT';
	
	INSERT INTO audit_facproves (facproveId, numFactu,tipo) VALUES (NEW.facproveId, NEW.numeroFacturaProveedor,@tipo);
    END;
$$

DELIMITER ;

DELIMITER $$

USE `proasistencia`$$



CREATE
    /*!50017 DEFINER = 'root'@'localhost' */
    TRIGGER `facturas_after_delete` BEFORE DELETE ON `facturas` 
    FOR EACH ROW BEGIN
	SET @tipo = 'DELETE';
	SET @numfactu = (SELECT CONCAT(serie,"-" ,ano,"-" ,numero) FROM facturas WHERE facturaId = OLD.facturaId);
	INSERT INTO audit_facturas (facturaId, numFactu,tipo) VALUES (OLD.facturaId, @numfactu,@tipo);
    END;
$$

DELIMITER ;


DELIMITER $$

USE `proasistencia`$$



CREATE
    /*!50017 DEFINER = 'root'@'localhost' */
    TRIGGER `facturas_after_update` AFTER UPDATE ON `facturas` 
    FOR EACH ROW BEGIN
	SET @tipo = 'EDIT';
	SET @numfactu = (SELECT CONCAT(serie,"-" ,ano,"-" ,numero) FROM facturas WHERE facturaId = NEW.facturaId);
	INSERT INTO audit_facturas (facturaId, numFactu,tipo) VALUES (NEW.facturaId, @numfactu,@tipo);
    END;
$$

DELIMITER ;




ALTER TABLE `partes_lineas`   
  ADD COLUMN `facturaLineaId` INT(11) NULL AFTER `totalProveedorIva`,
  ADD COLUMN `facproveLineaId` INT(11) NULL AFTER `facturaLineaId`,
  ADD CONSTRAINT `lineas_parte_factura` FOREIGN KEY (`facturaLineaId`) REFERENCES `facturas_lineas`(`facturaLineaId`) ON UPDATE CASCADE ON DELETE SET NULL,
  ADD CONSTRAINT `lineas_parte_facprove` FOREIGN KEY (`facproveLineaId`) REFERENCES `facprove_lineas`(`facproveLineaId`) ON UPDATE CASCADE  ON DELETE SET NULL;

ALTER TABLE `partes`   
  ADD COLUMN `empresaParteId` INT(11) NULL AFTER `facproveId`;

  ALTER TABLE `partes`  
  ADD CONSTRAINT `ref_parte_empresa` FOREIGN KEY (`empresaParteId`) REFERENCES `empresas`(`empresaId`);



UPDATE servicios AS ser 
LEFT JOIN partes AS par ON par.servicioId = ser.servicioId

SET par.empresaParteId = ser.empresaId

WHERE ser.empresaId IN

(SELECT tmp.empresaId FROM  (SELECT ser.empresaId AS empresaId FROM servicios AS ser 
LEFT JOIN partes AS par ON par.servicioId = ser.servicioId) AS tmp);
