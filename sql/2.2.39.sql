ALTER TABLE `proasistencia`.`clientes`   
  ADD COLUMN `colaboradorId` INT(11) NULL AFTER `tarifaId`,
  ADD CONSTRAINT `ref_cliente_colaborador` FOREIGN KEY (`colaboradorId`) REFERENCES `proasistencia`.`comerciales`(`comercialId`);


UPDATE clientes AS cli
INNER JOIN clientes_comisionistas AS cc ON cc.clienteId = cli.clienteId
SET cli.colaboradorId = cc.comercialId 

