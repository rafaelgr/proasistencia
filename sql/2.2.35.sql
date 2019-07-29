ALTER TABLE `articulos`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL AFTER `unidadId`,
  ADD CONSTRAINT `ref_art_tiposProfesiones` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`);


INSERT INTO tipos_profesionales (nombre) VALUES('CERRAJERO'), ('POCERO'), ('ANTENISTA'), ('CRISTALERO');

UPDATE articulos SET tipoProfesionalId = 2 WHERE codigoReparacion LIKE '1__.%';

UPDATE articulos SET tipoProfesionalId = 4 WHERE codigoReparacion LIKE '2__.%';

UPDATE articulos SET tipoProfesionalId = 6 WHERE codigoReparacion LIKE '3__.%';

UPDATE articulos SET tipoProfesionalId = 3 WHERE codigoReparacion LIKE '4__.%';

UPDATE articulos SET tipoProfesionalId = 5 WHERE codigoReparacion LIKE '5__.%';

UPDATE articulos SET tipoProfesionalId = 7 WHERE codigoReparacion LIKE '6__.%';

UPDATE articulos SET tipoProfesionalId = 8 WHERE codigoReparacion LIKE '7__.%';

UPDATE articulos SET tipoProfesionalId = 9 WHERE codigoReparacion LIKE '9__.%';

INSERT INTO unidades (nombre, abrev) VALUES('HORA', 'Hr.');

/*ARTICULOS DE FONTANERIA*/

CREATE TABLE `fontaneria_nueva` (
  `Id` int(11) default NULL,
  `unidades` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `VERDE` double default NULL,
  `AZUL` double default NULL,
  `TARIFA 1 (ALFONSO)` double default NULL,
  `TARIFA 2 (AVECAN)` double default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL,
  KEY `ref_font_uni` (`unidadId`),
  CONSTRAINT `ref_font_uni` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `fontaneria_nueva` */

insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (1,'Ud.','Localización de avería incluso apertura, hasta 1 m2 en escayola.',41.25,45.8333333333333,12.38,22.5,'100.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (2,'Ud.','Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 1 m2.',56.88,63.2,18.06,27,'100.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (3,'Ud.','Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 2 m2.',59.4,66,19.8,36,'100.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (4,'Ud.','Apertura de cala con otras reparaciones',41.25,45.8333333333333,13.75,25,'100.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (5,'Ud.','Adiccional m2 de apertura de cala',41.25,45.8333333333333,13.75,25,'100.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (6,'Ud.','Localización de fugas, con detector termográfico.\n',307.8,342,94.05,171,'100.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (7,'Ud.','Desmontaje y montaje de aparato sanitario.',74.65,82.9444444444444,18.06,27,'101.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (8,'Ud.','Desmontaje y montaje de aparato sanitario con otra reparación.',50.25,55.8333333333333,13.07,25,'101.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (9,'Ud.','Desmontaje de aparato sanitario con otra reparación.',16.73,18.5888888888889,6.63,20,'101.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (10,'Ud.','Únicamente desmontaje de aparato sanitario.',39.45,43.8333333333333,18.06,18,'101.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (11,'Ud.','Únicamente montaje aparato sanitario.',44.67,49.6333333333333,18.06,20,'101.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (12,'Ud.','Únicamente sustitución de latiguillo.',37.92,42.1333333333333,18.06,22.5,'102.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (13,'Ud.','Sustitución de latiguillo con otra reparación.',22.09,24.5444444444444,7.85,20,'102.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (14,'Ud.','Únicamente sustitución de válvula de desagüe.',67.3,74.7777777777778,24.14,34.2,'102.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (15,'Ud.','Sustitución de válvula y rebosadero de bañera.',98.25,109.166666666667,31.99,48,'102.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (16,'Ud.','Sustitución de válvula de desagüe con otra reparación.',53.85,59.8333333333333,19.31,43,'102.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (17,'Ud.','\n-Cambio de juntas en aparatos, válvulas.',46.98,52.2,14.36,26.1,'102.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (18,'Ud.','Sustitución de sifón.',63.64,70.7111111111111,22.32,27,'102.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (19,'Ud.','Sustitución de llave de escuadra, por unidad.',48.51,53.9,17.5,31.5,'103.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (20,'Ud.','Sustitución de llave de corte, hasta  1\"',68.77,76.4111111111111,24.75,49.5,'103.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (21,'Ud.','Tubería de distribución hasta 1\" y hasta 1ml.',110.54,122.822222222222,37.85,40.5,'104.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (22,'Ud.','Tubería de distribución hasta 1\" y hasta 2ml.',93.96,104.4,28.71,52.2,'104.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (23,'Ud.','Tubería de distribución hasta 1\" y hasta 3ml.',189.81,210.9,64.6,74.7,'104.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (24,'Ud.','Tubería de distribución desde 1\"1/4  hasta 2\" y hasta 1ml.',238.02,264.466666666667,101.71,40.5,'104.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (25,'Ud.','Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 2ml.',93.96,104.4,28.71,52.2,'104.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (26,'Ud.','Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 3ml.',402.54,447.266666666667,172.04,74.7,'104.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (27,'Ud.','Reparación de tubería de distribución sin sustitución.',71.22,79.1333333333333,25.36,35.1,'104.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (28,'Ud.','Reparación adiccional de tubería de distribución sin sustitución.\n',29.16,32.4,8.91,15,'104.08',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (29,'Ud.','Reparación de tubería con de gebo tapaporos de 1/2\".',92.56,102.844444444444,27.69,31.5,'105.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (30,'Ud.','Reparación de tubería con de gebo tapaporos de 3/4\".',93.14,103.488888888889,28.11,39.6,'105.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (31,'Ud.','Reparación de tubería con de gebo tapaporos de 1\" \n',90.72,100.8,27.72,50.4,'105.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (32,'Ud.','Reparación de tubería con de gebo tapaporos de 1\" y 1/4\"\n',100.13,111.255555555556,33.01,67.5,'105.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (33,'Ud.','Reparación de tubería con gebo tapaporos de 1\" Y 1/2.',102.21,113.566666666667,34.48,85.5,'105.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (34,'Ud.','Reparación de tubería con gebo tapaporos de 2\"',178.2,198,54.45,99,'105.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (35,'Ud.','Reparación de tubería con 2 gebos y tramo de tuberia de 1/2\".',118.36,131.511111111111,46.3,60,'105.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (36,'Ud.','Reparación de tubería con 2 gebos y tramo de tuberia 3/4\".',120.61,134.011111111111,47.18,69,'105.08',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (37,'Ud.','Cambio de manguetón de plomo o P.V.C., hasta 1 m, incluye desmontaje y montaje de sanitario.',279.14,310.155555555556,82.6,94.5,'106.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (38,'Ud.','Cambio de manguetón de plomo o P.V.C. m. adiccional\n-Incluye desmontaje y montaje de sanitario',72.9,81,22.28,40.5,'106.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (39,'Ud.','Reparación de manguetón. (soldadura en frio.)',79.83,88.7,28.38,32.4,'106.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (40,'Ud.','Sustitución de bote sifónico normal.',200.97,223.3,73.41,81,'107.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (41,'Ud.','Reparación de bote sifónico.',83.76,93.0666666666667,32.59,35,'107.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (42,'Ud.','Sustitución hasta 1ml de desagüe de PVC de 40mm de Ø.',95.58,106.2,27.07,35.1,'108.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (43,'Ud.','Sustitución hasta 2ml de desagüe de PVC de 40mm de Ø.',116.25,129.166666666667,29.21,53.1,'108.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (44,'Ud.','Sustitución hasta 3 ml de desagüe de PVC de 40mm de Ø.',136.65,151.833333333333,37.36,66.6,'108.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (45,'Ud.','Sustitución hasta 1ml de desagüe de plomo.',89.32,99.2444444444444,30.82,35.1,'108.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (46,'Ud.','Sustitución hasta 3ml de desagüe de plomo.',145.13,161.255555555556,50.47,66.6,'108.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (47,'Ud.','Sustitución m. adiccional de desagüe de plomo.',27,30,8.25,15,'108.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (48,'Ud.','Sustitución hasta 1,5ml de desagüe de fregadero y lavadora.',133.56,148.4,44.52,49.5,'108.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (49,'Ud.','Sustitución hasta 3ml de desagüe fregadero y lavadora.',151.7,168.555555555556,60.68,67.5,'108.08',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (50,'Ud.','Reparasión de desagüe de PVC de 40mm de Ø. sin sustitución.',77.03,85.5888888888889,25.36,22.5,'108.09',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (51,'Ud.','Sustitución de injerto sencillo, incluso 1ml bajante.',261.6,290.666666666667,78.8,81,'109.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (52,'Ud.','Sustitución de injerto sencillo, incluso hasta 3ml bajante.',324.82,360.911111111111,113.82,110,'109.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (53,'Ud.','Sustitución de injerto doble, incluso 1ml de bajante.',323.8,359.777777777778,87.55,94.5,'109.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (54,'Ud.','Sustitución de injerto doble, incluso hasta  3ml de bajante.',364.81,405.344444444444,127.82,120,'109.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (55,'Ud.','Cambio de codo con bajante.',124.95,138.833333333333,51.02,50,'109.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (56,'Ud.','Reparación de unión en bajante.',107.17,119.077777777778,42.26,45,'109.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (57,'Ud.','Sustitución de bajante de pluviales hasta 125mm y hasta 1m.',107.35,119.277777777778,43.78,58.5,'110.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (58,'Ud.','Sustitución de bajante de pluviales hasta 125mm y hasta 2m.',127.98,142.2,39.11,71.1,'110.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (59,'Ud.','Sustitución de bajante de pluviales hasta 125mm y hasta 3m.',214.69,238.544444444444,59.16,85.5,'110.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (60,'Ud.','Sustitución de bajante de fecales o mixta hasta 125mm y hasta 1m.',122.81,136.455555555556,52.53,58.5,'110.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (61,'Ud.','Sustitución de bajante de fecales o mixta hasta 125mm y hasta 2m.',146.7,163,39.11,71.1,'110.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (62,'Ud.','Sustitución de bajante de fecales o mixta hasta 125mm y hasta 3m.',245.64,272.933333333333,98.07,85.5,'110.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (63,'Ud.','Reparación  de bajante sin sustitución.',79.83,88.7,28.38,32.4,'110.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (64,'Ud.','Vaciado o llenado de calefacción.',40.5,45,12.38,22.5,'111.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (65,'Ud.','Desmontaje o montaje de radiador.',48.6,54,14.85,27,'111.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (66,'Ud.','Cambio de llave de regulación de radiador.',65.61,72.9,22.38,40.5,'111.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (67,'Ud.','Cambio de detentor.',52.95,58.8333333333333,22.38,40.5,'111.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (68,'Ud.','Reparación de radiador , cambio de juntas.',89.1,99,27.23,49.5,'111.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (69,'Ud.','Contador de agua fría de 1/2 (13mm) suministro ',39.86,44.2888888888889,16.5,30,'112.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (70,'Ud.','Contador de agua fría de 3/4 (20mm) suministro ',63.63,70.7,24.75,45,'112.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (71,'Ud.','Instalación de contador, sin suministro.',42.1,46.7777777777778,16.5,30,'112.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (72,'Ud.','Sellados de bañera o ducha.',121.5,135,37.13,67.5,'113.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (73,'Ud.','Reparación de mecanismo de cisterna, sin material.',56.7,63,17.33,31.5,'113.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (74,'Ud.','Reparación de cisterna con sustitución de mecanismo de carga ',63.81,70.9,21.27,38.6605586878524,'113.3',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (75,'Ud.','Reparación de cisterna con sustitución de mecanismo de descarga ',78.1049154279856,86.7832393644285,26.0349718093285,47.322655048693,'113.4',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (76,'Ud.','Reparación de cisterna con sustitución de mecanismo de carga y descarga ',112.880389543824,125.422655048693,37.6267965146079,68.3926191696566,'113.5',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (77,'Ud.','Desmontaje y montaje de griferias, sin material.',56.7,63,17.33,31.5,'113.6',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (78,'Ud.','Desmontaje y montaje de termos hasta 80 l., sin material.',157,174.444444444444,69.3,126,'113.7',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (79,'Ud.','Desatascos en hogar manual o con máquina de presión.',97.2,108,29.7,54,'114.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (80,'Ud.','Desatascos en zona comunitaria manual o con máquina de presión.',162,180,49.5,90,'114.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (81,'Hr.','Mano de obra oficial de fontaneria ',39.45,43.8333333333333,17.96,27,'190.01',12);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (82,'Hr.','Mano de obra ayudante de fontaneria ',33.51,37.2333333333333,15.26,NULL,'190.02',12);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (83,'Ud.','Desplazamiento',29,30,15,0,'190.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (84,'Ud.','Desplazamiento superior a 30 km',59,59,30,30,'190.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (85,'Ud.','Servicio realizado fuera del horario laboral',50,50,25,NULL,'190.05',9);

UPDATE articulos AS ar 
INNER JOIN `fontaneria_nueva` AS fn ON fn.codigo = ar.codigoReparacion
SET ar.nombre = fn.descripcion , ar.unidadId = fn.unidadId;


INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId)  (

SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
21 AS grupoArticuloId FROM fontaneria_nueva AS fn
LEFT JOIN articulos AS ar ON ar.codigorEPARACION = FN.CODIGO
WHERE ar.codigoReparacion IS NULL
);


/*TABLA DE ELECTRICIDAD*/

CREATE TABLE `electricidad_nueva` (
  `Id` int(11) default NULL,
  `unidades` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `TARIFA VERDE` decimal(15,2) default NULL,
  `TARIFA AZUL` decimal(15,2) default NULL,
  `TARIFA 1` decimal(15,2) default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL,
  KEY `ref_elec_uni` (`unidadId`),
  CONSTRAINT `ref_elec_uni` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `electricidad_nueva` */

insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (1,'Ud.','Sustitucion de interruptor, enchufe o timbre serie SIMON31 o similar.',49.94,55.49,25.41,'200.01',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (2,'Ud.','Sustitución pulsador con indicador luminoso serie SIMON31 o similar.',61.92,68.80,30.72,'200.02',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (3,'Ud.','Sustitucion automatico escalera T20 o similar',87.73,97.48,45.94,'200.03',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (4,'Ud.','Sustitución de automático de escalera T11 o similar.',111.89,124.32,55.51,'200.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (5,'Ud.','Suministro e instalación de detector tipo Koban 360º',97.54,108.38,56.82,'200.05',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (6,'Ud.','Sustitucion de diferencial hasta 2x40A sensibilidad 30mA.',82.17,91.30,40.77,'201.01',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (7,'Ud.','Sustitucion de diferencial de 2x63A sensibilidad 30mA.',231.46,257.18,167.46,'201.02',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (8,'Ud.','Sustitucion de diferencial  hasta 4x40A sensibilidad 300mA.',255.81,284.23,126.91,'201.03',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (9,'Ud.','Sustitucion de diferencial de 4x63A sensibilidad 300mA.',281.21,312.46,139.51,'201.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (10,'Ud.','Sustitucion de magnetotermico de hasta 2x25A.',62.55,69.50,31.03,'202.01',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (11,'Ud.','Sustitucion de magnetotermico 2x40A.',68.58,76.20,34.02,'202.02',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (12,'Ud.','Sustitucion de magnetotermico 2x63A.',79.35,88.17,39.37,'202.03',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (13,'Ud.','Sustitucion de magnetotermico de hasta 4x25A.',127.96,142.18,63.48,'202.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (14,'Ud.','Sustitucion de magnetotermico 4x40A.',149.97,166.63,74.40,'202.05',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (15,'Ud.','Sustitucion de magnetotermico 4x63A.',252.89,280.99,139.20,'202.06',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'Ml.','Cambio de linea hasta 2,5 mm2',7.56,8.40,3.75,'202.01',NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'Ml.','Cambio de linea de 4 mm2 ',7.94,8.82,3.94,'202.02',NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'Ml.','Cambio de linea hasta 6 mm2 ',8.33,9.26,4.13,'202.03',NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'Ud.','Intervención mínima en sustitución de linea eléctrica',75.60,84.00,37.50,'202.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'Ud.','Revision instalacion electrica',63.68,70.76,34.88,'202.05',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Hr.','Mano de obra de oficial instalador electricista',39.45,43.83,20.00,'290.01',12);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (22,'Hr.','Mano de obra de ayudante instalador electricista',34.00,37.78,17.00,'290.02',12);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (23,'Ud.','Desplazamiento',29.00,29.00,15.00,'290.03',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (24,'Ud.','Desplazamiento superior a 30km',59.00,59.00,30.00,'290.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (25,'Ud.','Incremento de servicio de electricidad realizado fuera del horario laboral',50.00,50.00,25.00,'290.05',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (26,'Ud.','Suministro de tubo de led de 120 cm, tipo Philips o similar.',25.24,28.04,15.77,'250.01',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (27,'Ud.','Suministro de downlight de led, 18W.',36.15,40.17,24.30,'250.02',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (28,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (29,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (30,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (31,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (32,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (33,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (34,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (35,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (36,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (37,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

UPDATE articulos AS ar 
INNER JOIN `fontaneria_nueva` AS fn ON fn.codigo = ar.codigoReparacion
SET ar.nombre = fn.descripcion , ar.unidadId = fn.unidadId;

