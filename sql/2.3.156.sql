ALTER TABLE `carpeta_subcarpetas`   
  CHANGE `carpetaSubcarpetaId` `carpetaSubcarpetaId` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT;


  ALTER TABLE `carpeta_subcarpetas`   
  CHANGE `carpetaId` `carpetaId` INT(11) UNSIGNED NULL;

  ALTER TABLE `proasistencia`.`carpeta_subcarpetas`   
  CHANGE `subcarpetaId` `subcarpetaId` INT(11) UNSIGNED NULL;



ALTER TABLE `carpeta_subcarpetas`  
  ADD CONSTRAINT `carpetas_subcarpetasFK` FOREIGN KEY (`carpetaId`) REFERENCES `carpetas`(`carpetaId`) ON DELETE CASCADE;


ALTER TABLE `proasistencia`.`carpeta_subcarpetas`  
  ADD CONSTRAINT `carpetas_subcarpetas2FK` FOREIGN KEY (`subcarpetaId`) REFERENCES `proasistencia`.`carpetas`(`carpetaId`) ON DELETE CASCADE;