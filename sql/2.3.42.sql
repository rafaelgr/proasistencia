ALTER TABLE `empresas`   
  ADD COLUMN `infFacCliObr` VARCHAR(255) NULL AFTER `serieFacRep`;

  update empresas set  infFacCliObr = 'factcli_obras_reabita' where empresaId = 7;

   update empresas set  infFacCliObr = 'factcli_obras_fondo' where empresaId = 3;

    update empresas set  infFacCliObr = 'factcli_obras_proas' where empresaId = 2;


