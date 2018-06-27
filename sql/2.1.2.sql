DELETE FROM liquidacion_comercial
WHERE comercialId IN
(SELECT comercialId FROM comerciales WHERE tipoComercialId <> 1);