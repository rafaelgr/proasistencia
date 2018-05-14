UPDATE facprove SET noContabilizar = 0 WHERE noContabilizar IS NULL;

ALTER TABLE `facprove`   
  ADD COLUMN `contabilizada` BOOL DEFAULT FALSE NULL AFTER `noContabilizar`;