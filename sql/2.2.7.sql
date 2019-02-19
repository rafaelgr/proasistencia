#EJECUTAR EL SCRIPT  antprove_tables.sql PARA LA CREACIÓN DE LAS TABLAS DE ANTICIPOS 

ALTER TABLE `proasistencia`.`antprove`   
  ADD COLUMN `facproveId` INT(11) NULL AFTER `visada`;


  ALTER TABLE `proasistencia`.`facprove`   
  ADD COLUMN `antproveId` INT(11) NULL AFTER `visada`;

