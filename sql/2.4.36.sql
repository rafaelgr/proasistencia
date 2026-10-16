ALTER TABLE liquidacion_comercial_obras
    ADD COLUMN anticipoAplicado DECIMAL(12,2) NOT NULL DEFAULT 0.00
        AFTER anticipo,
    ADD COLUMN anticipoPendiente DECIMAL(12,2) NOT NULL DEFAULT 0.00
        AFTER anticipoAplicado,
    ADD COLUMN anticipoAnterior DECIMAL(12,2) NOT NULL DEFAULT 0.00
        AFTER anticipoPendiente;