ALTER TABLE `audit_facproves`   
  ADD COLUMN `usuario` VARCHAR(255) NULL AFTER `cambio`;

ALTER TABLE `audit_facproves`   
  ADD COLUMN `numFactu2` VARCHAR(255) NULL AFTER `numFactu`;

  ALTER TABLE `audit_facproves`   
  ADD COLUMN `referencia` VARCHAR(255) NULL AFTER `numFactu2`;

