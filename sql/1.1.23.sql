UPDATE comerciales 
SET activa = 1
WHERE fechaBaja IS NULL;

UPDATE comerciales 
SET activa = 0
WHERE NOT fechaBaja IS NULL;