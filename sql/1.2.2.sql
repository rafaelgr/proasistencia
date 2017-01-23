ALTER TABLE `ofertas` DROP FOREIGN KEY `of_contrato`;

ALTER TABLE `ofertas` ADD CONSTRAINT `of_contrato` FOREIGN KEY (`contratoId`) REFERENCES `contratos`(`contratoId`) ON DELETE NO ACTION;


ALTER TABLE `contratos` DROP FOREIGN KEY `cnt_oferta`;

ALTER TABLE `contratos` ADD CONSTRAINT `cnt_oferta` FOREIGN KEY (`ofertaId`) REFERENCES `ofertas`(`ofertaId`) ON DELETE NO ACTION;
