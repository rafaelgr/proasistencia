UPDATE facprove SET noContabilizar = 0 WHERE noContabilizar IS NULL;

ALTER TABLE `facprove`   
  ADD COLUMN `contabilizada` BOOL DEFAULT FALSE NULL AFTER `noContabilizar`;

ALTER TABLE `grupo_articulo`   
  ADD COLUMN `cuentacompras` VARCHAR(255) NULL AFTER `nombre`,
  ADD COLUMN `cuentaventas` VARCHAR(255) NULL AFTER `cuentacompras`;

INSERT INTO `ariconta11`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta12`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta13`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta14`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta15`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta16`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta17`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta18`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 
INSERT INTO `ariconta19`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('623000001', 'FACTURAS DE SERVICIOS', 'S'); 

UPDATE grupo_articulo SET cuentacompras = '623000001', cuentaventas = '700000001';

ALTER TABLE `parametros`   
  ADD COLUMN `cuentaretencion` VARCHAR(255) NULL AFTER `articuloMantenimientoParaGastos`;

INSERT INTO `ariconta11`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta12`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta13`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta14`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta15`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta16`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta17`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta18`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');
INSERT INTO `ariconta19`.`cuentas` (`codmacta`, `nommacta`, `apudirec`) VALUES ('475300001', 'RETENCIONES A PROFESIONALES', 'S');

UPDATE parametros SET cuentaretencion = '475300001';