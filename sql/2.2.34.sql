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

DROP TRIGGER /*!50032 IF EXISTS */ `facprove_after_delete`$$

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

DROP TRIGGER /*!50032 IF EXISTS */ `facprove_after_update`$$

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

DROP TRIGGER /*!50032 IF EXISTS */ `facturas_after_delete`$$

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

DROP TRIGGER /*!50032 IF EXISTS */ `facturas_after_update`$$

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




