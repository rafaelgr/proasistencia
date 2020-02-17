INSERT INTO `tipos_iva` (`nombre`, `porcentaje`, `codigoContable`) 
VALUES ('21% Intracom', '21.00', '9'); 

CREATE TABLE `tipos_operaciones`(  
  `tipoOperacionId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  `codopera` INT(11),
  PRIMARY KEY (`tipoOperacionId`)
);

INSERT INTO `tipos_operaciones` (`nombre`, `codopera`) VALUES ('GENERAL', 0); 
INSERT INTO `tipos_operaciones` (`nombre`, `codopera`) VALUES ('INTRACOMUNITARIA', 1); 

ALTER TABLE `facprove`   
  ADD COLUMN `tipoOperacionId` INT(11) NULL AFTER `conceptoAnticipo`;

  ALTER TABLE `facprove`  
  ADD CONSTRAINT `RX_tipoOperacionFK` FOREIGN KEY (`tipoOperacionId`) REFERENCES `tipos_operaciones`(`tipoOperacionId`);

  UPDATE facprove SET tipoOperacionId = 1;

 DROP TABLE IF EXISTS `paises`;

CREATE TABLE `paises` (
  `paisId` INT (11) AUTO_INCREMENT NOT NULL,
  `codpais` CHAR(2) NOT NULL DEFAULT 'ES',
  `nompais` VARCHAR(50) NOT NULL DEFAULT '',
  `intracom` SMALLINT(1) NOT NULL DEFAULT '0',
  PRIMARY KEY  (`paisId`)
) ENGINE=INNODB DEFAULT CHARSET=latin1;

INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AD','ANDORRA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AE','EMIRATOS ARABES',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AF','AFGANISTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AG','ANTIGUA AND BARBUDA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AI','ANGUILLA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AL','ALBANIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AM','ARMENIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AN','ANTILLAS HOLANDESAS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AO','ANGOLA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AQ','ANTARCTICA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AR','ARGENTINA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AS','AMERICAN SAMOA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AT','AUSTRIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AU','AUSTRALIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AW','ARUBA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('AZ','AZERBAIJAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BA','BOSNIA AND HERZEGOVINA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BB','BARBADOS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BD','BANGLADESH',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BE','BELGICA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BF','BURKINA FASO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BG','BULGARIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BH','BAHRAIN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BI','BURUNDI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BJ','BENIN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BM','BERMUDA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BN','BRUNEI DARUSSALAM',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BO','BOLIVIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BR','BRASIL',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BS','BAHAMAS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BT','BHUTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BV','BOUVET ISLAND',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BW','BOTSWANA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BY','BELARUS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('BZ','BELIZE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CA','CANADA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CC','COCOS (KEELING) ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CD','CONGO, THE DEMOCRATIC REPUBLIC OF THE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CF','CENTRAL AFRICAN REPUBLIC',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CG','CONGO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CH','SUIZA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CI','COSTA DE MARFIL',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CK','COOK ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CL','CHILE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CM','CAMEROON',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CN','CHINA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CO','COLOMBIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CR','COSTA RICA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CS','SERBIA AND MONTENEGRO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CU','CUBA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CV','CAPE VERDE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CX','CHRISTMAS ISLAND',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CY','CHIPRE',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('CZ','REPUBLIZA CHECA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('DE','ALEMANIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('DJ','DJIBOUTI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('DK','DINAMARCA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('DM','DOMINICA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('DO','REPUBLIZA DOMINICANA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('DZ','ALGERIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('EC','ECUADOR',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('EE','ESTONIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('EG','EGIPTO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('EH','WESTERN SAHARA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ER','ERITREA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ES','ESPAÑA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ET','ETIOPIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('FI','FINLANDIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('FJ','FIJI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('FK','ISLAS MALVINAS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('FM','MICRONESIA, FEDERATED STATES OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('FO','FAROE ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('FR','FRANCIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GA','GABON',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GB','REINO UNIDO',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GD','GRENADA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GE','GEORGIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GF','FRENCH GUIANA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GH','GHANA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GI','GIBRALTAR',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GL','GREENLAND',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GM','GAMBIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GN','GUINEA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GP','GUADALUPE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GQ','GUINEA ECUATORIAL',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GR','GRECIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GS','SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GT','GUATEMALA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GU','GUAM',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GW','GUINEA-BISSAU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('GY','GUYANA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('HK','HONG KONG',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('HM','HEARD ISLAND AND MCDONALD ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('HN','HONDURAS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('HR','CROACIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('HT','HAITI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('HU','HUNGRIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ID','INDONESIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IE','IRLANDA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IL','ISRAEL',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IN','INDIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IO','BRITISH INDIAN OCEAN TERRITORY',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IQ','IRAQ',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IR','IRAN, ISLAMIC REPUBLIC OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IS','ISLANDIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('IT','ITALIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('JM','JAMAICA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('JO','JORDANIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('JP','JAPON',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KE','KENYA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KG','KYRGYZSTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KH','CAMBOYA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KI','KIRIBATI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KM','COMOROS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KN','SAINT KITTS AND NEVIS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KP','KOREA, DEMOCRATIC PEOPLES REPUBLIC OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KR','KOREA, REPUBLIC OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KW','KUWAIT',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KY','ISLAS CAIMAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('KZ','KAZAKHSTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LA','LAO PEOPLES DEMOCRATIC REPUBLIC',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LB','LEBANON',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LC','SAINT LUCIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LI','LIECHTENSTEIN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LK','SRI LANKA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LR','LIBERIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LS','LESOTHO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LT','LITUANIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LU','LUXEMBURGO',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LV','LATVIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('LY','LIBYAN ARAB JAMAHIRIYA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MA','MARRUECOS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MC','MONACO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MD','MOLDOVA, REPUBLIC OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MG','MADAGASCAR',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MH','MARSHALL ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MK','MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ML','MALI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MM','MYANMAR',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MN','MONGOLIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MO','MACAO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MP','NORTHERN MARIANA ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MQ','MARTINIQUE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MR','MAURITANIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MS','MONTSERRAT',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MT','MALTA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MU','MAURITIUS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MV','MALDIVES',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MW','MALAWI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MX','MEXICO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MY','MALAYSIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('MZ','MOZAMBIQUE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NA','NAMIBIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NC','NEW CALEDONIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NE','NIGER',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NF','NORFOLK ISLAND',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NG','NIGERIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NI','NICARAGUA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NL','HOLANDA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NO','NORUEGA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NP','NEPAL',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NR','NAURU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NU','NIUE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('NZ','NUEVA ZELANDA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('OM','OMAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PA','PANAMA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PE','PERU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PF','FRENCH POLYNESIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PG','PAPUA NEW GUINEA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PH','FILIPINAS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PK','PAKISTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PL','POLONIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PM','SAINT PIERRE AND MIQUELON',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PN','PITCAIRN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PR','PUERTO RICO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PS','PALESTINIAN TERRITORY, OCCUPIED',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PT','PORTUGAL',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PW','PALAU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('PY','PARAGUAY',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('QA','QATAR',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('RE','REUNION',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('RO','RUMANIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('RS','SERBIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('RU','RUSIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('RW','RUANDA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SA','ARABIA SAUDI',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SB','ISLAS SOLOMON',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SC','ISLAS SEYCHELLES',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SD','SUDAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SE','SUECIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SG','SINGAPORE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SH','SAINT HELENA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SI','ESLOVENIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SJ','SVALBARD AND JAN MAYEN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SK','ESLOVAQUIA',1);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SL','SIERRA LEONA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SM','SAN MARINO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SN','SENEGAL',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SO','SOMALIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SR','SURINAME',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ST','SAO TOME AND PRINCIPE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SV','EL SALVADOR',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SY','SIRIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('SZ','SWAZILAND',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TC','TURKS AND CAICOS ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TD','CHAD',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TF','FRENCH SOUTHERN TERRITORIES',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TG','TOGO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TH','THAILAND',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TJ','TAJIKISTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TK','TOKELAU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TL','TIMOR-LESTE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TM','TURKMENISTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TN','TUNISIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TO','TONGA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TR','TURQUIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TT','TRINIDAD AND TOBAGO',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TV','TUVALU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TW','TAIWAN, PROVINCE OF CHINA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('TZ','TANZANIA, UNITED REPUBLIC OF',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('UA','UCRANIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('UG','UGANDA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('UM','UNITED STATES MINOR OUTLYING ISLANDS',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('US','ESTADOS UNIDOS DE AMERICA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('UY','URUGUAY',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('UZ','UZBEKISTAN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VA','HOLY SEE (VATICAN CITY STATE)',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VC','SAINT VINCENT AND THE GRENADINES',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VE','VENEZUELA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VG','VIRGIN ISLANDS, BRITISH',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VI','VIRGIN ISLANDS, U.S.',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VN','VIETNAM',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('VU','VANUATU',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('WF','WALLIS AND FUTUNA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('WS','SAMOA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('YE','YEMEN',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('YT','MAYOTTE',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ZA','SOUTH AFRICA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ZM','ZAMBIA',0);
INSERT  INTO `paises`(`codpais`,`nompais`,`intracom`) VALUES ('ZW','ZIMBABWE',0);


ALTER TABLE `proveedores`   
  ADD COLUMN `paisId` INT(11) NULL AFTER `observaciones`,
  ADD CONSTRAINT `proveedores_paises` FOREIGN KEY (`paisId`) REFERENCES `paises`(`paisId`);


  UPDATE proveedores SET paisId = 66;