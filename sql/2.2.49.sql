

#TABLA DE fontaneria

USE `proasistencia`;

/*Table structure for table `nuevaFontaneria` */

DROP TABLE IF EXISTS `nuevaFontaneria`;

CREATE TABLE `nuevaFontaneria` (
  `Id` int(11) default NULL,
  `UNIDADN` varchar(255) default NULL,
  `UNIDADIDN` int(11) default NULL,
  `DESCRIPCIONN` varchar(255) default NULL,
  `VERDEN` decimal(12,2) default NULL,
  `AZULN` decimal(12,2) default NULL,
  `TARIFA1N` decimal(12,2) default NULL,
  `TARIFA2N` decimal(12,2) default NULL,
  `CODIGON` varchar(255) default NULL,
  `UNIDAD` varchar(255) default NULL,
  `UNIDADID` int(11) default NULL,
  `DESCRIPCION` varchar(255) default NULL,
  `VERDE` decimal(12,2) default NULL,
  `AZUL` decimal(12,2) default NULL,
  `TARIFA1` decimal(12,2) default NULL,
  `TARIFA2` decimal(12,2) default NULL,
  `CODIGO` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `nuevaFontaneria` */

insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (227,'Ud.',9,'Localización de avería incluso apertura, hasta 1 m2 en escayola.',41.25,45.83,12.38,22.50,'100.01','Ud.',9,'Localización de avería incluso apertura, hasta 1 m2 en escayola.',41.25,45.83,12.38,22.50,'100.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (282,'Ud.',9,'Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 1 m2.',56.88,63.20,18.06,27.00,'100.02','Ud.',9,'Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 1 m2.',56.88,63.20,18.06,27.00,'100.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (283,'Ud.',9,'Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 2 m2.',59.40,66.00,19.80,36.00,'100.03','Ud.',9,'Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 2 m2.',59.40,66.00,19.80,36.00,'100.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (268,'Ud.',9,'Apertura de cala con otras reparaciones',41.25,45.83,13.75,25.00,'100.04','Ud.',9,'Apertura de cala con otras reparaciones',41.25,45.83,13.75,25.00,'100.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (302,'Ud.',9,'Adiccional m2 de apertura de cala',41.25,45.83,13.75,25.00,'100.05','Ud.',9,'Adiccional m2 de apertura de cala',41.25,45.83,13.75,25.00,'100.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (410,'Ud.',9,'Localización de fugas, con detector termográfico.\n',307.80,342.00,94.05,171.00,'100.06','Ud.',9,'Localización de fugas, con detector termográfico.\n',307.80,342.00,94.05,171.00,'100.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (228,'Ud.',9,'Desmontaje y montaje de aparato sanitario.',74.65,82.94,18.06,27.00,'101.01','Ud.',9,'Desmontaje y montaje de aparato sanitario.',74.65,82.94,18.06,27.00,'101.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (229,'Ud.',9,'Desmontaje y montaje de aparato sanitario con otra reparación.',50.25,55.83,13.07,25.00,'101.02','Ud.',9,'Desmontaje y montaje de aparato sanitario con otra reparación.',50.25,55.83,13.07,25.00,'101.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (230,'Ud.',9,'Desmontaje de aparato sanitario con otra reparación.',16.73,18.59,6.63,20.00,'101.03','Ud.',9,'Desmontaje de aparato sanitario con otra reparación.',16.73,18.59,6.63,20.00,'101.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (231,'Ud.',9,'Únicamente desmontaje de aparato sanitario.',39.45,43.83,18.06,18.00,'101.04','Ud.',9,'Únicamente desmontaje de aparato sanitario.',39.45,43.83,18.06,18.00,'101.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (232,'Ud.',9,'Únicamente montaje aparato sanitario.',44.67,49.63,18.06,20.00,'101.05','Ud.',9,'Únicamente montaje aparato sanitario.',44.67,49.63,18.06,20.00,'101.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (233,'Ud.',9,'Únicamente sustitución de latiguillo.',37.92,42.13,18.06,22.50,'102.01','Ud.',9,'Únicamente sustitución de latiguillo.',37.92,42.13,18.06,22.50,'102.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (234,'Ud.',9,'Sustitución de latiguillo con otra reparación.',22.09,24.54,7.85,20.00,'102.02','Ud.',9,'Sustitución de latiguillo con otra reparación.',22.09,24.54,7.85,20.00,'102.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (235,'Ud.',9,'Únicamente sustitución de válvula de desagüe.',67.30,74.78,24.14,34.20,'102.03','Ud.',9,'Únicamente sustitución de válvula de desagüe.',67.30,74.78,24.14,34.20,'102.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (236,'Ud.',9,'Sustitución de válvula y rebosadero de bañera.',98.25,109.17,31.99,48.00,'102.04','Ud.',9,'Sustitución de válvula y rebosadero de bañera.',98.25,109.17,31.99,48.00,'102.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (237,'Ud.',9,'Sustitución de válvula de desagüe con otra reparación.',53.85,59.83,19.31,43.00,'102.05','Ud.',9,'Sustitución de válvula de desagüe con otra reparación.',53.85,59.83,19.31,43.00,'102.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (284,'Ud.',9,'\n-Cambio de juntas en aparatos, válvulas.',46.98,52.20,14.36,26.10,'102.06','Ud.',9,'\n-Cambio de juntas en aparatos, válvulas.',46.98,52.20,14.36,26.10,'102.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (238,'Ud.',9,'Sustitución de sifón.',63.64,70.71,22.32,27.00,'102.07','Ud.',9,'Sustitución de sifón.',63.64,70.71,22.32,27.00,'102.07');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (239,'Ud.',9,'Sustitución de llave de escuadra, por unidad.',48.51,53.90,17.50,31.50,'103.01','Ud.',9,'Sustitución de llave de escuadra, por unidad.',48.51,53.90,17.50,31.50,'103.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (240,'Ud.',9,'Sustitución de llave de corte, hasta  1\"',68.77,76.41,24.75,49.50,'103.02','Ud.',9,'Sustitución de llave de corte, hasta  1\"',68.77,76.41,24.75,49.50,'103.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (245,'Ud.',9,'Tubería de distribución hasta 1\" y hasta 1ml.',110.54,122.82,37.85,40.50,'104.01','Ud.',9,'Tubería de distribución hasta 1\" y hasta 1ml.',110.54,122.82,37.85,40.50,'104.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (286,'Ud.',9,'Tubería de distribución hasta 1\" y hasta 2ml.',93.96,104.40,28.71,52.20,'104.02','Ud.',9,'Tubería de distribución hasta 1\" y hasta 2ml.',93.96,104.40,28.71,52.20,'104.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (247,'Ud.',9,'Tubería de distribución hasta 1\" y hasta 3ml.',189.81,210.90,64.60,74.70,'104.03','Ud.',9,'Tubería de distribución hasta 1\" y hasta 3ml.',189.81,210.90,64.60,74.70,'104.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (246,'Ml.',11,'Tubería de distribución hasta 1\" m adiccional',24.90,27.66,10.76,12.45,'104.04','Ud.',9,'Tubería de distribución desde 1\"1/4  hasta 2\" y hasta 1ml.',238.02,264.47,101.71,40.50,'104.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (287,'Ud.',9,'Tubería de distribución desde 1\"1/4  hasta 2\" y hasta 1ml.',238.02,264.47,101.71,40.50,'104.05','Ud.',9,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 2ml.',93.96,104.40,28.71,52.20,'104.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (248,'Ud.',9,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 2ml.',93.96,104.40,28.71,52.20,'104.06','Ud.',9,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 3ml.',402.54,447.27,172.04,74.70,'104.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (249,'Ud.',9,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 3ml.',402.54,447.27,172.04,74.70,'104.07','Ud.',9,'Reparación de tubería de distribución sin sustitución.',71.22,79.13,25.36,35.10,'104.07');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (288,'Ml.',11,'Tubería de distribución desde 1\"1/4 hasta 2\" m adiccional.',57.34,63.71,28.67,12.45,'104.08','Ud.',9,'Reparación adiccional de tubería de distribución sin sustitución.\n',29.16,32.40,8.91,15.00,'104.08');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (0,'Ud.',9,'Reparación de tubería de distribución sin sustitución.',71.22,79.13,25.36,35.10,'104.09',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (0,'Ud.',9,'Reparación adiccional de tubería de distribución sin sustitución.\n',29.16,32.40,8.91,15.00,'104.10',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (269,'Ud.',9,'Reparación de tubería con de gebo tapaporos de 1/2\".',92.56,102.84,27.69,31.50,'105.01','Ud.',9,'Reparación de tubería con de gebo tapaporos de 1/2\".',92.56,102.84,27.69,31.50,'105.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (270,'Ud.',9,'Reparación de tubería con de gebo tapaporos de 3/4\".',93.14,103.49,28.11,39.60,'105.02','Ud.',9,'Reparación de tubería con de gebo tapaporos de 3/4\".',93.14,103.49,28.11,39.60,'105.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (293,'Ud.',9,'Reparación de tubería con de gebo tapaporos de 1\" \n',90.72,100.80,27.72,50.40,'105.03','Ud.',9,'Reparación de tubería con de gebo tapaporos de 1\" \n',90.72,100.80,27.72,50.40,'105.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (271,'Ud.',9,'Reparación de tubería con de gebo tapaporos de 1\" y 1/4\"\n',100.13,111.26,33.01,67.50,'105.04','Ud.',9,'Reparación de tubería con de gebo tapaporos de 1\" y 1/4\"\n',100.13,111.26,33.01,67.50,'105.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (272,'Ud.',9,'Reparación de tubería con gebo tapaporos de 1\" Y 1/2.',102.21,113.57,34.48,85.50,'105.05','Ud.',9,'Reparación de tubería con gebo tapaporos de 1\" Y 1/2.',102.21,113.57,34.48,85.50,'105.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (294,'Ud.',9,'Reparación de tubería con gebo tapaporos de 2\"',178.20,198.00,54.45,99.00,'105.06','Ud.',9,'Reparación de tubería con gebo tapaporos de 2\"',178.20,198.00,54.45,99.00,'105.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (273,'Ud.',9,'Reparación de tubería con 2 gebos y tramo de tuberia de 1/2\".',118.36,131.51,46.30,60.00,'105.07','Ud.',9,'Reparación de tubería con 2 gebos y tramo de tuberia de 1/2\".',118.36,131.51,46.30,60.00,'105.07');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (274,'Ud.',9,'Reparación de tubería con 2 gebos y tramo de tuberia 3/4\".',120.61,134.01,47.18,69.00,'105.08','Ud.',9,'Reparación de tubería con 2 gebos y tramo de tuberia 3/4\".',120.61,134.01,47.18,69.00,'105.08');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (241,'Ud.',9,'Cambio de manguetón de plomo o P.V.C., hasta 1 m, incluye desmontaje y montaje de sanitario.',279.14,310.16,82.60,94.50,'106.01','Ud.',9,'Cambio de manguetón de plomo o P.V.C., hasta 1 m, incluye desmontaje y montaje de sanitario.',279.14,310.16,82.60,94.50,'106.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (285,'Ud.',9,'Cambio de manguetón de plomo o P.V.C. m. adiccional\n-Incluye desmontaje y montaje de sanitario',72.90,81.00,22.28,40.50,'106.02','Ud.',9,'Cambio de manguetón de plomo o P.V.C. m. adiccional\n-Incluye desmontaje y montaje de sanitario',72.90,81.00,22.28,40.50,'106.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (242,'Ud.',9,'Reparación de manguetón. (soldadura en frio.)',79.83,88.70,28.38,32.40,'106.03','Ud.',9,'Reparación de manguetón. (soldadura en frio.)',79.83,88.70,28.38,32.40,'106.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (243,'Ud.',9,'Sustitución de bote sifónico normal.',200.97,223.30,73.41,81.00,'106.04','Ud.',9,'Sustitución de bote sifónico normal.',200.97,223.30,73.41,81.00,'107.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (244,'Ud.',9,'Reparación de bote sifónico.',83.76,93.07,32.59,35.00,'106.05','Ud.',9,'Reparación de bote sifónico.',83.76,93.07,32.59,35.00,'107.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (250,'Ud.',9,'Sustitución hasta 1ml de desagüe de PVC de 40mm de Ø.',95.58,106.20,27.07,35.10,'107.01','Ud.',9,'Sustitución hasta 1ml de desagüe de PVC de 40mm de Ø.',95.58,106.20,27.07,35.10,'108.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (289,'Ud.',9,'Sustitución hasta 2ml de desagüe de PVC de 40mm de Ø.',116.25,129.17,29.21,53.10,'107.02','Ud.',9,'Sustitución hasta 2ml de desagüe de PVC de 40mm de Ø.',116.25,129.17,29.21,53.10,'108.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (251,'Ud.',9,'Sustitución hasta 3 ml de desagüe de PVC de 40mm de Ø.',136.65,151.83,37.36,66.60,'107.03','Ud.',9,'Sustitución hasta 3 ml de desagüe de PVC de 40mm de Ø.',136.65,151.83,37.36,66.60,'108.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (252,'Ud.',9,'Sustitución hasta 1ml de desagüe de plomo.',89.32,99.24,30.82,35.10,'107.04','Ud.',9,'Sustitución hasta 1ml de desagüe de plomo.',89.32,99.24,30.82,35.10,'108.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (253,'Ud.',9,'Sustitución hasta 3ml de desagüe de plomo.',145.13,161.26,50.47,66.60,'107.05','Ud.',9,'Sustitución hasta 3ml de desagüe de plomo.',145.13,161.26,50.47,66.60,'108.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (290,'Ud.',9,'Sustitución m. adiccional de desagüe de plomo.',27.00,30.00,8.25,15.00,'107.06','Ud.',9,'Sustitución m. adiccional de desagüe de plomo.',27.00,30.00,8.25,15.00,'108.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (254,'Ud.',9,'Sustitución hasta 1,5ml de desagüe de fregadero y lavadora.',133.56,148.40,44.52,49.50,'107.07','Ud.',9,'Sustitución hasta 1,5ml de desagüe de fregadero y lavadora.',133.56,148.40,44.52,49.50,'108.07');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (255,'Ud.',9,'Sustitución hasta 3ml de desagüe fregadero y lavadora.',151.70,168.56,60.68,67.50,'107.08','Ud.',9,'Sustitución hasta 3ml de desagüe fregadero y lavadora.',151.70,168.56,60.68,67.50,'108.08');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (256,'Ud.',9,'Reparasión de desagüe de PVC de 40mm de Ø. sin sustitución.',77.03,85.59,25.36,22.50,'107.09','Ud.',9,'Reparasión de desagüe de PVC de 40mm de Ø. sin sustitución.',77.03,85.59,25.36,22.50,'108.09');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (257,'Ud.',9,'Sustitución de injerto sencillo, incluso 1ml bajante.',261.60,290.67,78.80,81.00,'108.01','Ud.',9,'Sustitución de injerto sencillo, incluso 1ml bajante.',261.60,290.67,78.80,81.00,'109.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (258,'Ud.',9,'Sustitución de injerto sencillo, incluso hasta 3ml bajante.',324.82,360.91,113.82,110.00,'108.02','Ud.',9,'Sustitución de injerto sencillo, incluso hasta 3ml bajante.',324.82,360.91,113.82,110.00,'109.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (259,'Ud.',9,'Sustitución de injerto doble, incluso 1ml de bajante.',323.80,359.78,87.55,94.50,'108.03','Ud.',9,'Sustitución de injerto doble, incluso 1ml de bajante.',323.80,359.78,87.55,94.50,'109.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (260,'Ud.',9,'Sustitución de injerto doble, incluso hasta  3ml de bajante.',364.81,405.34,127.82,120.00,'108.04','Ud.',9,'Sustitución de injerto doble, incluso hasta  3ml de bajante.',364.81,405.34,127.82,120.00,'109.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (266,'Ud.',9,'Cambio de codo con bajante.',124.95,138.83,51.02,50.00,'108.05','Ud.',9,'Cambio de codo con bajante.',124.95,138.83,51.02,50.00,'109.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (267,'Ud.',9,'Reparación de unión en bajante.',107.17,119.08,42.26,45.00,'108.06','Ud.',9,'Reparación de unión en bajante.',107.17,119.08,42.26,45.00,'109.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (261,'Ud.',9,'Sustitución de bajante de pluviales hasta 125mm y hasta 1m.',107.35,119.28,43.78,58.50,'108.07','Ud.',9,'Sustitución de bajante de pluviales hasta 125mm y hasta 1m.',107.35,119.28,43.78,58.50,'110.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (291,'Ud.',9,'Sustitución de bajante de pluviales hasta 125mm y hasta 2m.',127.98,142.20,39.11,71.10,'108.08','Ud.',9,'Sustitución de bajante de pluviales hasta 125mm y hasta 2m.',127.98,142.20,39.11,71.10,'110.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (262,'Ud.',9,'Sustitución de bajante de pluviales hasta 125mm y hasta 3m.',214.69,238.54,59.16,85.50,'108.09','Ud.',9,'Sustitución de bajante de pluviales hasta 125mm y hasta 3m.',214.69,238.54,59.16,85.50,'110.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (263,'Ud.',9,'Sustitución de bajante de fecales o mixta hasta 125mm y hasta 1m.',122.81,136.46,52.53,58.50,'108.10','Ud.',9,'Sustitución de bajante de fecales o mixta hasta 125mm y hasta 1m.',122.81,136.46,52.53,58.50,'110.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (292,'Ud.',9,'Sustitución de bajante de fecales o mixta hasta 125mm y hasta 2m.',146.70,163.00,39.11,71.10,'108.11','Ud.',9,'Sustitución de bajante de fecales o mixta hasta 125mm y hasta 2m.',146.70,163.00,39.11,71.10,'110.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (264,'Ud.',9,'Sustitución de bajante de fecales o mixta hasta 125mm y hasta 3m.',245.64,272.93,98.07,85.50,'108.12','Ud.',9,'Sustitución de bajante de fecales o mixta hasta 125mm y hasta 3m.',245.64,272.93,98.07,85.50,'110.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (265,'Ud.',9,'Reparación  de bajante sin sustitución.',79.83,88.70,28.38,32.40,'108.13','Ud.',9,'Reparación  de bajante sin sustitución.',79.83,88.70,28.38,32.40,'110.07');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (295,'Ud.',9,'Vaciado o llenado de calefacción.',40.50,45.00,12.38,22.50,'109.01','Ud.',9,'Vaciado o llenado de calefacción.',40.50,45.00,12.38,22.50,'111.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (300,'Ud.',9,'Desmontaje o montaje de radiador.',48.60,54.00,14.85,27.00,'109.02','Ud.',9,'Desmontaje o montaje de radiador.',48.60,54.00,14.85,27.00,'111.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (275,'Ud.',9,'Cambio de llave de regulación de radiador.',65.61,72.90,22.38,40.50,'109.03','Ud.',9,'Cambio de llave de regulación de radiador.',65.61,72.90,22.38,40.50,'111.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (276,'Ud.',9,'Cambio de detentor.',52.95,58.83,22.38,40.50,'109.04','Ud.',9,'Cambio de detentor.',52.95,58.83,22.38,40.50,'111.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (301,'Ud.',9,'Reparación de radiador , cambio de juntas.',89.10,99.00,27.23,49.50,'109.05','Ud.',9,'Reparación de radiador , cambio de juntas.',89.10,99.00,27.23,49.50,'111.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (277,'Ud.',9,'Contador de agua fría de 1/2 (13mm) suministro ',39.86,44.29,16.50,30.00,'110.01','Ud.',9,'Contador de agua fría de 1/2 (13mm) suministro ',39.86,44.29,16.50,30.00,'112.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (278,'Ud.',9,'Contador de agua fría de 3/4 (20mm) suministro ',63.63,70.70,24.75,45.00,'110.02','Ud.',9,'Contador de agua fría de 3/4 (20mm) suministro ',63.63,70.70,24.75,45.00,'112.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (279,'Ud.',9,'Instalación de contador, sin suministro.',42.10,46.78,16.50,30.00,'110.03','Ud.',9,'Instalación de contador, sin suministro.',42.10,46.78,16.50,30.00,'112.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (296,'Ud.',9,'Sellados de bañera o ducha.',121.50,135.00,37.13,67.50,'111.01','Ud.',9,'Sellados de bañera o ducha.',121.50,135.00,37.13,67.50,'113.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (297,'Ud.',9,'Reparación de mecanismo de cisterna, sin material.',56.70,63.00,17.33,31.50,'111.02','Ud.',9,'Reparación de mecanismo de cisterna, sin material.',56.70,63.00,17.33,31.50,'113.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (298,'Ud.',9,'Reparación de cisterna con sustitución de mecanismo de carga ',63.81,70.90,21.27,38.66,'111.03','Ud.',9,'Reparación de cisterna con sustitución de mecanismo de carga ',63.81,70.90,21.27,38.66,'113.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (299,'Ud.',9,'Reparación de cisterna con sustitución de mecanismo de descarga ',78.10,86.78,26.03,47.32,'111.04','Ud.',9,'Reparación de cisterna con sustitución de mecanismo de descarga ',78.10,86.78,26.03,47.32,'113.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (411,'Ud.',9,'Reparación de cisterna con sustitución de mecanismo de carga y descarga ',112.88,125.42,37.63,68.39,'111.05','Ud.',9,'Reparación de cisterna con sustitución de mecanismo de carga y descarga ',112.88,125.42,37.63,68.39,'113.05');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (412,'Ud.',9,'Desmontaje y montaje de griferias, sin material.',56.70,63.00,17.33,31.50,'111.06','Ud.',9,'Desmontaje y montaje de griferias, sin material.',56.70,63.00,17.33,31.50,'113.06');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (413,'Ud.',9,'Desmontaje y montaje de termos hasta 80 l., sin material.',157.00,174.44,69.30,126.00,'111.07','Ud.',9,'Desmontaje y montaje de termos hasta 80 l., sin material.',157.00,174.44,69.30,126.00,'113.07');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (303,'Ud.',9,'Desatascos en hogar manual o con máquina de presión.',97.20,108.00,29.70,54.00,'112.01','Ud.',9,'Desatascos en hogar manual o con máquina de presión.',97.20,108.00,29.70,54.00,'114.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (304,'Ud.',9,'Desatascos en zona comunitaria manual o con máquina de presión.',162.00,180.00,49.50,90.00,'112.02','Ud.',9,'Desatascos en zona comunitaria manual o con máquina de presión.',162.00,180.00,49.50,90.00,'114.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (280,'Hr.',NULL,'Mano de obra oficial de fontaneria ',39.45,43.83,17.96,27.00,'190.01','Hr.',NULL,'Mano de obra oficial de fontaneria ',39.45,43.83,17.96,27.00,'190.01');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (281,'Hr.',NULL,'Mano de obra ayudante de fontaneria ',33.51,37.23,15.26,23.00,'190.02','Hr.',NULL,'Mano de obra ayudante de fontaneria ',33.51,37.23,15.26,NULL,'190.02');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (414,'Ud.',9,'Desplazamiento',29.00,30.00,15.00,0.00,'190.03','Ud.',9,'Desplazamiento',29.00,30.00,15.00,0.00,'190.03');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (415,'Ud.',9,'Desplazamiento superior a 30 km',59.00,59.00,30.00,30.00,'190.04','Ud.',9,'Desplazamiento superior a 30 km',59.00,59.00,30.00,30.00,'190.04');
insert  into `nuevaFontaneria`(`Id`,`UNIDADN`,`UNIDADIDN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`TARIFA2N`,`CODIGON`,`UNIDAD`,`UNIDADID`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`TARIFA2`,`CODIGO`) values (416,'Ud.',9,'Servicio realizado fuera del horario laboral',50.00,50.00,25.00,NULL,'190.05','Ud.',9,'Servicio realizado fuera del horario laboral',50.00,50.00,25.00,NULL,'190.05');

#ACTUALIZAMOS LA ID CON LA BASE DE DATOS proasistencia

UPDATE `nuevaFontaneria` AS nf
LEFT JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGO
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL;

 UPDATE `nuevafontaneria` SET id = 0 WHERE id < 50;
 
 #ACTUALIZAMOS LOS ARTICULOS DE Fontaneria

 UPDATE articulos AS ar 
 INNER JOIN `nuevaFontaneria` AS nf ON  nf.id = ar.articuloId
 SET ar.codigoReparacion = nf.CODIGON, ar.nombre = nf.DESCRIPCIONN, ar.UNIDADID = nf.UNIDADIDN;
 

 #TABLA DE ELECTRICIDAD

USE `proasistencia`;

/*Table structure for table `nuevaelectricidad` */

DROP TABLE IF EXISTS `nuevaelectricidad`;

CREATE TABLE `nuevaelectricidad` (
  `Id` int(11) default NULL,
  `MALCODIGON` varchar(255) default NULL,
  `UNIDADIDN` double default NULL,
  `UNIDADN` varchar(255) default NULL,
  `DESCRIPCIONN` varchar(255) default NULL,
  `VERDEN` decimal(12,2) default NULL,
  `AZUlN` decimal(12,2) default NULL,
  `TARIFA1N` decimal(12,2) default NULL,
  `CODIGON` varchar(255) default NULL,
  `MALCODIGO` varchar(255) default NULL,
  `UNIDADID` double default NULL,
  `UNIDAD` varchar(255) default NULL,
  `DESCRIPCIÓN` varchar(255) default NULL,
  `VERDE` decimal(12,2) default NULL,
  `AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `CODIGO` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `nuevaelectricidad` */

insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (417,'200.01',NULL,'Ud.','Sustitucion de interruptor, enchufe o timbre serie SIMON31 o similar.',49.94,55.49,25.41,'200.01','200.01',NULL,'Ud.','Sustitucion de interruptor, enchufe o timbre serie SIMON31 o similar.',49.94,55.49,25.41,'200.01');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (418,'200.02',NULL,'Ud.','Sustitución pulsador con indicador luminoso serie SIMON31 o similar.',61.92,68.80,30.72,'200.02','200.02',NULL,'Ud.','Sustitución pulsador con indicador luminoso serie SIMON31 o similar.',61.92,68.80,30.72,'200.02');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (419,'200.03',NULL,'Ud.','Sustitucion automatico escalera T20 o similar',87.73,97.48,45.94,'200.03','200.03',NULL,'Ud.','Sustitucion automatico escalera T20 o similar',87.73,97.48,45.94,'200.03');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (420,'200.04',NULL,'Ud.','Sustitución de automático de escalera T11 o similar.',111.89,124.32,55.51,'200.04','200.04',NULL,'Ud.','Sustitución de automático de escalera T11 o similar.',111.89,124.32,55.51,'200.04');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (421,'200.05',NULL,'Ud.','Suministro e instalación de detector tipo Koban 360º',97.54,108.38,56.82,'200.05','200.05',NULL,'Ud.','Suministro e instalación de detector tipo Koban 360º',97.54,108.38,56.82,'200.05');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (422,'201,01',NULL,'Ud.','Sustitucion de diferencial hasta 2x40A sensibilidad 30mA.',82.17,91.30,40.77,'201.01','201,01',NULL,'Ud.','Sustitucion de diferencial hasta 2x40A sensibilidad 30mA.',82.17,91.30,40.77,'201.01');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (423,'201,02',NULL,'Ud.','Sustitucion de diferencial de 2x63A sensibilidad 30mA.',231.46,257.18,167.46,'201.02','201,02',NULL,'Ud.','Sustitucion de diferencial de 2x63A sensibilidad 30mA.',231.46,257.18,167.46,'201.02');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (424,'201,03',NULL,'Ud.','Sustitucion de diferencial  hasta 4x40A sensibilidad 300mA.',255.81,284.23,126.91,'201.03','201,03',NULL,'Ud.','Sustitucion de diferencial  hasta 4x40A sensibilidad 300mA.',255.81,284.23,126.91,'201.03');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (425,'201,04',NULL,'Ud.','Sustitucion de diferencial de 4x63A sensibilidad 300mA.',281.21,312.46,139.51,'201.04','201,04',NULL,'Ud.','Sustitucion de diferencial de 4x63A sensibilidad 300mA.',281.21,312.46,139.51,'201.04');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (426,'202,01',NULL,'Ud.','Sustitucion de magnetotermico de hasta 2x25A.',62.55,69.50,31.03,'202.01','202,01',NULL,'Ud.','Sustitucion de magnetotermico de hasta 2x25A.',62.55,69.50,31.03,'202.01');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (427,'202,02',NULL,'Ud.','Sustitucion de magnetotermico 2x40A.',68.58,76.20,34.02,'202.02','202,02',NULL,'Ud.','Sustitucion de magnetotermico 2x40A.',68.58,76.20,34.02,'202.02');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (428,'202,03',NULL,'Ud.','Sustitucion de magnetotermico 2x63A.',79.35,88.17,39.37,'202.03','202,03',NULL,'Ud.','Sustitucion de magnetotermico 2x63A.',79.35,88.17,39.37,'202.03');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (429,'202,04',NULL,'Ud.','Sustitucion de magnetotermico de hasta 4x25A.',127.96,142.18,63.48,'202.04','202,04',NULL,'Ud.','Sustitucion de magnetotermico de hasta 4x25A.',127.96,142.18,63.48,'202.04');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (430,'202,05',NULL,'Ud.','Sustitucion de magnetotermico 4x40A.',149.97,166.63,74.40,'202.05','202,05',NULL,'Ud.','Sustitucion de magnetotermico 4x40A.',149.97,166.63,74.40,'202.05');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (431,'202,06',NULL,'Ud.','Sustitucion de magnetotermico 4x63A.',252.89,280.99,139.20,'202.06','202,06',NULL,'Ud.','Sustitucion de magnetotermico 4x63A.',252.89,280.99,139.20,'202.06');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (426,'203,01',NULL,'Ml.','Cambio de linea hasta 2,5 mm2',7.56,8.40,3.75,'203.01','202,01',NULL,'Ml.','Cambio de linea hasta 2,5 mm2',7.56,8.40,3.75,'202.01');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (427,'203,02',NULL,'Ml.','Cambio de linea de 4 mm2 ',7.94,8.82,3.94,'203.02','202,02',NULL,'Ml.','Cambio de linea de 4 mm2 ',7.94,8.82,3.94,'202.02');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (428,'203,03',NULL,'Ml.','Cambio de linea hasta 6 mm2 ',8.33,9.26,4.13,'203.03','202,03',NULL,'Ml.','Cambio de linea hasta 6 mm2 ',8.33,9.26,4.13,'202.03');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (429,'203,04',NULL,'Ud.','Intervención mínima en sustitución de linea eléctrica',75.60,84.00,37.50,'203.04','202,04',NULL,'Ud.','Intervención mínima en sustitución de linea eléctrica',75.60,84.00,37.50,'202.04');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (430,'203,05',NULL,'Ud.','Revision instalacion electrica',63.68,70.76,34.88,'203.05','202,05',NULL,'Ud.','Revision instalacion electrica',63.68,70.76,34.88,'202.05');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (437,'290,01',NULL,'Hr.','Mano de obra de oficial instalador electricista',39.45,43.83,20.00,'290.01','290,01',NULL,'Hr.','Mano de obra de oficial instalador electricista',39.45,43.83,20.00,'290.01');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (438,'290,02',NULL,'Hr.','Mano de obra de ayudante instalador electricista',34.00,37.78,17.00,'290.02','290,02',NULL,'Hr.','Mano de obra de ayudante instalador electricista',34.00,37.78,17.00,'290.02');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (439,'290,03',NULL,'Ud.','Desplazamiento',29.00,29.00,15.00,'290.03','290,03',NULL,'Ud.','Desplazamiento',29.00,29.00,15.00,'290.03');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (440,'290,04',NULL,'Ud.','Desplazamiento superior a 30km',59.00,59.00,30.00,'290.04','290,04',NULL,'Ud.','Desplazamiento superior a 30km',59.00,59.00,30.00,'290.04');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (441,'290,05',NULL,'Ud.','Incremento de servicio de electricidad realizado fuera del horario laboral',50.00,50.00,25.00,'290.05','290,05',NULL,'Ud.','Incremento de servicio de electricidad realizado fuera del horario laboral',50.00,50.00,25.00,'290.05');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (443,'250,03',NULL,'Ud.','Suministro e instalación de detector tipo Koban 360º',97.54,108.37,56.82,'250.03','250,01',NULL,'Ud.','Suministro de tubo de led de 120 cm, tipo Philips o similar.',25.24,28.04,15.77,'250.01');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (0,'250,01',NULL,'Ud.','Suministro de tubo de led de 120 cm, tipo Philips o similar.',25.24,28.04,15.77,'250.01','250,02',NULL,'Ud.','Suministro de downlight de led, 18W.',36.15,40.17,24.30,'250.02');
insert  into `nuevaelectricidad`(`Id`,`MALCODIGON`,`UNIDADIDN`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZUlN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDADID`,`UNIDAD`,`DESCRIPCIÓN`,`VERDE`,`AZUL`,`TARIFA 1`,`CODIGO`) values (0,'250,02',NULL,'Ud.','Suministro de downlight de led, 18W.',36.15,40.17,24.30,'250.02',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);


 #ACTUALIZAMOS LAS IDS DE LA TABLA CON LOS ARTICULOS proasistencia

 UPDATE `nuevaelectricidad` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGO
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL;

UPDATE `nuevaelectricidad`  SET id = 0 WHERE id < 50;


  UPDATE articulos AS ar 
 INNER JOIN `nuevaelectricidad` AS nf ON  nf.id = ar.articuloId
 SET ar.codigoReparacion = nf.CODIGON, ar.nombre = nf.DESCRIPCIONN;

 #TABLA CERRAJERIA

 USE `proasistencia`;

/*Table structure for table `nuevacerrajeria` */

DROP TABLE IF EXISTS `nuevacerrajeria`;

CREATE TABLE `nuevacerrajeria` (
  `Id` int(11) default NULL,
  `MALCODIGON` double default NULL,
  `UNIDADN` varchar(255) default NULL,
  `DESCRIPCIONN` varchar(255) default NULL,
  `VERDEN` decimal(12,2) default NULL,
  `AZULN` decimal(12,2) default NULL,
  `TARIFA1N` decimal(12,2) default NULL,
  `CODIGON` varchar(255) default NULL,
  `MALCODIGO` double default NULL,
  `UNIDAD` varchar(255) default NULL,
  `DESCRIPCION` varchar(255) default NULL,
  `VERDE` decimal(12,2) default NULL,
  `AZUL` decimal(12,2) default NULL,
  `TARIFA1` decimal(12,2) default NULL,
  `CODIGO` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `nuevacerrajeria` */

insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (587,300.01,'Ud.','Apertura de puerta',112.12,124.58,55.00,'300.01',300.01,'Ud.','Apertura de puerta',112.12,124.58,55.00,'300.01');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (588,300.02,'Ud.','Apertura de puerta con sustitución de bombín llave serreta',165.00,183.33,81.00,'300.02',300.02,'Ud.','Apertura de puerta con sustitución de bombín o cerradura',165.00,183.33,81.00,'300.02');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (589,300.03,'Ud.','Apertura de puerta con sustitución de bombín llave de puntos',175.00,194.00,91.00,'300.03',300.03,'Ud.','Reparacion provisional (con o sin elementos recuperables)',95.89,106.54,51.83,'300.03');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (590,300.04,'Ud.','Reparacion provisional (con o sin elementos recuperables)',95.89,106.54,51.83,'300.04',300.04,'Ud.','Soldadura con equipo autógeno o eléctrico (Intervención mínima)',129.83,144.26,70.18,'300.04');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (5,300.05,'Ud.','Soldadura con equipo autógeno o eléctrico (Intervención mínima)',129.83,144.26,70.18,'300.05',300.05,'Ud.','Soldadura con equipo autógeno o eléctrico (Intervención mínima)',129.83,144.26,70.18,'300.05');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (591,301.01,'Ud.','Sustitución de bombin normal (Tipo CVL, EZCUR, TESA, AZBE o similar)',99.61,110.68,49.15,'301.01',301.01,'Ud.','Sustitución de bombin normal (Tipo CVL, EZCUR, TESA, AZBE o similar)',99.61,110.68,49.15,'301.01');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (592,301.02,'Ud.','Sustituc. bombillo seguridad, pompa o borjas g. baja (EZCURRA,ESA)',143.63,159.59,70.86,'301.02',301.02,'Ud.','Sustituc. bombillo seguridad, pompa o borjas g. baja (EZCURRA,ESA)',143.63,159.59,70.86,'301.02');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (593,301.03,'Ud.','Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,ESA)',205.77,228.63,101.51,'301.03',301.03,'Ud.','Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,ESA)',205.77,228.63,101.51,'301.03');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (594,301.04,'Ud.','Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,ESA)',216.29,240.32,106.70,'301.04',301.04,'Ud.','Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,ESA)',216.29,240.32,106.70,'301.04');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (595,301.05,'Ud.','Sust. bombillo seguridad, pompa, borjas g. media, serie alta(STS)',189.46,210.51,93.46,'301.05',301.05,'Ud.','Sust. bombillo seguridad, pompa, borjas g. media, serie alta(STS)',189.46,210.51,93.46,'301.05');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (596,302.01,'Ud.','Sustitución cerrojo (LINCE 3940, LINCE 2930, EZCURRA 400 o similar)',152.89,169.88,75.42,'302.01',302.01,'Ud.','Sustitución cerrojo (LINCE 3940, LINCE 2930, EZCURRA 400 o similar)',152.89,169.88,75.42,'302.01');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (597,302.02,'Ud.','Sustitución cerrojo (FAC 300, FAC 301, FAC 307 o similar)',144.79,160.88,71.42,'302.02',302.02,'Ud.','Sustitución cerrojo (FAC 300, FAC 301, FAC 307 o similar)',144.79,160.88,71.42,'302.02');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (598,302.03,'Ud.','Sustitución de cerradura de buzón incluida apertura',58.27,64.74,38.85,'302.03',302.03,'Ud.','Sustitución de cerradura de buzón incluida apertura',58.27,64.74,38.85,'302.03');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (599,302.04,'Ud.','Sustitución de cerradura de buzón sin apertura',49.86,55.40,33.91,'302.04',302.04,'Ud.','Sustitución de cerradura de buzón sin apertura',49.86,55.40,33.91,'302.04');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (0,302.05,'Ud.','Sustitución de cerradero electrónico sin desbloqueo',87.75,97.50,45.00,'302.05',302.05,'Ud.','Sustitución de cerradero electrónico sin desbloqueo',87.75,97.50,45.00,'302.05');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (16,302.06,'Ud.','Sustitución de cerradero electrónico con desbloqueo',97.50,108.33,50.00,'302.06',302.06,'Ud.','Sustitución de cerradero electrónico con desbloqueo',97.50,108.33,50.00,'302.06');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (600,303.01,'Ud.','Sustitución de muelle básico',178.15,197.94,90.00,'303.01',303.01,'Ud.','Sustitución de muelle básico',178.15,197.94,90.00,'303.01');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (601,303.02,'Ud.','Sustitución de muelle Dorma TS-71 ',237.00,263.33,120.00,'303.02',303.02,'Ud.','Sustitución de muelle Dorma TS-71 ',237.00,263.33,120.00,'303.02');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (602,303.03,'Ud.','Adicional chapa aluminio para instalación de muelle ',44.00,48.89,22.00,'303.03',303.03,'Ud.','Adicional chapa aluminio para instalación de muelle ',44.00,48.89,22.00,'303.03');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (603,390.01,'Hr.','Mano de obra de oficial de cerrajería.',52.05,57.83,25.91,'390.01',390.01,'Hr.','Mano de obra de oficial de cerrajería.',52.05,57.83,25.91,'390.01');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (604,390.02,'Hr.','Mano de obra de ayudante de cerrajería',26.03,28.92,12.96,'390.02',390.02,'Hr.','Mano de obra de ayudante de cerrajería',26.03,28.92,12.96,'390.02');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (605,390.03,'Ud.','Desplazamiento',29.00,29.00,15.00,'390.03',390.05,'Ud.','Desplazamiento',29.00,29.00,15.00,'390.05');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (606,390.04,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'390.04',390.06,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'390.06');
insert  into `nuevacerrajeria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (607,390.05,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'390.05',390.07,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'390.07');


#ACTUALIZAMOS LA TABLA NUEVA CERRAJERIA Y LA TABLA ARTICULOS

UPDATE `nuevacerrajeria` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGO
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL;
 
 UPDATE `nuevacerrajeria`  SET id = 0 WHERE id < 50;

UPDATE articulos AS ar 
 INNER JOIN `nuevacerrajeria` AS nf ON  nf.id = ar.articuloId
 SET ar.codigoReparacion = nf.CODIGON, ar.nombre = nf.DESCRIPCIONN;

 #TABLA ALBAÑILERIA

 USE `proasistencia`;

/*Table structure for table `nuevaalbanileria` */

DROP TABLE IF EXISTS `nuevaalbanileria`;

CREATE TABLE `nuevaalbanileria` (
  `Id` int(11) default NULL,
  `MALCODIGON` varchar(255) default NULL,
  `UNIDADN` varchar(255) default NULL,
  `DESCRIPCIONN` varchar(255) default NULL,
  `VERDEN` decimal(12,2) default NULL,
  `AZULN` decimal(12,2) default NULL,
  `TARIFA1N CODIGON` decimal(12,2) default NULL,
  `CODIGON` varchar(255) default NULL,
  `MALCODIGO` varchar(255) default NULL,
  `UNIDAD` varchar(255) default NULL,
  `DESCRIPCION` varchar(255) default NULL,
  `VERDE` decimal(12,2) default NULL,
  `AZUL` decimal(12,2) default NULL,
  `TARIFA1N` decimal(12,2) default NULL,
  `CODIGO` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `nuevaalbanileria` */

insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (1,'400.01','M2','Picado de guarnecido de yeso en techos o paredes',13.80,15.33,5.52,'400.01','400.01','M2','Picado de guarnecido de yeso en techos o paredes',13.80,15.33,5.52,'400.01');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (2,'400.02','M2','Picado de enfoscados de mortero de cemento en paredes.',21.30,23.67,8.52,'400.02','400.02','M2','Picado de enfoscados de mortero de cemento en paredes.',21.30,23.67,8.52,'400.02');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (3,'400.03','M2','Picado de  hormigon en soleras o muros',35.16,39.07,11.72,'400.03','400.03','M2','Picado de  hormigon en soleras o muros',35.16,39.07,11.72,'400.03');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (4,'400.04','M2','Picado en techo de escayola.',22.80,25.33,9.12,'400.04','400.04','M2','Picado en techo de escayola.',22.80,25.33,9.12,'400.04');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (5,'400.05','M2','Picado en paramentos verticales de ladrillo con guarnecido de yeso',26.40,29.33,10.56,'400.05','400.05','M2','Picado en paramentos verticales de ladrillo con guarnecido de yeso',26.40,29.33,10.56,'400.05');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (6,'400.06','M2','Picado en paramentos verticales de ladrillo con alicatado',31.20,34.67,12.48,'400.06','400.06','M2','Picado en paramentos verticales de ladrillo con alicatado',31.20,34.67,12.48,'400.06');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (7,'400.07','M2','Picado en suelos con gres, terrazo o similares',30.95,34.39,12.38,'400.07','400.07','M2','Picado en suelos con gres, terrazo o similares',30.95,34.39,12.38,'400.07');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (8,'400.08','Ml','Excavación a mano en zanja en tierra hasta 40 cm de profundidad',44.80,49.78,16.00,'400.08','400.08','Ml','Excavación a mano en zanja en tierra hasta 40 cm de profundidad',44.80,49.78,16.00,'400.08');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (9,'401.01','Ud.','Tapado de 1/2m2 de cala con enlucido 1 o 2 caras.',80.23,89.14,26.75,'401.01','401.01','Ud.','Tapado de 1/2m2 de cala con enlucido 1 o 2 caras.',80.23,89.14,26.75,'401.01');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (10,'401.02','Ud.','Tapado de cala con enlucido 1 o 2 caras 1m2.',118.36,131.51,41.73,'401.02','401.02','Ud.','Tapado de cala con enlucido 1 o 2 caras 1m2.',118.36,131.51,41.73,'401.02');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (11,'401.03','Ud.','Tapado de 1/2m2 de cala en techo de escayola.',92.88,103.20,25.06,'401.03','401.03','Ud.','Tapado de 1/2m2 de cala en techo de escayola.',92.88,103.20,25.06,'401.03');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (12,'401.04','Ud.','Tapado de 1m2 de cala en techo de escayola.',106.07,117.86,40.08,'401.04','401.04','Ud.','Tapado de 1m2 de cala en techo de escayola.',106.07,117.86,40.08,'401.04');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (13,'401.05','Ud.','Tapado de 1/2m2 de cala con alicatado o solado a 1cara.',93.84,104.27,34.53,'401.05','401.05','Ud.','Tapado de 1/2m2 de cala con alicatado o solado a 1cara.',93.84,104.27,34.53,'401.05');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (14,'401.06','Ud.','Tapado de 1m2 de cala con alicatado o solado a 1 cara.',129.50,143.89,46.94,'401.06','401.06','Ud.','Tapado de 1m2 de cala con alicatado o solado a 1 cara.',129.50,143.89,46.94,'401.06');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (15,'401.07','Ud.','Tapado de cala con hormigon 1m2.',69.10,76.78,38.25,'401.07','401.07','Ud.','Tapado de cala con hormigon 1m2.',69.10,76.78,38.25,'401.07');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (16,'401.08','M2','Adicional tapar cala con hormigon',44.93,49.92,22.37,'401.08','401.08','M2','Adicional tapar cala con hormigon',44.93,49.92,22.37,'401.08');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (17,'401.09','Ml','Tapado a mano de zanjas en tierra',28.00,31.11,10.00,'401.09','401.09','Ml','Tapado a mano de zanjas en tierra',28.00,31.11,10.00,'401.09');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (18,'402,01','Ud.','Reconstruccion de mocheta hasta 1m, acabada en yeso.',103.83,115.37,41.73,'402.01','402,01','Ud.','Reconstruccion de mocheta hasta 1m, acabada en yeso.',103.83,115.37,41.73,'402.01');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (19,'402,02','Ud.','Reconstruccion de mocheta hasta 2,5m, acabada en yeso.',180.89,200.99,73.06,'402.02','402,02','Ud.','Reconstruccion de mocheta hasta 2,5m, acabada en yeso.',180.89,200.99,73.06,'402.02');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (20,'402.03','Ud.','Reconstruccion de mocheta hasta 1m, acabada en mortero de cemento.',134.34,149.27,47.98,'402.03','402.03','Ud.','Reconstruccion de mocheta hasta 1m, acabada en mortero de cemento.',134.34,149.27,47.98,'402.03');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (21,'402.04','Ud.','Reconstruccion de mocheta hasta 2,5m, acabada en mortero de cemento',235.73,261.92,84.19,'402.04','402.04','Ud.','Reconstruccion de mocheta hasta 2,5m, acabada en mortero de cemento',235.73,261.92,84.19,'402.04');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (22,'402.05','Ud.','Tabicado acabado guarnecido y enlucido de yeso, hasta 1/2 m2.',63.70,70.78,22.75,'402.05','402.05','Ud.','Tabicado acabado guarnecido y enlucido de yeso, hasta 1/2 m2.',63.70,70.78,22.75,'402.05');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (23,'402.06','Ud.','Tabicado acabado guarnecido y enlucido de yeso,  hasta 1 m2.',105.31,117.01,37.61,'402.06','402.06','Ud.','Tabicado acabado guarnecido y enlucido de yeso,  hasta 1 m2.',105.31,117.01,37.61,'402.06');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (24,'402.07','Ud.','Tabicado acabado enfoscado de mortero de cemento hasta 1/2 m2.',70.97,78.86,25.28,'402.07','402.07','Ud.','Tabicado acabado enfoscado de mortero de cemento hasta 1/2 m2.',70.97,78.86,25.28,'402.07');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (25,'402.08','Ud.','Tabicado acabado enfoscado de mortero de cemento hasta 1 m2.',110.54,122.82,41.73,'402.08','402.08','Ud.','Tabicado acabado enfoscado de mortero de cemento hasta 1 m2.',110.54,122.82,41.73,'402.08');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (26,'402.09','Ud.','Tabicado de pared, m2 adicional.',40.21,44.68,15.03,'402.09','402.09','Ud.','Tabicado de pared, m2 adicional.',40.21,44.68,15.03,'402.09');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (27,'403.01','M2','Tendido de yeso negro.',18.42,20.47,7.01,'403.01','403.01','M2','Tendido de yeso negro.',18.42,20.47,7.01,'403.01');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (28,'403.02','M2','Enlucido de yeso blanco.',14.99,16.66,6.01,'403.02','403.02','M2','Enlucido de yeso blanco.',14.99,16.66,6.01,'403.02');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (29,'403.03','M2','Enfoscado de mortero de cemento.',24.59,27.32,10.51,'403.03','403.03','M2','Enfoscado de mortero de cemento.',24.59,27.32,10.51,'403.03');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (30,'403.04','M2','Alicatado o solado.',65.41,72.68,26.04,'403.04','403.04','M2','Alicatado o solado.',65.41,72.68,26.04,'403.04');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (31,'403.05','M2','Alicatado o solado, para superficie mayor de 3m2.',50.38,55.98,19.42,'403.05','403.05','M2','Alicatado o solado, para superficie mayor de 3m2.',50.38,55.98,19.42,'403.05');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (32,'403.06','M2','Solera de mortero de cemento fratasado, hasta 5 cm de espesor',19.44,21.60,12.75,'403.06','403.06','M2','Solera de mortero de cemento fratasado, hasta 5 cm de espesor',19.44,21.60,12.75,'403.06');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (33,'403.07','M2','Solado de terrazo',49.21,54.68,24.19,'403.07','403.07','M2','Solado de terrazo',49.21,54.68,24.19,'403.07');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (34,'403.08','Ml','Moldura de escayola.',18.99,21.10,7.51,'403.08','403.08','Ml','Moldura de escayola.',18.99,21.10,7.51,'403.08');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (35,'403.09','Ud.','Falso techo de escayola, hasta 1 m2. y hasta una altura de 2,50 m.',56.32,62.58,22.35,'403.09','406,03','Ud.','Falso techo de escayola, hasta 1 m2. y hasta una altura de 2,50 m.',56.32,62.58,22.35,'406.03');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (36,'403.10','M2','Falso techo de escayola m.adicional, hasta una altura de 2,50 m.',37.93,42.14,15.03,'403.10','406,01','M2','Falso techo de escayola m.adicional, hasta una altura de 2,50 m.',37.93,42.14,15.03,'406.01');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (37,'490,01','Hr.','Mano de obra  oficial de albañilería',39.45,43.83,20.52,'490.01','490,01','Hr.','Mano de obra  oficial de albañilería',39.45,43.83,20.52,'490.01');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (38,'490,02','Hr.','Mano de obra ayudante de albañilería',33.52,37.25,17.44,'490.02','490,02','Hr.','Mano de obra ayudante de albañilería',33.52,37.25,17.44,'490.02');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (39,'490,03','Ud.','Desplazamiento',29.00,29.00,15.00,'490.03','490,03','Ud.','Desplazamiento',29.00,29.00,15.00,'490.03');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (40,'490,04','Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'490.04','490,04','Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'490.04');
insert  into `nuevaalbanileria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N CODIGON`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1N`,`CODIGO`) values (41,'490,05','Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'490.05','490,05','Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'490.05');



#ACTUALIZAMOS LA TABLA NUEVA ALBAÑILERIA Y LA TABLA ARTICULOS

UPDATE `nuevaalbanileria` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGO
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL;
 
UPDATE `nuevaalbanileria`  SET id = 0 WHERE id < 50;

UPDATE articulos AS ar 
 INNER JOIN `nuevaalbanileria` AS nf ON  nf.id = ar.articuloId
 SET ar.codigoReparacion = nf.CODIGON, ar.nombre = nf.DESCRIPCIONN;

#TABLA PINTURA

USE `proasistencia`;

/*Table structure for table `nuevapintura` */

DROP TABLE IF EXISTS `nuevapintura`;

CREATE TABLE `nuevapintura` (
  `Id` int(11) default NULL,
  `MALCODIGON` double default NULL,
  `UNIDADN` varchar(255) default NULL,
  `DESCRIPCIONN` varchar(255) default NULL,
  `VERDEN` decimal(12,2) default NULL,
  `AZULN` decimal(12,2) default NULL,
  `TARIFA1N` decimal(12,2) default NULL,
  `CODIGON` varchar(255) default NULL,
  `MALCODIGO` double default NULL,
  `UNIDAD` varchar(255) default NULL,
  `DESCRIPCION` varchar(255) default NULL,
  `VERDE` decimal(12,2) default NULL,
  `AZUL` decimal(12,2) default NULL,
  `TARIFA1` decimal(12,2) default NULL,
  `CODIGO` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `nuevapintura` */

insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (1,500.01,'Ud.','Pintura al temple liso de 1 a 7 m2.',80.91,89.90,30.59,'500.01',500.01,'Ud.','Pintura al temple liso de 1 a 7 m2.',80.91,89.90,30.59,'500.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (2,500.02,'Ud.','Pintura al temple liso de 7 a 15 m2.',97.39,108.21,36.69,'500.02',500.02,'Ud.','Pintura al temple liso de 7 a 15 m2.',97.39,108.21,36.69,'500.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (3,500.03,'Ud.','Pintura al temple liso m2 adicional.',4.66,5.18,1.50,'500.03',500.03,'Ud.','Pintura al temple liso m2 adicional.',4.66,5.18,1.50,'500.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (4,501.01,'Ud.','Pintura al temple picado de 1 a 7 m2.',109.32,121.47,40.51,'501.01',501.01,'Ud.','Pintura al temple picado de 1 a 7 m2.',109.32,121.47,40.51,'501.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (5,501.02,'Ud.','Pintura al temple picado de 7 a 15 m2.',156.31,173.68,47.28,'501.02',501.02,'Ud.','Pintura al temple picado de 7 a 15 m2.',156.31,173.68,47.28,'501.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (6,501.03,'Ud.','Pintura al temple picado m2 adicional.',7.06,7.84,2.31,'501.03',501.03,'Ud.','Pintura al temple picado m2 adicional.',7.06,7.84,2.31,'501.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (7,502.01,'Ud.','Pintura al temple gotele de 1 a 7 m2.',109.32,121.47,40.51,'502.01',502.01,'Ud.','Pintura al temple gotele de 1 a 7 m2.',109.32,121.47,40.51,'502.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (8,502.02,'Ud.','Pintura al temple gotele de 7 a 15 m2.',124.18,137.98,47.28,'502.02',502.02,'Ud.','Pintura al temple gotele de 7 a 15 m2.',124.18,137.98,47.28,'502.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (9,502.03,'Ud.','Pintura al temple gotele m2 adicional.',7.06,7.84,2.31,'502.03',502.03,'Ud.','Pintura al temple gotele m2 adicional.',7.06,7.84,2.31,'502.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (10,503.01,'Ud.','Pintura plastica lisa de 1 a 7 m2.',103.47,114.97,35.30,'503.01',503.01,'Ud.','Pintura plastica lisa de 1 a 7 m2.',103.47,114.97,35.30,'503.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (11,503.02,'Ud.','Pintura plastica lisa de 7 a 15 m2.',130.54,145.04,42.88,'503.02',503.02,'Ud.','Pintura plastica lisa de 7 a 15 m2.',130.54,145.04,42.88,'503.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (12,503.03,'Ud.','Pintura plastica lisa m2 adicional.',8.27,9.19,2.16,'503.03',503.03,'Ud.','Pintura plastica lisa m2 adicional.',8.27,9.19,2.16,'503.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (13,504.01,'Ud.','Temple picado plastificado de 1 a 7 m2.',167.99,186.66,47.65,'504.01',504.01,'Ud.','Temple picado plastificado de 1 a 7 m2.',167.99,186.66,47.65,'504.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (14,504.02,'Ud.','Temple picado plastificado de 7 a 15 m2.',181.14,201.27,53.01,'504.02',504.02,'Ud.','Temple picado plastificado de 7 a 15 m2.',181.14,201.27,53.01,'504.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (15,504.03,'Ud.','Temple picado plastificado m2 adicional',10.14,11.27,2.52,'504.03',504.03,'Ud.','Temple picado plastificado m2 adicional',10.14,11.27,2.52,'504.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (16,505.01,'Ud.','Temple gotele plastificado de 1 a 7 m2.',135.92,151.02,47.65,'505.01',505.01,'Ud.','Temple gotele plastificado de 1 a 7 m2.',135.92,151.02,47.65,'505.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (17,505.02,'Ud.','Temple gotele plastificado de 7 a 15 m2.',156.31,173.68,53.01,'505.02',505.02,'Ud.','Temple gotele plastificado de 7 a 15 m2.',156.31,173.68,53.01,'505.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (18,505.03,'Ud.','Temple gotele plastificado m2 adicional',9.42,10.47,2.52,'505.03',505.03,'Ud.','Temple gotele plastificado m2 adicional',9.42,10.47,2.52,'505.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (19,506.01,'Ud.','Pasta rayada de 1 a 7 m2.',103.47,114.97,41.67,'506.01',506.01,'Ud.','Pasta rayada de 1 a 7 m2.',103.47,114.97,41.67,'506.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (20,506.02,'Ud.','Pasta rayada de 7 a 15 m2.',130.54,145.04,47.28,'506.02',506.02,'Ud.','Pasta rayada de 7 a 15 m2.',130.54,145.04,47.28,'506.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (21,506.03,'Ud.','Pasta rayada m2 adicional.',8.27,9.19,2.31,'506.03',506.03,'Ud.','Pasta rayada m2 adicional.',8.27,9.19,2.31,'506.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (22,507.01,'Ud.','Pintura al esmalte de 1 a 7 m2.',136.89,152.10,51.47,'507.01',507.01,'Ud.','Pintura al esmalte de 1 a 7 m2.',136.89,152.10,51.47,'507.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (23,507.02,'Ud.','Pintura al esmalte de 7 a 15 m2.',219.00,243.33,69.33,'507.02',507.02,'Ud.','Pintura al esmalte de 7 a 15 m2.',219.00,243.33,69.33,'507.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (24,507.03,'Ud.','Pintura al esmalte m2 adicional.',16.51,18.34,4.22,'507.03',507.03,'Ud.','Pintura al esmalte m2 adicional.',16.51,18.34,4.22,'507.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (25,508.01,'Ud.','Pintura tixotrópica de 1 a 7 m2.',136.89,152.10,51.47,'508.01',508.01,'Ud.','Pintura tixotrópica de 1 a 7 m2.',136.89,152.10,51.47,'508.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (26,508.02,'Ud.','Pintura tixotrópica de 7 a 15 m2.',219.00,243.33,69.33,'508.02',508.02,'Ud.','Pintura tixotrópica de 7 a 15 m2.',219.00,243.33,69.33,'508.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (27,508.03,'Ud.','Pintura tixotrópica m2 adicional.',16.51,18.34,4.22,'508.03',508.03,'Ud.','Pintura tixotrópica m2 adicional.',16.51,18.34,4.22,'508.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (28,509.01,'Ud.','Picado y tendido de paramento de 1 a 7 m2.',150.00,166.67,75.00,'509.01',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (29,509.02,'Ud.','Picado y tendido de paramento de 7 a 15 m2.',260.00,288.89,130.00,'509.02',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (30,509.03,'Ud.','Picado y tendido de paramento m2 adicional.',30.00,33.33,15.00,'509.03',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (31,509.04,'Ud.','Colocación de malla de fibra en grietas  de 1 a 7m2.',50.00,55.56,20.00,'509.04',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (32,509.05,'Ud.','Colocación de malla de fibra en grietas  de 7 a 15 m2.',75.00,83.33,30.00,'509.05',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (33,509.06,'Ud.','Colocación de malla de fibra en grietas  m2 adicional.',17.50,19.44,7.00,'509.06',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (34,590.01,'Hr.','Mano de obra de oficialde pintura.',38.30,42.56,20.52,'590.01',590.01,'Hr.','Mano de obra de oficialde pintura.',38.30,42.56,20.52,'590.01');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (35,590.02,'Hr.','Mano de obra ayudante de pintura.',38.30,42.56,20.52,'590.02',590.02,'Hr.','Mano de obra de pintura.',38.30,42.56,20.52,'590.02');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (36,590.03,'Ud.','Desplazamiento',29.00,29.00,15.00,'590.03',590.03,'Ud.','Desplazamiento',29.00,29.00,15.00,'590.03');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (37,590.04,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'590.04',590.04,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'590.04');
insert  into `nuevapintura`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MALCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (38,590.05,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'590.05',590.05,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'590.05');


#ACTUALIZAMOS LA TABLA NUEVA PINTURA Y LA TABLA ARTICULOS

UPDATE `nuevapintura` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGO
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL;

 UPDATE `nuevapintura` SET id = 0 WHERE id < 50;

 

UPDATE articulos AS ar 
 INNER JOIN `nuevapintura` AS nf ON  nf.id = ar.articuloId
 SET ar.codigoReparacion = nf.CODIGON, ar.nombre = nf.DESCRIPCIONN;

 #TABLA CRISTALERIA

 USE `proasistencia`;

/*Table structure for table `nuevacristaleria` */

DROP TABLE IF EXISTS `nuevacristaleria`;

CREATE TABLE `nuevacristaleria` (
  `Id` int(11) default NULL,
  `MALCODIGON` double default NULL,
  `UNIDADN` varchar(255) default NULL,
  `DESCRIPCIONN` varchar(255) default NULL,
  `VERDEN` decimal(12,2) default NULL,
  `AZULN` decimal(12,2) default NULL,
  `TARIFA1N` decimal(12,2) default NULL,
  `CODIGON` varchar(255) default NULL,
  `MAlCODIGO` double default NULL,
  `UNIDAD` varchar(255) default NULL,
  `DESCRIPCION` varchar(255) default NULL,
  `VERDE` decimal(12,2) default NULL,
  `AZUL` decimal(12,2) default NULL,
  `TARIFA1` decimal(12,2) default NULL,
  `CODIGO` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `nuevacristaleria` */

insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (1,800.01,'M2.','Luna pulida de 3 mm.',69.12,76.80,34.42,'800.01',900.01,'M2.','Luna pulida de 3 mm.',69.12,76.80,34.42,'900.01');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (2,800.02,'M2.','Luna pulida de 4 mm.',79.34,88.16,39.51,'800.02',900.02,'M2.','Luna pulida de 4 mm.',79.34,88.16,39.51,'900.02');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (3,800.03,'M2.','Luna pulida de 5 mm.',88.38,98.20,44.00,'800.03',900.03,'M2.','Luna pulida de 5 mm.',88.38,98.20,44.00,'900.03');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (4,800.04,'M2.','Luna pulida de 6 mm.',96.31,107.01,47.95,'800.04',900.04,'M2.','Luna pulida de 6 mm.',96.31,107.01,47.95,'900.04');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (5,800.05,'M2.','Luna pulida de 8 mm.',122.38,135.98,60.93,'800.05',900.05,'M2.','Luna pulida de 8 mm.',122.38,135.98,60.93,'900.05');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (6,800.06,'M2.','Luna pulida de 10 mm.',148.44,164.93,73.90,'800.06',900.06,'M2.','Luna pulida de 10 mm.',148.44,164.93,73.90,'900.06');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (7,801.01,'M2.','Luna Parsol de 5 mm.',98.59,109.54,49.08,'801.01',901.01,'M2.','Luna Parsol de 5 mm.',98.59,109.54,49.08,'901.01');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (8,801.02,'M2.','Luna Parsol de 6 mm.',112.17,124.63,55.85,'801.02',901.02,'M2.','Luna Parsol de 6 mm.',112.17,124.63,55.85,'901.02');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (9,801.03,'M2.','Luna Parsol de 10 mm.',175.66,195.18,87.46,'801.03',901.03,'M2.','Luna Parsol de 10 mm.',175.66,195.18,87.46,'901.03');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (10,802.01,'M2.','Luna espejo de 3 mm.',88.38,98.20,44.00,'802.01',902.01,'M2.','Luna espejo de 3 mm.',88.38,98.20,44.00,'902.01');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (11,802.02,'M2.','Luna espejo 5 mm.',125.81,139.79,62.63,'802.02',902.02,'M2.','Luna espejo 5 mm.',125.81,139.79,62.63,'902.02');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (12,803.01,'M2.','Vidrio listral.',68.00,75.56,33.86,'803.01',903.01,'M2.','Vidrio listral.',68.00,75.56,33.86,'903.01');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (13,803.02,'M2.','Vidrio Madras.',181.31,201.46,90.27,'803.02',903.02,'M2.','Vidrio Madras.',181.31,201.46,90.27,'903.02');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (14,803.03,'M2.','Vidrio armado.',93.48,103.87,46.55,'803.03',903.03,'M2.','Vidrio armado.',93.48,103.87,46.55,'903.03');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (15,804.01,'Ml.','Canto pulido hasta 6 mm.',7.14,7.93,3.56,'804.01',906.01,'Ml.','Canto pulido hasta 6 mm.',7.14,7.93,3.56,'906.01');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (16,804.02,'Ml.','Canto pulido mas de 6 mm.',11.92,13.24,5.92,'804.02',906.02,'Ml.','Canto pulido mas de 6 mm.',11.92,13.24,5.92,'906.02');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (17,804.03,'Ml.','Bisel hasta 6 mm.',14.37,15.97,7.16,'804.03',906.03,'Ml.','Bisel hasta 6 mm.',14.37,15.97,7.16,'906.03');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (18,804.04,'Ml.','Bisel mas de 6 mm.',16.77,18.63,8.35,'804.04',906.04,'Ml.','Bisel mas de 6 mm.',16.77,18.63,8.35,'906.04');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (19,804.05,'Ml.','Taladro hasta 10 mm.',7.20,8.00,3.58,'804.05',906.05,'Ml.','Taladro hasta 10 mm.',7.20,8.00,3.58,'906.05');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (20,804.06,'Ml.','Taladro hasta 40 mm.',20.00,22.22,9.95,'804.06',906.06,'Ml.','Taladro hasta 40 mm.',20.00,22.22,9.95,'906.06');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (21,890.01,'Hr.','Mano de obra de oficial cristalería',52.08,57.87,24.96,'890.01',990.01,'Hr.','Mano de obra de oficial cristalería',52.08,57.87,24.96,'990.01');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (22,890.02,'Hr.','Mano de obra de ayudante de cristalería',26.04,28.93,12.48,'890.02',990.02,'Hr.','Mano de obra de ayudante de cristalería',26.04,28.93,12.48,'990.02');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (23,890.03,'Ud.','Reparación provicional o protección de elementos a sustituir',95.89,106.54,51.83,'890.03',990.03,'Ud.','Reparación provicional o protección de elementos a sustituir',95.89,106.54,51.83,'990.03');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (24,890.04,'Ud.','Desplazamiento',29.00,29.00,15.00,'890.04',990.04,'Ud.','Desplazamiento',29.00,29.00,15.00,'990.04');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (25,890.05,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'890.05',990.05,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'990.05');
insert  into `nuevacristaleria`(`Id`,`MALCODIGON`,`UNIDADN`,`DESCRIPCIONN`,`VERDEN`,`AZULN`,`TARIFA1N`,`CODIGON`,`MAlCODIGO`,`UNIDAD`,`DESCRIPCION`,`VERDE`,`AZUL`,`TARIFA1`,`CODIGO`) values (26,890.06,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'890.06',990.06,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'990.06');

#ACTUALIZAMOS LA TABLA NUEVA CRISTALERIA Y LA TABLA ARTICULOS


UPDATE `nuevacristaleria` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGO
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL;

 UPDATE `nuevacristaleria`  SET id = 0 WHERE id < 50;
 

UPDATE articulos AS ar 
 INNER JOIN `nuevacristaleria` AS nf ON  nf.id = ar.articuloId
 SET ar.codigoReparacion = nf.CODIGON, ar.nombre = nf.DESCRIPCIONN;

 #INSERTAMOS ARTICULOS NUEVOS

 INSERT INTO articulos (codigoreparacion, nombre, grupoArticuloId, precioUnitario, unidadId, tipoProfesionalId)
(SELECT CODIGON AS codigoreparacion, DESCRIPCIONN AS nombre, 46 AS grupoArticuloId, 0.00 AS precioUnitario, 9 
AS unidadId, 2 AS tipoProfesionalId FROM  nuevafontaneria WHERE CODIGON LIKE '1__.%' AND id = 0);

INSERT INTO articulos (codigoreparacion, nombre, grupoArticuloId, precioUnitario, unidadId, tipoProfesionalId)
(SELECT CODIGON AS codigoreparacion, DESCRIPCIONN AS nombre, 45 AS grupoArticuloId, 0.00 AS precioUnitario, 
9 AS unidadId, 4 AS tipoProfesionalId FROM  nuevaelectricidad WHERE id = 0);

INSERT INTO articulos (codigoreparacion, nombre, grupoArticuloId, precioUnitario, unidadId, tipoProfesionalId)
(SELECT CODIGON AS codigoreparacion, DESCRIPCIONN AS nombre, 43 AS grupoArticuloId, 0.00 AS precioUnitario, 
9 AS unidadId, 6 AS tipoProfesionalId FROM  nuevacerrajeria WHERE id = 0);

INSERT INTO articulos (codigoreparacion, nombre, grupoArticuloId, precioUnitario, unidadId, tipoProfesionalId)
(SELECT CODIGON AS codigoreparacion, DESCRIPCIONN AS nombre, 47 AS grupoArticuloId, 0.00 AS precioUnitario, 
9 AS unidadId, 5 AS tipoProfesionalId FROM  nuevapintura WHERE id = 0);



#ACTUALIZAMOS LAS IDS DE LAS TABLAS TEMPORALES

UPDATE `nuevaFontaneria` AS nf
LEFT JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGON
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL AND nf.id = 0;

UPDATE `nuevaelectricidad` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGON
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL AND nf.id = 0;

UPDATE `nuevacerrajeria` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGON
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL AND nf.id = 0;
 
 UPDATE `nuevapintura` AS nf
INNER JOIN articulos AS ar ON ar.codigoReparacion = nf.CODIGON
 SET nf.Id = ar.articuloId
 WHERE ar.codigoReparacion IS NOT NULL AND nf.id = 0;

 #ACTUALIZAMOS LA TARIFA AZUL

 

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevafontaneria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.AZULN
WHERE tarifaClienteId = 2;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevaelectricidad` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.AZULN
WHERE tarifaClienteId = 2;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevacerrajeria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.AZULN
WHERE tarifaClienteId = 2;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevaalbanileria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.AZULN
WHERE tarifaClienteId = 2;


UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevapintura` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.AZULN
WHERE tarifaClienteId = 2;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevacristaleria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.AZULN
WHERE tarifaClienteId = 2;


#ACTUALIZAMOS LA TARIFA VERDE


UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevafontaneria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.VERDEN
WHERE tarifaClienteId = 1;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevaelectricidad` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.VERDEN
WHERE tarifaClienteId = 1;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevacerrajeria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.VERDEN
WHERE tarifaClienteId = 1;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevaalbanileria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.VERDEN
WHERE tarifaClienteId = 1;


UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevapintura` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.VERDEN
WHERE tarifaClienteId = 1;

UPDATE tarifas_cliente_lineas AS ta
INNER JOIN `nuevacristaleria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.VERDEN
WHERE tarifaClienteId = 1;


#ACTUALIZAMOS LA TARIFA 1


UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevafontaneria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA1N
WHERE tarifaProveedorId = 1;

UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevaelectricidad` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA1N
WHERE tarifaProveedorId = 1;

UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevacerrajeria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA1N
WHERE tarifaProveedorId = 1;

UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevaalbanileria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA1N
WHERE tarifaProveedorId = 1;


UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevapintura` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA1N
WHERE tarifaProveedorId = 1;

UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevacristaleria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA1N
WHERE tarifaProveedorId = 1;

#ACTUALIZAMOS LA TARIFA 2


UPDATE tarifas_proveedor_lineas AS ta
INNER JOIN `nuevafontaneria` AS nf ON nf.id = ta.articuloId
SET ta.precioUnitario = nf.TARIFA2N
WHERE tarifaProveedorId = 2;

#INSERTAMOS LOS NUEVOS ARTICULOS EN LAS TARIFAS

#fontaneria

INSERT INTO tarifas_cliente_lineas (articuloId, tarifaClienteId, precioUnitario)
SELECT ar.articuloId, 2 AS tarifaClienteId, nf.AZULN AS precioUnitario FROM articulos AS ar
INNER JOIN nuevafontaneria AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevafontaneria` WHERE codigo IS NULL);


INSERT INTO tarifas_cliente_lineas(articuloId, tarifaClienteId, precioUnitario)
SELECT ar.articuloId, 1 AS tarifaClienteId, nf.VERDEN AS precioUnitario FROM articulos AS ar
INNER JOIN nuevafontaneria AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevafontaneria` WHERE codigo IS NULL);

INSERT INTO tarifas_proveedor_lineas (articuloId, tarifaProveedorId, precioUnitario)
SELECT ar.articuloId, 1 AS tarifaProveedorId, nf.TARIFA1N AS precioUnitario FROM articulos AS ar
INNER JOIN nuevafontaneria AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevafontaneria` WHERE codigo IS NULL);


INSERT INTO tarifas_proveedor_lineas (articuloId, tarifaProveedorId, precioUnitario)
SELECT ar.articuloId, 2 AS tarifaProveedorId, nf.TARIFA2N AS precioUnitario FROM articulos AS ar
INNER JOIN nuevafontaneria AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevafontaneria` WHERE codigo IS NULL);


INSERT INTO tarifas_proveedor_lineas (articuloId, tarifaProveedorId, precioUnitario)
SELECT ar.articuloId, 2 AS tarifaProveedorId, 23.00 AS precioUnitario FROM articulos AS ar
WHERE ar.codigoReparacion = '190.02';


#electricidad
INSERT INTO tarifas_cliente_lineas (articuloId, tarifaClienteId, precioUnitario)
SELECT ar.articuloId, 2 AS tarifaClienteId, nf.AZULN AS precioUnitario FROM articulos AS ar
INNER JOIN nuevaelectricidad AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevaelectricidad` WHERE codigo IS NULL);

INSERT INTO tarifas_cliente_lineas (articuloId, tarifaClienteId, precioUnitario)
SELECT ar.articuloId, 1 AS tarifaClienteId, nf.VERDEN AS precioUnitario FROM articulos AS ar
INNER JOIN nuevaelectricidad AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevaelectricidad` WHERE codigo IS NULL);


INSERT INTO tarifas_proveedor_lineas (articuloId, tarifaProveedorId, precioUnitario)
SELECT ar.articuloId, 1 AS tarifaProveedorId, nf.TARIFA1N AS precioUnitario FROM articulos AS ar
INNER JOIN nuevaelectricidad AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevaelectricidad` WHERE codigo IS NULL);

#PINTURA

INSERT INTO tarifas_cliente_lineas (articuloId, tarifaClienteId, precioUnitario)
SELECT ar.articuloId, 2 AS tarifaClienteId, nf.AZULN AS precioUnitario FROM articulos AS ar
INNER JOIN nuevapintura AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevapintura` WHERE codigo IS NULL);

INSERT INTO tarifas_cliente_lineas (articuloId, tarifaClienteId, precioUnitario)
SELECT ar.articuloId, 1 AS tarifaClienteId, nf.VERDEN AS precioUnitario FROM articulos AS ar
INNER JOIN nuevapintura AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevapintura` WHERE codigo IS NULL);

INSERT INTO tarifas_proveedor_lineas (articuloId, tarifaProveedorId, precioUnitario)
SELECT ar.articuloId, 1 AS tarifaProveedorId, nf.TARIFA1N AS precioUnitario FROM articulos AS ar
INNER JOIN nuevapintura AS nf ON nf.id = ar.articuloId
WHERE articuloId IN (SELECT id FROM `nuevapintura` WHERE codigo IS NULL);


#antenas

INSERT INTO tarifas_proveedor_lineas (articuloId, tarifaProveedorId, precioUnitario)
SELECT ar.articuloId, 2 AS tarifaProveedorId, 15.00 AS precioUnitario FROM articulos AS ar
WHERE ar.codigoReparacion = '790.03';






