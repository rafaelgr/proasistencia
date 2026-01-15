ALTER TABLE `prefacturas_temporal`   
	ADD COLUMN `prefacturaInteresesTempId` INT(11) NULL AFTER `noFacturar`,
  ADD CONSTRAINT `pref_intereses` FOREIGN KEY (`prefacturaInteresesTempId`) REFERENCES `prefacturas_temporal`(`prefacturaTempId`) ON UPDATE CASCADE ON DELETE CASCADE;