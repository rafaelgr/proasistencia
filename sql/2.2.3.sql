ALTER TABLE `actuaciones`   
  DROP INDEX `act_servFK`,
  ADD CONSTRAINT `actuaciones_ser` FOREIGN KEY (`servicioId`) REFERENCES `proasistencia`.`servicios`(`servicioId`) ON UPDATE CASCADE ON DELETE NO ACTION;

  ALTER TABLE `proasistencia`.`reparaciones`  
  ADD CONSTRAINT `rep_actuFK` FOREIGN KEY (`actuacionId`) REFERENCES `proasistencia`.`actuaciones`(`actuacionId`) ON UPDATE CASCADE ON DELETE CASCADE;

