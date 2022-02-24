ALTER TABLE `servicios` DROP `necesitaPresupuesto`; 

ALTER TABLE `partes`   
  ADD COLUMN `urgente` TINYINT(1) DEFAULT 0 NULL AFTER `notasWeb`;


UPDATE servicios AS s
LEFT JOIN partes AS p ON p.servicioId = s.servicioId
SET p.urgente = s.urgente;

ALTER TABLE `servicios` DROP `urgente`; 
