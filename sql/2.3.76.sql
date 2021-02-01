ALTER TABLE `tipos_proyecto`   
  ADD COLUMN `activo` TINYINT(1) DEFAULT 1 NULL AFTER `tipoMantenimientoId`;

UPDATE tipos_proyecto 
SET activo = 0
WHERE abrev IN
('AT',
  'DFA',
  'TRM',
  'IEE POLIZA',
  'PITE',
  'ITE POLIZA',
  'PZI',
  'PZE'
);