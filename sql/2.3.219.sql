CREATE TABLE `tipoProyecto_profesiones` (
  `tipoProyectoProfesionId` int(11) unsigned NOT NULL auto_increment,
  `tipoProyectoId` int(11) default NULL,
  `tipoProfesionalId` int(11) default NULL,
  PRIMARY KEY  (`tipoProyectoProfesionId`),
  KEY `tipoProyectoProfesiones_tipos_profesionales` (`tipoProfesionalId`),
  KEY `tipoProyectoProfesiones_tipoproyecto` (`tipoProyectoId`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;