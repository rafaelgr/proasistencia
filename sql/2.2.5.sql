#EJECUTAR EL SCRIPT  antprove_tables.sql PARA LA CREACIÓN DE LAS TABLAS DE ANTICIPOS 

ALTER TABLE `proasistencia`.`antprove`   
  ADD COLUMN `facproveId` INT(11) NULL AFTER `visada`,
  ADD CONSTRAINT `RX_facturaProveedor22a` FOREIGN KEY (`facproveId`) REFERENCES `proasistencia`.`facprove`(`facproveId`) ON UPDATE CASCADE ON DELETE NO ACTION;
