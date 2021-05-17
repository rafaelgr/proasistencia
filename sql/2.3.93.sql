ALTER TABLE `proveedores_profesiones` DROP FOREIGN KEY `proveedoresProfesiones_proveedores`;

ALTER TABLE `proveedores_profesiones` ADD CONSTRAINT `proveedoresProfesiones_proveedores` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores`(`proveedorId`) ON UPDATE CASCADE ON DELETE CASCADE;
