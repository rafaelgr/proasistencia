/*
SQLyog Community v13.0.1 (64 bit)
MySQL - 5.7.21 : Database - proasistencia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`proasistencia` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `proasistencia`;

/*Table structure for table `tr_carpinteros` */

DROP TABLE IF EXISTS `tr_carpinteros`;

CREATE TABLE `tr_carpinteros` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `tr_carpinteros` */

insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (706,1000.01,'Sumi y coloc d manetas(prec ref.15,03 e','N','S',39.37,23.16,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (707,1000.02,'Suministro y colocación tope de puerta','N','S',28.38,16.69,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (708,1001.01,'Suministro y colocac de tapetas 2 caras','N','S',93.38,54.94,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (709,1002.01,'Repasar puerta chapeando un canto','N','S',61.34,36.09,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (710,1002.02,'Repas pta q roza n suelo y retocr pern ','N','S',59.51,35.01,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (711,1003.01,'Reparación de urgencia en puerta forza','N','S',91.56,53.86,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (715,1090.01,'Mano de obra carpinterío','N','S',55.6,25.91,0,0,0,0,0,0,0,0,0,0);
insert  into `tr_carpinteros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (716,1090.02,'Desplazamiento de carpintero','N','S',29,15,0,0,0,0,0,0,0,0,0,0);

/*Table structure for table `trf_albanyiles` */

DROP TABLE IF EXISTS `trf_albanyiles`;

CREATE TABLE `trf_albanyiles` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_albanyiles` */

insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (27,407.01,'Solera de mortero de cemento m2.','N','N',25,12.75,0,12.38,0,12.38,0,12.02,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (28,401.03,'Picar hormigon','N','N',23.21,11.72,0,11.38,0,11.38,0,11.38,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (29,400.04,'Tapado de cala con hormigon 1m2.','N','N',76.79,38.25,0,37.14,0,37.14,0,37.14,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (30,400.05,'Adicional de tapar cala con hormigon','N','N',49.91,22.37,0,21.72,0,21.72,0,21.72,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (31,NULL,NULL,'N','N',0,NULL,0,NULL,0,0,0,0,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (32,406.03,'Suministro y colocacion de falso techo m2.','N','N',36,22.35,0,22.35,0,0,0,22.35,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (33,407.02,'Solado de terrazo m2.','N','N',39,24.19,0,23.49,0,23.49,0,23.49,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (201,400.01,'Tapado de cala con enlucido 1 o 2 caras 1m2.','N','S',131.5,41.73,135.45,39.33,0,39.33,0,39.33,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (202,400.02,'Tapado de 1m2 de cala en techo de escayola.','N','S',117.85,40.08,121.39,37.78,0,37.78,0,37.78,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (203,400.03,'Tapado de 1m2 de cala con alicatado o solado a 1 cara.','N','S',143.89,46.94,148.21,44.25,0,44.25,0,44.25,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (204,400.06,'Tapado de 1/2m2 de cala con enlucido 1 o 2 caras.','N','S',89.14,26.75,91.81,25.97,0,25.97,0,25.97,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (205,400.07,'Tapado de 1/2m2 de cala en techo de escayola.','N','S',103.19,25.06,106.29,24.33,0,24.33,0,24.33,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (206,400.08,'Tapado de 1/2m2 de cala con alicatado o solado a 1cara.','N','S',104.28,34.53,107.41,33.52,0,33.52,0,33.52,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (207,403.01,'Tabicado incluso raseado de cemento hasta 1/2m2.','N','S',78.85,25.28,92.14,24.55,0,24.55,0,24.55,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (208,403.02,'Tabicado incluso raseado de cemento hasta 1m2.','N','S',122.81,41.73,126.49,39.33,0,39.33,0,39.33,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (209,402.01,'Reconstruccion de mocheta hasta 1m, acabada en yeso.','N','S',115.37,41.73,118.83,39.33,0,39.33,0,39.33,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (210,402.02,'Reconstruccion de mocheta hasta 2,5m, acabada en yeso.','N','S',200.98,73.06,207.01,68.83,0,55.06,0,55.06,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (211,401.01,'Picado de yeso.','N','S',14.88,5.52,15.33,5.19,0,5.19,0,5.19,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (212,401.02,'Picado de mortero de cemento.','N','S',23.2,8.52,23.9,8.03,0,8.03,0,8.03,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (213,403.011,'Tendido de yeso negro.','N','S',20.47,7.01,21.08,6.6,0,6.6,0,6.6,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (214,404.01,'Enlucido de yeso blanco.','N','S',16.66,6.01,17.16,5.66,0,5.66,0,5.66,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (215,406.01,'Falso techo de escayola, m2 adicional.','N','S',42.16,15.03,43.42,14.16,0,14.16,0,14.16,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (216,406.02,'Moldura de escayola.','N','S',21.1,7.51,21.73,7.09,0,7.09,0,5.82,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (217,405.01,'Alicatado o solado.','N','S',72.68,26.04,74.86,24.55,0,24.55,0,24.55,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (218,405.02,'Alicatado o solado, para superficie mayor de 3m2.','N','S',55.98,19.42,57.66,18.3,0,18.3,0,18.3,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (219,403.03,'Tabicado de pared, m2 adicional.','N','S',44.67,15.03,46.01,14.16,0,14.16,0,14.16,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (220,404.02,'Enfoscado de mortero de cemento.','N','S',27.31,10.51,28.13,9.92,0,9.92,0,9.92,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (221,490.01,'Mano de obra albañilería','N','S',43.83,20.52,43.83,20.52,0,20.52,0,20.52,0,0,0,0);
insert  into `trf_albanyiles`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (222,490.02,'Desplazamiento albanyiles','N','S',29,15,29,15,0,15,0,15,0,0,0,0);

/*Table structure for table `trf_antenistas` */



DROP TABLE IF EXISTS `trf_antenistas`;

CREATE TABLE `trf_antenistas` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) DEFAULT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_antenistas` */

insert  into `trf_antenistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (603,'700.01','Suministro e instalación de telefonillo universal Fermax o similar.','N','N',92.6,59.87,0,0,0,0,0,0,0,0,0,0);
insert  into `trf_antenistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (602,'790.01','Mano de obra servicios técnicos en comunicaciones','N','N',59.33,25.91,0,32,59.33,20,59.33,30,0,0,0,0);
insert  into `trf_antenistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (604,'790.02','Desplazamiento de tecnico en comunicaciones','N','S',29,15,0,0,0,0,0,0,0,0,0,0);


/*Table structure for table `trf_calefactores` */

DROP TABLE IF EXISTS `trf_calefactores`;

CREATE TABLE `trf_calefactores` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_calefactores` */

insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (101,1100.01,'Localización de avería en calefaccion incluso apertura.','N','S',63.19,21.58,62.95,22.44,0,37.5,0,17.53,0,18.06,0,18.06);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (176,1100.02,'Localización de fugas.\n-Con detector termográfico.',NULL,NULL,342,136.8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (169,1101.01,'\n-Vaciado o llenado de calefaccion',NULL,NULL,45,18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (174,1102.01,'\n-Desmontaje o montaje radiadores',NULL,NULL,54,21.6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (149,1102.02,'Cambio de llave de regulación de radiador.','N','S',72.89,26.9,74.82,27.98,0,67.5,0,21.73,0,22.38,0,22.38);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (150,1102.03,'Cambio de detentor.','N','S',58.83,26.9,60.39,27.98,0,67.5,0,21.73,0,22.38,0,22.38);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (175,1102.04,'\n-Reparacion de  radiadores, cambio de juntas',NULL,NULL,99,39.6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (154,1190.01,'Mano de obra de fontanería.','N','S',43.83,20.52,43.66,21.34,0,37.5,0,17.44,0,25,0,17.96);
insert  into `trf_calefactores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (155,1190.02,'Desplazamiento calefactores','N','S',29,15,29,15,0,0,0,15,0,15,0,15);

/*Table structure for table `trf_cerrajeros` */

DROP TABLE IF EXISTS `trf_cerrajeros`;

CREATE TABLE `trf_cerrajeros` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_cerrajeros` */

insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1401,300.01,'Apertura de puerta','N','S',124.57,55,128.31,55,0,55,0,55,0,55,0,55);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1402,301.01,'Sustitución de bombillo normal (Tipo CVL, EZCUR, TESA, AZBE o similar)','N','S',110.67,51.12,113.99,49.15,110.28,39.32,0,64.15,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1403,301.02,'Sustituc. bombillo seguridad, pompa o borjas g. baja (EZCURRA,TESA)','N','S',159.59,73.69,164.38,70.86,159.02,56.69,0,85.86,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1404,301.03,'Sustituc. bombillo seguridad,pompa o borjas g. media (EZCURRA,TESA)','N','S',228.64,105.57,235.5,101.51,227.81,81.21,0,116.51,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1405,301.04,'Sustituc. bombillo seguridad,pompa o borjas g. alta (EZCURRAT,ESA)','N','S',240.32,110.97,247.53,106.7,240.32,85.36,0,121.7,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1406,301.05,'Sust.bombillo seguridad, pompa, borjas gama media, serie alta(STS)','N','S',210.5,97.2,216.82,93.46,216.82,74.77,0,108.46,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1407,302.01,'Sustitución cerrojo (LINCE 3940, LINCE 2930, EZCURRA 400 o similar)','N','S',169.88,78.44,174.98,75.42,174.98,60.34,0,75.42,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1408,302.02,'Sustitución cerrojo (FAC 300, FAC 301, FAC 307 o similar)','N','S',160.89,74.28,165.72,71.42,165.72,57.14,0,71.42,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1409,303.01,'Sustitución de muelle (Tipo Dorma, Azbe)','N','S',197.94,93.6,203.88,90,0,0,0,105,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1410,390.01,'Mano de obra cerrajería.','N','S',57.83,26.95,59.56,25.91,57.83,17.44,0,36,0,0,0,0);
insert  into `trf_cerrajeros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1411,390.02,'Desplazamiento cerrajeros','N','S',29,15,29,15,29,15,0,15,0,0,0,0);

/*Table structure for table `trf_cristaleros` */

DROP TABLE IF EXISTS `trf_cristaleros`;

CREATE TABLE `trf_cristaleros` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_cristaleros` */

insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1301,900.01,'Luna pulida de 3 mm.','N','S',76.81,27.35,79.11,21.61,0,15.45,0,34.42,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1302,900.02,'Luna pulida de 4 mm.','N','S',88.16,31.57,90.49,26.79,0,21.25,0,39.51,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1303,900.03,'Luna pulida de 5 mm.','N','S',98.21,35.51,104.06,32.52,0,27.86,0,44,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1304,900.04,'Luna pulida de 6 mm.','N','S',107.02,37.57,109.83,35.7,0,33.9,0,47.95,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1305,900.05,'Luna pulida de 8 mm.','N','S',135.98,47.67,139.55,45.28,0,40.56,0,60.93,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1306,900.06,'Luna pulida de 10 mm.','N','S',164.93,57.94,169.28,65.28,0,52.15,0,73.9,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1307,901.01,'Luna Parsol de 5 mm.','N','S',109.55,38.69,112.43,36.76,0,36.7,0,49.08,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1308,901.02,'Luna Parsol de 6 mm.','N','S',124.63,43.95,127.91,41.76,0,36.7,0,55.85,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1309,901.03,'Luna Parsol de 10 mm.','N','S',195.17,68.71,200.3,65.28,0,59.43,0,87.46,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1310,902.01,'Luna espejo de 3 mm.','N','S',98.21,34.48,100.8,32.76,0,26.08,0,44,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1311,902.02,'Luna espejo 5 mm.','N','S',139.79,49.21,143.47,46.75,0,29.93,0,63.24,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1312,903.01,'Vidrio listral.','N','S',75.56,26.55,77.54,23.14,0,27.15,0,33.86,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1313,904.01,'Vidrio Madras.','N','S',201.46,70.82,206.76,67.28,0,84.98,0,90.27,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1314,905.01,'Vidrio armado.','N','S',103.88,36.52,106.61,33.04,0,34.18,0,46.55,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1315,906.01,'Canto pulido hasta 6 mm.','N','S',7.93,3,8.14,1.7,0,3.72,0,3.56,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1316,906.02,'Canto pulido mas de 6 mm.','N','S',13.23,4.83,13.57,3.25,0,4.83,0,5.92,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1317,907.01,'Bisel hasta 6 mm.','N','S',15.97,5.82,16.38,5.53,0,2.17,0,7.16,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1318,907.02,'Bisel mas de 6 mm.','N','S',18.64,6.81,19.14,6.47,0,2.17,0,8.35,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1319,908.01,'Taladro hasta 10 mm.','N','S',8.01,2.96,8.23,1.5,0,3.72,0,3.58,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1320,908.02,'Taladro hasta 40 mm.','N','S',22.22,8.79,22.79,8.49,0,4.83,0,9.95,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1321,990.01,'Mano de obra cristalería.','N','S',57.83,18.33,59.56,17.41,0,19.07,0,24.96,0,0,0,0);
insert  into `trf_cristaleros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1322,990.02,'Desplazamiento de cristalero','N','S',29,15,29,15,0,15,0,15,0,0,0,0);

/*Table structure for table `trf_electricistas` */

DROP TABLE IF EXISTS `trf_electricistas`;

CREATE TABLE `trf_electricistas` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_electricistas` */

insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (602,200.01,'Revisión instalación eléctrica','N','S',70.76,32.5,70.76,29.25,0,33.48,70.76,29.25,0,34.88,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (603,201.01,'Sustitución de interruptor, enchufe o timbre serie SIMON31 o similar.','N','S',55.49,25.99,55.28,23.39,0,26.77,55.28,24.09,0,25.41,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (604,201.02,'Sustitución pulsador con indicador luminoso serie SIMON31 o similar.','N','S',70.33,28.06,0,0,0,0,0,28.21,0,30.72,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (605,201.03,'Sustitución de automático de escalera T20 o similar.','N','S',97.48,70.47,132.99,63.42,0,70.47,132.99,65.32,0,45.94,0,70.47);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (606,201.04,'Sustitución de automático de escalera T11 o similar.','N','S',124.33,0,0,0,0,0,0,0,0,55.51,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (621,201.05,'Suministro e instalación de detector tipo Koban 360º','N','N',97.54,56.82,97.54,56.82,0,0,0,56.82,0,56.82,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (607,202.03,'Sustitución de diferencial hasta 2x40A sensibilidad 30mA.','N','S',91.31,45.4,123.1,40.86,0,46.76,120.57,42.08,0,40.77,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (608,202.04,'Sustitución de diferencial de 2x63A sensibilidad 30mA.','N','S',375.06,148.07,508.05,133.82,0,153.15,444.99,137.83,0,167.46,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (609,202.05,'Sustitución de diferencial de 4x40A sensibilidad 300mA.','N','S',246.41,102.32,342.38,92.09,0,105.39,300.45,94.85,0,110.02,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (610,202.06,'Sustitución de diferencial de 4x63A sensibilidad 300mA.','N','S',403.44,128.83,436,115.95,0,132.69,401.99,119.42,0,139.51,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (611,202.07,'Sustitución de diferencial hasta 4x40A sensibilidad 30mA.','N','S',284.24,118.33,396.02,106.5,0,121.88,347.96,122.13,0,126.91,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (612,202.08,'Sustitución de magnetotérmico 2x25A.','N','S',69.5,28.45,116.23,25.61,0,29.3,69.83,26.37,0,31.03,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (613,202.09,'Sustitución de magnetotérmico 2x40A.','N','S',76.19,39.85,138.37,35.87,0,41.05,103.04,36.94,0,34.02,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (614,202.10,'Sustitución de magnetotérmico 2x50A.','N','S',88.17,48.89,221.07,44,0,50.36,160.31,49.11,0,39.37,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (615,202.11,'Sustitución de magnetotérmico 4x25A.','N','S',142.17,48.55,193.22,43.7,0,50.01,167.79,66.67,0,63.48,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (616,202.12,'Sustitución de magnetotérmico 4x40A.','N','S',166.63,58.23,227.6,52.41,0,59.98,206.65,78.17,0,74.4,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (617,202.13,'Sustitución de magnetotérmico 4x50A.','N','S',280.97,105.03,431.26,94.53,0,108.18,279.96,97.36,0,139.2,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (618,203.01,'Cambio de línea hasta 2,5 mm2 ','N','S',8.4,4.14,10.79,3.73,0,4.26,10.79,3.84,0,3.75,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (619,203.02,'Cambio de línea de 4 mm2','N','S',8.83,4.2,13.57,3.78,0,4.33,13.57,3.89,0,3.94,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (620,203.03,'Cambio de línea hasta 6 mm2 ','N','S',9.25,5.16,14.75,4.64,14.75,5.31,14.75,4.78,0,4.13,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (622,204.01,'Suministro de tubo de led de 120 cm, tipo Philips o similar.','N','N',25.24,15.77,0,0,0,0,0,0,0,15.77,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (623,204.02,'Suministro de downlight de led, 18W.','N','N',36.15,24.3,0,0,0,0,0,0,0,24.3,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (601,290.01,'Mano de obra de electricidad','N','S',43.83,20.52,43.83,17.44,0,21.99,43.83,17.44,0,20,0,0);
insert  into `trf_electricistas`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (624,290.02,'Desplazamiento electricistas','N','S',29,15,0,0,0,0,0,0,0,15,0,0);

/*Table structure for table `trf_fontaneros` */

DROP TABLE IF EXISTS `trf_fontaneros`;

CREATE TABLE `trf_fontaneros` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) DEFAULT NULL,
  `DESCRIPCION` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  `F18` varchar(255) DEFAULT NULL,
  `F19` varchar(255) DEFAULT NULL,
  `F20` varchar(255) DEFAULT NULL,
  `F21` varchar(255) DEFAULT NULL,
  `F22` varchar(255) DEFAULT NULL,
  `F23` varchar(255) DEFAULT NULL,
  `F24` varchar(255) DEFAULT NULL,
  `F25` varchar(255) DEFAULT NULL,
  `F26` varchar(255) DEFAULT NULL,
  `F27` varchar(255) DEFAULT NULL,
  `F28` varchar(255) DEFAULT NULL,
  `F29` varchar(255) DEFAULT NULL,
  `F30` varchar(255) DEFAULT NULL,
  `F31` varchar(255) DEFAULT NULL,
  `F32` varchar(255) DEFAULT NULL,
  `F33` varchar(255) DEFAULT NULL,
  `F34` varchar(255) DEFAULT NULL,
  `F35` varchar(255) DEFAULT NULL,
  `F36` varchar(255) DEFAULT NULL,
  `F37` varchar(255) DEFAULT NULL,
  `F38` varchar(255) DEFAULT NULL,
  `F39` varchar(255) DEFAULT NULL,
  `F40` varchar(255) DEFAULT NULL,
  `F41` varchar(255) DEFAULT NULL,
  `F42` varchar(255) DEFAULT NULL,
  `F43` varchar(255) DEFAULT NULL,
  `F44` varchar(255) DEFAULT NULL,
  `F45` varchar(255) DEFAULT NULL,
  `F46` varchar(255) DEFAULT NULL,
  `F47` varchar(255) DEFAULT NULL,
  `F48` varchar(255) DEFAULT NULL,
  `F49` varchar(255) DEFAULT NULL,
  `F50` varchar(255) DEFAULT NULL,
  `F51` varchar(255) DEFAULT NULL,
  `F52` varchar(255) DEFAULT NULL,
  `F53` varchar(255) DEFAULT NULL,
  `F54` varchar(255) DEFAULT NULL,
  `F55` varchar(255) DEFAULT NULL,
  `F56` varchar(255) DEFAULT NULL,
  `F57` varchar(255) DEFAULT NULL,
  `F58` varchar(255) DEFAULT NULL,
  `F59` varchar(255) DEFAULT NULL,
  `F60` varchar(255) DEFAULT NULL,
  `F61` varchar(255) DEFAULT NULL,
  `F62` varchar(255) DEFAULT NULL,
  `F63` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_fontaneros` */

insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (101,100.01,'Localización de avería incluso apertura.','N','S',63.19,21.58,62.95,22.44,0,37.5,0,17.53,0,18.06,0,18.06,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (102,101.01,'Desmontaje y montaje de aparato sanitario.','N','S',82.96,25.53,82.98,26.55,0,45,0,17.53,0,18.03,0,18.06,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (103,101.02,'Desmontaje y montaje de aparato sanitario con otra reparación.','N','S',55.84,20.69,57.3,21.52,0,37.5,0,12.69,0,13.07,0,13.07,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (104,101.03,'Desmontaje de aparato sanitario con otra reparación.','N','S',18.59,7.58,19.08,7.88,0,37.5,0,6.44,0,6.63,0,6.63,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (105,101.04,'Únicamente desmontaje de aparato sanitario.','N','S',43.83,20.62,44.97,21.44,0,0,0,17.53,0,18.06,0,18.06,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (106,101.05,'Únicamente montaje aparato sanitario.','N','S',49.64,20.62,50.94,21.44,0,0,0,17.53,0,18.06,0,18.06,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (107,102.01,'Únicamente sustitución de latiguillo.','N','S',42.14,20.62,43.24,21.44,0,37.5,0,17.53,0,18.06,0,18.06,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (108,102.02,'Sustitución de latiguillo con otra reparación.','N','S',24.54,9,25.18,9.36,0,30,0,7.62,0,7.85,0,7.85,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (109,102.03,'Únicamente sustitución de válvula de desagüe.','N','S',74.78,27.58,76.75,28.68,0,57,0,23.44,0,24.14,0,24.14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (110,102.04,'Sustitución de válvula y rebosadero de bañera.','N','S',109.17,36.69,112.04,38.16,0,57,0,31.06,0,31.99,0,31.99,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (111,102.05,'Sustitución de válvula de desagüe con otra reparación.','N','S',59.83,22.07,61.09,22.95,0,43.5,0,18.75,0,19.31,0,19.31,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (112,102.07,'Sustitución de sifón.','N','S',70.71,29,72.56,30.16,0,45,0,21.67,0,22.32,0,22.32,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (113,103.01,'Sustitución de llave de escuadra.','N','S',53.9,23,55.31,23.92,0,52.5,0,16.99,0,17.5,0,17.5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (114,103.02,'Sustitución de llave de corte.','N','S',76.42,30.57,78.42,31.79,0,82.5,0,24.03,0,24.75,0,24.75,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (115,106.01,'Cambio de manguetón de plomo o P.V.C.','N','S',310.16,94.35,318.32,98.12,0,157.5,0,80.19,0,82.6,0,82.6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (116,106.03,'Reparación de manguetón.','N','S',88.7,32.41,91.03,33.71,0,52.5,0,27.55,0,28.38,0,28.38,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (117,107.01,'Sustitución de bote sifónico normal.','N','S',223.3,83.85,229.18,87.2,0,135,0,71.27,0,73.41,0,73.41,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (118,107.02,'Reparación de bote sifónico.','N','S',93.07,37.93,95.51,39.45,0,52.5,0,31.64,0,32.59,0,32.59,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (119,104.01,'Tubería de distribución hasta 1\" y hasta 1ml.','N','S',122.81,45.52,126.03,47.34,0,67.5,0,36.75,0,37.85,0,37.85,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (120,104.04,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 1ml.','N','S',264.47,116.18,263.8,120.83,0,135,0,98.75,0,101.71,0,101.71,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (121,104.03,'Tubería de distribución hasta 1\" y hasta 3ml.','N','S',210.89,83.85,216.44,87.2,0,105,0,62.72,0,64.6,0,64.6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (122,104.06,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 3ml.','N','S',447.28,196.5,459.04,204.36,0,195,0,167.03,0,172.04,0,172.04,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (123,104.07,'Reparación de tubería de distribución sin sustitución.','N','S',79.15,29,81.23,30.16,0,58.5,0,24.62,0,25.36,0,25.36,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (124,108.01,'Sustitución hasta 1ml de desagüe de PVC de 40mm de Ø.','N','S',122.81,53.2,121.78,53.33,0,58.5,0,26.28,0,27.07,0,27.07,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (125,108.03,'Sustitución hasta 3ml de desagüe de PVC de 40mm de Ø.','N','S',151.83,73.26,155.83,76.19,0,111,0,36.27,0,37.36,0,37.36,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (126,108.04,'Sustitución hasta 1ml de desagüe de plomo.','N','S',99.24,40.01,101.85,41.61,0,58.5,0,29.92,0,30.82,0,30.82,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (127,108.05,'Sustitución hasta 3ml de desagüe de plomo.','N','S',161.26,65.51,165.49,68.13,0,111,0,49,0,50.47,0,50.47,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (128,108.07,'Sustitución hasta 1,5ml de desagüe de fregadero y lavadora.','N','S',163.74,60,168.04,62.4,0,82.5,0,43.22,0,44.52,0,44.52,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (129,108.08,'Sustitución hasta 3ml de desagüe fregadero y lavadora.','N','S',248.13,100.67,254.65,104.7,0,112.5,0,85.57,0,88.14,0,88.14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (130,108.09,'Reparación de desagüe sin sustitución.','N','S',85.59,31.72,87.84,32.99,0,37.5,0,24.62,0,25.36,0,25.36,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (131,109.01,'Sustitución de injerto sencillo, incluso 1ml bajante.','N','S',290.67,90,298.31,93.6,0,135,0,76.5,0,78.8,0,78.8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (132,109.02,'Sustitución de injerto sencillo, incluso 3ml bajante.','N','S',360.91,130,370.39,135.2,0,165,0,110.5,0,113.82,0,113.82,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (133,109.03,'Sustitución de injerto doble, incluso 1ml de bajante.','N','S',359.78,100,369.23,0,0,157.5,0,85,0,87.55,0,87.55,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (134,109.04,'Sustitución de injerto doble, incluso 3ml de bajante.','N','S',405.34,146,415.99,151.84,0,180,0,124.1,0,127.82,0,127.82,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (135,110.01,'Sustitución de bajante de pluviales, hasata 1ml.','N','S',119.26,50,122.41,52,0,97.5,0,42.5,0,43.78,0,43.78,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (136,110.03,'Sustitución de bajante de pluviales, tramo hasta 3 ml.','N','S',238.56,67.58,244.83,70.28,0,142.5,0,57.44,0,59.16,0,59.16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (137,110.04,'Sustitución de bajante de fecales o mixta, tramo hasta 1ml.','N','S',136.46,60,140.05,62.4,0,97.5,0,51,0,52.53,0,52.53,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (138,110.06,'Sustitución de bajante de fecales o mixta, tramo hasta 3ml.','N','S',272.93,112.01,280.11,116.49,0,142.5,0,95.21,0,98.07,0,98.07,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (139,110.07,'Reparación  de bajante sin sustitución.','N','S',88.7,32.41,90.54,33.71,0,54,0,27.55,0,28.38,0,28.38,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (140,109.05,'Cambio de codo con banjante.','N','S',138.83,48.27,142.49,50.2,0,75,0,49.53,0,51.02,0,51.02,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (141,109.06,'Reparación de unión en bajante.','N','S',119.08,48.27,118.64,50.2,0,67.5,0,41.03,0,42.26,0,42.26,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (142,100.04,'Apertura de cala.','N','S',54.83,20.62,56.26,21.44,0,45,0,17.53,0,18.06,0,18.06,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (143,105.01,'Reparación de tubería con de gebo tapaporos de 1/2\".','N','S',102.84,31.62,105.53,32.88,0,52.5,0,26.88,0,27.69,0,27.69,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (144,105.02,'Reparación de tubería con de gebo tapaporos de 3/4\".','N','S',103.49,32.1,106.21,33.38,0,66,0,27.29,0,28.11,0,28.11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (145,105.04,'Reparación de tubería con de gebo tapaporos de 1\" Y 1/4.','N','S',111.25,37.71,114.18,39.22,0,84,0,32.05,0,33.01,0,33.01,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (146,105.05,'Reparación de tubería con gebo tapaporos de 1\" Y 1/2.','N','S',113.57,39.39,116.57,40.97,0,142.5,0,33.48,0,34.48,0,34.48,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (147,105.07,'Reparación de tubería con 2 gebos y tramo de tuberia de 1/2\".','N','S',131.5,52.88,134.96,55,0,70.5,0,44.95,0,46.3,0,46.3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (148,105.08,'Reparación de tubería con 2 gebos y tramo de tuberia 3/4\".','N','S',134.01,53.89,137.54,56.05,0,75,0,45.81,0,47.18,0,47.18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (149,111.03,'Cambio de llave de regulación de radiador.','N','S',72.89,26.9,74.82,27.98,0,67.5,0,21.73,0,22.38,0,22.38,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (150,111.04,'Cambio de detentor.','N','S',58.83,26.9,60.39,27.98,0,67.5,0,21.73,0,22.38,0,22.38,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (151,112.01,'Contador de agua fría de 3/4 (20mm)','N','N',70.7,40.05,70.44,40.05,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (152,112.02,'Instalación de contador','N','N',46.76,28.61,46.6,28.61,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (153,112.03,'Suministro contador agua fría 1/2 (13mm)','N','N',44.29,22.3,44.14,22.3,0,0,0,0,0,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (154,190.01,'Mano de obra de fontanería.','N','S',43.83,20.52,43.66,21.34,0,37.5,0,17.44,0,25,0,17.96,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (155,190.02,'Desplazamiento fontaneros','N','S',29,15,29,15,0,0,0,15,0,15,0,15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (156,100.02,'Localización de avería incluso apertura de cala en \n-Escayola',NULL,NULL,63.19,18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (157,100.03,'Localización de avería incluso apertura de cala\n-Suelo, pared, techo, no escayola hasta 2,00 m.',NULL,NULL,63.19,28.8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (158,102.06,'\n-Cambio de juntas en aparatos, válvulas.',NULL,NULL,52.2,20.880000000000003,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (159,106.02,'Cambio de manguetón de plomo o P.V.C. m. adiccional\n-Incluye desmontaje y montaje de sanitario',NULL,NULL,81,32.4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (160,104.02,'Tubería de distribución hasta 1\" y hasta 2ml.\n',NULL,NULL,104.4,41.760000000000005,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (161,104.05,'Tubería de distribución desde 1\"1/4 hasta 2\" y hasta 2ml.',NULL,NULL,104.4,41.760000000000005,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (162,104.08,'Reparación adiccional de tubería de distribución sin sustitución.\n-Reparacion de tuberia con soldadura estaño adiccional',NULL,NULL,32.4,12.96,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (163,108.02,'Sustitución hasta 2ml de desagüe de PVC de 40mm de Ø.\n-Cambio desagüe pvc o plomo 1m',NULL,NULL,106.2,42.480000000000004,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (164,108.06,'Sustitución de desagüe de plomo.\n-Cambio desagüe pvc o plomo adicional +15€',NULL,NULL,30,12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (165,110.02,'Sustitución de bajante de pluviales, hasta 2ml.\n-Sust bajante en pvc hasta 125mm 2 m',NULL,NULL,142.20000000000002,56.88000000000001,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (166,110.05,'Sustitución de bajante de fecales o mixta, tramo hasta 2ml.\n-Sust bajante en pvc hasta 125mm 2 m',NULL,NULL,163,56.88000000000001,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (167,105.03,'Reparación de tubería con de gebo tapaporos de 1\" \n',NULL,NULL,100.8,40.32,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (168,105.06,'Reparación de tubería con de gebo tapaporos de 2\" \n',NULL,NULL,198,79.2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (169,111.01,'\n-Vaciado o llenado de calefaccion',NULL,NULL,45,18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (170,113.01,'sellados de bañera\n-Sellado de azulejos, griferia, banda',NULL,NULL,135,54,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (171,113.02,'Griferias\n-Desmontaje y montaje de griferias sin material.',NULL,NULL,63,25.200000000000003,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (172,113.03,'Mecansmo cisternas.\n-Desmontaje y montaje de mecanismo de cisterna sin material.',NULL,NULL,63,25.200000000000003,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (173,113.04,'Termos\n-Desmontaje y montaje de termos hasta 80 l. sin material.',NULL,NULL,252,100.80000000000001,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (174,111.02,'\n-Desmontaje o montaje radiadores',NULL,NULL,54,21.6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (175,111.05,'\n-Reparacion de  radiadores, cambio de juntas',NULL,NULL,99,39.6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (176,100.05,'Localización de fugas.\n-Con detector termográfico.',NULL,NULL,342,136.8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (177,114.01,'Desatascos. \n-Hogar, con máquina',NULL,NULL,108,43.2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
insert  into `trf_fontaneros`(`CANT`,`CODIGO`,`DESCRIPCION`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`,`F18`,`F19`,`F20`,`F21`,`F22`,`F23`,`F24`,`F25`,`F26`,`F27`,`F28`,`F29`,`F30`,`F31`,`F32`,`F33`,`F34`,`F35`,`F36`,`F37`,`F38`,`F39`,`F40`,`F41`,`F42`,`F43`,`F44`,`F45`,`F46`,`F47`,`F48`,`F49`,`F50`,`F51`,`F52`,`F53`,`F54`,`F55`,`F56`,`F57`,`F58`,`F59`,`F60`,`F61`,`F62`,`F63`) values (178,114.02,'Desatascos. \n-CP, con máquina',NULL,NULL,180,72,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

/*Table structure for table `trf_parquetista` */

DROP TABLE IF EXISTS `trf_parquetista`;

CREATE TABLE `trf_parquetista` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_parquetista` */

insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1101,800.01,'Preparación suelo con pasta niveladora.','N','N',7.75,2.79,7.98,0,0,0,0,0,0,0,0,0);
insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1102,801.01,'Acuchillado y barnizado de parquet, hasta 20 m². ','N','N',382.74,145.8,394.22,0,0,0,0,0,0,0,0,0);
insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1103,801.02,'Acuchillado y barnizado de parquet m² adicional.','N','N',18.78,7.96,19.34,0,0,0,0,0,0,0,0,0);
insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1104,802.01,'Suministro e instalación de tablillas de 1 a 15 m².','N','N',93.48,33.61,96.28,0,0,0,0,0,0,0,0,0);
insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1105,802.02,'Suministro e instalación de tablilla de parquet más de 15 m²','N','N',69.69,23.25,71.78,0,0,0,0,0,0,0,0,0);
insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1110,890.01,'Mano de obra parquetista','N','N',57.83,19.83,43.83,0,0,0,0,0,0,0,0,0);
insert  into `trf_parquetista`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1126,890.02,'Desplazamiento de parquetista','N','S',29,15,29,0,0,0,0,0,0,0,0,0);

/*Table structure for table `trf_pintores` */

DROP TABLE IF EXISTS `trf_pintores`;

CREATE TABLE `trf_pintores` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_pintores` */

insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (701,500.01,'Pintura al temple liso de 1 a 7 m2','N','S',89.9,36.51,92.27,30.59,0,32.4,0,37.03,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (702,500.02,'Pintura al temple liso de 7 a 15 m2','N','S',108.21,49.49,111.05,36.69,0,39.71,0,44.56,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (703,500.03,'Pintura al temple liso m2 adicional.','N','S',5.18,2.12,5.31,1.5,0,2.09,0,1.95,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (704,501.01,'Pintura al temple picado de 1 a 7 m2','N','S',121.46,41.73,124.66,40.51,0,40.51,0,50.03,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (705,501.02,'Pintura al temple picado de 7 a 15 m2','N','S',173.68,80.08,177.92,47.28,0,47.28,0,66.66,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (706,501.03,'Pintura al temple picado m2 adicional.','N','S',7.84,3.19,8.05,2.32,0,2.31,0,3,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (707,502.01,'Pintura al temple gotele de 1 a 7 m2','N','S',121.46,41.73,124.66,40.51,0,40.51,0,50.03,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (708,502.02,'Pintura al temple gotele de 7 a 15 m2','N','S',137.98,63.61,141.93,47.28,0,47.28,0,56.82,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (709,502.03,'Pintura al temple gotele m2 adicional.','N','S',7.84,3.19,8.05,2.31,0,2.31,0,3,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (710,503.01,'Temple picado plastificado de 1 a 7 m2','N','S',179.59,73.04,184.31,47.65,0,47.65,0,67.15,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (711,503.02,'Temple picado plastificado de 7 a 15 m2','N','S',201.27,92.8,206.56,53.01,0,53.01,0,74.11,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (712,503.03,'Temple picado plastificado m2 adicional','N','S',11.26,4.57,11.56,2.52,0,2.52,0,3.28,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (713,504.01,'Temple gotele plastificado de 1 a 7 m2','N','S',151.03,62.57,154.99,47.65,0,47.65,0,62.2,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (714,504.02,'Temple gotele plastificado de 7 a 15 m2','N','S',173.68,80.08,178.25,53.01,0,53.01,0,71.53,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (715,504.03,'Temple gotele plastificado m2 adicional','N','S',10.48,4.26,10.74,2.52,0,2.52,0,3.28,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (716,505.01,'Pintura plastica lisa de 1 a 7 m2','N','S',114.97,41.73,118,35.3,0,35.3,0,47.34,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (717,505.02,'Pintura plastica lisa de 7 a 15 m2','N','S',145.04,66.88,148.86,42.88,0,42.88,0,59.73,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (718,505.03,'Pintura plastica lisa m2 adicional.','N','S',9.19,3.74,9.43,2.16,0,2.16,0,2.81,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (719,506.01,'Pasta rayada de 1 a 7 m2','N','S',114.97,46.94,118,41.67,0,41.67,0,47.34,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (720,506.02,'Pasta rayada de 7 a 15 m2','N','S',145.04,66.88,148.86,47.28,0,47.28,0,59.73,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (721,506.03,'Pasta rayada m2 adicional','N','S',9.19,3.74,9.43,2.31,0,2.31,0,3,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (722,507.01,'Pintura al esmalte de 1 a 7 m2','N','S',152.1,57.37,156.1,51.47,0,51.47,0,62.64,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (723,507.02,'Pintura al esmalte de 7 a 15 m2','N','S',243.34,91.59,249.73,69.33,0,69.33,0,95.33,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (724,507.03,'Pintura al esmalte m2 adicional.','N','S',18.34,7.47,18.83,4.22,0,4.22,0,5.49,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (725,590.01,'Mano de obra de pintor','N','S',43.83,20.52,45.14,20.52,0,20.52,0,20.52,0,0,0,0);
insert  into `trf_pintores`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (726,590.02,'Desplazamiento pintores','N','S',29,15,29,15,0,15,0,15,0,0,0,0);

/*Table structure for table `trf_poceros` */

DROP TABLE IF EXISTS `trf_poceros`;

CREATE TABLE `trf_poceros` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_poceros` */

insert  into `trf_poceros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (2103,600.01,'Desplazamiento de equipo para inspección con cámara de TV.','N','S',125,73,0,0,0,0,0,0,0,0,0,0);
insert  into `trf_poceros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (2104,600.02,'Mano de obra para revisión de instalación con cámara.','N','S',125,53,0,0,0,0,0,0,0,0,0,0);
insert  into `trf_poceros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (2101,690.01,'Desplazamiento de cuadrilla de poceria con grupo de presión','N','S',108.15,73,118.17,73,0,0,0,0,0,0,0,0);
insert  into `trf_poceros`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (2102,690.02,'Mano de obra de cuadrilla poceria con grupo de presión.','N','S',108.15,53,118.17,44.11,0,0,0,0,0,0,0,0);

/*Table structure for table `trf_pulidos` */

DROP TABLE IF EXISTS `trf_pulidos`;

CREATE TABLE `trf_pulidos` (
  `CANT` double DEFAULT NULL,
  `CODIGO` varchar(255) NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `DA` varchar(255) DEFAULT NULL,
  `W` varchar(255) DEFAULT NULL,
  `CT1` decimal(12,2) DEFAULT NULL,
  `PT1` decimal(12,2) DEFAULT NULL,
  `CT2` decimal(12,2) DEFAULT NULL,
  `PT2` decimal(12,2) DEFAULT NULL,
  `CT3` decimal(12,2) DEFAULT NULL,
  `PT3` decimal(12,2) DEFAULT NULL,
  `CT4` decimal(12,2) DEFAULT NULL,
  `PT4` decimal(12,2) DEFAULT NULL,
  `CT5` decimal(12,2) DEFAULT NULL,
  `PT5` decimal(12,2) DEFAULT NULL,
  `CT6` decimal(12,2) DEFAULT NULL,
  `PT6` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`CODIGO`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `trf_pulidos` */

insert  into `trf_pulidos`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1106,1000.011,'Abrillantado de terrazo o mármol hasta 20 m². ','N','N',319.49,128.54,329.07,0,0,0,0,0,0,0,0,0);
insert  into `trf_pulidos`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1107,1000.021,'Abrillantado de terrazo o mármol, m² adicional.','N','N',8.78,3.21,9.04,0,0,0,0,0,0,0,0,0);
insert  into `trf_pulidos`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1125,1001.011,'Pulido y abrillantado de terrazo o mármol hasta 20 m².','N','N',527.12,225.33,525.22,0,0,0,0,0,0,0,0,0);
insert  into `trf_pulidos`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1108,1001.021,'Pulido y abrillantado de terrazo o mármol, m² adicional.','N','N',18.44,6.62,18.44,0,0,0,0,0,0,0,0,0);
insert  into `trf_pulidos`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1110,1090.011,'Mano de obra pulidor con maquinaria','N','N',57.83,19.83,43.83,0,0,0,0,0,0,0,0,0);
insert  into `trf_pulidos`(`CANT`,`CODIGO`,`Descripcion`,`DA`,`W`,`CT1`,`PT1`,`CT2`,`PT2`,`CT3`,`PT3`,`CT4`,`PT4`,`CT5`,`PT5`,`CT6`,`PT6`) values (1126,1090.021,'Desplazamiento de pulidor con maquinaria.','N','S',29,15,29,0,0,0,0,0,0,0,0,0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
