ALTER TABLE
  `prefacturas_temporal`
ADD
  COLUMN `prefacturaInteresesTempId` INT(11) NULL
AFTER
  `noFacturar`,
ADD
  CONSTRAINT `pref_intereses` FOREIGN KEY (`prefacturaInteresesTempId`) REFERENCES `prefacturas_temporal`(`prefacturaTempId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE
  `prefacturas`
ADD
  COLUMN `prefacturaInteresesId` INT(11) NULL
AFTER
  `noFacturar`,
ADD
  CONSTRAINT `pref_intereses2` FOREIGN KEY (`prefacturaInteresesId`) REFERENCES `prefacturas`(`prefacturaId`) ON UPDATE CASCADE ON DELETE CASCADE;