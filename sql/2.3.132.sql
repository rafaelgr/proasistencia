ALTER TABLE `mensajes`   
  ADD COLUMN `presupuestoAceptado` TINYINT(1) DEFAULT 0 NULL AFTER `proveedorUsuarioPushId`;