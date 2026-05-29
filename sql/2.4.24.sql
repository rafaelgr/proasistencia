ALTER TABLE `usuarios`   
	ADD COLUMN `activo` TINYINT(1) DEFAULT 1 NULL AFTER `usuarioWeb`,
	ADD COLUMN `fechaAlta` DATE NULL AFTER `activo`,
	ADD COLUMN `fechaBaja` DATE NULL AFTER `fechaAlta`;

UPDATE usuarios SET fechaAlta = 20150101;


INSERT INTO `tipos_operaciones` (`nombre`, `codopera`) VALUES ('IMPORTACIÓN/EXPORTACIÓN', '2'); 

INSERT INTO `tipos_iva` (`nombre`, `porcentaje`, `codigoContable`) VALUES ('IMPORTACIÓN/EXPORTACIÓN', '0', '14'); 

////

INSERT INTO `tiposiva` (codigiva, nombriva, tipodiva, porceiva, porcerec, cuentare, cuentarr, cuentaso, cuentasr, cuentasn) 
VALUES(14, 'IMPOR-EXPOR', 0, 0, 0, 477000013, 477000013, 477000013, 477000013, 477000013) ;

ALTER TABLE `antclien`   
	ADD COLUMN `noFactura` TINYINT(1) DEFAULT 0 NULL AFTER `servicioId`;
