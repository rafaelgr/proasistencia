ALTER TABLE
    liquidacion_comercial_obras
ADD
    COLUMN anticipoAplicado DECIMAL(12, 2) NOT NULL DEFAULT 0.00
AFTER
    anticipo,
ADD
    COLUMN anticipoPendiente DECIMAL(12, 2) NOT NULL DEFAULT 0.00
AFTER
    anticipoAplicado,
ADD
    COLUMN anticipoAnterior DECIMAL(12, 2) NOT NULL DEFAULT 0.00
AFTER
    anticipoPendiente;

ALTER TABLE
    antprove_serviciados
ADD
    COLUMN importeAmortizado DECIMAL(12, 2) NOT NULL DEFAULT 0;

    CREATE TABLE antprove_serviciados_amortizaciones (
    amortizacionId INT NOT NULL AUTO_INCREMENT,
    antproveServiciadoId INT NOT NULL,
    contratoId INT NOT NULL,
    comercialId INT NOT NULL,
    dFecha DATE NOT NULL,
    hFecha DATE NOT NULL,
    importe DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (amortizacionId),
    UNIQUE KEY uk_amortizacion_periodo (
        antproveServiciadoId,
        comercialId,
        dFecha,
        hFecha
    ),
    KEY idx_amortizacion_contrato (
        contratoId,
        comercialId,
        dFecha,
        hFecha
    )
) 