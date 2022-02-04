CREATE TABLE `proveedor_usuariospush` (
  `proveedorUsuarioPushId` int(11) unsigned NOT NULL auto_increment,
  `nombre` varchar(255) default NULL,
  `login` varchar(255) default NULL,
  `password` varchar(255) default NULL,
  `proveedorId` int(11) default NULL,
  PRIMARY KEY  (`proveedorUsuarioPushId`),
  KEY `proveedor_ususrioPushFK` (`proveedorId`),
  CONSTRAINT `proveedor_ususrioPushFK` FOREIGN KEY (`proveedorId`) REFERENCES `proveedores` (`proveedorId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
