ALTER TABLE `formas_pago`   
  ADD COLUMN `codigoContable` INT(11) NULL AFTER `restoVencimiento`;

# trasladar las formas de pago de conta a gestión
INSERT INTO tipos_iva
SELECT 
0 AS tipoIvaId,
nombriva AS nombre,
porceiva AS porcentaje,
codigiva AS codigoContable
FROM ariconta1.tiposiva;
# -- usando estos sql como plantilla hay que actualizar los valores de otras tablas
/*
update articulos set tipoIvaId = * WHERE tipoIvaId = *
update prefacturas_bases set tipoIvaId = * WHERE tipoIvaId = *
update prefacturas_lineas set tipoIvaId = * WHERE tipoIvaId = *
*/

INSERT INTO formas_pago
SELECT 
0 AS formaPagoId,
tipforpa AS tipoFormaPagoId,
nomforpa AS nombre,
numerove AS numeroVencimientos,
primerve AS primerVencimiento,
restoven AS restoVencimiento,
codforpa AS codigoContable
FROM ariconta1.formapago;
# -- usando estos sql hay que cambiar los valores de las formas de pago
/*
update clientes set formaPagoId = * where formaPagoId = *;
update prefacturas set formaPagoId = * where formaPagoId = *;
*/

ALTER TABLE `clientes`   
  ADD COLUMN `email2` VARCHAR(255) NULL AFTER `email`;

ALTER TABLE `comerciales`   
  ADD COLUMN `email2` VARCHAR(255) NULL AFTER `email`;
  

CREATE TABLE `unidades`(  
  `unidadId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  `abrev` VARCHAR(255),
  PRIMARY KEY (`unidadId`)
);


ALTER TABLE `articulos`   
  ADD COLUMN `unidadId` INT(11) NULL AFTER `descripcion`,
  ADD CONSTRAINT `ref_art_unidades` FOREIGN KEY (`unidadId`) REFERENCES `unidades`(`unidadId`);

ALTER TABLE `comerciales`   
  ADD COLUMN `dniFirmante` VARCHAR(255) NULL AFTER `formaPagoId`,
  ADD COLUMN `firmante` VARCHAR(255) NULL AFTER `dniFirmante`;
  
ALTER TABLE `contrato_comercial`   
  ADD COLUMN `dniFirmanteEmpresa` VARCHAR(255) NULL AFTER `observaciones`,
  ADD COLUMN `firmanteEmpresa` VARCHAR(255) NULL AFTER `dniFirmanteEmpresa`,
  ADD COLUMN `dniFirmanteColaborador` VARCHAR(255) NULL AFTER `firmanteEmpresa`,
  ADD COLUMN `firmanteColaborador` VARCHAR(255) NULL AFTER `dniFirmanteColaborador`;

ALTER TABLE `contrato_cliente_mantenimiento`   
  ADD COLUMN `referencia` VARCHAR(255) NULL AFTER `importeAlCliente`;
