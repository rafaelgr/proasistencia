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


DROP TABLE IF EXISTS `fontaneria_nueva`;

CREATE TABLE `fontaneria_nueva` (
  `Id` int(11) default NULL,
  `unidades` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `VERDE` int(11) default NULL,
  `AZUL` int(11) default NULL,
  `TARIFA 1 (ALFONSO)` int(11) default NULL,
  `TARIFA 2 (AVECAN)` int(11) default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL,
  KEY `ref_font_uni` (`unidadId`),
  CONSTRAINT `ref_font_uni` FOREIGN KEY (`unidadId`) REFERENCES `unidades` (`unidadId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `fontaneria_nueva` */

insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (1,'Ud.','Localización de avería incluso apertura, hasta 1 m2 en escayola.',41,46,12,23,'100.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (2,'Ud.','Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 1 m2.',57,63,18,27,'100.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (3,'Ud.','Localización de avería incluso apertura de cala, suelo, pared, techo no escayola, hasta 2 m2.',59,66,20,36,'100.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (4,'Ud.','Apertura de cala con otras reparaciones',41,46,14,25,'100.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (5,'Ud.','Adiccional m2 de apertura de cala',41,46,14,25,'100.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (6,'Ud.','Localización de fugas, con detector termográfico.\n',308,342,94,171,'100.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (7,'Ud.','Desmontaje y montaje de aparato sanitario.',75,83,18,27,'101.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (8,'Ud.','Desmontaje y montaje de aparato sanitario con otra reparación.',50,56,13,25,'101.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (9,'Ud.','Desmontaje de aparato sanitario con otra reparación.',17,19,7,20,'101.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (10,'Ud.','Únicamente desmontaje de aparato sanitario.',39,44,18,18,'101.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (11,'Ud.','Únicamente montaje aparato sanitario.',45,50,18,20,'101.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (12,'Ud.','Únicamente sustitución de latiguillo.',38,42,18,23,'102.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (13,'Ud.','Sustitución de latiguillo con otra reparación.',22,25,8,20,'102.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (14,'Ud.','Únicamente sustitución de válvula de desagüe.',67,75,24,34,'102.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (15,'Ud.','Sustitución de válvula y rebosadero de bañera.',98,109,32,48,'102.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (16,'Ud.','Sustitución de válvula de desagüe con otra reparación.',54,60,19,43,'102.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (17,'Ud.','\n-Cambio de juntas en aparatos, válvulas.',47,52,14,26,'102.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (18,'Ud.','Sustitución de sifón.',64,71,22,27,'102.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (19,'Ud.','Sustitución de llave de escuadra, por unidad.',49,54,18,32,'103.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (20,'Ud.','Sustitución de llave de corte, hasta  1\"',69,76,25,50,'103.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (21,'Ud.','Tubería de distribución hasta 1\" y hasta 1ml.',111,123,38,41,'104.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (22,'Ud.','Tubería de distribución hasta 1\" y hasta 2ml.',94,104,29,52,'104.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (23,'Ud.','Tubería de distribución hasta 1\" y hasta 3ml.',190,211,65,75,'104.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (24,'Ud.','Tubería de distribución desde 1\"1/4  hasta 2\" y hasta 1ml.',238,264,102,41,'104.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (25,'Ud.','Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 2ml.',94,104,29,52,'104.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (26,'Ud.','Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 3ml.',403,447,172,75,'104.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (27,'Ud.','Reparación de tubería de distribución sin sustitución.',71,79,25,35,'104.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (28,'Ud.','Reparación adiccional de tubería de distribución sin sustitución.\n',29,32,9,15,'104.08',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (29,'Ud.','Reparación de tubería con de gebo tapaporos de 1/2\".',93,103,28,32,'105.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (30,'Ud.','Reparación de tubería con de gebo tapaporos de 3/4\".',93,103,28,40,'105.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (31,'Ud.','Reparación de tubería con de gebo tapaporos de 1\" \n',91,101,28,50,'105.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (32,'Ud.','Reparación de tubería con de gebo tapaporos de 1\" y 1/4\"\n',100,111,33,68,'105.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (33,'Ud.','Reparación de tubería con gebo tapaporos de 1\" Y 1/2.',102,114,34,86,'105.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (34,'Ud.','Reparación de tubería con gebo tapaporos de 2\"',178,198,54,99,'105.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (35,'Ud.','Reparación de tubería con 2 gebos y tramo de tuberia de 1/2\".',118,132,46,60,'105.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (36,'Ud.','Reparación de tubería con 2 gebos y tramo de tuberia 3/4\".',121,134,47,69,'105.08',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (37,'Ud.','Cambio de manguetón de plomo o P.V.C., hasta 1 m, incluye desmontaje y montaje de sanitario.',279,310,83,95,'106.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (38,'Ud.','Cambio de manguetón de plomo o P.V.C. m. adiccional\n-Incluye desmontaje y montaje de sanitario',73,81,22,41,'106.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (39,'Ud.','Reparación de manguetón. (soldadura en frio.)',80,89,28,32,'106.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (40,'Ud.','Sustitución de bote sifónico normal.',201,223,73,81,'107.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (41,'Ud.','Reparación de bote sifónico.',84,93,33,35,'107.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (42,'Ud.','Sustitución hasta 1ml de desagüe de PVC de 40mm de Ø.',96,106,27,35,'108.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (43,'Ud.','Sustitución hasta 2ml de desagüe de PVC de 40mm de Ø.',116,129,29,53,'108.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (44,'Ud.','Sustitución hasta 3 ml de desagüe de PVC de 40mm de Ø.',137,152,37,67,'108.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (45,'Ud.','Sustitución hasta 1ml de desagüe de plomo.',89,99,31,35,'108.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (46,'Ud.','Sustitución hasta 3ml de desagüe de plomo.',145,161,50,67,'108.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (47,'Ud.','Sustitución m. adiccional de desagüe de plomo.',27,30,8,15,'108.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (48,'Ud.','Sustitución hasta 1,5ml de desagüe de fregadero y lavadora.',134,148,45,50,'108.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (49,'Ud.','Sustitución hasta 3ml de desagüe fregadero y lavadora.',152,169,61,68,'108.08',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (50,'Ud.','Reparasión de desagüe de PVC de 40mm de Ø. sin sustitución.',77,86,25,23,'108.09',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (51,'Ud.','Sustitución de injerto sencillo, incluso 1ml bajante.',262,291,79,81,'109.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (52,'Ud.','Sustitución de injerto sencillo, incluso hasta 3ml bajante.',325,361,114,110,'109.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (53,'Ud.','Sustitución de injerto doble, incluso 1ml de bajante.',324,360,88,95,'109.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (54,'Ud.','Sustitución de injerto doble, incluso hasta  3ml de bajante.',365,405,128,120,'109.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (55,'Ud.','Cambio de codo con bajante.',125,139,51,50,'109.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (56,'Ud.','Reparación de unión en bajante.',107,119,42,45,'109.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (57,'Ud.','Sustitución de bajante de pluviales hasta 125mm y hasta 1m.',107,119,44,59,'110.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (58,'Ud.','Sustitución de bajante de pluviales hasta 125mm y hasta 2m.',128,142,39,71,'110.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (59,'Ud.','Sustitución de bajante de pluviales hasta 125mm y hasta 3m.',215,239,59,86,'110.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (60,'Ud.','Sustitución de bajante de fecales o mixta hasta 125mm y hasta 1m.',123,136,53,59,'110.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (61,'Ud.','Sustitución de bajante de fecales o mixta hasta 125mm y hasta 2m.',147,163,39,71,'110.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (62,'Ud.','Sustitución de bajante de fecales o mixta hasta 125mm y hasta 3m.',246,273,98,86,'110.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (63,'Ud.','Reparación  de bajante sin sustitución.',80,89,28,32,'110.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (64,'Ud.','Vaciado o llenado de calefacción.',41,45,12,23,'111.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (65,'Ud.','Desmontaje o montaje de radiador.',49,54,15,27,'111.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (66,'Ud.','Cambio de llave de regulación de radiador.',66,73,22,41,'111.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (67,'Ud.','Cambio de detentor.',53,59,22,41,'111.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (68,'Ud.','Reparación de radiador , cambio de juntas.',89,99,27,50,'111.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (69,'Ud.','Contador de agua fría de 1/2 (13mm) suministro ',40,44,17,30,'112.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (70,'Ud.','Contador de agua fría de 3/4 (20mm) suministro ',64,71,25,45,'112.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (71,'Ud.','Instalación de contador, sin suministro.',42,47,17,30,'112.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (72,'Ud.','Sellados de bañera o ducha.',122,135,37,68,'113.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (73,'Ud.','Reparación de mecanismo de cisterna, sin material.',57,63,17,32,'113.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (74,'Ud.','Reparación de cisterna con sustitución de mecanismo de carga ',64,71,21,39,'113.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (75,'Ud.','Reparación de cisterna con sustitución de mecanismo de descarga ',78,87,26,47,'113.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (76,'Ud.','Reparación de cisterna con sustitución de mecanismo de carga y descarga ',113,125,38,68,'113.05',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (77,'Ud.','Desmontaje y montaje de griferias, sin material.',57,63,17,32,'113.06',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (78,'Ud.','Desmontaje y montaje de termos hasta 80 l., sin material.',157,174,69,126,'113.07',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (79,'Ud.','Desatascos en hogar manual o con máquina de presión.',97,108,30,54,'114.01',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (80,'Ud.','Desatascos en zona comunitaria manual o con máquina de presión.',162,180,50,90,'114.02',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (81,'Hr.','Mano de obra oficial de fontaneria ',39,44,18,27,'190.01',12);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (82,'Hr.','Mano de obra ayudante de fontaneria ',34,37,15,NULL,'190.02',12);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (83,'Ud.','Desplazamiento',29,30,15,0,'190.03',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (84,'Ud.','Desplazamiento superior a 30 km',59,59,30,30,'190.04',9);
insert  into `fontaneria_nueva`(`Id`,`unidades`,`descripcion`,`VERDE`,`AZUL`,`TARIFA 1 (ALFONSO)`,`TARIFA 2 (AVECAN)`,`codigo`,`unidadId`) values (85,'Ud.','Servicio realizado fuera del horario laboral',50,50,25,NULL,'190.05',9);


UPDATE articulos AS ar 
INNER JOIN `fontaneria_nueva` AS fn ON fn.codigo = ar.codigoReparacion
SET ar.nombre = fn.descripcion , ar.unidadId = fn.unidadId;


INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (

SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
21 AS grupoArticuloId, 2 AS tipoProfesionalId FROM fontaneria_nueva AS fn
LEFT JOIN articulos AS ar ON ar.codigoReparacion = fn.codigo
WHERE ar.codigoReparacion IS NULL
);



/*TABLA DE ELECTRICIDAD*/

DROP TABLE IF EXISTS `electricidad_nueva`;

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
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'Ml.','Cambio de linea hasta 2,5 mm2',7.56,8.40,3.75,'203.01',11);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'Ml.','Cambio de linea de 4 mm2 ',7.94,8.82,3.94,'203.02',11);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'Ml.','Cambio de linea hasta 6 mm2 ',8.33,9.26,4.13,'203.03',11);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'Ud.','Intervención mínima en sustitución de linea eléctrica',75.60,84.00,37.50,'203.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'Ud.','Revision instalacion electrica',63.68,70.76,34.88,'203.05',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Hr.','Mano de obra de oficial instalador electricista',39.45,43.83,20.00,'290.01',12);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (22,'Hr.','Mano de obra de ayudante instalador electricista',34.00,37.78,17.00,'290.02',12);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (23,'Ud.','Desplazamiento',29.00,29.00,15.00,'290.03',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (24,'Ud.','Desplazamiento superior a 30km',59.00,59.00,30.00,'290.04',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (25,'Ud.','Incremento de servicio de electricidad realizado fuera del horario laboral',50.00,50.00,25.00,'290.05',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (26,'Ud.','Suministro de tubo de led de 120 cm, tipo Philips o similar.',25.24,28.04,15.77,'250.01',9);
insert  into `electricidad_nueva`(`Id`,`unidades`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (27,'Ud.','Suministro de downlight de led, 18W.',36.15,40.17,24.30,'250.02',9);

DELETE FROM articulos WHERE codigoReparacion LIKE '2__.%';

INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (

SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
45 AS grupoArticuloId, 4 AS tipoProfesionalId FROM electricidad_nueva AS fn
);

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
);


/*ARTICULOS DE PINTURA*/


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





INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (
SELECT
fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
40 AS grupoArticuloId,  8 AS tipoProfesionalId FROM antenas_nueva AS fn
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


INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (
SELECT
fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
44 AS grupoArticuloId,  9 AS tipoProfesionalId FROM cristaleria_nueva AS fn
);

/*CERRAJERIA*/
DROP TABLE IF EXISTS `cerrajeria_nueva`;

CREATE TABLE `cerrajeria_nueva` (
  `Id` int(11) default NULL,
  `UNIDAD` varchar(255) default NULL,
  `descripcion` varchar(255) default NULL,
  `TARIFA VERDE` decimal(12,2) default NULL,
  `TARIFA AZUL` decimal(12,2) default NULL,
  `TARIFA 1` decimal(12,2) default NULL,
  `codigo` varchar(255) default NULL,
  `unidadId` int(11) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `cerrajeria_nueva` */

insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (1,'Ud.','Apertura de puerta',112.12,124.58,55.00,'300.01',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (2,'Ud.','Apertura de puerta con sustitución de bombín o cerradura',165.00,183.33,81.00,'300.02',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (3,'Ud.','Reparacion provisional (con o sin elementos recuperables)',95.89,106.54,51.83,'300.03',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (4,'Ud.','Soldadura con equipo autógeno o eléctrico (Intervención mínima)',129.83,144.26,70.18,'300.04',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (5,'Ud.','Sustitución de bombin normal (Tipo CVL, EZCUR, TESA, AZBE o similar)',99.61,110.68,49.15,'301.01',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (6,'Ud.','Sustituc. bombillo seguridad, pompa o borjas g. baja (EZCURRA,ESA)',143.63,159.59,70.86,'301.02',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (7,'Ud.','Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,ESA)',205.77,228.63,101.51,'301.03',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (8,'Ud.','Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,ESA)',216.29,240.32,106.70,'301.04',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (9,'Ud.','Sust. bombillo seguridad, pompa, borjas g. media, serie alta(STS)',189.46,210.51,93.46,'301.05',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (10,'Ud.','Sustitución cerrojo (LINCE 3940, LINCE 2930, EZCURRA 400 o similar)',152.89,169.88,75.42,'302.01',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (11,'Ud.','Sustitución cerrojo (FAC 300, FAC 301, FAC 307 o similar)',144.79,160.88,71.42,'302.02',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (12,'Ud.','Sustitución de cerradura de buzón incluida apertura',58.27,64.74,38.85,'302.03',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (13,'Ud.','Sustitución de cerradura de buzón sin apertura',49.86,55.40,33.91,'302.04',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (14,'Ud.','Sustitución de muelle básico',178.15,197.94,90.00,'303.01',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (15,'Ud.','Sustitución de muelle Dorma TS-71 ',237.00,263.33,120.00,'303.02',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (16,'Ud.','Adicional chapa aluminio para instalación de muelle ',44.00,48.89,22.00,'303.03',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (17,'Hr.','Mano de obra de oficial de cerrajería.',52.05,57.83,25.91,'390.01',12);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (18,'Hr.','Mano de obra de ayudante de cerrajería',26.03,28.92,12.96,'390.02',12);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (19,'Ud.','Desplazamiento',29.00,29.00,15.00,'390.05',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (20,'Ud.','Desplazamiento superior a 30 Km',59.00,59.00,30.00,'390.06',9);
insert  into `cerrajeria_nueva`(`Id`,`UNIDAD`,`descripcion`,`TARIFA VERDE`,`TARIFA AZUL`,`TARIFA 1`,`codigo`,`unidadId`) values (21,'Ud.','Servicio realizado fuera del horario laboral',50.00,50.00,25.00,'390.07',9);

DELETE FROM articulos WHERE codigoReparacion LIKE '3__.%';

INSERT INTO articulos (nombre, unidadId, codigoReparacion, grupoArticuloId, tipoProfesionalId)  (

SELECT DISTINCT fn.descripcion AS nombre, fn.unidadId AS unidadId, fn.codigo AS codigoReparacion,
43 AS grupoArticuloId, 6 AS tipoProfesionalId FROM cerrajeria_nueva AS fn
);

/*ELIMINAMOS ARTICULOS QUE NO SE USAN*/

DELETE FROM articulos WHERE codigoReparacion IN(
SELECT tmp.codigoReparacion FROM (
	SELECT codigoReparacion FROM articulos WHERE tipoProfesionalId IS NULL AND codigoReparacion IS NOT NULL AND articuloId NOT IN (
	SELECT articuloId FROM facprove_lineas WHERE articuloId IN (
		SELECT articuloId FROM articulos WHERE tipoProfesionalId IS NULL AND codigoReparacion IS NOT NULL
		))
) AS tmp
);


/*-----------------------------------CREACIÓN DE TARIFA VERDE------------------------------------------------*/

INSERT INTO tarifas_cliente (tarifaClienteId,nombre) values(1,'TARIFA VERDE');

DROP TABLE IF EXISTS `tarifa_verde`;

CREATE TABLE `tarifa_verde` (
  `Id` int(11) default NULL,
  `precioUnitario` double default NULL,
  `tarifaId` smallint(6) default NULL,
  `articuloId` smallint(6) default NULL,
  `codigo` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tarifa_verde` */

INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (1,41.25,1,227,'100.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (2,56.88,1,282,'100.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (3,59.4,1,283,'100.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (4,41.25,1,268,'100.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (5,41.25,1,302,'100.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (6,307.8,1,410,'100.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (7,74.65,1,228,'101.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (8,50.25,1,229,'101.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (9,16.73,1,230,'101.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (10,39.45,1,231,'101.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (11,44.67,1,232,'101.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (12,37.92,1,233,'102.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (13,22.09,1,234,'102.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (14,67.3,1,235,'102.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (15,98.25,1,236,'102.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (16,53.85,1,237,'102.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (17,46.98,1,284,'102.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (18,63.64,1,238,'102.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (19,48.51,1,239,'103.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (20,68.77,1,240,'103.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (21,110.54,1,245,'104.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (22,93.96,1,286,'104.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (23,189.81,1,247,'104.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (24,238.02,1,246,'104.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (25,93.96,1,287,'104.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (26,402.54,1,248,'104.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (27,71.22,1,249,'104.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (28,29.16,1,288,'104.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (29,92.56,1,269,'105.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (30,93.14,1,270,'105.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (31,90.72,1,293,'105.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (32,100.13,1,271,'105.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (33,102.21,1,272,'105.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (34,178.2,1,294,'105.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (35,118.36,1,273,'105.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (36,120.61,1,274,'105.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (37,279.14,1,241,'106.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (38,72.9,1,285,'106.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (39,79.83,1,242,'106.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (40,200.97,1,243,'107.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (41,83.76,1,244,'107.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (42,95.58,1,250,'108.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (43,116.25,1,289,'108.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (44,136.65,1,251,'108.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (45,89.32,1,252,'108.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (46,145.13,1,253,'108.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (47,27,1,290,'108.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (48,133.56,1,254,'108.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (49,151.7,1,255,'108.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (50,77.03,1,256,'108.09');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (51,261.6,1,257,'109.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (52,324.82,1,258,'109.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (53,323.8,1,259,'109.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (54,364.81,1,260,'109.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (55,124.95,1,266,'109.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (56,107.17,1,267,'109.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (57,107.35,1,261,'110.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (58,127.98,1,291,'110.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (59,214.69,1,262,'110.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (60,122.81,1,263,'110.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (61,146.7,1,292,'110.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (62,245.64,1,264,'110.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (63,79.83,1,265,'110.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (64,40.5,1,295,'111.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (65,48.6,1,300,'111.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (66,65.61,1,275,'111.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (67,52.95,1,276,'111.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (68,89.1,1,301,'111.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (69,39.86,1,277,'112.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (70,63.63,1,278,'112.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (71,42.1,1,279,'112.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (72,121.5,1,296,'113.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (73,56.7,1,297,'113.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (74,63.81,1,298,'113.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (75,78.1049154279856,1,299,'113.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (76,112.880389543824,1,411,'113.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (77,56.7,1,412,'113.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (78,157,1,413,'113.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (79,97.2,1,303,'114.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (80,162,1,304,'114.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (81,39.45,1,280,'190.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (82,33.51,1,281,'190.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (83,29,1,414,'190.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (84,59,1,415,'190.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (85,50,1,416,'190.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (86,49.94,1,417,'200.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (87,61.92,1,418,'200.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (88,87.73,1,419,'200.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (89,111.89,1,420,'200.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (90,97.54,1,421,'200.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (91,82.17,1,422,'201.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (92,231.46,1,423,'201.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (93,255.81,1,424,'201.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (94,281.21,1,425,'201.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (95,62.55,1,426,'202.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (96,68.58,1,427,'202.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (97,79.35,1,428,'202.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (98,127.96,1,429,'202.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (99,149.97,1,430,'202.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (100,252.89,1,431,'202.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (101,7.56,1,432,'203.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (102,7.94,1,433,'203.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (103,8.33,1,434,'203.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (104,75.6,1,435,'203.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (105,63.68,1,436,'203.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (106,39.45,1,437,'290.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (107,34,1,438,'290.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (108,29,1,439,'290.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (109,59,1,440,'290.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (110,50,1,441,'290.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (111,25.24,1,442,'250.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (112,36.15,1,443,'250.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (113,112.12,1,533,'300.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (114,165,1,534,'300.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (115,95.8855,1,535,'300.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (116,129.833,1,536,'300.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (117,99.61,1,537,'301.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (118,143.63,1,538,'301.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (119,205.77,1,539,'301.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (120,216.29,1,540,'301.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (121,189.46,1,541,'301.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (122,152.89,1,542,'302.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (123,144.79,1,543,'302.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (124,58.27,1,544,'302.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (125,49.86,1,545,'302.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (126,178.15,1,546,'303.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (127,237,1,547,'303.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (128,44,1,548,'303.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (129,52.05,1,549,'390.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (130,26.03,1,550,'390.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (131,29,1,551,'390.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (132,59,1,552,'390.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (133,50,1,553,'390.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (134,13.8,1,136,'400.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (135,21.3,1,137,'400.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (136,35.16,1,138,'400.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (137,22.8,1,132,'400.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (138,26.4,1,133,'400.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (139,31.2,1,139,'400.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (140,30.95,1,140,'400.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (141,44.8,1,141,'400.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (142,80.23,1,146,'401.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (143,118.36,1,147,'401.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (144,92.88,1,131,'401.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (145,106.07,1,444,'401.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (146,93.84,1,445,'401.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (147,129.5,1,446,'401.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (148,69.1,1,447,'401.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (149,44.93,1,448,'401.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (150,28,1,449,'401.09');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (151,103.83,1,144,'402.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (152,180.89,1,145,'402.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (153,134.344,1,450,'402.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (154,235.732,1,451,'402.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (155,63.7,1,452,'402.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (156,105.308,1,453,'402.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (157,70.97,1,454,'402.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (158,110.54,1,455,'402.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (159,40.21,1,456,'402.09');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (160,18.42,1,142,'403.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (161,14.99,1,143,'403.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (162,24.59,1,154,'403.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (163,65.41,1,457,'403.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (164,50.38,1,458,'403.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (165,19.44,1,459,'403.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (166,49.21,1,460,'403.07');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (167,18.99,1,461,'403.08');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (168,56.322,1,134,'406.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (169,37.93,1,150,'406.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (170,39.45,1,156,'490.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (171,33.52,1,157,'490.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (172,29,1,462,'490.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (173,59,1,463,'490.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (174,50,1,464,'490.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (175,80.91,1,465,'500.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (176,97.39,1,466,'500.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (177,4.66,1,467,'500.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (178,109.32,1,468,'501.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (179,156.31,1,469,'501.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (180,7.06,1,470,'501.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (181,109.32,1,471,'502.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (182,124.18,1,472,'502.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (183,7.06,1,473,'502.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (184,103.47,1,474,'503.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (185,130.54,1,475,'503.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (186,8.27,1,476,'503.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (187,167.99,1,477,'504.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (188,181.14,1,478,'504.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (189,10.14,1,479,'504.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (190,135.92,1,480,'505.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (191,156.31,1,481,'505.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (192,9.42,1,482,'505.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (193,103.47,1,483,'506.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (194,130.54,1,484,'506.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (195,8.27,1,485,'506.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (196,136.89,1,486,'507.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (197,219,1,487,'507.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (198,16.51,1,488,'507.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (199,136.89,1,489,'508.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (200,219,1,490,'508.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (201,16.51,1,491,'508.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (202,38.3,1,492,'590.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (203,38.3,1,493,'590.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (204,29,1,494,'590.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (205,59,1,495,'590.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (206,50,1,496,'590.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (207,108.15,1,497,'600.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (208,125,1,498,'600.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (209,108.15,1,499,'690.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (210,125,1,500,'690.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (211,0.4,1,501,'690.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (212,55.4,1,502,'790.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (213,27.7,1,503,'790.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (214,29,1,504,'790.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (215,59,1,505,'790.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (216,50,1,506,'790.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (217,69.12,1,507,'900.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (218,79.34,1,508,'900.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (219,88.38,1,509,'900.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (220,96.31,1,510,'900.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (221,122.38,1,511,'900.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (222,148.44,1,512,'900.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (223,98.59,1,513,'901.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (224,112.17,1,514,'901.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (225,175.66,1,515,'901.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (226,88.38,1,516,'902.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (227,125.81,1,517,'902.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (228,68,1,518,'903.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (229,181.31,1,519,'903.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (230,93.48,1,520,'903.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (231,7.14,1,521,'906.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (232,11.92,1,522,'906.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (233,14.37,1,523,'906.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (234,16.77,1,524,'906.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (235,7.2,1,525,'906.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (236,20,1,526,'906.06');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (237,52.08,1,527,'990.01');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (238,26.04,1,528,'990.02');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (239,95.8855,1,529,'990.03');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (240,29,1,530,'990.04');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (241,59,1,531,'990.05');
INSERT  INTO `tarifa_verde`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) VALUES (242,50,1,532,'990.06');

INSERT INTO `tarifas_cliente_lineas` (`tarifaClienteId`,`articuloId`,`precioUnitario`)

(SELECT tf.tarifaId AS `tarifaClienteId`,  tf.`articuloId` AS `articuloId`, tf.`precioUnitario` AS `precioUnitario` 
FROM tarifa_verde AS tf);

/*-----------------------------------CREACIÓN DE TARIFA AZUL------------------------------------------------*/

INSERT INTO tarifas_cliente (tarifaClienteId,nombre) values(2,'TARIFA AZUL');

DROP TABLE IF EXISTS `tarifa_azul`;

CREATE TABLE `tarifa_azul` (
  `Id` int(11) default NULL,
  `precioUnitario` decimal(12,2) default NULL,
  `tarifaId` smallint(6) default NULL,
  `articuloId` smallint(6) default NULL,
  `codigo` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tarifa_azul` */

insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (1,45.83,2,227,'100.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (2,63.20,2,282,'100.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (3,66.00,2,283,'100.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (4,45.83,2,268,'100.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (5,45.83,2,302,'100.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (6,342.00,2,410,'100.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (7,82.94,2,228,'101.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (8,55.83,2,229,'101.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (9,18.59,2,230,'101.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (10,43.83,2,231,'101.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (11,49.63,2,232,'101.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (12,42.13,2,233,'102.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (13,24.54,2,234,'102.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (14,74.78,2,235,'102.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (15,109.17,2,236,'102.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (16,59.83,2,237,'102.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (17,52.20,2,284,'102.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (18,70.71,2,238,'102.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (19,53.90,2,239,'103.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (20,76.41,2,240,'103.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (21,122.82,2,245,'104.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (22,104.40,2,286,'104.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (23,210.90,2,247,'104.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (24,264.47,2,246,'104.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (25,104.40,2,287,'104.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (26,447.27,2,248,'104.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (27,79.13,2,249,'104.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (28,32.40,2,288,'104.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (29,102.84,2,269,'105.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (30,103.49,2,270,'105.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (31,100.80,2,293,'105.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (32,111.26,2,271,'105.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (33,113.57,2,272,'105.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (34,198.00,2,294,'105.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (35,131.51,2,273,'105.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (36,134.01,2,274,'105.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (37,310.16,2,241,'106.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (38,81.00,2,285,'106.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (39,88.70,2,242,'106.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (40,223.30,2,243,'107.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (41,93.07,2,244,'107.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (42,106.20,2,250,'108.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (43,129.17,2,289,'108.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (44,151.83,2,251,'108.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (45,99.24,2,252,'108.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (46,161.26,2,253,'108.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (47,30.00,2,290,'108.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (48,148.40,2,254,'108.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (49,168.56,2,255,'108.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (50,85.59,2,256,'108.09');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (51,290.67,2,257,'109.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (52,360.91,2,258,'109.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (53,359.78,2,259,'109.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (54,405.34,2,260,'109.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (55,138.83,2,266,'109.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (56,119.08,2,267,'109.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (57,119.28,2,261,'110.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (58,142.20,2,291,'110.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (59,238.54,2,262,'110.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (60,136.46,2,263,'110.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (61,163.00,2,292,'110.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (62,272.93,2,264,'110.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (63,88.70,2,265,'110.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (64,45.00,2,295,'111.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (65,54.00,2,300,'111.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (66,72.90,2,275,'111.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (67,58.83,2,276,'111.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (68,99.00,2,301,'111.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (69,44.29,2,277,'112.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (70,70.70,2,278,'112.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (71,46.78,2,279,'112.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (72,135.00,2,296,'113.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (73,63.00,2,297,'113.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (74,70.90,2,298,'113.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (75,86.78,2,299,'113.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (76,125.42,2,411,'113.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (77,63.00,2,412,'113.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (78,174.44,2,413,'113.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (79,108.00,2,303,'114.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (80,180.00,2,304,'114.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (81,43.83,2,280,'190.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (82,37.23,2,281,'190.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (83,30.00,2,414,'190.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (84,59.00,2,415,'190.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (85,50.00,2,416,'190.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (86,55.49,2,417,'200.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (87,68.80,2,418,'200.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (88,97.48,2,419,'200.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (89,124.32,2,420,'200.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (90,108.38,2,421,'200.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (91,91.30,2,422,'201.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (92,257.18,2,423,'201.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (93,284.23,2,424,'201.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (94,312.46,2,425,'201.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (95,69.50,2,426,'202.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (96,76.20,2,427,'202.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (97,88.17,2,428,'202.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (98,142.18,2,429,'202.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (99,166.63,2,430,'202.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (100,280.99,2,431,'202.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (101,8.40,2,432,'203.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (102,8.82,2,433,'203.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (103,9.26,2,434,'203.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (104,84.00,2,435,'203.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (105,70.76,2,436,'203.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (106,43.83,2,437,'290.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (107,37.78,2,438,'290.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (108,29.00,2,439,'290.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (109,59.00,2,440,'290.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (110,50.00,2,441,'290.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (111,28.04,2,442,'250.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (112,40.17,2,443,'250.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (113,124.58,2,533,'300.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (114,183.33,2,534,'300.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (115,106.54,2,535,'300.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (116,144.26,2,536,'300.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (117,110.68,2,537,'301.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (118,159.59,2,538,'301.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (119,228.63,2,539,'301.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (120,240.32,2,540,'301.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (121,210.51,2,541,'301.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (122,169.88,2,542,'302.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (123,160.88,2,543,'302.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (124,64.74,2,544,'302.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (125,55.40,2,545,'302.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (126,197.94,2,546,'303.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (127,263.33,2,547,'303.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (128,48.89,2,548,'303.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (129,57.83,2,549,'390.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (130,28.92,2,550,'390.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (131,29.00,2,551,'390.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (132,59.00,2,552,'390.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (133,50.00,2,553,'390.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (134,15.33,2,136,'400.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (135,23.67,2,137,'400.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (136,39.07,2,138,'400.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (137,25.33,2,132,'400.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (138,29.33,2,133,'400.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (139,34.67,2,139,'400.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (140,34.39,2,140,'400.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (141,49.78,2,141,'400.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (142,89.14,2,146,'401.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (143,131.51,2,147,'401.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (144,103.20,2,131,'401.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (145,117.86,2,444,'401.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (146,104.27,2,445,'401.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (147,143.89,2,446,'401.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (148,76.78,2,447,'401.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (149,49.92,2,448,'401.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (150,31.11,2,449,'401.09');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (151,115.37,2,144,'402.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (152,200.99,2,145,'402.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (153,149.27,2,450,'402.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (154,261.92,2,451,'402.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (155,70.78,2,452,'402.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (156,117.01,2,453,'402.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (157,78.86,2,454,'402.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (158,122.82,2,455,'402.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (159,44.68,2,456,'402.09');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (160,20.47,2,142,'403.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (161,16.66,2,143,'403.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (162,27.32,2,154,'403.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (163,72.68,2,457,'403.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (164,55.98,2,458,'403.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (165,21.60,2,459,'403.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (166,54.68,2,460,'403.07');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (167,21.10,2,461,'403.08');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (168,62.58,2,134,'406.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (169,42.14,2,150,'406.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (170,43.83,2,156,'490.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (171,37.25,2,157,'490.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (172,29.00,2,462,'490.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (173,59.00,2,463,'490.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (174,50.00,2,464,'490.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (175,89.90,2,465,'500.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (176,108.21,2,466,'500.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (177,5.18,2,467,'500.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (178,121.47,2,468,'501.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (179,173.68,2,469,'501.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (180,7.84,2,470,'501.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (181,121.47,2,471,'502.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (182,137.98,2,472,'502.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (183,7.84,2,473,'502.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (184,114.97,2,474,'503.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (185,145.04,2,475,'503.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (186,9.19,2,476,'503.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (187,186.66,2,477,'504.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (188,201.27,2,478,'504.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (189,11.27,2,479,'504.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (190,151.02,2,480,'505.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (191,173.68,2,481,'505.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (192,10.47,2,482,'505.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (193,114.97,2,483,'506.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (194,145.04,2,484,'506.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (195,9.19,2,485,'506.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (196,152.10,2,486,'507.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (197,243.33,2,487,'507.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (198,18.34,2,488,'507.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (199,152.10,2,489,'508.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (200,243.33,2,490,'508.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (201,18.34,2,491,'508.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (202,42.56,2,492,'590.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (203,42.56,2,493,'590.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (204,29.00,2,494,'590.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (205,59.00,2,495,'590.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (206,50.00,2,496,'590.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (207,108.15,2,497,'600.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (208,125.00,2,498,'600.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (209,108.15,2,499,'690.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (210,125.00,2,500,'690.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (211,0.40,2,501,'690.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (212,61.56,2,502,'790.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (213,30.78,2,503,'790.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (214,29.00,2,504,'790.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (215,59.00,2,505,'790.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (216,50.00,2,506,'790.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (217,76.80,2,507,'900.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (218,88.16,2,508,'900.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (219,98.20,2,509,'900.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (220,107.01,2,510,'900.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (221,135.98,2,511,'900.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (222,164.93,2,512,'900.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (223,109.54,2,513,'901.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (224,124.63,2,514,'901.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (225,195.18,2,515,'901.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (226,98.20,2,516,'902.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (227,139.79,2,517,'902.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (228,75.56,2,518,'903.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (229,201.46,2,519,'903.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (230,103.87,2,520,'903.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (231,7.93,2,521,'906.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (232,13.24,2,522,'906.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (233,15.97,2,523,'906.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (234,18.63,2,524,'906.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (235,8.00,2,525,'906.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (236,22.22,2,526,'906.06');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (237,57.87,2,527,'990.01');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (238,28.93,2,528,'990.02');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (239,106.54,2,529,'990.03');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (240,29.00,2,530,'990.04');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (241,59.00,2,531,'990.05');
insert  into `tarifa_azul`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (242,50.00,2,532,'990.06');



INSERT INTO `tarifas_cliente_lineas` (`tarifaClienteId`,`articuloId`,`precioUnitario`)

(SELECT tf.tarifaId AS `tarifaClienteId`,  tf.`articuloId` AS `articuloId`, tf.`precioUnitario` AS `precioUnitario` 
FROM tarifa_azul AS tf);

/*-----------------------------------CREACIÓN DE TARIFA_1------------------------------------------------*/

INSERT INTO tarifas_proveedor (tarifaProveedorId,nombre) values(1,'TARIFA 1 (ALFONSO)');

DROP TABLE IF EXISTS `tarifa_1`;

CREATE TABLE `tarifa_1` (
  `Id` int(11) default NULL,
  `precioUnitario` double default NULL,
  `tarifaId` smallint(6) default NULL,
  `articuloId` smallint(6) default NULL,
  `codigo` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tarifa_1` */

insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (1,12.38,1,227,'100.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (2,18.06,1,282,'100.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (3,19.8,1,283,'100.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (4,13.75,1,268,'100.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (5,13.75,1,302,'100.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (6,94.05,1,410,'100.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (7,18.06,1,228,'101.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (8,13.07,1,229,'101.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (9,6.63,1,230,'101.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (10,18.06,1,231,'101.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (11,18.06,1,232,'101.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (12,18.06,1,233,'102.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (13,7.85,1,234,'102.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (14,24.14,1,235,'102.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (15,31.99,1,236,'102.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (16,19.31,1,237,'102.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (17,14.36,1,284,'102.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (18,22.32,1,238,'102.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (19,17.5,1,239,'103.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (20,24.75,1,240,'103.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (21,37.85,1,245,'104.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (22,28.71,1,286,'104.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (23,64.6,1,247,'104.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (24,101.71,1,246,'104.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (25,28.71,1,287,'104.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (26,172.04,1,248,'104.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (27,25.36,1,249,'104.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (28,8.91,1,288,'104.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (29,27.69,1,269,'105.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (30,28.11,1,270,'105.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (31,27.72,1,293,'105.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (32,33.01,1,271,'105.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (33,34.48,1,272,'105.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (34,54.45,1,294,'105.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (35,46.3,1,273,'105.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (36,47.18,1,274,'105.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (37,82.6,1,241,'106.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (38,22.28,1,285,'106.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (39,28.38,1,242,'106.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (40,73.41,1,243,'107.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (41,32.59,1,244,'107.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (42,27.07,1,250,'108.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (43,29.21,1,289,'108.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (44,37.36,1,251,'108.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (45,30.82,1,252,'108.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (46,50.47,1,253,'108.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (47,8.25,1,290,'108.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (48,44.52,1,254,'108.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (49,60.68,1,255,'108.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (50,25.36,1,256,'108.09');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (51,78.8,1,257,'109.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (52,113.82,1,258,'109.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (53,87.55,1,259,'109.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (54,127.82,1,260,'109.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (55,51.02,1,266,'109.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (56,42.26,1,267,'109.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (57,43.78,1,261,'110.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (58,39.11,1,291,'110.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (59,59.16,1,262,'110.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (60,52.53,1,263,'110.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (61,39.11,1,292,'110.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (62,98.07,1,264,'110.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (63,28.38,1,265,'110.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (64,12.38,1,295,'111.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (65,14.85,1,300,'111.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (66,22.38,1,275,'111.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (67,22.38,1,276,'111.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (68,27.23,1,301,'111.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (69,16.5,1,277,'112.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (70,24.75,1,278,'112.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (71,16.5,1,279,'112.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (72,37.13,1,296,'113.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (73,17.33,1,297,'113.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (74,21.27,1,298,'113.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (75,26.0349718093285,1,299,'113.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (76,37.6267965146079,1,411,'113.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (77,17.33,1,412,'113.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (78,69.3,1,413,'113.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (79,29.7,1,303,'114.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (80,49.5,1,304,'114.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (81,17.96,1,280,'190.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (82,15.26,1,281,'190.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (83,15,1,414,'190.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (84,30,1,415,'190.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (85,25,1,416,'190.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (86,25.41,1,417,'200.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (87,30.72,1,418,'200.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (88,45.94,1,419,'200.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (89,55.51,1,420,'200.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (90,56.82,1,421,'200.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (91,40.77,1,422,'201.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (92,167.46,1,423,'201.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (93,126.91,1,424,'201.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (94,139.51,1,425,'201.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (95,31.03,1,426,'202.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (96,34.02,1,427,'202.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (97,39.37,1,428,'202.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (98,63.48,1,429,'202.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (99,74.4,1,430,'202.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (100,139.2,1,431,'202.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (101,3.75,1,432,'203.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (102,3.94,1,433,'203.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (103,4.13,1,434,'203.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (104,37.5,1,435,'203.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (105,34.88,1,436,'203.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (106,20,1,437,'290.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (107,17,1,438,'290.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (108,15,1,439,'290.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (109,30,1,440,'290.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (110,25,1,441,'290.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (111,15.77,1,442,'250.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (112,24.3,1,443,'250.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (113,55,1,533,'300.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (114,81,1,534,'300.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (115,51.83,1,535,'300.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (116,70.18,1,536,'300.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (117,49.15,1,537,'301.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (118,70.86,1,538,'301.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (119,101.51,1,539,'301.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (120,106.7,1,540,'301.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (121,93.46,1,541,'301.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (122,75.42,1,542,'302.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (123,71.42,1,543,'302.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (124,38.85,1,544,'302.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (125,33.91,1,545,'302.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (126,90,1,546,'303.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (127,120,1,547,'303.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (128,22,1,548,'303.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (129,25.91,1,549,'390.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (130,12.96,1,550,'390.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (131,15,1,551,'390.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (132,30,1,552,'390.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (133,25,1,553,'390.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (134,5.52,1,136,'400.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (135,8.52,1,137,'400.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (136,11.72,1,138,'400.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (137,9.12,1,132,'400.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (138,10.56,1,133,'400.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (139,12.48,1,139,'400.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (140,12.38,1,140,'400.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (141,16,1,141,'400.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (142,26.75,1,146,'401.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (143,41.73,1,147,'401.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (144,25.06,1,131,'401.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (145,40.08,1,444,'401.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (146,34.53,1,445,'401.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (147,46.94,1,446,'401.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (148,38.25,1,447,'401.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (149,22.37,1,448,'401.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (150,10,1,449,'401.09');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (151,41.73,1,144,'402.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (152,73.06,1,145,'402.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (153,47.98,1,450,'402.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (154,84.19,1,451,'402.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (155,22.75,1,452,'402.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (156,37.61,1,453,'402.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (157,25.28,1,454,'402.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (158,41.73,1,455,'402.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (159,15.03,1,456,'402.09');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (160,7.01,1,142,'403.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (161,6.01,1,143,'403.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (162,10.51,1,154,'403.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (163,26.04,1,457,'403.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (164,19.42,1,458,'403.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (165,12.75,1,459,'403.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (166,24.19,1,460,'403.07');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (167,7.51,1,461,'403.08');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (168,22.35,1,134,'406.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (169,15.03,1,150,'406.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (170,20.52,1,156,'490.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (171,17.44,1,157,'490.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (172,15,1,462,'490.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (173,30,1,463,'490.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (174,25,1,464,'490.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (175,30.59,1,465,'500.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (176,36.69,1,466,'500.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (177,1.5,1,467,'500.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (178,40.51,1,468,'501.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (179,47.28,1,469,'501.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (180,2.31,1,470,'501.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (181,40.51,1,471,'502.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (182,47.28,1,472,'502.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (183,2.31,1,473,'502.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (184,35.3,1,474,'503.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (185,42.88,1,475,'503.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (186,2.16,1,476,'503.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (187,47.65,1,477,'504.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (188,53.01,1,478,'504.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (189,2.52,1,479,'504.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (190,47.65,1,480,'505.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (191,53.01,1,481,'505.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (192,2.52,1,482,'505.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (193,41.67,1,483,'506.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (194,47.28,1,484,'506.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (195,2.31,1,485,'506.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (196,51.47,1,486,'507.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (197,69.33,1,487,'507.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (198,4.22,1,488,'507.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (199,51.47,1,489,'508.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (200,69.33,1,490,'508.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (201,4.22,1,491,'508.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (202,20.52,1,492,'590.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (203,20.52,1,493,'590.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (204,15,1,494,'590.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (205,30,1,495,'590.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (206,25,1,496,'590.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (207,73,1,497,'600.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (208,73,1,498,'600.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (209,53,1,499,'690.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (210,53,1,500,'690.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (211,0.4,1,501,'690.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (212,20,1,502,'790.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (213,10,1,503,'790.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (214,15,1,504,'790.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (215,30,1,505,'790.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (216,25,1,506,'790.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (217,34.42,1,507,'900.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (218,39.51,1,508,'900.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (219,44,1,509,'900.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (220,47.95,1,510,'900.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (221,60.93,1,511,'900.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (222,73.9,1,512,'900.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (223,49.08,1,513,'901.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (224,55.85,1,514,'901.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (225,87.46,1,515,'901.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (226,44,1,516,'902.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (227,62.63,1,517,'902.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (228,33.86,1,518,'903.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (229,90.27,1,519,'903.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (230,46.55,1,520,'903.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (231,3.56,1,521,'906.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (232,5.92,1,522,'906.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (233,7.16,1,523,'906.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (234,8.35,1,524,'906.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (235,3.58,1,525,'906.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (236,9.95,1,526,'906.06');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (237,24.96,1,527,'990.01');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (238,12.48,1,528,'990.02');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (239,51.83,1,529,'990.03');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (240,15,1,530,'990.04');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (241,30,1,531,'990.05');
insert  into `tarifa_1`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (242,25,1,532,'990.06');


INSERT INTO `tarifas_proveedor_lineas` (`tarifaProveedorId`,`articuloId`,`precioUnitario`)

(SELECT tf.tarifaId AS `tarifaProveedorId`,  tf.`articuloId` AS `articuloId`, tf.`precioUnitario` AS `precioUnitario` 
FROM tarifa_1 AS tf);

/*-----------------------------------CREACIÓN DE TARIFA_2------------------------------------------------*/

INSERT INTO tarifas_proveedor (tarifaProveedorId,nombre) values(2,'TARIFA 2 (AVECAN)');


DROP TABLE IF EXISTS `tarifa_2`;

CREATE TABLE `tarifa_2` (
  `Id` int(11) default NULL,
  `precioUnitario` decimal(12,2) default NULL,
  `tarifaId` smallint(6) default NULL,
  `articuloId` smallint(6) default NULL,
  `codigo` varchar(255) default NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tarifa_2` */

insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (1,22.50,2,227,'100.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (2,27.00,2,282,'100.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (3,36.00,2,283,'100.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (4,25.00,2,268,'100.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (5,25.00,2,302,'100.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (6,171.00,2,410,'100.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (7,27.00,2,228,'101.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (8,25.00,2,229,'101.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (9,20.00,2,230,'101.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (10,18.00,2,231,'101.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (11,20.00,2,232,'101.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (12,22.50,2,233,'102.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (13,20.00,2,234,'102.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (14,34.20,2,235,'102.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (15,48.00,2,236,'102.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (16,43.00,2,237,'102.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (17,26.10,2,284,'102.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (18,27.00,2,238,'102.07');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (19,31.50,2,239,'103.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (20,49.50,2,240,'103.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (21,40.50,2,245,'104.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (22,52.20,2,286,'104.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (23,74.70,2,247,'104.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (24,40.50,2,246,'104.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (25,52.20,2,287,'104.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (26,74.70,2,248,'104.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (27,35.10,2,249,'104.07');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (28,15.00,2,288,'104.08');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (29,31.50,2,269,'105.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (30,39.60,2,270,'105.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (31,50.40,2,293,'105.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (32,67.50,2,271,'105.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (33,85.50,2,272,'105.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (34,99.00,2,294,'105.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (35,60.00,2,273,'105.07');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (36,69.00,2,274,'105.08');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (37,94.50,2,241,'106.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (38,40.50,2,285,'106.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (39,32.40,2,242,'106.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (40,81.00,2,243,'107.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (41,35.00,2,244,'107.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (42,35.10,2,250,'108.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (43,53.10,2,289,'108.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (44,66.60,2,251,'108.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (45,35.10,2,252,'108.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (46,66.60,2,253,'108.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (47,15.00,2,290,'108.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (48,49.50,2,254,'108.07');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (49,67.50,2,255,'108.08');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (50,22.50,2,256,'108.09');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (51,81.00,2,257,'109.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (52,110.00,2,258,'109.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (53,94.50,2,259,'109.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (54,120.00,2,260,'109.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (55,50.00,2,266,'109.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (56,45.00,2,267,'109.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (57,58.50,2,261,'110.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (58,71.10,2,291,'110.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (59,85.50,2,262,'110.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (60,58.50,2,263,'110.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (61,71.10,2,292,'110.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (62,85.50,2,264,'110.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (63,32.40,2,265,'110.07');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (64,22.50,2,295,'111.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (65,27.00,2,300,'111.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (66,40.50,2,275,'111.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (67,40.50,2,276,'111.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (68,49.50,2,301,'111.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (69,30.00,2,277,'112.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (70,45.00,2,278,'112.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (71,30.00,2,279,'112.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (72,67.50,2,296,'113.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (73,31.50,2,297,'113.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (74,38.66,2,298,'113.03');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (75,47.32,2,299,'113.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (76,68.39,2,411,'113.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (77,31.50,2,412,'113.06');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (78,126.00,2,413,'113.07');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (79,54.00,2,303,'114.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (80,90.00,2,304,'114.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (81,27.00,2,280,'190.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (82,30.00,2,415,'190.04');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (83,0.50,2,416,'190.05');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (84,30.00,2,502,'790.01');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (85,15.00,2,503,'790.02');
insert  into `tarifa_2`(`Id`,`precioUnitario`,`tarifaId`,`articuloId`,`codigo`) values (86,25.00,2,506,'790.05');

INSERT INTO `tarifas_proveedor_lineas` (`tarifaProveedorId`,`articuloId`,`precioUnitario`)

(SELECT tf.tarifaId AS `tarifaProveedorId`,  tf.`articuloId` AS `articuloId`, tf.`precioUnitario` AS `precioUnitario` 
FROM tarifa_2 AS tf);
