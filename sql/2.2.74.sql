CREATE TABLE empresas_cuentaspago (
    empresaCuentapagoId INT(11) NOT NULL AUTO_INCREMENT,empresaId INT(11),
    tipoFormaPagoId INT,
    cuentapago VARCHAR(255),
    PRIMARY KEY (empresaCuentapagoId),
    CONSTRAINT ref_emcu_empresas FOREIGN KEY (empresaId) REFERENCES empresas(empresaId),
    CONSTRAINT ref_emcu_tipoforma FOREIGN KEY (tipoFormaPagoId) REFERENCES tipos_forma_pago(tipoFormaPagoId)
);