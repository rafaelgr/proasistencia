ALTER TABLE `articulos`   
	ADD COLUMN `porcen1` DECIMAL(12,2) DEFAULT 0 NULL AFTER `esTecnico`,
	ADD COLUMN `porcen2` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcen1`,
    ADD COLUMN `porcen3` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcen2`,
    ADD COLUMN `porcen4` DECIMAL(12,2) DEFAULT 0 NULL AFTER `porcen3`;

    ALTER TABLE `grupo_articulo`   
	DROP COLUMN `porcen1`, 
	DROP COLUMN `porcen2`, 
	DROP COLUMN `porcen3`, 
	DROP COLUMN `porcen4`;

ALTER TABLE `parametros`   
	ADD COLUMN `limiteImpObra` DECIMAL(12,2) DEFAULT 0 NULL AFTER `indiceCorrector`;


ALTER TABLE `articulos`   
	CHANGE `porcen1` `porcen1` DECIMAL(12,3) DEFAULT 0.00 NULL,
	CHANGE `porcen2` `porcen2` DECIMAL(12,3) DEFAULT 0.00 NULL,
	CHANGE `porcen3` `porcen3` DECIMAL(12,3) DEFAULT 0.00 NULL,
	CHANGE `porcen4` `porcen4` DECIMAL(12,3) DEFAULT 0.00 NULL;


DROP TABLE IF EXISTS tmpArt;
CREATE TABLE IF NOT EXISTS tmpArt(
   articuloId     VARCHAR(40) NOT NULL PRIMARY KEY
  ,aplicarFormula INT 
  ,porcen1        DECIMAL(12,3)
  ,porcen2        DECIMAL(12,3)
  ,porcen3        DECIMAL(12,3)
  ,porcen4        DECIMAL(12,3)
);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1024,1,2.100,2.100,2.100,0.060);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1025,1,2.100,2.100,2.100,0.060);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1026,1,1.450,2.000,1.450,0.060);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1027,1,2.340,2.340,2.340,0.156);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1028,1,0.650,0.650,0.650,0.500);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1029,1,0.540,0.540,0.540,0.250);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1030,1,0.600,0.600,0.600,0.300);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1031,1,0.440,0.440,0.440,0.218);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1032,1,0.600,0.600,0.600,0.300);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1033,1,0.440,0.440,0.440,0.218);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1034,1,1.200,1.200,1.200,0.100);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1035,1,0.870,0.870,0.870,0.100);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1048,1,3.920,3.920,3.920,0.020);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1049,1,4.480,4.480,4.480,0.020);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1050,1,4.480,4.480,4.480,0.020);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1051,1,2.800,2.800,2.800,0.012);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1052,1,3.000,3.000,3.000,0.012);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1053,1,1.800,1.800,1.800,0.010);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1054,1,1.500,1.500,1.500,0.010);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1055,1,0.600,0.600,0.600,0.400);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1056,1,1.800,1.800,1.800,0.100);
INSERT INTO tmpArt(articuloId,aplicarFormula,porcen1,porcen2,porcen3,porcen4) VALUES (1076,1,2.100,2.100,2.100,2.100);

