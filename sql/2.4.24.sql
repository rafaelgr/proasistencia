ALTER TABLE `usuarios`   
	ADD COLUMN `activo` TINYINT(1) DEFAULT 1 NULL AFTER `usuarioWeb`,
	ADD COLUMN `fechaAlta` DATE NULL AFTER `activo`,
	ADD COLUMN `fechaBaja` DATE NULL AFTER `fechaAlta`;

UPDATE usuarios SET fechaAlta = 20150101;
