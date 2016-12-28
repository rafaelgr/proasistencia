ALTER TABLE `contrato_cliente_mantenimiento`   
  ADD COLUMN `formaPagoId` INT(11) NULL AFTER `tipoMantenimientoId`,
  ADD CONSTRAINT `ref_ccm_forma_pago` FOREIGN KEY (`formaPagoId`) REFERENCES `formas_pago`(`formaPagoId`);

UPDATE contrato_cliente_mantenimiento AS ccm, clientes AS c
SET ccm.formaPagoId = c.formaPagoId
WHERE ccm.clienteId = c.clienteId;