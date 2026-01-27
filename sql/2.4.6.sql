ALTER TABLE
  `contrato_planificacion`
ADD
  COLUMN `importeIntereses` DECIMAL(12, 2) DEFAULT 0 NULL
AFTER
  `importeCobrado`;

ALTER TABLE
  `contrato_planificacion`
ADD
  COLUMN `contPlanificacionIntId` INT(11) NULL
AFTER
  `importeIntereses`,
ADD
  KEY `contPlanificacion_contPlanificacionIntereses` (`contPlanificacionIntId`);

ALTER TABLE
  `contrato_planificacion`
ADD
  CONSTRAINT `contPlanificacion2_contPlanificacionInteresesFK` FOREIGN KEY (`contPlanificacionIntId`) REFERENCES `contrato_planificacion`(`contPlanificacionId`) ON DELETE
SET
  NULL;

ALTER TABLE
  `contrato_planificacion`
ADD
  COLUMN `esAdicional` TINYINT(1) DEFAULT 0 NULL
AFTER
  `formaPagoId`;

ALTER TABLE
  `contrato_planificacion`
ADD
  COLUMN `contratoAdicionalId` INT(11) NULL
AFTER
  `esAdicional`;

ALTER TABLE
  `contrato_planificacion`
ADD
  COLUMN `refPresupuestoAdicional` VARCHAR(211) NULL
AFTER
  `contratoAdicionalId`;