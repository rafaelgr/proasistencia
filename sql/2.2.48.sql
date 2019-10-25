/*BORRADO DE TARIFAS*/

UPDATE clientes SET tarifaId = NULL;
UPDATE proveedores SET tarifaId = NULL;


DELETE FROM `tarifas_cliente_lineas`;

DELETE FROM `tarifas_proveedor_lineas`;

DELETE FROM `tarifas_cliente`;

DELETE FROM `tarifas_proveedor`;
