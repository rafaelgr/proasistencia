ALTER TABLE `contratos`   
  ADD COLUMN `fechaSiguientesFacturas` DATE NULL AFTER `porcentajeRetencion`;

UPDATE contratos SET fechaSiguientesfacturas = fechaPrimeraFactura;