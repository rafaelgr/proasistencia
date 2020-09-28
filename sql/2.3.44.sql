ALTER TABLE `facprove`   
  DROP INDEX `facprove_numeroprov`,
  ADD  UNIQUE INDEX `facprove_numeroprov` (`numeroFacturaProveedor`, `proveedorId`, `ano`);