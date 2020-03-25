CREATE TABLE empresas_cuentaspago (
    empresaCuentapagoId INT(11) NOT NULL AUTO_INCREMENT,empresaId INT(11),
    tipoFormaPagoId INT,
    cuentapago VARCHAR(255),
    PRIMARY KEY (empresaCuentapagoId),
    CONSTRAINT ref_emcu_empresas FOREIGN KEY (empresaId) REFERENCES empresas(empresaId),
    CONSTRAINT ref_emcu_tipoforma FOREIGN KEY (tipoFormaPagoId) REFERENCES tipos_forma_pago(tipoFormaPagoId)
);

ALTER TABLE `empresas_cuentaspago`   
  ADD  UNIQUE INDEX `unico_tipoforpa_empresa` (`empresaId`, `tipoFormaPagoId`);

  ALTER TABLE `antclien`   
  ADD COLUMN `parteLineaId` INT(11) NULL AFTER `noContabilizar`;


  ALTER TABLE `antclien` DROP INDEX `antprove_numeroprova`;