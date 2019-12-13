ALTER TABLE `servicios`   
  ADD  UNIQUE INDEX `num_servicio_UNIQUE` (`numServicio`);
  
UPDATE clientes SET tipoIvaId = 5, limiteCredito = 400;

ALTER TABLE `partes`   
  ADD  UNIQUE INDEX `numparte_UNIQUE` (`numParte`);

