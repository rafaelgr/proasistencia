# poder hacer eliminaciones en cascada
ALTER TABLE `proasistencia`.`prefacturas_bases` DROP FOREIGN KEY `prefb_prefacturas`;
ALTER TABLE `proasistencia`.`prefacturas_bases` ADD CONSTRAINT `prefb_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `proasistencia`.`prefacturas`(`prefacturaId`) ON DELETE CASCADE;
ALTER TABLE `proasistencia`.`prefacturas_lineas` DROP FOREIGN KEY `prefl_prefacturas`;
ALTER TABLE `proasistencia`.`prefacturas_lineas` ADD CONSTRAINT `prefl_prefacturas` FOREIGN KEY (`prefacturaId`) REFERENCES `proasistencia`.`prefacturas`(`prefacturaId`) ON DELETE CASCADE;

