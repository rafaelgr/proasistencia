ALTER TABLE `facturas`   
	ADD COLUMN `nombreFacturaPdf` VARCHAR(255) NULL AFTER `beneficioLineal`;


     UPDATE
     facturas AS pf
     INNER JOIN 
     (
	SELECT f.facturaId,
	CONCAT(COALESCE(f.serie,' '),'-',COALESCE(CAST(f.ano AS CHAR(50)),' '),'-',COALESCE(CAST(LPAD(f.numero, 6, '0') AS CHAR(50)),' '),".pdf") AS vFac
	FROM facturas AS f
      ) AS tmp ON tmp.facturaId = pf.facturaId
      SET pf.nombreFacturaPdf = tmp.vFac;
      