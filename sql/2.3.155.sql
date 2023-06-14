ALTER TABLE `tmp_contratos`   
  ADD COLUMN `totLetras` DECIMAL(12,2) NULL AFTER `BINeto`;

  ALTER TABLE `tmp_contratos`   
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`contratoId`, `usuarioId`);

  ALTER TABLE `ofertas`   
  ADD COLUMN `conceptosExcluidos` TEXT NULL AFTER `observaciones`;



UPDATE ofertas
SET conceptosExcluidos = 
'Quedan excluidos explícitamente de la presente oferta los siguientes trabajos:	
* Tasas e Impuestos ocasionados por los Proyectos e Instalaciones que se comprenden en la presente oferta
para sus respectivas legalizaciones ante los Organismos Oficiales.	
* El Impuesto sobre el Valor Añadido (IVA).	
* Apertura de calas, ensayos y/o estudio geotécnico.	
* Cualquier trabajo no especificado en la presente oferta.' 
WHERE tipoOfertaId = 5 AND empresaId = 10