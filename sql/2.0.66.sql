CREATE TABLE `grupo_tarifa`(  
  `grupoTarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255),
  PRIMARY KEY (`grupoTarifaId`)
);

CREATE TABLE `tarifas`(  
  `tarifaId` INT(11) NOT NULL AUTO_INCREMENT,
  `grupoTarifaId` INT(11),
  `nombre` VARCHAR(255),
  PRIMARY KEY (`tarifaId`),
  CONSTRAINT `tarifaGrupoTarifaFK` FOREIGN KEY (`grupoTarifaId`) REFERENCES `grupo_tarifa`(`grupoTarifaId`) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `tarifas_lineas`(  
  `tarifaLineaId` INT(11) NOT NULL AUTO_INCREMENT,
  `tarifaId` INT(11),
  `articuloId` INT(11),
  `precioUnitario` DECIMAL(10,2),
  PRIMARY KEY (`tarifaLineaId`),
  CONSTRAINT `tarifaLineasTarifasFK` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `tarifaLineasArticulosFK` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`articuloId`) ON UPDATE CASCADE ON DELETE CASCADE,
  UNIQUE INDEX `artIdUni` (`articuloId`, `tarifaId`)
);

ALTER TABLE `clientes`   
  ADD COLUMN `tarifaId` INT(11) NULL AFTER `tipoViaId3`,
  ADD CONSTRAINT `fkey_tarifa_cliente` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `proveedores`   
  ADD COLUMN `tarifaId` INT(11) NULL AFTER `fianza`,
  ADD CONSTRAINT `proveedores_tarifa` FOREIGN KEY (`tarifaId`) REFERENCES `tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `facprove`   
  ADD COLUMN `fecha_recepcion` DATE NULL AFTER `ref`;

  ALTER TABLE `facprove`   
  ADD COLUMN `empresaId2` INT(11) NULL AFTER `empresaId`,
  ADD CONSTRAINT `RX_empresas2` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`empresaId`);

	ALTER TABLE `tarifas` DROP FOREIGN KEY `tarifaGrupoTarifaFK`;

	ALTER TABLE `tarifas` ADD CONSTRAINT `tarifaGrupoTarifaFK` FOREIGN KEY (`grupoTarifaId`) REFERENCES `grupo_tarifa`(`grupoTarifaId`) ON UPDATE CASCADE ON DELETE NO ACTION;

	ALTER TABLE `proasistencia`.`tarifas_lineas` DROP FOREIGN KEY `tarifaLineasTarifasFK`;

	ALTER TABLE `proasistencia`.`tarifas_lineas` ADD CONSTRAINT `tarifaLineasTarifasFK` FOREIGN KEY (`tarifaId`) REFERENCES `proasistencia`.`tarifas`(`tarifaId`) ON UPDATE CASCADE ON DELETE NO ACTION;


/*Procedimiento nuevo para actualizar campo fecha_recepcion. crear procedimiento en la BBDD y colocar entre etiquetas de BEGIN y END*/

    DECLARE vreferencia VARCHAR(255);
		DECLARE vfecha DATE;
		DECLARE vid INT;
		
		DECLARE ntf BOOL;
		
	
		DECLARE cursor1 CURSOR FOR SELECT fecha, facproveId FROM facprove ORDER BY facproveId;

		DECLARE CONTINUE HANDLER FOR NOT FOUND SET ntf=1;
		
		SET ntf = 0;
		
		OPEN cursor1;
		
		s_cursor: WHILE(ntf = 0) DO
		
		FETCH cursor1 INTO vfecha, vid;
			
		UPDATE facprove SET fecha_recepcion = vfecha WHERE facproveId = vid;
				
		IF ntf=1 THEN LEAVE s_cursor;
		END IF;
		
		
		
		END WHILE s_cursor;
		
		CLOSE cursor1;
/*PROCEDIMIENTO NUEVO PARA ACTUALIZAR CAMPO EMPRESAiD2. CREAR PROCEDIMIENTO EN LA BBDD Y COLOCAR EL CODIGO
ENTRA LAS ETIQUETAS BEGUIN Y END Y EJECUTAR*/

		DECLARE vid INT;
		DECLARE vfacproveId INT;
		
		DECLARE ntf BOOL;
		
	
		DECLARE cursor1 CURSOR FOR SELECT empresaId, facproveId FROM facprove;

		DECLARE CONTINUE HANDLER FOR NOT FOUND SET ntf=1;
		
		SET ntf = 0;
		
		OPEN cursor1;
		
		s_cursor: WHILE(ntf = 0) DO
		
		FETCH cursor1 INTO vid, vfacproveId;
			
		UPDATE facprove SET empresaId2 = vid WHERE facproveId = vfacproveId;
				
		IF ntf=1 THEN LEAVE s_cursor;
		END IF;
		
		
		
		END WHILE s_cursor;
		
		CLOSE cursor1;
