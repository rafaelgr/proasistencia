ALTER TABLE `tipos_proveedor`   
  ADD COLUMN `inicioCuenta` INT(11) NULL AFTER `nombre`;

  CREATE TABLE `tipos_profesionales`(  
  `tipoProfesionalId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tipoProfesionalId`)
);

ALTER TABLE `proveedores`   
  ADD COLUMN `tipoProfesionalId` INT(11) NULL AFTER `tipoProveedor`,
  ADD CONSTRAINT `proveedores_tipoProfesional` FOREIGN KEY (`tipoProfesionalId`) 
  REFERENCES `tipos_profesionales`(`tipoProfesionalId`) ON UPDATE CASCADE ON DELETE CASCADE;


INSERT INTO tipos_proveedor (tipoProveedorId, nombre, inicioCuenta ) VALUES(1,'Empresas', 40), (2,'Profesionales', 41);

 UPDATE proveedores SET tipoProveedor = 1;

ALTER TABLE `proasistencia`.`proveedores`   
  DROP INDEX `unica_codigo`,
  ADD  UNIQUE INDEX `unica_codigo` (`codigo`, `tipoProveedor`);

  /*correcciones*/

  delete from ariconta11.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta12.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta13.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta14.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta15.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta16.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta17.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta18.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';
  delete from ariconta19.cuentas  where codmacta >= '400001182' and codmacta <= '400001309';

  
 ALTER TABLE `proasistencia`.`proveedores`   
  DROP INDEX `unica_codigo`;

  


/*CREAR TABLA BORRAR_PROVEEDORES CON EL SCRIPT BORRAR_PROVEEDORES_TABLA ANTES DE EJECUTAR LO SIGUIENTE*/


CREATE TABLE borrar_proveedores(
   proveedorId  INTEGER  NOT NULL PRIMARY KEY 
  ,cuentaContable INTEGER  NOT NULL
  ,nombre         VARCHAR(44) NOT NULL
  ,nif            VARCHAR(9)
  ,direccion      VARCHAR(39)
  ,poblacion      VARCHAR(24)
  ,provincia      VARCHAR(11)
  ,codPostal      INTEGER 
  ,codigo         INTEGER  NOT NULL
);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2052,400001182,'JOSE ASENCIOS CAMILOAGA','X5106631X','FATIMA 14','LEGANES','MADRID',28917,1182);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2053,400001184,'JORGE WILBERT NAMICELA TOLEDO','29528778K','FUENTE DE LA CAPONA 7','MADRID','MADRID',28021,1184);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2054,400001185,'INST.ELECTR Y CLIMA ATIENZA S.','B85288884','CAQUETA 1','MADRID','MADRID',28033,1185);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2056,400001187,'ORGAZ ORTEGA S.L.','B81440232','TOTANA 19 LOCAL','MADRID','MADRID',28033,1187);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2057,400001188,'PROYECTA MEDIACION EN INGENIERÍA','B87645990','FERNANDO EL CATOLICO 86','MADRID','MADRID',28015,1188);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2058,400001189,'HEYPO SOLUTIONS S.L.','B87498127','LUIS DE GÓNGORA, 2, PORTAL 1 3 4','FUENLABRADA','MADRID',28942,1189);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2059,400001190,'JOMAR SEGURIDAD S.L.','B19168582','FRANCISCO MEDINA Y MENDOZA, 17','CABANILLAS DEL CAMPO','GUADALAJARA',19171,1190);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2060,400001191,'CIMA EXTINTORES S.L.','B28986511','AV. DE LA CONSTITUCIÓN, 24-26 - NAVE 15','COSLADA','MADRID',28820,1191);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2061,400001192,'MASMOVIL - XFERA MOVILES, SAU','A82528548','AVDA. DE LA VEGA, 15','ALCOBENDAS','MADRID',28018,1192);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2062,400001193,'BANCO SABADEL','A08000143','AVDA. OSCAR ESPLÁ, 37','ALICANTE','ALICANTE',3007,1193);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2063,400001194,'FRAGMA REPROGRAFÍA, S.L.','B80043698','AVDA. DE AMÉRICA, 22','MADRID','MADRID',28028,1194);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2064,400001195,'SERVICIOS PROFESIONALES RUIZ ARCE, S.L.','B73989477','MINERVA, 4 - BAJO','BENIAJAN','MURCIA',30570,1195);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2065,400001196,'ARSYS INTERNET S.L.U.','B85294916','CHILE, 54','LOGROnO','LA RIOJA',26007,1196);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2066,400001197,'EVA FERNÁNDEZ PEREA','52401063W','AVDA. CATALUNYA, 102','PALAU-SOLITA I PLEGAMANS','BARCELONA',8184,1197);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2067,400001198,'COLEGIO OFICIAL DE ADMINISTRADORES DE FINCAS','G28840387','GARCÍA DE PAREDES, 70','MADRID','MADRID',28010,1198);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2068,400001199,'ROMÁN ALONSO GARCIA','00676698S','AVDA. DE AMERICA, 16','MADRID','MADRID',28028,1199);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2069,400001200,'TELEFONICA SERV.MOVILES, S.A.','A78923125','PZA.INDEPENDENCIA, 6','MADRID','MADRID',28001,1200);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2070,400001201,'TELEFONICA DE ESPAnA, S.A.','A82018474','GRAN VIA, 28','MADRID','MADRID',28013,1201);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2071,400001202,'RETEVISION MOVIL, S.A.','A61719274','C/DE LA MARINA, 16','BARCELONA','BARCELONA',8005,1202);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2072,400001203,'GESYTEL SERVICIOS TELEMATICOS','B81545600','MEJICO, 35 LOCAL','MADRID','MADRID',28028,1203);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2073,400001204,'AIRTEL MOVIL, S.A.','A80907397','AV.DE EUROPA, 1','MADRID','MADRID',28108,1204);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2074,400001205,'ADELA ALONSO GARCIA','70025204W',NULL,NULL,NULL,NULL,1205);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2075,400001206,'MARÍA DEL CARMEN MANGAS CASADO','00419011C','GRAL. ALVAREZ DE CASTRO, 24','MADRID','MADRID',28010,1206);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2076,400001207,'COMERCIAL SOBRES LANZA, S.L.','B33419573','INGENIERO MARQUINA, 7','OVIEDO','OVIEDO',33004,1207);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2077,400001208,'APLICACIONES INFORMATICAS ACRO','B80464738','AVDA. DE AMERICA, 8, BAJO  C','MADRID','MADRID',28028,1208);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2078,400001209,'FINUR GESTION, S.L.','B81520850','STA. VIRGILIA, 12','MADRID','MADRID',28033,1209);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2079,400001210,'INFORMATICA Y FUTURO, S.L.','B78090206','VICTOR DE LA SERNA, 42 LOCAL','MADRID','MADRID',28016,1210);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2080,400001211,'UNION ELECTRICA FENOSA, S.A.','A81944324',NULL,NULL,NULL,NULL,1211);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2081,400001212,'ROSANA FAJARDO CASAS','51462095D','OBISPO GOLFIN, 7','ALPEDRETE','MADRID',28430,1212);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2082,400001213,'GESTION Y LOGISTICA, S.L.','B81361024','CAMINO DE LO CORTAO,6/8,NAVE 44','S.S.DE LOS REYES','MADRID',28700,1213);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2083,400001214,'ANTONIO RAMOS FERNANDEZ','05635932N',NULL,NULL,NULL,NULL,1214);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2084,400001215,'ALTA GESTION, S.A.','A78131919','PZ MANUEL GOMEZ MORENO, 3','MADRID','MADRID',28020,1215);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2085,400001216,'TRADER SEGUNDAMANO, S.L.','B82191354','AVDA. CASTILLA, 2','SAN FERNANDO DE HENARES,','MADRID',28830,1216);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2086,400001217,'PREVISION ESPAnOLA, S.A.','A41003864',NULL,NULL,NULL,NULL,1217);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2087,400001218,'TECNICAS INDUSTRIALES DE MONTA','B82309964','ALCARRIA, 7','COSLADA','MADRID',28820,1218);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2088,400001219,'AYUNTAMIENTO DE MADRID','P2807900B',NULL,NULL,NULL,NULL,1219);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2089,400001220,'MAQUINAS EL SIETE, S.A.','A28849222','HORTALEZA, 17','MADRID','MADRID',28000,1220);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2090,400001221,'GASTOS AMPLIACION CAPITAL',NULL,NULL,NULL,NULL,NULL,1221);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2091,400001222,'BATCH-PC S.L.','B81058133','C/CABO TRAFALGAR 57-59','MADRID','MADRID',28500,1222);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2092,400001223,'ES-NIC REG.DELEGADO INTERNET E','Q2891006E','PASEO DE LA HABANA 138','MADRID','MADRID',28036,1223);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2093,400001224,'PARKING GALAXIA',NULL,NULL,NULL,NULL,NULL,1224);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2094,400001225,'GARAJES M.T.M.',NULL,NULL,NULL,NULL,NULL,1225);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2095,400001226,'GARAJE RAMOS','B82100579',NULL,NULL,NULL,NULL,1226);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2096,400001227,'INTERPARKING HISPANIA S.A.','A60526928',NULL,NULL,NULL,NULL,1227);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2097,400001228,'METROPARK','A50596675',NULL,NULL,NULL,NULL,1228);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2098,400001229,'FERRETERIA VENECIA','5396978M',NULL,NULL,NULL,NULL,1229);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2099,400001230,'CARLIN VENTAS DIRECTAS','A79127197',NULL,NULL,NULL,NULL,1230);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2100,400001231,'GRUPO SP S.A.','A28926590','LABASTIDA 10-12','MADRID','MADRID',28034,1231);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2101,400001232,'COLEGIO OF.APAREJ.Y ARQUIT.MAD','Q2875010G','MAESTRO VICTORIA 3','MADRID','MADRID',28013,1232);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2102,400001233,'FRANCISCO JAVIER SAENZ VILLAR','25883115L','C/CUESTA 2','COLMENAR VIEJO','MADRID',28770,1233);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2103,400001234,'MONTAJES ELECTRICOS G.M.G. S.L','B83207167','C/CID 16 P7','ALCORCON','MADRID',28921,1234);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2104,400001235,'APARCAMIENTOS APADIMA S.L.','B80613995','FDEZ DE LA HOZ 45','MADRID','MADRID',NULL,1235);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2105,400001236,'FOCINTRA APARCAMIENTOS S.A.','A78320736','PLAZA DE COLON','MADRID','MADRID',NULL,1236);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2106,400001237,'ATOCHA COMFERSA','A28889491',NULL,NULL,NULL,NULL,1237);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2107,400001238,'CAMARA OFIC.COMERCIO E INDUSTR','Q2873001H','C/HUERTAS 13','MADRID','MADRID',28012,1238);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2108,400001239,'COMUN.MADRID C  ECONOMIA,INNOV','S7800001E',NULL,NULL,NULL,NULL,1239);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2109,400001240,'ANTONIO RAMOS-YZQUIERDO ESTEBAN','24247142J','C/INFANTA MERCEDES 20 BAJO EXT.','MADRID','MADRID',28020,1240);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2110,400001241,'IBERCAJA','G50000652','PLZA. BASILIO PARAISO, 2','ZARAGOZA','ZARAGOZA',50008,1241);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2111,400001242,'LA CAIXA','G58899998','AVDA. DIAGONAL, 621','BARCELONA','BARCELONA',8028,1242);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2112,400001243,'QDQ MEDIA, S.A.U.','A81745002','JULIAN CAMARILLO, 6','MADRID','MADRID',28037,1243);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2113,400001244,'COLEGIO OF.APAREJ.ARQUIT.GUADA','G19005917','CAPITAN ARENAS, 8','GUADALAJARA','GUADALAJARA',19003,1244);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2114,400001245,'SUMINISTROS COMPAS, S.A.','A28967362','ALEJANDRO RODRIGUEZ, 16','MADRID','MADRID',28039,1245);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2115,400001246,'JUZGADO 1  INSTANCIA N45',NULL,NULL,NULL,NULL,NULL,1246);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2116,400001247,'TELESAT, S.L.','B79988267',NULL,NULL,NULL,NULL,1247);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2117,400001248,'BOLETIN OFICIAL DEL ESTADO','Q2811001C','AVDA. DE MANOTERAS, 54','MADRID','MADRID',28071,1248);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2118,400001249,'INFORMATIZACION DE EMPRESAS, S','A78097797','SAN GRACIANO, 1 y 3','MADRID','MADRID',28026,1249);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2119,400001250,'AYUNTAMIENTO DE SAN LORENZO DEL ESCORIAL','P2813100A',NULL,NULL,NULL,NULL,1250);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2120,400001251,'S.V ASESORES SL','B83264770','C/IBIZA 35  3 DCHA','MADRID','MADRID',28009,1251);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2121,400001252,'ESIMPRO S.A.','A78519162','C/.JUAN BRAVO 18','MADRID','MADRID',28006,1252);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2122,400001253,'COESSEGUR S.A.','A78191814','C/.LAGUNA DEL MARQUESADO 49 F','MADRID','MADRID',28021,1253);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2123,400001254,'ASQ INFORMATICA S.L.N.E.','B84599703','C/.PILAR DE ZARAGOZA 53','MADRID','MADRID',NULL,1254);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2124,400001255,'MONSTER WORLDWIDE S.L','B82313982','PL.DE MANUEL GOMEZ MORENO 2','MADRID','MADRID',28020,1255);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2125,400001256,'AYUNTAMIENTO DE COSLADA','P2804900E',NULL,NULL,NULL,NULL,1256);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2126,400001257,'JOSE LUIS HERNANDEZ GARCIA','00397257R',NULL,'TORRELODONES','MADRID',28250,1257);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2127,400001258,'J.P.R. INFOR, S.A.','A61157558',NULL,'BARCELONA','BARCELONA',8037,1258);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2128,400001259,'REDFINCAS S.L.','B85827491',NULL,'MADRID','MADRID',28028,1259);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2129,400001260,'MARTÍN RAMIREZ GOMEZ','02061106F',NULL,'TRES CANTOS','MADRID',28760,1260);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2130,400001261,'REPSOL COMERCIAL DE PRODCUTOS','A80298839','Pso DE LA CASTELLANA 278','MADRID',NULL,28046,1261);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2131,400001262,'ILEANA AURELIA SPANACHE',NULL,'LOS CURAS 56','TOREJON DE ARDOZ','MADRID',NULL,1262);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2132,400001263,'OSCAR BERMEJO GOMEZ','51352095H','VICENTE BLASCO IBAnEZ 19','MADRID','MADRID',28050,1263);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2133,400001264,'BATTICALOA INVERSIONES S.L.','B85426815','Pso DE LA CASTELLANA 130','MADRID',NULL,28046,1264);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2134,400001265,'GOLDWIN SERVICES S.L.','B86235736',NULL,NULL,'MADRID',NULL,1265);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2135,400001266,'JORGE A. LASPIUR TALLADE','50835072N','O''DONNELL 3','MADRID','MADRID',28009,1266);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2136,400001267,'MARÍA TERESA GONZALEZ REBOLLO','50823728F',NULL,'MADRID',NULL,28016,1267);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2137,400001268,'AXA SEGUROS','A60917978',NULL,NULL,NULL,NULL,1268);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2138,400001269,'GO MEDIA S.L.','B97994545','PL.BANDAS DE MUSICA 5','VALENCIA','VALENCIA',46013,1269);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2139,400001270,'EUSEBIO COMISAnA SANZ','02512216H',NULL,'MADRID',NULL,NULL,1270);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2140,400001271,'JUAN FRANCISCO BAYO TORIJANO','07226103D',NULL,'MADRID',NULL,NULL,1271);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2141,400001272,'OPTIMIZA CLICK S.L.U.','B85530236',NULL,'MADRID','MADRID',28044,1272);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2142,400001273,'ROSA CARPINTERO MORILLAS','50959335Y',NULL,'MADRID','MADRID',28022,1273);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2143,400001274,'ONDA MEDIAPLAN S.L.','B85551802',NULL,'MADRID','MADRID',28029,1274);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2144,400001275,'LUIS JOSE IBAnEZ JIMENEZ','51646507F',NULL,'MADRID','MADRID',28027,1275);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2145,400001276,'CENTROS COMERCIALES CARREFOUR','A28425270',NULL,'MADRID','MADRID',NULL,1276);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2146,400001277,'ANGEL MARIA VADILLO CUADRADO','11822329F',NULL,'ALCALA DE HENARES','MADRID',NULL,1277);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2147,400001278,'CLARA ADELAIDA GARCIA CABREJAS','00821185Q','ALBERCHE, 13  2B','MADRID','MADRID',28045,1278);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2148,400001279,'FERRETERIA-ELECTRICIDAD GARRIDO','02614415M','C/ SAN MAXIMILIANO N 40','MADRID','MADRID',28017,1279);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2149,400001280,'CAMPSA ESTACIONES DE SERVICIO','A78492782','AVDA.AMERICA N 18','MADRID','MADRID',28028,1280);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2150,400001281,'EURO BAZAR AMERICA','X2161079E','AVDA. AMERICA N 26','MADRID','MADRID',28002,1281);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2151,400001282,'MASTIVAF, EUROPEA DE MASTILES,','B81666778',NULL,NULL,NULL,NULL,1282);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2152,400001283,'ALAMBIQUE VINOS Y LICORES S.L.','B83481184','CAMINO DE LAS REJAS 1 NAVE 17','COSLADA','MADRID',28820,1283);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2153,400001284,'FRANCE TELECOM ESPAnA S.A.','A82009812','PARQUE EMP.LA FINCA P DEL CLUB DEPO','POZUELO DE ALARCON','MADRID',28223,1284);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2154,400001285,'LAURA DE FRANCISCO MOLANO','00405340B','C/.LAGASCA 140','MADRID','MADRID',28006,1285);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2155,400001286,'JORGE SANTOS CABRERA','00380166E','C/.JARA 25','COLLADO MEDIANO','MADRID',28450,1286);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2156,400001287,'CYBERDRIVE S.L.','B82364951','AVDA.DE LA CONSTITUCION 89-91','TORREJON DE ARDOZ','MADRID',28850,1287);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2157,400001288,'JAIME GOMEZ GARCIA','02618083Q',NULL,NULL,NULL,NULL,1288);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2158,400001289,'HELVETIA CIA SUIZA','A41003864',NULL,NULL,NULL,NULL,1289);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2159,400001290,'INNOVA MBC S.L.','B64665029',NULL,NULL,NULL,NULL,1290);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2160,400001291,'ANTONIO M. ALVAREZ BUYLLA','02697856W',NULL,NULL,NULL,NULL,1291);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2161,400001292,'MEDIOS DE PREVENCION EXTERNOS','B41776360','EDIFICIO M.P.E. CAMINOS 6','SEVILLA','SEVILLA',41020,1292);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2162,400001293,'VIDAMEDIC S.L.','B91127258','EDIFICIO M.P.E. CAMINOS 6','SEVILLA','SEVILLA',41020,1293);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2163,400001294,'NAVARRULAQUE S.L.','B78622180',NULL,NULL,NULL,NULL,1294);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2164,400001295,'ELISA ZABIA DE LA MATA','02623566W','SANTO DOMINGO DE SILOS 8','MADRID','MADRID',28036,1295);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2165,400001296,'AZENTA COMUNICACION Y MARKETIN','B85319978',NULL,'MADRID',NULL,28005,1296);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2166,400001297,'DISTRIBUCIONES Y MARKETING DIR','B86425295','MANUEL POMBO ANGULO 8','MADID',NULL,28050,1297);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2167,400001298,'MUTUA MADRILEnA A.AUTOMOV.','V28027118',NULL,NULL,NULL,NULL,1298);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2168,400001299,'ROAN MH S.L.','B80133317',NULL,'MADRID',NULL,28028,1299);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2169,400001300,'LINUR S.L.','B80399520',NULL,NULL,'MADRID',NULL,1300);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2170,400001301,'VICTOR M.LOPEZ-RODRIGUEZ','11812547T',NULL,NULL,'MADRID',NULL,1301);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2171,400001302,'DISTRIBUIDOR OFICIAL DE KONICA','B78752268',NULL,NULL,'MADRID',NULL,1302);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2172,400001303,'LUBESPRES S.A.','A80902935',NULL,NULL,'MADRID',NULL,1303);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2173,400001304,'TALLERES MECANICOS SALVADOR S.','B82112954',NULL,NULL,'MADRID',NULL,1304);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2174,400001305,'AYUNTAMIENTO DE TORRELODONES','P2815200G',NULL,NULL,'MADRID',NULL,1305);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2175,400001306,'ING','W0037986G',NULL,NULL,NULL,NULL,1306);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2176,400001307,'JUAN PEDRO ANDRES SANCHEZ','00666160B',NULL,NULL,'MADRID',NULL,1307);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2177,400001308,'GENERALI ESPAnA S.A.','A28007268',NULL,NULL,'MADRID',NULL,1308);
INSERT INTO borrar_proveedores(proveedorId,cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES (2178,400001309,'SERVISOFT SOLUCIONES INFORMATICAS','B83664748',NULL,NULL,'MADRID',NULL,1309);

/*ACTUALIZA PROVEEDORES*/

update proveedores, `borrar_proveedores` set 
  proveedores.nombre= borrar_proveedores.nombre
 ,proveedores.`nif`=borrar_proveedores.`nif`
 ,proveedores.`direccion`=borrar_proveedores.`direccion`
 ,proveedores.`poblacion`= borrar_proveedores.`poblacion`
 ,proveedores.`provincia`= borrar_proveedores.`provincia`
 ,proveedores.`codPostal`= borrar_proveedores.`codPostal`
 ,proveedores.`cuentaContable`= borrar_proveedores.`cuentaContable`
 ,proveedores.`codigo`= borrar_proveedores.`codigo`
   where proveedores.proveedorId = borrar_proveedores.`proveedorId` and 
   proveedores.cuentaContable >= '400001182' AND proveedores.cuentaContable <= '400001309';

   DELETE FROM proveedores WHERE nombre = 'CLAUDIA ALONSO GOMEZ'


   ALTER TABLE `proasistencia`.`proveedores`
   ADD  UNIQUE INDEX `unica_codigo` (`codigo`, `tipoProveedor`);

   /*ESCRIPT PROVEEDORES NUEVOS Y CREAR CONTAS NUEVAS*/

INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001183','JORBIT VERTICALES SL','B87787263','GRAN CANAL 8 GALERIA COMERCIAL','ALCALA DE HENARES','MADRID','28804','1183');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001186','EURO MOQUETAS S.L.','B82970989','MIGUEL HERNANDEZ 120','MADRID','MADRID','28038','1186');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001310','LAURA LANA GARCIA','50866610V',NULL,NULL,'MADRID',NULL,'1310');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001311','ARIADANA SOFTWARE SL','B96470190','PASAJE VENTURA FELIU 13','VALENCIA','VALENCIA','46007','1311');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001312','CLAUDIA ALONSO GOMEZ','05458958T','RAMON Y CAJAL 31','CERCEDILLA','MADRID','28470','1312');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001313','ANTONIO VALENZUELA LINARES','80026616W','CAnADA REAL DE MERINAS, 187','MADRID','MADRID','28052','1313');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001314','CRISTIAN RUSIN','X4914686T','HERNAN CORTES, 2 - 4A','COSLADA','MADRID','28821','1314');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001315','REPARACIONES ALBEDA, S.L.','B87746673','SAN BERNARDO, 20 - 1','MADRID','MADRID','28015','1315');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001316','HRISTO TOMOV HINKOV','X4141448E','OSLO, 10','LOECHES','MADRID','28890','1316');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001317','MANUEL SILVA DA SILVA','02237103P','ZULOAGA, 67','VALDEMORO','MADRID','28342','1317');
INSERT INTO proveedores(cuentaContable,nombre,nif,direccion,poblacion,provincia,codPostal,codigo) VALUES ('400001318','PROWALL PROYECTOS Y MANTENIMIENTOS, S.L.U.','B86931896','CORUnA, 1','LEGANES','MADRID','28914','1318');

INSERT IGNORE INTO ariconta11.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';


INSERT IGNORE INTO ariconta12.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta13.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta14.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta15.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta16.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta17.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta18.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';

INSERT IGNORE INTO ariconta19.cuentas 
(codmacta,nommacta,apudirec,model347,razosoci,dirdatos,codposta,despobla,desprovi,nifdatos,maidatos,iban,forpa) 
SELECT cuentaContable,nombre,'S',1,nombre,direccion,codPostal,poblacion,provincia,nif,correo,IBAN,codigo 
FROM proveedores where cuentaContable >= '400001182' AND cuentaContable <= '400001318';


 
