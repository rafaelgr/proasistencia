CREATE TABLE `tipoProyecto_profesiones` (
  `tipoProyectoProfesionId` int(11) unsigned NOT NULL auto_increment,
  `tipoProyectoId` int(11) default NULL,
  `tipoProfesionalId` int(11) default NULL,
  PRIMARY KEY  (`tipoProyectoProfesionId`),
  KEY `tipoProyectoProfesiones_tipos_profesionales` (`tipoProfesionalId`),
  KEY `tipoProyectoProfesiones_tipoproyecto` (`tipoProyectoId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `contratos`   
  ADD COLUMN `fechaFormalizacionContrato` DATE NULL AFTER `resumenDiario`;

ALTER TABLE `clientes`   
  ADD COLUMN `nombrePresidente` VARCHAR(255) NULL AFTER `emailOfertas`,
  ADD COLUMN `dniPresidente` VARCHAR(255) NULL AFTER `nombrePresidente`,
  ADD COLUMN `correoPresidente` VARCHAR(255) NULL AFTER `dniPresidente`;
