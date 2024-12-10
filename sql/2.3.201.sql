ALTER TABLE `contratos`   
  ADD COLUMN `resumenExp` VARCHAR(255) NULL AFTER `fechaFinAlquiler`,
  ADD COLUMN `resumenJefeObraId` INT(11) NULL AFTER `resumenExp`,
  ADD COLUMN `resumenTecnicoId` INT(11) NULL AFTER `resumenJefeObraId`,
  ADD COLUMN `resumenDistrito` VARCHAR(255) NULL AFTER `resumenTecnico`,
  ADD COLUMN `resumenPtoAceptado` TINYINT(1) DEFAULT 0 NULL AFTER `resumenDistrito`,
  ADD COLUMN `resumenAutorizacion` VARCHAR(255) NULL AFTER `resumenPtoAceptado`,
  ADD COLUMN `resumenActa` VARCHAR(255) NULL AFTER `resumenAutorizacion`,
  ADD COLUMN `resumenDni` VARCHAR(255) NULL AFTER `resumenActa`,
  ADD COLUMN `resumenCif` VARCHAR(255) NULL AFTER `resumenDni`,
  ADD COLUMN `resumenTasas` VARCHAR(255) NULL  AFTER `resumenCif`,
  ADD COLUMN `resumenIcio` VARCHAR(255) NULL AFTER `resumenTasas`,
  ADD COLUMN `resumenFormulario` VARCHAR(255) NULL AFTER `resumenIcio`,
  ADD COLUMN `resumenDr` VARCHAR(255) NULL AFTER `resumenFormulario`,
  ADD COLUMN `resumenTasasVisado` VARCHAR(255) NULL  AFTER `resumenDr`,
  ADD COLUMN `resumenDiario` TEXT NULL AFTER `resumenTasasVisado`;


