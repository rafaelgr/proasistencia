ALTER TABLE `partes`   
  ADD COLUMN `fichero` VARCHAR(255) NULL AFTER `fecha_cierre_profesional`;

ALTER TABLE `parametros`   
  ADD COLUMN `bucket` VARCHAR(255) NULL AFTER `cuentaretencion`,
  ADD COLUMN `bucket_region` VARCHAR(255) NULL AFTER `bucket`,
  ADD COLUMN `bucket_folder` VARCHAR(255) NULL AFTER `bucket_region`,
  ADD COLUMN `indentity_pool` VARCHAR(255) NULL AFTER `bucket_folder`;
  ADD COLUMN `raiz_url` VARCHAR(255) NULL AFTER `indentity_pool`;

 


