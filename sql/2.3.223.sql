ALTER TABLE `ofertas`   
	CHANGE `esCoste` `esCoste` TINYINT(1) DEFAULT 0 NULL COMMENT '0 --> contrato ventas// 1--> contrato de coste // 2 --> contrato de subcontrata';
