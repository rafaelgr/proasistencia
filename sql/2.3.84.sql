UPDATE liquidacion_comercial SET pendientePeriodo = 0, 
pendienteAnterior = 0, 
pagadoPeriodo = 0,
pagadoAnterior = 0 
WHERE pendientePeriodo IS NULL AND pendienteAnterior IS NULL AND pagadoPeriodo IS NULL AND pagadoAnterior IS NULL