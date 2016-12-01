ALTER TABLE `clientes`   
  ADD COLUMN `nombreComercial` VARCHAR(255) NULL AFTER `tipoViaId`;
UPDATE clientes SET nombreComercial = nombre;