ALTER TABLE `contratos`   
	CHANGE `nombrePresidente` `nombreFirmante` VARCHAR(255) CHARSET utf8 COLLATE utf8_general_ci NULL,
	CHANGE `dniPresidente` `dniFirmante` VARCHAR(255) CHARSET utf8 COLLATE utf8_general_ci NULL,
	CHANGE `correoPresidente` `correoFirmante` VARCHAR(255) CHARSET utf8 COLLATE utf8_general_ci NULL;

ALTER TABLE `contratos`   
	ADD COLUMN `cargoFirmante` VARCHAR(255) NULL AFTER `correoFirmante`;


ALTER TABLE `contrato_planificacion_temporal`   
	ADD COLUMN `fechaReal` DATE NULL AFTER `fecha`;
