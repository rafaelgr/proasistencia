SELECT c.nombre AS cliente, cc.nombre AS agente, ca.fechaCambio, 
COUNT(fechaCambio) AS numfecha FROM clientes_agentes AS ca
INNER JOIN clientes AS c ON c.clienteId = ca.clienteId
INNER JOIN comerciales AS cc ON cc.comercialId = ca.comercialId
GROUP BY ca.clienteId, ca.comercialId, fechaCambio
HAVING numfecha >1;

DELETE FROM  `clientes_agentes` WHERE `clienteAgenteId` = '64'; 
DELETE FROM  `clientes_agentes` WHERE `clienteAgenteId` = '124'; 
DELETE FROM  `clientes_agentes` WHERE `clienteAgenteId` = '147'; 

ALTER TABLE `clientes_agentes`   
  ADD  UNIQUE INDEX `fecha_cambio_unica` (`fechaCambio`, `clienteId`);
