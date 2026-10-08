ALTER TABLE `contratos`   
	ADD COLUMN `DFnombre` VARCHAR(255) NULL AFTER `tituloExpediente`,
	ADD COLUMN `DFncolegiado` VARCHAR(255) NULL AFTER `DFnombre`,
	ADD COLUMN `DFcorreo` VARCHAR(255) NULL AFTER `DFncolegiado`,
	ADD COLUMN `DFprofesion` VARCHAR(255) NULL AFTER `DFcorreo`;
    ADD COLUMN `direccionFacultativaId` INT(11) NULL AFTER `DFprofesion`;


ALTER TABLE `empresas`   
	ADD COLUMN `infActa` VARCHAR(255) NULL AFTER `infFacturas`;


CREATE TABLE `correos` (
    `correoId` INT(11) NOT NULL AUTO_INCREMENT,
    `contratoId` INT(11) NOT NULL,
    `fechaEnvio` DATE NOT NULL,
    `numeroCorreo` INT(2) NOT NULL,
    `tipoCorreo` VARCHAR(255) NOT NULL,
    `archivoRelacionado` VARCHAR(255),

    PRIMARY KEY (`correoId`),

    UNIQUE KEY `uk_contrato_tipo_numero`
        (`contratoId`, `tipoCorreo`, `numeroCorreo`),

    KEY `idx_correos_contrato`
        (`contratoId`),

    CONSTRAINT `fk_correos_contrato`
        FOREIGN KEY (`contratoId`)
        REFERENCES `contratos` (`contratoId`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

ALTER TABLE `facprove`   
	ADD COLUMN `codintra` VARCHAR(1) NULL AFTER `esColaborador`;
