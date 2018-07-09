ALTER TABLE `facturas`   
  ADD COLUMN `contabilizada` TINYINT(1) DEFAULT 0 NULL AFTER `devuelta`;

  UPDATE facturas SET contabilizada = 1 WHERE NOT contafich IS NULL;
