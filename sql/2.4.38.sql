ALTER TABLE
    contratos
ADD
    COLUMN ajusteCertFinal TINYINT(1) NOT NULL DEFAULT 0;

ALTER TABLE
    `proasistencia`.`notascontrato` CHANGE `accion` `titulo` VARCHAR(255) CHARSET utf8 COLLATE utf8_spanish_ci NULL,
    CHANGE `contratoId` `registroId` INT(11) NULL,
ADD
    COLUMN `tipo` TINYINT(1) NULL COMMENT '0 = contratos // 1 = prefacturas // 2 = facturas'
AFTER
    `registroId`,
    DROP INDEX `nota_contratoFK`,
ADD
    KEY `nota_registroFK` (`registroId`),
    DROP FOREIGN KEY `nota_contratoFK`;

RENAME TABLE `proasistencia`.`notascontrato` TO `proasistencia`.`notasweb`;