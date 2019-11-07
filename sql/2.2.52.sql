ALTER TABLE `departamentos`   
  ADD COLUMN `usaCalculadora` TINYINT(1) DEFAULT 1 NULL AFTER `nombre`;

UPDATE departamentos SET usaCalculadora = 0 WHERE departamentoId = 7;