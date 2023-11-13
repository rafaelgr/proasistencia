ALTER TABLE `parametros`   
  ADD COLUMN `bucket_server` VARCHAR(255) NULL AFTER `raiz_url_docum`,
  ADD COLUMN `bucket_region_server` VARCHAR(255) NULL AFTER `bucket_server`,
  ADD COLUMN `bucket_folder_server` VARCHAR(255) NULL AFTER `bucket_region_server`,
  ADD COLUMN `identity_pool_server` VARCHAR(255) NULL AFTER `bucket_folder_server`,
  ADD COLUMN `raiz_url_server` VARCHAR(255) NULL AFTER `identity_pool_server`;
