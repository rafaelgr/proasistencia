DELETE FROM proasistencia.proveedores WHERE codigo = 1183;


DELETE FROM ariconta11.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';

DELETE FROM proasistencia.proveedores WHERE  cuentaContable = '410000333' OR  cuentaContable = '400000068' OR  cuentaContable = '400001217' 
OR  cuentaContable = '400000176' OR  cuentaContable = '400000241' OR  cuentaContable = '400000205' OR cuentaContable = '400000753' OR 
cuentaContable = '400000001' OR cuentaContable = '410000357';



UPDATE proasistencia.proveedores SET cuentaContable = '410000401', 
tipoProveedor = 2, codigo = 401 WHERE codigo = 1224;

UPDATE proasistencia.proveedores SET cuentaContable = '410000402', 
tipoProveedor = 2, codigo = 402 WHERE codigo = 1225;


UPDATE proasistencia.proveedores SET cuentaContable = '410000413', 
tipoProveedor = 2, codigo = 413 WHERE codigo = 1246;

UPDATE proasistencia.proveedores pro, tmp_cuentas tp
SET pro.cuentaContable = tp.codmacta, pro.tipoProveedor = 2, pro.codigo = tp.codigo
WHERE pro.nif = tp.nifdatos AND tp.codmacta LIKE '41%';



DELETE FROM ariconta12.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';




DELETE FROM ariconta13.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';




DELETE FROM ariconta14.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';



DELETE FROM ariconta15.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';




DELETE FROM ariconta16.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';



DELETE FROM ariconta17.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';


DELETE FROM ariconta18.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';



DELETE FROM ariconta19.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';


DELETE FROM ariconta21.cuentas WHERE codmacta = '400000001'  OR codmacta = '410000333' OR  codmacta = '400000068' OR  codmacta = '400001217' 
OR  codmacta = '400000176' OR  codmacta = '400000241' OR  codmacta = '400000205' OR codmacta = '400000753';


INSERT IGNORE ariconta20.cuentas 
SELECT * FROM ariconta11.cuentas 