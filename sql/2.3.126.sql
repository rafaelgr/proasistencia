ALTER TABLE `documentospago_facproves`   
  ADD COLUMN `antproveId` INT(11) NULL AFTER `facproveId`,
  ADD CONSTRAINT `antproveFK` FOREIGN KEY (`antproveId`) REFERENCES `antprove`(`antproveId`);

  ALTER TABLE `usuarios`   
  ADD COLUMN `puedeAbrir` TINYINT(1) DEFAULT 0 NULL AFTER `puedeEditar`;

UPDATE `usuarios` SET `puedeAbrir` = '1' WHERE `usuarioId` = '21'; 

UPDATE `usuarios` SET `puedeAbrir` = '1' WHERE `usuarioId` = '16'; 