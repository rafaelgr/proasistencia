ALTER TABLE `parametros`   
  ADD COLUMN `bucket_server` VARCHAR(255) NULL AFTER `raiz_url_docum`,
  ADD COLUMN `bucket_region_server` VARCHAR(255) NULL AFTER `bucket_server`,
  ADD COLUMN `bucket_folder_server` VARCHAR(255) NULL AFTER `bucket_region_server`,
  ADD COLUMN `identity_pool_server` VARCHAR(255) NULL AFTER `bucket_folder_server`,
  ADD COLUMN `raiz_url_server` VARCHAR(255) NULL AFTER `identity_pool_server`;

   UPDATE `parametros` SET `bucket_server` = 'comercializa-server' , `bucket_region_server` = 'eu-west-3' , 
   `identity_pool_server` = 'eu-west-3:2d09d557-1507-4aff-8c03-9bf7825c54cd' ,
   `raiz_url_server` = 'https://comercializa-server.s3.eu-west-3.amazonaws.com/' WHERE `parametroId` = '0'; 
