/*BORRADO DE TARIFAS*/

UPDATE clientes SET tarifaId = NULL;
UPDATE proveedores SET tarifaId = NULL;


DELETE FROM `tarifas_cliente_lineas`;

DELETE FROM `tarifas_proveedor_lineas`;

DELETE FROM `tarifas_cliente`;

DELETE FROM `tarifas_proveedor`;

ALTER TABLE `articulos`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL AFTER `unidadId`,
  ADD CONSTRAINT `ref_art_tiposProfesiones` FOREIGN KEY (`tipoProfesionalId`) REFERENCES `tipos_profesionales`(`tipoProfesionalId`);


INSERT INTO tipos_profesionales (tipoProfesionalId,nombre) VALUES(6,'CERRAJERO'), (7,'POCERO'), (8,'ANTENISTA'), (9,'CRISTALERO');

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
SET ar.nombre = fn.descripcion , ar.unidadId = fn.unidadId ar.tipoProveedorId = 2;


INSERT INTO articulos (nombre, unidadId, codigoReparacion, , tipoProveedorId)  (

SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
21 AS grupoArticuloId, 2 AS tipoProveedorId FROM fontaneria_nueva AS fn
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

-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (1,'Ud.','Sustitucion de interruptor, enchufe o timbre serie SIMON31 o similar.',49.94,55.49,25.41,'200.01',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (2,'Ud.','Sustitución pulsador con indicador luminoso serie SIMON31 o similar.',61.92,68.80,30.72,'200.02',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (3,'Ud.','Sustitucion automatico escalera T20 o similar',87.73,97.48,45.94,'200.03',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (4,'Ud.','Sustitución de automático de escalera T11 o similar.',111.89,124.32,55.51,'200.04',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (5,'Ud.','Suministro e instalación de detector tipo Koban 360º',97.54,108.38,56.82,'200.05',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (6,'Ud.','Sustitucion de diferencial hasta 2x40A sensibilidad 30mA.',82.17,91.30,40.77,'201.01',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (7,'Ud.','Sustitucion de diferencial de 2x63A sensibilidad 30mA.',231.46,257.18,167.46,'201.02',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (8,'Ud.','Sustitucion de diferencial  hasta 4x40A sensibilidad 300mA.',255.81,284.23,126.91,'201.03',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (9,'Ud.','Sustitucion de diferencial de 4x63A sensibilidad 300mA.',281.21,312.46,139.51,'201.04',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (10,'Ud.','Sustitucion de magnetotermico de hasta 2x25A.',62.55,69.50,31.03,'202.01',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (11,'Ud.','Sustitucion de magnetotermico 2x40A.',68.58,76.20,34.02,'202.02',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (12,'Ud.','Sustitucion de magnetotermico 2x63A.',79.35,88.17,39.37,'202.03',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (13,'Ud.','Sustitucion de magnetotermico de hasta 4x25A.',127.96,142.18,63.48,'202.04',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (14,'Ud.','Sustitucion de magnetotermico 4x40A.',149.97,166.63,74.40,'202.05',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (15,'Ud.','Sustitucion de magnetotermico 4x63A.',252.89,280.99,139.20,'202.06',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'Ml.','Cambio de linea hasta 2,5 mm2',7.56,8.40,3.75,'202.01',NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'Ml.','Cambio de linea de 4 mm2 ',7.94,8.82,3.94,'202.02',NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'Ml.','Cambio de linea hasta 6 mm2 ',8.33,9.26,4.13,'202.03',NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'Ud.','Intervención mínima en sustitución de linea eléctrica',75.60,84.00,37.50,'202.04',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'Ud.','Revision instalacion electrica',63.68,70.76,34.88,'202.05',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Hr.','Mano de obra de oficial instalador electricista',39.45,43.83,20.00,'290.01',12);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (22,'Hr.','Mano de obra de ayudante instalador electricista',34.00,37.78,17.00,'290.02',12);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (23,'Ud.','Desplazamiento',29.00,29.00,15.00,'290.03',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (24,'Ud.','Desplazamiento superior a 30km',59.00,59.00,30.00,'290.04',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (25,'Ud.','Incremento de servicio de electricidad realizado fuera del horario laboral',50.00,50.00,25.00,'290.05',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (26,'Ud.','Suministro de tubo de led de 120 cm, tipo Philips o similar.',25.24,28.04,15.77,'250.01',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (27,'Ud.','Suministro de downlight de led, 18W.',36.15,40.17,24.30,'250.02',9);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (28,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (29,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (30,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (31,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (32,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (33,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (34,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (35,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (36,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
-- insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (37,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

-- UPDATE articulos AS ar 
-- INNER JOIN `electricidad_nueva` AS fn ON fn.codigo = ar.codigoReparacion
-- SET ar.nombre = fn.descripcion , ar.unidadId = fn.unidadId;

-- INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId)  (

-- SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
-- 45 AS grupoArticuloId FROM electricidad_nueva AS fn
-- LEFT JOIN articulos AS ar ON ar.codigorEPARACION = FN.CODIGO
-- WHERE ar.codigoReparacion IS NULL
-- );

/*ARTICULOS DE ALBAÑILERIA*/

DROP TABLE IF EXISTS `albañileria_nueva`;

CREATE TABLE `albañileria_nueva` (
  `Id` int(11) default NULL,
  `Ud` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `TARIFA VERDE` decimal(12,2) default NULL,
  `TARIFA AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL,
  KEY `ref_uni_alb` (`unidadId`),
  CONSTRAINT `ref_uni_alb` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `albañileria_nueva` */

insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (1,'M2','Picado de guarnecido de yeso en techos o paredes',13.80,15.33,5.52,'400.01',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (2,'M2','Picado de enfoscados de mortero de cemento en paredes.',21.30,23.67,8.52,'400.02',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (3,'M2','Picado de  hormigon en soleras o muros',35.16,39.07,11.72,'400.03',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (4,'M2','Picado en techo de escayola.',22.80,25.33,9.12,'400.04',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (5,'M2','Picado en paramentos verticales de ladrillo con guarnecido de yeso',26.40,29.33,10.56,'400.05',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (6,'M2','Picado en paramentos verticales de ladrillo con alicatado',31.20,34.67,12.48,'400.06',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (7,'M2','Picado en suelos con gres, terrazo o similares',30.95,34.39,12.38,'400.07',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (8,'ml','Excavación a mano en zanja en tierra hasta 40 cm de profundidad',44.80,49.78,16.00,'400.08',11);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (9,'Ud.','Tapado de 1/2m2 de cala con enlucido 1 o 2 caras.',80.23,89.14,26.75,'401.01',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (10,'Ud.','Tapado de cala con enlucido 1 o 2 caras 1m2.',118.36,131.51,41.73,'401.02',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (11,'Ud.','Tapado de 1/2m2 de cala en techo de escayola.',92.88,103.20,25.06,'401.03',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (12,'Ud.','Tapado de 1m2 de cala en techo de escayola.',106.07,117.86,40.08,'401.04',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (13,'Ud.','Tapado de 1/2m2 de cala con alicatado o solado a 1cara.',93.84,104.27,34.53,'401.05',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (14,'Ud.','Tapado de 1m2 de cala con alicatado o solado a 1 cara.',129.50,143.89,46.94,'401.06',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (15,'Ud.','Tapado de cala con hormigon 1m2.',69.10,76.78,38.25,'401.07',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'M2','Adicional tapar cala con hormigon',44.93,49.92,22.37,'401.08',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'ml','Tapado a mano de zanjas en tierra',28.00,31.11,10.00,'401.09',11);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'Ud.','Reconstruccion de mocheta hasta 1m, acabada en yeso.',103.83,115.37,41.73,'402.01',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'Ud.','Reconstruccion de mocheta hasta 2,5m, acabada en yeso.',180.89,200.99,73.06,'402.02',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'Ud.','Reconstruccion de mocheta hasta 1m, acabada en mortero de cemento.',134.34,149.27,47.98,'402.03',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Ud.','Reconstruccion de mocheta hasta 2,5m, acabada en mortero de cemento',235.73,261.92,84.19,'402.04',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (22,'Ud.','Tabicado acabado guarnecido y enlucido de yeso, hasta 1/2 m2.',63.70,70.78,22.75,'402.05',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (23,'Ud.','Tabicado acabado guarnecido y enlucido de yeso,  hasta 1 m2.',105.31,117.01,37.61,'402.06',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (24,'Ud.','Tabicado acabado enfoscado de mortero de cemento hasta 1/2 m2.',70.97,78.86,25.28,'402.07',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (25,'Ud.','Tabicado acabado enfoscado de mortero de cemento hasta 1 m2.',110.54,122.82,41.73,'402.08',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (26,'Ud.','Tabicado de pared, m2 adicional.',40.21,44.68,15.03,'402.09',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (27,'M2','Tendido de yeso negro.',18.42,20.47,7.01,'403.01',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (28,'M2','Enlucido de yeso blanco.',14.99,16.66,6.01,'403.02',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (29,'M2','Enfoscado de mortero de cemento.',24.59,27.32,10.51,'403.03',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (30,'M2','Alicatado o solado.',65.41,72.68,26.04,'403.04',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (31,'M2','Alicatado o solado, para superficie mayor de 3m2.',50.38,55.98,19.42,'403.05',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (32,'M2','Solera de mortero de cemento fratasado, hasta 5 cm de espesor',19.44,21.60,12.75,'403.06',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (33,'M2','Solado de terrazo',49.21,54.68,24.19,'403.07',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (34,'ml','Moldura de escayola.',18.99,21.10,7.51,'403.08',11);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (35,'Ud.','Falso techo de escayola, hasta 1 m2. y hasta una altura de 2,50 m.',56.32,62.58,22.35,'406.03',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (36,'M2','Falso techo de escayola m.adicional, hasta una altura de 2,50 m.',37.93,42.14,15.03,'406.01',10);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (37,'Hr.','Mano de obra  oficial de albañilería',39.45,43.83,20.52,'490.01',12);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (38,'Hr.','Mano de obra ayudante de albañilería',33.52,37.25,17.44,'490.02',12);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (39,'Ud.','Desplazamiento',29.00,29.00,15.00,'490.03',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (40,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'490.04',9);
insert  into `albañileria_nueva`(`Id`,`Ud`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (41,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'490.05',9);

UPDATE articulos AS ar 
INNER JOIN `albañileria_nueva` AS fn ON fn.codigo = ar.codigoReparacion
SET ar.nombre = fn.descripcion , ar.unidadId = fn.unidadId;


INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (

SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
21 AS grupoArticuloId, 3 AS tipoProfesionalId FROM albañileria_nueva AS fn
LEFT JOIN articulos AS ar ON ar.codigoReparacion = fn.codigo
WHERE ar.codigoReparacion IS NULL
);

DELETE FROM articulos WHERE codigoReparacion IN
(
SELECT tmp.codigoReparacion FROM 
(SELECT codigoReparacion FROM articulos WHERE  codigoReparacion NOT IN (403.011, 405.02) 
AND codigoReparacion NOT IN (SELECT codigo FROM albañileria_nueva ) AND codigoReparacion LIKE '4__.%') AS tmp
)


/*ARTICULOS DE PINTURA*/

DELETE FROM articulos WHERE codigoReparacion LIKE '5__.%';

DROP TABLE IF EXISTS `pintura_nueva`;

CREATE TABLE `pintura_nueva` (
  `Id` int(11) default NULL,
  `unidades` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `TARIFA VERDE` decimal(12,2) default NULL,
  `TARIFA AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL,
  KEY `ref_pint_uni` (`unidadId`),
  CONSTRAINT `ref_pint_uni` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `pintura_nueva` */

insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (1,'Ud.','Pintura al temple liso de 1 a 7 m2.',80.91,89.90,30.59,'500.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (2,'Ud.','Pintura al temple liso de 7 a 15 m2.',97.39,108.21,36.69,'500.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (3,'Ud.','Pintura al temple liso m2 adicional.',4.66,5.18,1.50,'500.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (4,'Ud.','Pintura al temple picado de 1 a 7 m2.',109.32,121.47,40.51,'501.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (5,'Ud.','Pintura al temple picado de 7 a 15 m2.',156.31,173.68,47.28,'501.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (6,'Ud.','Pintura al temple picado m2 adicional.',7.06,7.84,2.31,'501.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (7,'Ud.','Pintura al temple gotele de 1 a 7 m2.',109.32,121.47,40.51,'502.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (8,'Ud.','Pintura al temple gotele de 7 a 15 m2.',124.18,137.98,47.28,'502.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (9,'Ud.','Pintura al temple gotele m2 adicional.',7.06,7.84,2.31,'502.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (10,'Ud.','Pintura plastica lisa de 1 a 7 m2.',103.47,114.97,35.30,'503.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (11,'Ud.','Pintura plastica lisa de 7 a 15 m2.',130.54,145.04,42.88,'503.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (12,'Ud.','Pintura plastica lisa m2 adicional.',8.27,9.19,2.16,'503.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (13,'Ud.','Temple picado plastificado de 1 a 7 m2.',167.99,186.66,47.65,'504.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (14,'Ud.','Temple picado plastificado de 7 a 15 m2.',181.14,201.27,53.01,'504.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (15,'Ud.','Temple picado plastificado m2 adicional',10.14,11.27,2.52,'504.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'Ud.','Temple gotele plastificado de 1 a 7 m2.',135.92,151.02,47.65,'505.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'Ud.','Temple gotele plastificado de 7 a 15 m2.',156.31,173.68,53.01,'505.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'Ud.','Temple gotele plastificado m2 adicional',9.42,10.47,2.52,'505.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'Ud.','Pasta rayada de 1 a 7 m2.',103.47,114.97,41.67,'506.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'Ud.','Pasta rayada de 7 a 15 m2.',130.54,145.04,47.28,'506.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Ud.','Pasta rayada m2 adicional.',8.27,9.19,2.31,'506.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (22,'Ud.','Pintura al esmalte de 1 a 7 m2.',136.89,152.10,51.47,'507.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (23,'Ud.','Pintura al esmalte de 7 a 15 m2.',219,243.33,69.33,'507.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (24,'Ud.','Pintura al esmalte m2 adicional.',16.51,18.34,4.22,'507.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (25,'Ud.','Pintura tixotrópica de 1 a 7 m2.',136.89,152.10,51.47,'508.01',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (26,'Ud.','Pintura tixotrópica de 7 a 15 m2.',219,243.33,69.33,'508.02',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (27,'Ud.','Pintura tixotrópica m2 adicional.',16.51,18.34,4.22,'508.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (28,'Hr.','Mano de obra de oficialde pintura.',38.3,42.56,20.52,'590.01',12);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (29,'Hr.','Mano de obra de pintura.',38.3,42.56,20.52,'590.02',12);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (30,'Ud.','Desplazamiento',29,29.00,15.00,'590.03',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (31,'Ud.','Desplazamiento superior a 30 Km',59,59.00,30.00,'590.04',9);
insert  into `pintura_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (32,'Ud.','Servicio realizado fuera del horario laboral',50,50.00,25.00,'590.05',9);

DELETE FROM articulos WHERE codigoReparacion LIKE '5__.%';

INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (
SELECT
fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
47 AS grupoArticuloId, 5 AS tipoProfesionalId  FROM pintura_nueva AS fn
);




/*ARTICULOS DE POCERÍA*/

DROP TABLE IF EXISTS `poceria_nueva`;

CREATE TABLE `poceria_nueva` (
  `Id` int(11) default NULL,
  `codigo` varchar(255) default NULL,
  `UNIDAD` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `TARIFA VERDE` decimal(12,2) default NULL,
  `TARIFA AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `unidadId` int(11) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `poceria_nueva` */

insert  into `poceria_nueva`(`Id`,`codigo`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`unidadId`) values (1,'600.01','Ud.','Desplazamiento de cuadrilla',108.15,108.15,73.00,9);
insert  into `poceria_nueva`(`Id`,`codigo`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`unidadId`) values (2,'600.02','Ud.','Desplazamiento de equipo para inspección con cámara de TV.',125.00,125.00,73.00,9);
insert  into `poceria_nueva`(`Id`,`codigo`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`unidadId`) values (3,'690.01','Hr.','Mano de obra de cuadrilla pocería.',108.15,108.15,53.00,12);
insert  into `poceria_nueva`(`Id`,`codigo`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`unidadId`) values (4,'690.02','Hr.','Mano de obra para revisión de instalación con cámara.',125.00,125.00,53.00,12);
insert  into `poceria_nueva`(`Id`,`codigo`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`unidadId`) values (5,'690.03','Ud.','Servicio realizado fuera del horario laboral',0.40,0.40,0.40,9);


DELETE FROM articulos WHERE codigoReparacion LIKE '6__.%';

UPDATE `poceria_nueva` AS an
LEFT JOIN unidades AS u ON u.abrev = an.unidad
SET an.unidadId = u.unidadId;

INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (
SELECT
fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
48 AS grupoArticuloId,  7 AS tipoProfesionalId FROM poceria_nueva AS fn
);


/*ARTICULOS DE ANTENAS*/

DELETE FROM articulos WHERE codigoReparacion LIKE '7__.%';

DROP TABLE IF EXISTS `antenas_nueva`;

CREATE TABLE `antenas_nueva` (
  `Id` int(11) default NULL,
  `CODIGO` varchar(255) default NULL,
  `UNIDAD` varchar(255) default NULL,
  `DESCRIPCION` varchar(255) default NULL,
  `TARIFA VERDE` decimal(12,2) default NULL,
  `TARIFA AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `TARIFA 2` decimal(12,2) default NULL,
  `unidadId` int(11) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `antenas_nueva` */

insert  into `antenas_nueva`(`Id`,`CODIGO`,`UNIDAD`,`DESCRIPCION`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`TARIFA 2`,`unidadId`) values (1,'790.01','hr.','Mano de obra de oficial de servicios técnicos en comunicaciones',55.40,61.56,20.00,30.00,12);
insert  into `antenas_nueva`(`Id`,`CODIGO`,`UNIDAD`,`DESCRIPCION`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`TARIFA 2`,`unidadId`) values (2,'790.02','hr.','Mano de obra de ayudante de servicios técnicos en comunicaciones',27.70,30.78,10.00,15.00,12);
insert  into `antenas_nueva`(`Id`,`CODIGO`,`UNIDAD`,`DESCRIPCION`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`TARIFA 2`,`unidadId`) values (3,'790.03','Ud.','Desplazamiento de tecnico en comunicaciones',29.00,29.00,15.00,0.00,9);
insert  into `antenas_nueva`(`Id`,`CODIGO`,`UNIDAD`,`DESCRIPCION`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`TARIFA 2`,`unidadId`) values (4,'790.04','Ud.','Desplazamiento superior a 30km',59.00,59.00,30.00,0.00,9);
insert  into `antenas_nueva`(`Id`,`CODIGO`,`UNIDAD`,`DESCRIPCION`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`TARIFA 2`,`unidadId`) values (5,'790.05','Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,25.00,9);



UPDATE `antenas_nueva` AS an
LEFT JOIN unidades AS u ON u.abrev = an.unidad
SET an.unidadId = u.unidadId;

INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (
SELECT
fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
48 AS grupoArticuloId,  8 AS tipoProfesionalId FROM antenas_nueva AS fn
);


/*ARTICULOS DE CRISTALERIA*/

DELETE FROM articulos WHERE codigoReparacion LIKE '9__.%';

DROP TABLE IF EXISTS `cristaleria_nueva`;

CREATE TABLE `cristaleria_nueva` (
  `Id` int(11) default NULL,
  `UNIDAD` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `TARIFA VERDE` decimal(12,2) default NULL,
  `TARIFA AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `cristaleria_nueva` */

insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (1,'M2.','Luna pulida de 3 mm.',69.12,76.80,34.42,'900.01',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (2,'M2.','Luna pulida de 4 mm.',79.34,88.16,39.51,'900.02',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (3,'M2.','Luna pulida de 5 mm.',88.38,98.20,44.00,'900.03',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (4,'M2.','Luna pulida de 6 mm.',96.31,107.01,47.95,'900.04',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (5,'M2.','Luna pulida de 8 mm.',122.38,135.98,60.93,'900.05',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (6,'M2.','Luna pulida de 10 mm.',148.44,164.93,73.90,'900.06',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (7,'M2.','Luna Parsol de 5 mm.',98.59,109.54,49.08,'901.01',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (8,'M2.','Luna Parsol de 6 mm.',112.17,124.63,55.85,'901.02',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (9,'M2.','Luna Parsol de 10 mm.',175.66,195.18,87.46,'901.03',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (10,'M2.','Luna espejo de 3 mm.',88.38,98.20,44.00,'902.01',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (11,'M2.','Luna espejo 5 mm.',125.81,139.79,62.63,'902.02',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (12,'M2.','Vidrio listral.',68.00,75.56,33.86,'903.01',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (13,'M2.','Vidrio Madras.',181.31,201.46,90.27,'903.02',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (14,'M2.','Vidrio armado.',93.48,103.87,46.55,'903.03',10);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (15,'ml','Canto pulido hasta 6 mm.',7.14,7.93,3.56,'906.01',11);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'ml','Canto pulido mas de 6 mm.',11.92,13.24,5.92,'906.02',11);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'ml','Bisel hasta 6 mm.',14.37,15.97,7.16,'906.03',11);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'ml','Bisel mas de 6 mm.',16.77,18.63,8.35,'906.04',11);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'ml','Taladro hasta 10 mm.',7.20,8.00,3.58,'906.05',11);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'ml','Taladro hasta 40 mm.',20.00,22.22,9.95,'906.06',11);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Hr.','Mano de obra de oficial cristalería',52.08,57.87,24.96,'990.01',12);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (22,'Hr.','Mano de obra de ayudante de cristalería',26.04,28.93,12.48,'990.02',12);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (23,'Ud.','Reparación provicional o protección de elementos a sustituir',95.89,106.54,51.83,'990.03',9);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (24,'Ud.','Desplazamiento',29.00,29.00,15.00,'990.04',9);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (25,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'990.05',9);
insert  into `cristaleria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (26,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'990.06',9);


UPDATE `cristaleria_nueva` AS an
LEFT JOIN unidades AS u ON u.abrev = an.unidad
SET an.unidadId = u.unidadId;

UPDATE `cristaleria_nueva`  SET unidadId = 10 WHERE unidad = 'M2.'

INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (
SELECT
fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
44 AS grupoArticuloId,  9 AS tipoProfesionalId FROM cristaleria_nueva AS fn
);


