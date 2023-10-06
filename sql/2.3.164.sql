ALTER TABLE `facprove`   
  ADD COLUMN `externa` TINYINT(1) DEFAULT 0 NULL AFTER `esColaborador`;


  INSERT INTO `tipos_operaciones` (`nombre`, `codopera`) VALUES ('REPERCUTIDA', '4')
