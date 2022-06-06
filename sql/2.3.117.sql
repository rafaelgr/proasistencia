ALTER TABLE `mensajes`   
  ADD COLUMN `proveedorId` INT(11) NULL AFTER `parteId`, 
  ADD  INDEX `menasjes_proveedoresFK` (`proveedorId`),
  ADD CONSTRAINT `menasjes_proveedoresFK` FOREIGN KEY (`proveedorId`) REFERENCES `proasistencia`.`proveedores`(`proveedorId`);


ALTER TABLE `mensajes`   
  ADD COLUMN `proveedorUsuarioPushId` INT(11) NULL AFTER `proveedorId`;

   ALTER TABLE `mensajes` ADD CONSTRAINT `mensajes_proveedorPushFK` 
   FOREIGN KEY (`proveedorUsuarioPushId`) REFERENCES `proasistencia`.`proveedor_usuariospush`(`proveedorUsuarioPushId`); 

