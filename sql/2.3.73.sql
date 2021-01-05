ALTER TABLE `proveedores`   
  ADD COLUMN `comercialId` INT(11) NULL AFTER `empresaId`,
  ADD CONSTRAINT `proveedores_comerciales` FOREIGN KEY (`comercialId`) REFERENCES `comerciales`(`comercialId`) ON UPDATE CASCADE ON DELETE SET NULL;


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
WHERE  NOT p.proveedorId IN 
(
117,
413,
2128,
2186,
2192,
2211,
2214,
2577,
2687,
2708
) AND c.activa = 1;

#SE ACTULIUZAN LOS PROVEEDORES CON EL COMERCIALID DE LA TABLA TEMPORAL
UPDATE proveedores AS p
INNER JOIN tmpComerPro AS t ON t.proveedorId = p.proveedorId
SET p.comercialId = t.comercialId;