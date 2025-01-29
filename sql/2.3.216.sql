CREATE TABLE tmpClientesOfertas ENGINE = MYISAM
SELECT * FROM 
(

SELECT 
	clienteId,
	c.nombre AS clienteNombre,
	direccion2 AS direcionTrabajo,
	COALESCE(tv.tipoViaId, NULL) AS tipoViaIdOfertas,
	COALESCE(tv.nombre, '') AS tipoViaNombreOfertas,
	c.codpostal2 AS codpostalOfertas,
	c.poblacion2 AS poblacionOfertas,
	c.provincia2 AS provinciaOfertas,
	c.email AS emailOfertas,

    
    -- Extraer la subcadena a la izquierda de la coma (nueva_direccion2)
    CASE
        WHEN LOCATE(',', direccion2) > 0 THEN
            SUBSTRING_INDEX(direccion2, ',', 1)
        ELSE direccion2  -- Si no hay coma, devolver toda la dirección
    END AS direccionOfertas,
    

    -- Si numero2 tiene valor y existe puerta2, eliminarla de numero2. Si numero2 está vacío, devolver cadena vacía
    CASE
        WHEN LOCATE(',', direccion2) > 0 THEN
            -- Si numero2 tiene valor y existe puerta2, eliminarla de numero2
            CASE
                WHEN LOCATE(' ', REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', '')) > 0 THEN
                    REPLACE(
                        REPLACE(
                            REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', ''), 
                            SUBSTRING(REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', ''), LOCATE(' ', REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', '')) + 1), ''
                        ),
                        'Nº', '' -- Elimina también cualquier aparición de 'Nº' sin importar el espacio
                    )
                ELSE 
                    -- Si no hay puerta2, devolver numero2 tal cual
                    REPLACE(REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', ''), 'Nº', '')
            END
        ELSE ''
    END AS numeroOfertas,
    
        -- Extraer la subcadena a partir del primer espacio en numero2, solo si numero2 tiene valor
    CASE
        WHEN LOCATE(',', direccion2) > 0 AND LOCATE(' ', REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', '')) > 0 THEN
            -- Extraer la parte después del primer espacio de numero2
            SUBSTRING(REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', ''), LOCATE(' ', REPLACE(LTRIM(SUBSTRING(direccion2, LOCATE(',', direccion2) + 1)), 'Nº ', '')) + 1)
        ELSE ''  -- Si no hay coma o no hay espacio, devolver cadena vacía
    END AS puertaOfertas

FROM clientes AS c
LEFT JOIN tipos_via AS tv ON tv.tipoViaId = c.tipoViaId2
) AS tmp;

ALTER TABLE `clientes`   
  ADD COLUMN `direccionOfertas` VARCHAR(255) NULL AFTER `passWeb`,
  ADD COLUMN `poblacionOfertas` VARCHAR(255) NULL AFTER `direccionOfertas`,
  ADD COLUMN `codPostalOfertas` VARCHAR(255) NULL AFTER `poblacionOfertas`,
  ADD COLUMN `provinciaOfertas` VARCHAR(255) NULL AFTER `codPostalOfertas`,
  ADD COLUMN `tipoViaIdOfertas` INT(11) NULL AFTER `provinciaOfertas`,
  ADD COLUMN `emailOfertas` VARCHAR(255) NULL AFTER `tipoViaIdOfertas`,
  ADD CONSTRAINT `ref_cliente_viaOfertas` FOREIGN KEY (`tipoViaIdOfertas`) REFERENCES `tipos_via`(`tipoViaId`);


ALTER TABLE `clientes`   
  ADD COLUMN `numeroOfertas` VARCHAR(255) NULL AFTER `direccionOfertas`,
  ADD COLUMN `puertaOfertas` VARCHAR(255) NULL AFTER `numeroOfertas`;
