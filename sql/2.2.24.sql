ALTER TABLE `facturas`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `contabilizada`,
  ADD CONSTRAINT `fac_departamento` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

UPDATE facturas 
INNER JOIN contratos ON contratos.contratoId = facturas.contratoId
SET facturas.departamentoId = contratos.tipoContratoId;

ALTER TABLE `facprove`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `antproveId`,
  ADD CONSTRAINT `facprove_departamento` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

  
UPDATE facprove AS fact  
LEFT JOIN facprove_serviciados AS fs ON fs.facproveId = fact.facproveId
LEFT JOIN contratos AS con ON con.contratoId = fs.contratoId
SET fact.departamentoId = con.tipoContratoId;

ALTER TABLE `antprove`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `facproveId`,
  ADD CONSTRAINT `antprove_departamento` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

UPDATE antprove AS fact  
LEFT JOIN antprove_serviciados AS fs ON fs.antproveId = fact.antproveId
LEFT JOIN contratos AS con ON con.contratoId = fs.contratoId
SET fact.departamentoId = con.tipoContratoId;


ALTER TABLE `tipos_proyecto` 
  ADD CONSTRAINT `ref_departamentos` FOREIGN KEY (`tipoMantenimientoId`) REFERENCES `departamentos`(`departamentoId`),
  DROP FOREIGN KEY `ref_tipoMantenimiento`;

   ALTER TABLE `prefacturas`   
  ADD COLUMN `departamentoId` INT(11) NULL AFTER `mantenedorDesactivado`,
  ADD CONSTRAINT `pref_departamentos` FOREIGN KEY (`departamentoId`) REFERENCES `departamentos`(`departamentoId`);

UPDATE prefacturas 
INNER JOIN contratos ON contratos.contratoId = prefacturas.contratoId
SET prefacturas.departamentoId = contratos.tipoContratoId;



