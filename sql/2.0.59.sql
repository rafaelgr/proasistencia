ALTER TABLE `proasistencia`.`empresas`   
  ADD COLUMN `hostCorreo` VARCHAR(255) NULL AFTER `asuntoCorreo`,
  ADD COLUMN `portCorreo` INT(11) NULL AFTER `hostCorreo`,
  ADD COLUMN `secureCorreo` BOOLEAN NULL AFTER `portCorreo`,
  ADD COLUMN `usuCorreo` VARCHAR(255) NULL AFTER `secureCorreo`,
  ADD COLUMN `passCorreo` VARCHAR(255) NULL AFTER `usuCorreo`;
