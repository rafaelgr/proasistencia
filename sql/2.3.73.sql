ALTER TABLE `proasistencia`.`comerciales`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `tarifaId`,
  ADD CONSTRAINT `ref_comercial_proveedor` FOREIGN KEY (`proveedorId`) REFERENCES `proasistencia`.`proveedores`(`proveedorId`);


#SE CREA UNA TABLA TEMPORAL
DROP TABLE tmpComerPro;
CREATE TABLE tmpComerPro
SELECT DISTINCT c.activa,c.tipoComercialId,
c.comercialId AS comercialId, c.nombre AS comercialNombre, c.nif AS comercialNif
, p.nif AS proveedorNif
,p.proveedorId AS proveedorId
,p.nombre AS proveedorNombre
#, COUNT(proveedorId) as c
#,p.codigo AS codigo, p.cuentaContable AS cuenta
FROM comerciales AS c
INNER JOIN proveedores AS p ON p.nif = c.nif AND p.nif <> '000000000'
WHERE  c.activa = 1 OR activa IS NULL;


#SE ACTULIUZAN LOS COMERCIALES CON EL PROVEEDORID DE LA TABLA TEMPORAL
UPDATE comerciales AS c
INNER JOIN tmpComerPro AS t ON t.comercialId = c.comercialId
SET c.proveedorId = t.proveedorId;