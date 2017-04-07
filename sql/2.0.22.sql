ALTER TABLE `prefacturas` DROP FOREIGN KEY `pref_contrato`;

ALTER TABLE `prefacturas` ADD CONSTRAINT `pref_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON DELETE CASCADE;

ALTER TABLE `contratos`   
  ADD  UNIQUE INDEX `idx_ref_fechas` (`referencia`, `fechaInicio`, `fechaFinal`);