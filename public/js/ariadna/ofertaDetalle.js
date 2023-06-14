

/*-------------------------------------------------------------------------- 
ofertaDetalle.js
Funciones js par la página OfertaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var ofertaId = 0;
var lineaEnEdicion = false;

var dataOfertasLineas;
var dataBases;
var usuario;
usuario = recuperarUsuario();
var usaCalculadora;
var dataConceptosLineas;
var numConceptos = 0;
var dataConceptos; 
var dataProveedores;
var dataDocumentacion
var numLineas = 0;
var parametros;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
var  docName = '';
var carpeta = ''
var subCarpeta = '';
var carpetaId = null;
var carpetaTipo = null;
var num = 0;


datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();

    vm = new admData();
    ko.applyBindings(vm);

    //Evento de cambio de departamento
    $("#cmbDepartamentos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioDepartamento(e.added.id); 
    });
    //eventos de las lineas de conceptos / porcentajes
    $("#txtPorcentajeCobro").on('blur', function (e) {
        var totalOferta = vm.importeCliente();
        var porcentaje = parseFloat($("#txtPorcentajeCobro").val());
        var restoContraro = 0;
        var importePorcentaje = 0;
        if(isNaN(porcentaje)) return;

        porcentaje = porcentaje / 100;
        importePorcentaje = porcentaje * totalOferta;

        vm.importeCalculado(roundToTwo(importePorcentaje));
    });

    $("#txtImporteCalculado").on('blur', function (e) {
        var totalOferta = vm.importeCliente();
        var importeCalculado = parseFloat($("#txtImporteCalculado").val());
        if(isNaN(importeCalculado)) return;
        

        var porcentaje = (importeCalculado * 100) / totalOferta;
        vm.porcentajeCobro(roundToTwo(porcentaje));
    });

    // Eventos de la calculadora de costes
    $('#txtCoste').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeBeneficio').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtImporteBeneficio').on('blur', cambioCampoConRecalculoDesdeBeneficio);
    $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);

    // asignación de eventos al clic
    $("#btnAceptar").click(clicAceptar);
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $("#frmOferta").submit(function () {
        return false;
    });

    //Evento dfel modal de la documentación
    $('#modalUploadDoc').on('hidden.bs.modal', function (event) {
        vm.files([]);
      });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    $("#concepto-form").submit(function () {
        return false;
    });
    
    $("#frmLineaConceptos").submit(function () {
        return false;
    });
    
    $("#generar-contrato-form").submit(function () {
        return false;
    });

    $("#creacionCarpetas-form").submit(function () {
        return false;
    });

    $("#creacionSubcarpetas-form").submit(function () {
        return false;
    });

    $("#frmDoc").submit(function () {
        return false;
    });

    $("#frmloadDoc").submit(function () {
        return false;
    });
    validacionesAdicionalesDelContrato();

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioEmpresa(e.added);
    });
    $("#cmbTipoProyecto").select2().on('change', function (e) {
        cambioTipoProyecto(e.added);
    });
    $("#cmbDepartamentos").select2(select2Spanish());
    loadDepartamentosUsuario();

    $("#cmbTipoProyecto").select2(select2Spanish());
    //loadTipoProyecto();
    $("#cmbTextosPredeterminados").select2(select2Spanish());
    loadTextosPredeterminados();
    $("#cmbTextosPredeterminados").select2().on('change', function (e) {
        cambioTextosPredeterminados(e.added);
    });

    $("#cmbDepartamentos").on('change', function (e) {
        if(!e.added) return;
        loadTipoProyecto();
    });

    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores();
    $("#cmbProveedores").select2().on('change', function (e) {
        if(!e.added) return;
        cambioProveedor(e.added.id);
        var tipof =  vm.tipoOfertaId();
        if(tipof == 7) {
            buscaTarifaProveedor(e.added.id);
        }
    });

   $('#dt_documentacion').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = tablaDocumentacion.row(tr);
 
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });

   /*  $('#upload-input').on('change', function () {
        if(vm.documNombre() == '') return mensError("Se tiene que asignar un nombre al documento.");
        var encontrado = false;
        var id = 0;
        var files = $(this).get(0).files;
        var file = files[0];
        var ext = file.name.split('.').pop().toLowerCase();
        var blob = file.slice(0, file.size, file.type); 
        var newFile = new File([blob], {type: file.type});
        var nom = vm.documNombre() + "." + ext;
        nom = nom.replace(/\//g, "-");
        var fileKey =  carpeta + "/" + nom
        //buscamos si el documento ya existe en la carpeta de destino
        llamadaAjax('GET', "/api/documentacion/documentos/de/la/carpeta/" + carpetaId, null, function (err, docums) {
            if (err) return;
            if(docums && docums.length > 0) {
                for(var i = 0; i < docums.length; i++) {
                    var d = docums[i];
                    var n = d.key.split('/');
                    var index = n.length - 1
                    if(n[index] == nom) {
                        encontrado = true;
                        id = d.documentoId
                        break;
                    }
                }
                if(encontrado) {

                    var mens = "Ya existe un documento con este nombre en esta carpeta, se reemplazará con el que está apunto de subir. ¿Desea continuar?";
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Aceptar][Cancelar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Aceptar") {
                            method = 'PUT';
                            uploadDocum(newFile, fileKey, id);
                        }
                        if (ButtonPressed === "Cancelar") {
                            $('#upload-input').val([]);
                        }
                    });

                } else {
                    uploadDocum(newFile, fileKey, id);
                }
            } else {
                uploadDocum(newFile, fileKey, id);
            }
        }); 
    });
 */
      

    initAutoCliente();
    initAutoMantenedor();
    initAutoAgente();


    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();


    $("#cmbFormasPagoLinea").select2(select2Spanish());
    loadFormasPagoLinea();

    $("#cmbGrupoArticulos").select2(select2Spanish());
    loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        cambioGrupoArticulo(e.added);
    });

    $("#cmbUnidades").select2(select2Spanish());
    loadUnidades();

    $("#cmbArticulos").select2(select2Spanish());
    // loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioArticulo(e.added);
        var tipof =  vm.tipoOfertaId();
        if(tipof == 7) {
            buscaTarifaCliente(e.added);
            if(vm.proveedorId()) buscaTarifaProveedor(vm.proveedorId())
        }
    });

    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();

    $("#cmbTiposIvaProveedor").select2(select2Spanish());
    loadTiposIvaProveedor();

    $("#cmbTiposIva").select2().on('change', function (e) {
        cambioTiposIva(e.added);
    });

    $("#cmbTiposIvaProveedor").select2().on('change', function (e) {
        if(e.added)
            cambioTiposIvaProveedor(e.added.id);
    });

    $('#btnNuevaLinea').prop('disabled', false);
    $('#btnAceptarLinea').prop('disabled', false);

    $('#btnNuevaCarpeta').show();
    if(!usuario.puedeEditar) {
        $('#btnNuevaCarpeta').hide();
    } 
   


    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtImpUni").blur(cambioPrecioCantidad);
    $("#txtPorDescuento").blur(cambioPrecioCantidad);
    $("#txtPorDescuentoProveedor").blur(cambioPrecioCantidad);
    $('#txtPrecioProveedor').blur(cambioPrecioCantidad);
    $("#txtRappelAgente").blur(function(){
        var val =  $("#txtRappelAgente").val();
        nuevaRefReparaciones(vm.stipoOfertaId(), val);
      });
    $("#txtPorDescuento").focus( function () { $('#txtPorDescuento').val(null);});
    $("#txtPorDescuentoProveedor").focus( function () { $('#txtPorDescuentoProveedor').val(null);});

    initTablaOfertasLineas();
    initTablaBases();
    initTablaConceptosLineas();
    initTablaProveedores();
    initTablaDocumentacion();

    ofertaId = gup('OfertaId');
    if (ofertaId != 0) {
        llamadaAjax('GET', myconfig.apiUrl + "/api/ofertas/" + ofertaId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadLineasOferta(data.ofertaId);
            loadBasesOferta(data.ofertaId);
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.ofertaId(0);
        obtenerPorcentajeBeneficioPorDefecto();
        // ocultamos líneas y bases
        $("#btnImprimir").hide();
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        $('#btnGenerarContrato').hide();
        //
        document.title = "NUEVA OFERTA";
    }

    //metodo de validacion de fechas
    $.validator.addMethod("greaterThan",
        function (value, element, params) {
            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) >= new Date(fp);
            } 
        }, 'La fecha de la factura debe ser mayor o igual que la fecha de inicio de contrato.');
}

function admData() {
    var self = this;
    self.ofertaId = ko.observable();
    self.tipoOfertaId = ko.observable();
    self.referencia = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.nombreCliente = ko.observable();
    self.mantenedorId = ko.observable();
    self.agenteId = ko.observable();
    self.fechaOferta = ko.observable();
    self.empresaId = ko.observable();
    self.servicioId = ko.observable();
    // calculadora
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.antPorcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.rappelAgente = ko.observable();
    self.antPorcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeCliente = ko.observable();
    self.importeMantenedor = ko.observable();
    // descuentos
    self.precio = ko.observable();
    self.perdto = ko.observable();
    self.perdtoProveedor = ko.observable();
    self.dto = ko.observable();
    self.precioProveedor = ko.observable();
    self.dtoProveedor = ko.observable();
    //
    self.formaPagoId = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.tipoOfertaId = ko.observable();
    self.stipoOfertaId = ko.observable();
    //
    self.posiblesTiposOferta = ko.observableArray([]);
    self.elegidosTiposOferta = ko.observableArray([]);
    //
    self.tipoProyectoId = ko.observable();
    self.stipoProyectoId = ko.observable();
    //
    self.posiblesTipoProyecto = ko.observableArray([]);
    self.elegidosTipoProyecto = ko.observableArray([]);
    //
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.scontratoClienteMantenimientoId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
    self.observaciones = ko.observable();
    self.conceptosExcluidos = ko.observable();
    //
    self.total = ko.observable();
    self.totalConIva = ko.observable();
    self.contratoId = ko.observable();
    self.fechaAceptacionOferta = ko.observable();

    // -- Valores para las líneas
    self.ofertaLineaId = ko.observable();
    self.linea = ko.observable();
    self.articuloId = ko.observable();
    self.tipoIvaId = ko.observable();
    self.porcentaje = ko.observable();
    self.descripcion = ko.observable();
    self.cantidad = ko.observable();
    self.importe = ko.observable();
    self.costeLinea = ko.observable();
    self.totalLinea = ko.observable();
    self.capituloLinea = ko.observable();
    self.importeProveedor = ko.observable();
    self.costeLineaProveedor = ko.observable();
    self.totalLineaProveedor = ko.observable();
    self.totalLineaProveedorIva = ko.observable();
    self.porcentajeProveedor = ko.observable();
    //
    self.sgrupoArticuloId = ko.observable();
    //
    self.posiblesGrupoArticulos = ko.observableArray([]);
    self.elegidosGrupoArticulos = ko.observableArray([]);
    //
    self.sunidadId = ko.observable();
    //
    self.posiblesUnidades = ko.observableArray([]);
    self.elegidosUnidades = ko.observableArray([]);
    //
    self.stextoPredeterminadoId = ko.observable();
    //
    self.posiblesTextosPredeterminados = ko.observableArray([]);
    self.elegidosTextosPredeterminados = ko.observableArray([]);
    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
    //
    self.sarticuloId = ko.observable();
    //
    self.posiblesArticulos = ko.observableArray([]);
    self.elegidosArticulos = ko.observableArray([]);
    //
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);
    //
    self.stipoIvaProveedorId = ko.observable();
    //
    self.posiblesTiposIvaProveedor = ko.observableArray([]);
    self.elegidosTiposIvaProveedor = ko.observableArray([]);
    //
    // Nuevo Total de coste para la oferta
    self.totalCoste = ko.observable();
    //
    self.generada = ko.observable();
    // -- Valores para la generación del contrato
    self.fechaInicio = ko.observable();
    self.fechaFinal = ko.observable();
    self.fechaOriginal = ko.observable();
    self.fechaPrimeraFactura = ko.observable();
    self.facturaParcial = ko.observable();
    self.preaviso = ko.observable();
    
    //CONCEPTOS
    self.ofertaPorcenId = ko.observable();
    self.conceptoCobro = ko.observable();
    self.porcentajeCobro = ko.observable();
    self.contratoPorcenId = ko.observable();
    self.fechaConcepto = ko.observable();
    self.importeCalculado = ko.observable();
     //
     self.sformaPagoIdLinea = ko.observable();
     self.posiblesFormasPagoLinea = ko.observableArray([]);
     self.elegidosFormasPagoLinea = ko.observableArray([]);

     //CARPETAS  Y DOCUMENTOS
     self.carpetaNombre = ko.observable();
     self.subCarpetaNombre = ko.observable();
     self.documNombre = ko.observable();
     //
     self.files = ko.observable();
}

function loadData(data) {
    vm.ofertaId(data.ofertaId);
    vm.servicioId(data.servicioId);
    vm.tipoOfertaId(data.tipoOfertaId);
    vm.stipoOfertaId(data.tipoOfertaId);
    loadDepartamentosUsuario(data.tipoOfertaId);
    loadTipoProyecto(data.tipoProyectoId);
    vm.referencia(data.referencia);
    loadEmpresas(data.empresaId);
    cargaCliente(data.clienteId);
    cargaMantenedor(data.mantenedorId);
    cargaAgente(data.agenteId, true);
    vm.fechaOferta(spanishDate(data.fechaOferta));
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.antPorcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.antPorcentajeAgente(data.porcentajeAgente);
    vm.rappelAgente(data.rappelAgente);
    vm.importeCliente(data.importeCliente);
    recalcularCostesImportesDesdeCoste();
    vm.importeMantenedor(data.importeMantenedor);
    vm.observaciones(data.observaciones);
    vm.conceptosExcluidos(data.conceptosExcluidos);
    vm.formaPagoId(data.formaPagoId);
    loadFormasPago(data.formaPagoId);
    vm.contratoId(data.contratoId);
    vm.fechaAceptacionOferta(spanishDate(data.fechaAceptacionOferta));
    //
    //cambioDepartamento(data.tipoOfertaId);
    document.title = "OFERTA: " + vm.referencia();

    loadConceptosLineas(data.ofertaId);
    loadGrupoArticulos();

    cargaTablaProveedores();
    cargaTablaDocumentacion();


    if(data.contratoId) {
        $('#cmbEmpresas').prop('disabled', true);
        $('#cmbTiposContrato').prop('disabled', true);
        $('#cmbTipoProyecto').prop('disabled', true);
        $('#txtReferencia').prop('disabled', true);
        $('#txtCliente').prop('disabled', true);
        $('#txtAgente').prop('disabled', true);
    } else {
        $('#cmbEmpresas').prop('disabled', false);
        $('#cmbTiposContrato').prop('disabled', false);
        $('#cmbTipoProyecto').prop('disabled', false);
        $('#txtReferencia').prop('disabled', false);
        $('#txtCliente').prop('disabled', false);
        $('#txtAgente').prop('disabled', false);
    }
}

function datosOK() {
    $('#frmOferta').validate({
        rules: {
            txtReferencia: {
                required: true
            },
            cmbEmpresas: {
                required: true
            },
            txtFechaOferta: {
                required: true
            },
            cmbFormasPago: {
                required: true
            },
            cmbDepartamentos: {
                required: true
            },
            cmbTipoProyecto: {
                required: true
            },
            txtCliente: {
                clienteNecesario: true
            },
            txtAgente: {
                agenteNecesario: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            },
            txtFechaOferta: {
                required: 'Debe elegir una fecha'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbDepartamentos: {
                required: "Debe elegir un departamento"
            },
            cmbTipoProyecto: {
                required: "Debe elegir un tipo de proyecto"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmOferta").validate().settings;
    return $('#frmOferta').valid();
}

function salir() {
    var mf = function () {
        var url = "OfertaGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

var clicAceptar = function () {
    guardarOferta(function (err, tipo) {
        if (err) return;
        var url = "OfertaGeneral.html?OfertaId=" + vm.ofertaId(); // default PUT
        if (tipo == 'POST') {
            url = "OfertaDetalle.html?OfertaId=" + vm.ofertaId(); // POST
        }
        window.open(url, '_self');
    })
}

var guardarOferta = function (done) {
    if (!datosOK()) return errorGeneral(new Error('Datos del formulario incorrectos'), done);
    comprobarSiHayMantenedor();
    var data = generarOfertaDb();
    if (ofertaId == 0) {
        llamadaAjax('POST', myconfig.apiUrl + "/api/ofertas", data, function (err, data) {
            if (err) return errorGeneral(err, done);
            loadData(data);
            done(null, 'POST');
        });
    } else {
        if( (vm.porcentajeBeneficio() != vm.antPorcentajeBeneficio() ||  vm.porcentajeAgente() !=  vm.antPorcentajeAgente()) && numLineas > 0) {
                // mensaje de confirmación
                var mens = "Al cambiar los porcentajes con lineas creadas se modificarán los importes de estas en arreglo a los nuevos porcentajes introducidos, ¿ Desea continuar ?.";
                $.SmartMessageBox({
                    title: "<i class='fa fa-info'></i> Mensaje",
                    content: mens,
                    buttons: '[Aceptar][Cancelar]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Aceptar") {
                        actualizarLineasDeLaOfertaTrasCambioCostes(function(err, result) {
                            if (err) return errorGeneral(err, done);
                            recalcularImportesGuardar(function(err, result) {
                                if (err) return errorGeneral(err, done);
                                var data  = generarOfertaDb();
                                llamadaAjax('PUT', myconfig.apiUrl + "/api/ofertas/" + ofertaId, data, function (err, data) {
                                    if (err) return errorGeneral(err, done);
                                    done(null, 'PUT');
                                });
                            });
                        });
                    }
                    
                    if (ButtonPressed === "Cancelar") {
                        salir()();
                    }
                });
        } else {
            llamadaAjax('PUT', myconfig.apiUrl + "/api/ofertas/" + ofertaId, data, function (err, data) {
                if (err) return errorGeneral(err, done);
                done(null, 'PUT');
            });
        }
        
    }
}

var generarOfertaDb = function() {
    var data = {
        oferta: {
            "ofertaId": vm.ofertaId(),
            "tipoOfertaId": vm.stipoOfertaId(),
            "tipoProyectoId": vm.stipoProyectoId(),
            "referencia": vm.referencia(),
            "empresaId": vm.sempresaId(),
            "clienteId": vm.clienteId(),
            "agenteId": vm.agenteId(),
            "mantenedorId": vm.mantenedorId(),
            "fechaOferta": spanishDbDate(vm.fechaOferta()),
            "coste": vm.coste(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "importeBeneficio": vm.importeBeneficio(),
            "ventaNeta": vm.ventaNeta(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "rappelAgente": vm.rappelAgente(),
            "importeAgente": vm.importeAgente(),
            "importeCliente": vm.importeCliente(),
            "importeMantenedor": vm.importeMantenedor(),
            "observaciones": vm.observaciones(),
            "conceptosExcluidos": vm.conceptosExcluidos(),
            "formaPagoId": vm.sformaPagoId()
        }
    };
    return data;
}

var recalcularImportesGuardar = function(done) {
    llamadaAjax('GET', "/api/ofertas/lineas/" + vm.ofertaId() + "/" + false + "/" +  false, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        llamadaAjax('GET', "/api/ofertas/bases/" + vm.ofertaId(), null, function (err, data) {
            if (err) return;
            // actualizamos los totales
            var t1 = 0; // total sin iva
            var t2 = 0; // total con iva
            for (var i = 0; i < data.length; i++) {
                t1 += data[i].base;
                t2 += data[i].base + data[i].cuota;
            }
            vm.total(numeral(t1).format('0,0.00'));
            vm.totalConIva(numeral(t2).format('0,0.00'));
            vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
            done(null, 'OK')
        })
    });
}


var actualizarLineasDeLaOfertaTrasCambioCostes = function (done) {
    llamadaAjax('PUT',
        "/api/ofertas/recalculo/" + vm.ofertaId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente(),
        null, function (err, data) {
            if (err) return errorGeneral(err, done);
            done(null, 'OK')
        });
};




function loadEmpresas(id) {
    llamadaAjax('GET', "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}


function loadDepartamentos(id) {
    llamadaAjax('GET', "/api/departamentos", null, function (err, data) {
        if (err) return;
        var tipos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesTiposOferta(tipos);
        $("#cmbDepartamentos").val([id]).trigger('change');
    });
}

function loadDepartamentosUsuario(id) {
    if(id) vm.tipoOfertaId(id);
    llamadaAjax('GET', "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var tipos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesTiposOferta(tipos);
        $("#cmbDepartamentos").val([id]).trigger('change');
    });
}

function loadTipoProyecto(id) {
    if(id == undefined) id = 0;
    var url = "/api/tipos_proyectos/departamento/activos/" + usuario.usuarioId + "/" + vm.stipoOfertaId()  + "/" + id;
    //si estamos creando la oferta cargamos solo como elegibles los tipos de proyecto activos
    //if (ofertaId == 0 || !id)  url = "/api/tipos_proyectos/departamento/activos/" + usuario + "/" + vm.stipoOfertaId() + "/" + id;
    llamadaAjax('GET', url, null, function (err, data) {
        if (err) return;
        var tipos = [{ tipoProyectoId: 0, nombre: "" }].concat(data);
        vm.posiblesTipoProyecto(tipos);
        $("#cmbTipoProyecto").val([id]).trigger('change');
    });
}

function loadTextosPredeterminados(id) {
    llamadaAjax('GET', "/api/textos_predeterminados", null, function (err, data) {
        if (err) return;
        var textos = [{ textoPredeterminadoId: 0, texto: "", abrev: "" }].concat(data);
        vm.posiblesTextosPredeterminados(textos);
        $("#cmbTextPredeterminados").val([id]).trigger('change');
    });
}

function loadFormasPago(id) {
    llamadaAjax('GET', '/api/formas_pago', null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([id]).trigger('change');
    });
}

function loadContratos(id) {
    if (id) {
        // caso de un contrato en concreto
        llamadaAjax('GET', "/api/contratos_cliente_mantenimiento/" + id, null, function (err, data) {
            if (err) return;
            var contratos = [{ contratoClienteMantenimientoId: 0, referencia: "" }].concat(data);
            vm.posiblesContratos(contratos);
            $("#cmbContratos").val([id]).trigger('change');
        });
    } else {
        // caso cargar contratos de empreas / cliente
        llamadaAjax('GET',
            "/api/contratos_cliente_mantenimiento/empresa_cliente/" + vm.sempresaId() + "/" + vm.sclienteId(), null, function (err, data) {
                if (err) return;
                var contratos = [{ contratoClienteMantenimientoId: 0, referencia: "" }].concat(data);
                vm.posiblesContratos(contratos);
                $("#cmbContratos").val([id]).trigger('change');
            });
    }
}

function loadFormasPagoLinea(id) {
    llamadaAjax('GET', '/api/formas_pago', null, function (err, data) {
        if (err) return;
        var formasPago = [{
            formaPagoId: null,
            nombre: ""
        }].concat(data);
        vm.posiblesFormasPagoLinea(formasPago);
        vm.sformaPagoIdLinea(id);
        $("#cmbFormasPagoLinea").val([id]).trigger('change');
    });
}

function cambioDepartamento(departamentoId) {
    if(!departamentoId) return;
    llamadaAjax('GET', "/api/departamentos/" + departamentoId, null, function (err, data) {
        if (err) return;
        usaCalculadora = data.usaCalculadora;
        if(data.usaCalculadora == 0) {
            $('#calculadora').hide();
            vm.porcentajeAgente(0);
            vm.porcentajeBeneficio(0);
        } else {
            $('#calculadora').show();
            if( !vm.porcentajeBeneficio() ) obtenerPorcentajeBeneficioPorDefecto();
            if(vm.agenteId()) {
                cargaAgente(vm.agenteId(), false);
            }
        }
       
    });
}

function nuevaRefReparaciones(departamentoId, comision) {
    var fecha = spanishDbDate(vm.fechaOferta());
    var ano = null
    if(fecha) {
        fecha = new Date(fecha);
        ano = fecha.getFullYear();

    }
    if(!comision) comision = 0;
    if(!departamentoId ||  !ano || !vm.sempresaId()) return;
   
    if(departamentoId == 7) {
        if(vm.sempresaId() == 2 || vm.sempresaId() == 3 || vm.sempresaId() == 7) {
            llamadaAjax('GET', "/api/ofertas/siguiente_referencia/reparaciones/" + vm.sempresaId() + "/" + comision  + "/" + ano, null, function (err, nuevaReferencia) {
                if (err) return;
                vm.referencia(nuevaReferencia);
            });
        }
    }
}

var cambioCliente = function (data) {
    //
    if (!data) {
        return;
    }
    var clienteId = data.id;
    llamadaAjax('GET', "/api/clientes/" + clienteId, null, function (err, data) {
        if (err) return;
        cargaAgente(data.comercialId, false);
        vm.agenteId(data.comercialId);
        loadFormasPago(data.formaPagoId);
    });
}

function cambioEmpresa(data) {
    //
    if (!data) {
        return;
    }
    var empresaId = data.id;
    llamadaAjax('GET', "/api/empresas/" + empresaId, null, function (err, data) {
        if (err) return;
    });
}

function cambioTipoProyecto(data) {
    //
    if (!data) {
        return;
    }
    var tipoProyectoId = data.id;
    var arquitectura = false;
    if(vm.stipoOfertaId() == 5) arquitectura = true;
    if(vm.stipoOfertaId() == 7) {
        if(vm.sempresaId() != 2 && vm.sempresaId() != 3 && vm.sempresaId() != 7) {
            llamadaAjax('GET', myconfig.apiUrl + "/api/tipos_proyectos/" + tipoProyectoId, null, function (err, data) {
                if (err) return;
                llamadaAjax('GET', myconfig.apiUrl + "/api/ofertas/siguiente_referencia/" + data.abrev + "/" + arquitectura, null, function (err, nuevaReferencia) {
                    if (err) return;
                    vm.referencia(nuevaReferencia);
                });
            });
        }
    } 
    if(vm.stipoOfertaId() != 7) {
        llamadaAjax('GET', myconfig.apiUrl + "/api/tipos_proyectos/" + tipoProyectoId, null, function (err, data) {
            if (err) return;
            llamadaAjax('GET', myconfig.apiUrl + "/api/ofertas/siguiente_referencia/" + data.abrev + "/" + arquitectura, null, function (err, nuevaReferencia) {
                if (err) return;
                if(vm.stipoOfertaId() == 5) {
                    var a = spanishDbDate(vm.fechaOferta());
                    var y =  moment(a).year().toString();
                    y = y.substring(2);
                    nuevaReferencia = nuevaReferencia + "-0/" + y
                    vm.referencia(nuevaReferencia);
                    if(vm.porcentajeAgente()) {
                        cargaPorcenRef(vm.porcentajeAgente());
                        return;
                    }
                }
                vm.referencia(nuevaReferencia);
            });
        });
    }
}

function cambioTextosPredeterminados(data) {
    //
    if (!data) {
        return;
    }
    var textoPredeterminadoId = data.id;
    llamadaAjax('GET', myconfig.apiUrl + "/api/textos_predeterminados/" + textoPredeterminadoId, null, function (err, data) {
        if (err) return;
        var observaciones = ""
        if (vm.observaciones()) observaciones = vm.observaciones();
        observaciones += data.texto;
        vm.observaciones(observaciones);
    });
}

/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de ofertas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea(); // es un alta
    lineaEnEdicion = false;
    llamadaAjax('GET', "/api/ofertas/nextlinea/" + vm.ofertaId(), null, function (err, data) {
        if (err) return;
        vm.linea(data);
        vm.total(0);
        vm.totalConIva(0);
    });
}

function limpiaDataLinea(data) {
    vm.ofertaLineaId(0);
    vm.linea(null);
    vm.articuloId(null);
    vm.tipoIvaId(null);
    vm.porcentaje(null);
    vm.descripcion(null);
    vm.cantidad(null);
    vm.importe(null);
    vm.costeLinea(null);
    vm.totalLinea(null);
    vm.costeLineaProveedor(null);
    vm.importeProveedor(null);
    vm.totalLineaProveedor(null);
    vm.totalLineaProveedorIva(null);
    vm.porcentajeProveedor(null)
    vm.proveedorId(null);
    //
    vm.precio(null);
    vm.precioProveedor(null);
    vm.perdto(0);
    vm.perdtoProveedor(0);
    vm.dto(0);
    vm.dtoProveedor(0);
    

    //
    //
    loadGrupoArticulos();
    // loadArticulos();
    loadTiposIva();
    loadTiposIvaProveedor();
    loadProveedores();
   
    //
    loadArticulos();
    loadUnidades();
}

var guardarLinea = function () {
    var costeCliente = vm.costeLinea();
    var costeProveedor = vm.costeLineaProveedor();
    if (!datosOKLineas()) {
        return;
    }
    if(costeProveedor > costeCliente) {
        mensError("El total del proveedor no puede ser mayor que el total del cliente");
        return;
    }
    if(vm.proveedorId()) {
        if(!vm.stipoIvaProveedorId()) {
            mensError("Se tiene que introducir un tipo de iva");
            return;
        }
    }
    var data = {
        ofertaLinea: {
            ofertaLineaId: vm.ofertaLineaId(),
            linea: vm.linea(),
            ofertaId: vm.ofertaId(),
            unidadId: vm.sunidadId(),
            articuloId: vm.sarticuloId(),
            tipoIvaId: vm.tipoIvaId(),
            porcentaje: vm.porcentaje(),
            descripcion: vm.descripcion(),
            cantidad: vm.cantidad(),
            importe: vm.importe(),
            totalLinea: vm.totalLinea(),
            coste: vm.costeLinea(),
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente(),
            capituloLinea: vm.capituloLinea(),
            importeProveedor: vm.importeProveedor(),
            totalLineaProveedor: vm.totalLineaProveedor(),
            costeLineaProveedor: vm.costeLineaProveedor(),
            tipoIvaProveedorId: vm.stipoIvaProveedorId(),
            porcentajeProveedor: vm.porcentajeProveedor(),
            proveedorId: vm.sproveedorId(),
            precio: vm.precio(),
            perdto: vm.perdto(),
            perdtoProveedor: vm.perdtoProveedor(),
            dto: vm.dto(),
            precioProveedor: vm.precioProveedor(),
            dtoProveedor: vm.dtoProveedor(),
            totalLineaProveedorIva: vm.totalLineaProveedorIva()
            //
        }
    }
    var verboAjax = '';
    var urlAjax = '';
    if (!lineaEnEdicion) {
        verbo = 'POST';
        urlAjax = myconfig.apiUrl + "/api/ofertas/lineas";
    } else {
        verbo = 'PUT';
        urlAjax = myconfig.apiUrl + "/api/ofertas/lineas/" + vm.ofertaLineaId();
    }
    llamadaAjax(verbo, urlAjax, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        recargaCabeceraLineasBases();
    });
}


function datosOKLineas() {
    $('#linea-form').validate({
        rules: {
            txtCapitulo: {
                required: true
            },
            txtLinea: {
                required: true
            },
            cmbTextosPredeterminados: {
                required: true
            },
            cmbArticulos: {
                required: true
            },
            cmbTiposIva: {
                required: true
            },
            txtDescripcion: {
                required: true
            },
            txtPrecio: {
                required: true
            },
            txtCantidad: {
                required: true
            },
            txtTotalLinea: {
                required: true
            },
            txtPorDescuento: {
                required: true
            },
            txtPorDescuentoProveedor: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtCapitulo: {
                required: "Debe dar un texto al capítulo"
            },
            cmbUnidades: {
                required: "Debe elegir una unidad"
            },
            cmbArticulos: {
                required: "Debe elegir un articulo"
            },
            cmbTiposIva: {
                required: 'Debe elegir un tipo de IVA'
            },
            txtLinea: {
                required: 'Necesita un número de linea'
            },
            txtDescripcion: {
                required: 'Necesita una descripcion'
            },
            txtCantidad: {
                required: 'Necesita una cantidad'
            },
            txtPrecio: {
                required: 'Necesita un precio'
            },
            txtPorDescuento: {
                required: "introduzca una cantidad, puede ser cero"
            },
            txtPorDescuentoProveedor: {
                required: "introduzca una cantidad, puede ser cero"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#linea-form").validate().settings;
    return $('#linea-form').valid();
}

function initTablaOfertasLineas() {
    tablaOfertasLineas = $('#dt_lineas').DataTable({
        autoWidth: true,
        responsive: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
           
        },
        rowCallback: function (nRow) {
           
        },
        drawCallback: function (oSettings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            api.column(1, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="8">' + group + '</td></tr>'
                    );
                    last = group;
                }
            });
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataOfertasLineas,
        columns: [{
            data: "linea"
        }, {
            data: "capituloLinea",
            render: function (data, type, row) {
                return "";
            }
        }, {
            data: "unidades"
        }, {
            data: "descripcion",
            render: function (data, type, row) {
                return data.replace('\n', '<br/>');
            }
        }, {
            data: "importe",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "cantidad",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "dto",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "costeLinea",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },  {
            data: "proveedorNombre",
        },{
            data: "importeProveedor",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "dtoProveedor",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },  {
            data: "costeLineaProveedor",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "ofertaLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteOfertaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editOfertaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                if (!vm.generada())
                    html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
    tablaOfertasLineas.columns(1).visible(false);
}

function loadDataLinea(data) {
    vm.ofertaLineaId(data.ofertaLineaId);
    vm.linea(data.linea);
    vm.articuloId(data.articuloId);
    vm.tipoIvaId(data.tipoIvaId);
    vm.porcentaje(data.porcentaje);
    vm.descripcion(data.descripcion);
    vm.cantidad(data.cantidad);
    vm.importe(data.importe);
    vm.totalLinea(data.totalLinea);
    vm.costeLinea(data.coste);
    vm.capituloLinea(data.capituloLinea);
    vm.proveedorId(data.proveedorId);
    //
    //cantidades de proveedor
    vm.importeProveedor(data.importeProveedor);
    vm.totalLineaProveedor(data.totalLineaProveedor);
    vm.costeLineaProveedor(data.costeLineaProveedor);
    vm.porcentajeProveedor(data.porcentajeProveedor);
    vm.totalLineaProveedorIva(data.totalLineaProveedorIva);
    //
    loadGrupoArticulos(data.grupoArticuloId);
    loadUnidades(data.unidadId);
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
    loadTiposIvaProveedor(data.tipoIvaProveedorId);
    loadProveedores(data.proveedorId)
    //
    //descuento cliente
    vm.precio(data.precio);
    vm.perdto(data.perdto);
    vm.dto(data.dto);
    //
    //descuento del proveedor
    vm.perdtoProveedor(data.perdtoProveedor);
    vm.precioProveedor(data.precioProveedor);
    vm.dtoProveedor(data.dtoProveedor);

}



function loadTablaOfertaLineas(data) {
    numLineas = data.length;
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(!data) numLineas = 0;
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasOferta(id) {
    llamadaAjax('GET', "/api/ofertas/lineas/" + id + "/" + false + "/" +  false, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        loadTablaOfertaLineas(data);
    });
}

function loadArticulos(id) {
    llamadaAjax('GET', "/api/articulos", null, function (err, data) {
        if (err) return;
        var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
        if (id) {
            $("#cmbArticulos").val([id]).trigger('change');
        } else {
            $("#cmbArticulos").val([0]).trigger('change');
        }
    });
}

function loadGrupoArticulos(id) {
    var url;
    url = "/api/grupo_articulo/departamento/" + vm.tipoOfertaId();
    /*if(id) {
        url =  "/api/grupo_articulo";
    } else {
        url = "/api/grupo_articulo/departamento/" + vm.departamentoId();
    }*/
    llamadaAjax('GET', url, null, function (err, data) {
        if (err) return;
        var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
        vm.posiblesGrupoArticulos(grupos);
        if (id) {
            $("#cmbGrupoArticulos").val([id]).trigger('change');
        } else {
            $("#cmbGrupoArticulos").val([0]).trigger('change');
        }
    });
}

function loadUnidades(id) {
    llamadaAjax('GET', "/api/unidades", null, function (err, data) {
        if (err) return;
        var unidades = [{ unidadId: 0, nombre: "  ", abrev: "  " }].concat(data);
        vm.posiblesUnidades(unidades);
        if (id) {
            $("#cmbUnidades").val([id]).trigger('change');
        } else {
            $("#cmbUnidades").val([0]).trigger('change');
        }
    });
}

function loadTiposIva(id) {
    llamadaAjax('GET', "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: null, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([0]).trigger('change');
        }
    });
}



function loadProveedores(proveedorId) {
    llamadaAjax("GET", "/api/proveedores", null, function (err, data) {
        if (err) return;
        var proveedores = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesProveedores(proveedores);
        $("#cmbProveedores").val([proveedorId]).trigger('change');
    });
}

function cambioArticulo(data) {
    //
    if (!data) {
        return;
    }
    var articuloId = data.id;
    llamadaAjax('GET', "/api/articulos/" + articuloId, null, function (err, data) {
        if (err) return;
        // cargamos los campos por defecto de receptor
        if (data.descripcion == null) {
            vm.descripcion(data.nombre);
        } else {
            vm.descripcion(data.nombre + ':\n' + data.descripcion);
        }
        vm.cantidad(1);
        vm.importe(data.precioUnitario);
        //valores para IVA por defecto a partir del  
        // articulo seleccionado.
        $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
        var data2 = {
            id: data.tipoIvaId
        };
        // poner la unidades por defecto de ese artículo
        $("#cmbUnidades").val([data.unidadId]).trigger('change');
        cambioTiposIva(data2);
        cambioPrecioCantidad();
    });
}


function buscaTarifaCliente(data) {
    if (!data) {
        return;
    }
    var articuloId = data.id;
    llamadaAjax('GET', "/api/clientes/tarifa/por/articuloId/" + vm.clienteId() + "/" + articuloId, null, function (err, data) {
        if (err) return;
        if(data.length > 0)  {
            vm.importe(data[0].precioCliente);
            cambioPrecioCantidad();
        }
        
    });
}

function buscaTarifaProveedor(proveedorId) {
    if (!proveedorId) return;
    llamadaAjax('GET', "/api/proveedores/tarifa/por/articuloId/" + proveedorId + "/" + vm.sarticuloId(), null, function (err, data) {
        if (err) return;
        if(data.length > 0)  {
            vm.importeProveedor(data[0].precioProveedor);
            cambioPrecioCantidad();
        }
        
    });
}


function cambioGrupoArticulo(data) {
    if (!data) return;
    var grupoArticuloId = data.id;
    
        crearTextoDeCapituloAutomatico(grupoArticuloId);
    
    cargarArticulosRelacionadosDeUnGrupo(grupoArticuloId);
}

var crearTextoDeCapituloAutomatico = function (grupoArticuloId) {
    var numeroCapitulo = Math.floor(vm.linea());
    var nombreCapitulo = "Capitulo " + numeroCapitulo + ": ";
    // ahora hay que buscar el nombre del capitulo para concatenarlo
    llamadaAjax('GET', "/api/grupo_articulo/" + grupoArticuloId, null, function (err, data) {
        if (err) return;
        var capituloAntiguo = vm.capituloLinea();
        nombreCapitulo += data.nombre;
        if(capituloAntiguo != nombreCapitulo) {
            vm.capituloLinea(nombreCapitulo);
        }
    });
}

var cargarArticulosRelacionadosDeUnGrupo = function (grupoArticuloId) {
    llamadaAjax('GET', "/api/articulos/grupo/" + grupoArticuloId, null, function (err, data) {
        if (err) return;
        var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
    });
}

function cambioTiposIva(data) {
    if (!data) return;
    var tipoIvaId = data.id;
    llamadaAjax('GET', "/api/tipos_iva/" + tipoIvaId, null, function (err, data) {
        if (err) return;
        vm.tipoIvaId(data.tipoIvaId);
        vm.porcentaje(data.porcentaje);
    });
}

function cambioTiposIvaProveedor(tipoIvaId) {
    if (!tipoIvaId) {
        vm.stipoIvaProveedorId(null);
        vm.porcentajeProveedor(null);
        return;
    }
    llamadaAjax('GET', "/api/tipos_iva/" + tipoIvaId, null, function (err, data) {
        if (err) return;
        vm.stipoIvaProveedorId(data.tipoIvaId);
        vm.porcentajeProveedor(data.porcentaje);
        cambioPrecioCantidad();
    });
}

function loadTiposIvaProveedor(id) {
    llamadaAjax('GET', "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: null, nombre: "" }].concat(data);
        vm.posiblesTiposIvaProveedor(tiposIva);
        if (id) {
            $("#cmbTiposIvaProveedor").val([id]).trigger('change');
        } else {
            $("#cmbTiposIvaProveedor").val([0]).trigger('change');
        }
    });
}

function cambioProveedor(proveedorId) {
    if (!proveedorId) return;
    llamadaAjax("GET", "/api/proveedores/" + proveedorId, null, function (err, data) {
        if (err) return;
        vm.proveedorId(proveedorId);
        loadTiposIvaProveedor(data.tipoIvaId);
        cambioTiposIvaProveedor(data.tipoIvaId);
        cambioPrecioCantidad();
    });
}

var cambioPrecioCantidad = function () {
    var totalProIva;
    var porIva;
    var porPro = vm.porcentajeProveedor();
    vm.precio(vm.cantidad() * vm.importe());
    vm.costeLinea(vm.cantidad() * vm.importe());
    recalcularCostesImportesDesdeCoste();
    vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));

     //CALCULO DE LAS CANTIDADES DEL PROVEEDOR
     vm.precioProveedor(vm.cantidad() * vm.importeProveedor());
     vm.costeLineaProveedor(vm.cantidad() * vm.importeProveedor());
     vm.totalLineaProveedor(obtenerImporteAlClienteDesdeCoste(vm.costeLineaProveedor()));
     vm.totalLineaProveedorIva(vm.totalLineaProveedor());
     if(porPro !== null) {
        porIva = vm.porcentajeProveedor() / 100;
        totalProIva = vm.totalLineaProveedor() + (vm.totalLineaProveedor() * porIva);
        vm.totalLineaProveedorIva(roundToTwo(totalProIva));
     }

     if(vm.perdtoProveedor() == 0 || !vm.perdtoProveedor()) vm.perdtoProveedor(vm.perdto()); //si no hay porcentaje de 
                                                                                                 //descuennto en el proveedor cargamos el del cliente
     //calculo en caso de descuento cliente
    if(vm.perdto() > 0 || vm.perdto() != '') {
        var precio = parseFloat(vm.precio());
        var porcen = parseFloat(vm.perdto());
        porcen = porcen / 100;
        var descuento = precio * porcen;
        //se calcula el descuento cliente
        vm.dto(roundToTwo(descuento));
        var resultado = parseFloat(precio-descuento);
        vm.costeLinea(roundToTwo(resultado));
        
        recalcularCostesImportesDesdeCoste();
        vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));
    }

    //calculo en caso de descuento proveedor
    if(vm.perdtoProveedor() > 0 || vm.perdtoProveedor() != '') {
        var precioProveedor =  parseFloat(vm.precioProveedor());
        var porcen = parseFloat(vm.perdtoProveedor());
        porcen = porcen / 100;
        var descuentoProveedor = precioProveedor * porcen;
        
        //se calcula el descuento proveedor
        vm.dtoProveedor(roundToTwo(descuentoProveedor));
        var resultadoProveedor = parseFloat(precioProveedor-descuentoProveedor);
        vm.costeLineaProveedor(roundToTwo(resultadoProveedor));

        recalcularCostesImportesDesdeCoste();
        vm.totalLineaProveedor(obtenerImporteAlClienteDesdeCoste(vm.costeLineaProveedor()));
        if(porPro !== null) {
            porIva = vm.porcentajeProveedor() / 100;
            totalProIva = vm.totalLineaProveedor() + (vm.totalLineaProveedor() * porIva);
            vm.totalLineaProveedorIva(roundToTwo(totalProIva));
         }

    }
}

function editOfertaLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax('GET', "/api/ofertas/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) {
            loadDataLinea(data[0]);
        }
    });
}

function deleteOfertaLinea(id) {
    // mensaje de confirmación
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        // aceptar borra realmente la línea
        var data = {
            ofertaLinea: {
                ofertaId: vm.ofertaId()
            }
        };
        llamadaAjax('DELETE', myconfig.apiUrl + "/api/ofertas/lineas/" + id, data, function (err, data) {
            if (err) return;
            recargaCabeceraLineasBases();
        });
    }, function () {
        // cancelar no hace nada
    });
}

var recargaCabeceraLineasBases = function () {
    llamadaAjax('GET', myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(), null, function (err, data) {
        if (err) return;
        loadData(data);
        loadLineasOferta(data.ofertaId);
        loadBasesOferta(data.ofertaId);
    });
}

var recargaLineasBases = function () {
    llamadaAjax('GET', myconfig.apiUrl + "/api/ofertas/" + vm.ofertaId(), null, function (err, data) {
        if (err) return;
        loadLineasOferta(data.ofertaId);
        loadBasesOferta(data.ofertaId);
    });
}

/*
    Funciones relacionadas con la gestión de bases
    y cuotas
*/

function initTablaBases() {
    tablaCarro = $('#dt_bases').dataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
           
        },
        rowCallback: function (nRow) {
            
        },
        drawCallback: function (oSettings) {
           
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataBases,
        columns: [{
            data: "tipo"
        }, {
            data: "porcentaje",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "base",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "cuota",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }]
    });
}


function loadTablaBases(data) {
    var dt = $('#dt_bases').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


function loadBasesOferta(id) {
    llamadaAjax('GET', "/api/ofertas/bases/" + id, null, function (err, data) {
        if (err) return;
        // actualizamos los totales
        var t1 = 0; // total sin iva
        var t2 = 0; // total con iva
        for (var i = 0; i < data.length; i++) {
            t1 += data[i].base;
            t2 += data[i].base + data[i].cuota;
        }
        vm.total(numeral(t1).format('0,0.00'));
        vm.totalConIva(numeral(t2).format('0,0.00'));
        loadTablaBases(data);
    })
}

// ----------- Funciones relacionadas con el manejo de autocomplete

var cargaCliente = function (id) {
    if (!id) return;
    llamadaAjax('GET', "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.nombreCliente(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.clienteId(data.clienteId);
    });
};

var cargaMantenedor = function (id) {
    if (!id) return;
    llamadaAjax('GET', "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtMantenedor').val(data.nombre);
        vm.mantenedorId(id);
    });
};

var cargaAgente = function (id, encarga) {
    llamadaAjax('GET', "/api/comerciales/" + id, null, function (err, data) {
        if (err) return;
        $('#txtAgente').val(data.nombre);
        vm.agenteId(data.comercialId);
        if (!encarga) {
            obtenerPorcentajeDelAgente(vm.agenteId(), vm.clienteId(), vm.sempresaId(), vm.stipoOfertaId(), function (err, comision) {
                if (err) return;
                var porcenAgen = vm.porcentajeAgente();
                if (!vm.porcentajeAgente() || porcenAgen == 0) {
                    if(usaCalculadora)  vm.porcentajeAgente(comision);
                    vm.rappelAgente(comision);
                } 
                recalcularCostesImportesDesdeCoste();
                if(vm.stipoOfertaId() == 7)  nuevaRefReparaciones(vm.stipoOfertaId(), comision);
                if(vm.stipoOfertaId() == 5 && !encarga) cargaPorcenRef(comision);
            });
        }
    });
};

var initAutoCliente = function () {
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/clientes/clientes_activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.clienteId(ui.item.id);
            cambioCliente(ui.item);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.clienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var initAutoMantenedor = function () {
    $("#txtMantenedor").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/clientes/mantenedores_activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.clienteId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.mantenedorId(ui.item.id);
            recalcularCostesImportesDesdeCoste();
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("mantenedorNecesario", function (value, element) {
        var r = false;
        if (vm.mantenedorId()) r = true;
        return r;
    }, "Debe seleccionar un mantenedor válido");
};

var initAutoAgente = function () {
    $("#txtAgente").autocomplete({
        source: function (request, response) {
            llamadaAjax('GET', "/api/comerciales/agentes_activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.comercialId,
                        porcentajeAgente: d.porComer
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.agenteId(ui.item.id);
            obtenerPorcentajeDelAgente(vm.agenteId(), vm.clienteId(), vm.sempresaId(), vm.stipoOfertaId(), function (err, comision) {
                if (err) return;
                vm.porcentajeAgente(comision);
                vm.rappelAgente(comision);
                recalcularCostesImportesDesdeCoste();
                nuevaRefReparaciones(vm.stipoOfertaId(), comision);
                //gargamos la comision en la referencia si es de arquitectura

                if(vm.stipoOfertaId() == 5) {
                   cargaPorcenRef(comision);
                }
            });
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("agenteNecesario", function (value, element) {
        var r = false;
        if (vm.agenteId()) r = true;
        return r;
    }, "Debe seleccionar un agente válido");
};

var cargaPorcenRef = function(comision) {
    if(!comision) comision = 0;
    var ref = vm.referencia();
    if(ref && ref != '') {
        ref = ref.toString();
        var com = comision.toString();
        ref = ref.replace(/-[0-9]*\//, "-" + com + "/");
        vm.referencia(ref);
    }
}

var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    if(vm.porcentajeBeneficio() != vm.antPorcentajeBeneficio() || vm.porcentajeAgente() != vm.antPorcentajeAgente()) {
        $('#btnNuevaLinea').prop('disabled', true);
        $('#btnAceptarLinea').prop('disabled', true)
    } else {
        $('#btnNuevaLinea').prop('disabled', false);
        $('#btnAceptarLinea').prop('disabled', false)
    }
    
};

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
}

var recalcularCostesImportesDesdeCoste = function () {
    if(usaCalculadora == 0) return;//SI NO USA CALCULADORA NO SE OBTINEN PORCENTAJES
    if (!vm.coste()) vm.coste(0);
    if (!vm.porcentajeAgente()) {
        vm.porcentajeAgente(0);
    } else {
        vm.porcentajeAgente(roundToTwo(vm.porcentajeAgente()));
    }
    if (!vm.porcentajeBeneficio()) vm.porcentajeBeneficio(0);
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio() != null) {
            vm.importeBeneficio(roundToTwo(vm.porcentajeBeneficio() * vm.coste() / 100));
        }
        vm.ventaNeta(roundToTwo(vm.coste() * 1 + vm.importeBeneficio() * 1));
    }
    if (vm.porcentajeAgente() != null) {
        vm.importeCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeCliente() - vm.ventaNeta()));
    }
    vm.importeCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.mantenedorId()) {
        vm.importeMantenedor(roundToTwo(vm.importeCliente() - vm.ventaNeta() + vm.importeBeneficio()));
    }
};

var recalcularCostesImportesDesdeBeneficio = function () {
    if (vm.porcentajeBeneficio() && vm.coste()) {
        if (vm.importeBeneficio()) {
            vm.porcentajeBeneficio(roundToSix(((100 * vm.importeBeneficio()) / vm.coste())));
        }
    }
    recalcularCostesImportesDesdeCoste();
};



var ocultarCamposOfertasGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var obtenerImporteAlClienteDesdeCoste = function (coste) {
    if(usaCalculadora == 0) return coste;
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = roundToTwo(vm.porcentajeBeneficio() * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = roundToTwo(importeCliente - ventaNeta);
    }
    importeCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    return importeCliente;
}

var imprimir = function () {
    guardarOferta(function (err) {
        if (err) return;
        printOferta2(vm.ofertaId());
    })
}

var imprimirProveedor = function (id) {
    guardarOferta(function (err) {
        if (err) return;
        printOfertaProveedor(id);
    })
}

function printOferta2(id) {
    var url = "InfOfertas.html?ofertaId=" + id;
    window.open(url, "_new");
}

function printOfertaProveedor(id) {
    var url = "InfOfertasProveedores.html?ofertaId=" + vm.ofertaId() + "&proveedorId=" + id;
    window.open(url, "_new");
}

function printOferta(id) {
    llamadaAjax('GET', myconfig.apiUrl + "/api/informes/ofertas/" + id, null, function (err, data) {
        if (err) return;
        informePDF(data);
    });
}

function informePDF(data) {
    var shortid = "rySBxKzIe";
    var infData = {
        "template": {
            "shortid": shortid
        },
        "data": data,
        "options": {
            "Content-Disposition": "attachment; esteEsElInforme.pdf",
            "reports": { "save": true }
        }
    }
    llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + data.cabecera.empresaId, null, function (err, empresa) {
        if (err) return;
        if (empresa.infOfertas) infData.template.shortid = empresa.infOfertas;
        //f_open_post("POST", myconfig.reportUrl + "/api/report", infData);
        apiReport("POST", myconfig.reportUrl + "/api/report", infData);
    });
}

var f_open_post = function (verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_blank";

    var input = document.createElement("textarea");
    input.name = "template[shortid]";
    input.value = data.template.shortid;
    form.appendChild(input);

    input = document.createElement("textarea");
    input.name = "data";
    input.value = JSON.stringify(data.data);
    form.appendChild(input);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
};

var apiReport = function (verb, url, data) {
    $.ajax({
        type: verb,
        url: url,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, status, request) {
            var a = 1;
        },
        error: function (err) {
            //mensErrorAjax(err);
            var file = new Blob([err.responseText], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            //var base64EncodedPDF = window.btoa(err.responseText);
            window.open("data:application/pdf " + err.responseText);
            //window.open(fileURL);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}
//
var generarContrato = function () {
    vm.fechaAceptacionOferta(spanishDate(new Date()));
}

var guardarContrato = function () {
    if (!contratoOk()) return;
    if (vm.contratoId()) {
        var mens = "Ya hay un contrato generado para esta oferta. ¿Desea eliminarlo y generarlo de nuevo?"
        mensajeAceptarCancelar(mens, function aceptar() {
            var url = myconfig.apiUrl + "/api/contratos/" + vm.contratoId();
            llamadaAjax('DELETE', url, null, function (err) {
                if (err) return;
                generarContratoAPI();
            });
        }, function cancelar() { });
    } else {
        generarContratoAPI();
    }
}

var generarContratoAPI = function () {
    var data = {
        fechaAceptacionOferta: spanishDbDate(vm.fechaAceptacionOferta()),
        fechaInicio: spanishDbDate(vm.fechaInicio()),
        fechaFinal: spanishDbDate(vm.fechaFinal()),
        fechaOriginal: spanishDbDate(vm.fechaOriginal()),
        fechaPrimeraFactura: spanishDbDate(vm.fechaPrimeraFactura()),
        preaviso: vm.preaviso(),
        facturaParcial: vm.facturaParcial()
    }
    var url = myconfig.apiUrl + "/api/ofertas/generar-contrato/" + vm.ofertaId();
    llamadaAjax('POST', url, data, function (err, data) {
        if (err) return;
        var datos = {
            contratoId: data.contratoId,
            ofertaId: vm.ofertaId(),
        }
        generarLineasConceptos(datos);
        var url = "ContratoDetalle.html?ContratoId=" + data.contratoId + "&CMD=GEN";
        window.open(url, '_new');
    })
}

var generarLineasConceptos = function(datos) {
    var url = myconfig.apiUrl + "/api/ofertas/generar-lineas/concepto";
    llamadaAjax('POST', url, datos, function (err, data) {
        if (err) return;
        
    })
}

var contratoOk = function () {
    $('#generar-contrato-form').validate({
        rules: {
            txtFechaAceptacionContrato: {
                required: true
            },
            txtFechaInicio: {
                required: true
            },
            txtFechaFinal: {
                required: true,
                fechaFinalSuperiorAInicial: true
            }
        },
        // Messages for form validation
        messages: {
            txtFechaAceptacionContrato: {
                required: "Debe escoger una fecha de aceptacion"
            },
            txtFechaInicio: {
                required: "Debe escoger una fecha inicial"
            },
            txtFechaFinal: {
                required: "Debe escoger una fecha final"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#generar-contrato-form").validate().settings;
    return $('#generar-contrato-form').valid();
}

var validacionesAdicionalesDelContrato = function () {
    jQuery.validator.addMethod("fechaFinalSuperiorAInicial", function (value, element) {
        var fechaInicial = new Date(spanishDbDate(vm.fechaInicio()));
        var fechaFinal = new Date(spanishDbDate(vm.fechaFinal()));
        return (fechaFinal >= fechaInicial);
    }, "La fecha final debe ser superior a la inicial");
}
// funciones de apoyo
var obtenerPorcentajeBeneficioPorDefecto = function (done) {
    llamadaAjax('GET', myconfig.apiUrl + "/api/parametros/0", null, function (err, data) {
        if (err) return done(err);
        vm.porcentajeBeneficio(data.margenMantenimiento);
        recalcularCostesImportesDesdeCoste();
        if (done) done(null);
    })
}

var comprobarSiHayMantenedor = function () {
    if ($('#txtMantenedor').val() == '') {
        vm.mantenedorId(null);
        vm.importeMantenedor(0);
    }
}

var obtenerPorcentajeDelAgente = function (comercialId, clienteId, empresaId, tipoOfertaId, done) {
    var url = myconfig.apiUrl + "/api/comerciales/comision";
    url += "/" + comercialId;
    url += "/" + empresaId;
    url += "/" + tipoOfertaId;
    llamadaAjax('GET', url, null, function (err, data) {
        if (err) return done(err);
        done(null, data);
    })
}

//FUNCIONES DE LOS CONCEPTOS/PORCENTAJES

function initTablaConceptosLineas() {
    tablaCarro = $('#dt_lineasConcepto').DataTable({
        autoWidth: true,
        order: [[ 0, "asc" ]],
        "columnDefs": [
            {
                "targets": [ 0 ],
                "visible": false,
                "searchable": false
            }
        ],
       
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
           
        },
        rowCallback: function (nRow) {
            
        },
        drawCallback: function (oSettings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;
            
        },
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataConceptosLineas,
        columns: [  {
            data: "fecha",
            
        },{
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "concepto",
            
        }, {
            data: "porcentaje",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        },{
            data: "importe",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "formaPagoNombre",
            
        },  {
            data: "ofertaPorcenId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteConceptosLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalConcepto' onclick='editFprmaPagoLineaConcepto(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function  loadConceptosLineas(id) {
    llamadaAjax("GET", "/api/ofertas/conceptos/porcentaje/" + id, null, function (err, data) {
        if (err) return;
        
        loadTablaConceptosLineas(data);
        
    });
}

function loadTablaConceptosLineas(data) {
    if (data) {
        dataConceptos = data;
        numConceptos = data.length;
    } else {
        dataConceptos = null;
        numConceptos = 0;
    }
    var dt = $('#dt_lineasConcepto').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
        $('#btnPorcentaje').hide();
        $('#btnDeleteTipo').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
        $('#btnPorcentaje').show();
        $('#btnDeleteTipo').show();
    }
    dt.fnDraw();
}


function nuevaLineaConcepto() {
    limpiaDataLineaConcepto();
    lineaEnEdicion = false;
}

function limpiaDataLineaConcepto() {
    vm.conceptoCobro('');
    vm.porcentajeCobro(0);
    vm.fechaConcepto(vm.fechaOferta());
    vm.importeCalculado(0);
    loadFormasPagoLinea(vm.formaPagoId())
}


function aceptarLineaConcepto() {
    if (!datosOKLineasConceptos()) {
        return;
    }
    var data = {
        cobroPorcen: {
            ofertaId: vm.ofertaId(),
            concepto: vm.conceptoCobro(),
            porcentaje: vm.porcentajeCobro(),
            fecha: spanishDbDate(vm.fechaConcepto()),
            importe: vm.importeCalculado(),
            formaPagoId: vm.sformaPagoIdLinea(),
        }
    }
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/ofertas/concepto";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/ofertas/concepto/" +  vm.ofertaPorcenId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalConcepto').modal('hide');
                    llamadaAjax("GET", myconfig.apiUrl + "/api/ofertas/conceptos/porcentaje/" + vm.ofertaId(), null, function (err, data) {
                        loadTablaConceptosLineas(data);
                    });
                });
}

function editFprmaPagoLineaConcepto(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/ofertas/concepto/porcenteje/registro/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLineaConcepto(data[0]);
    });
}
function loadDataLineaConcepto(data) {
    vm.ofertaPorcenId(data.ofertaPorcenId);
    vm.conceptoCobro(data.concepto);
    vm.porcentajeCobro(data.porcentaje);
    vm.fechaConcepto(spanishDate(data.fecha));
    vm.importeCalculado(data.importe);
    loadFormasPagoLinea(data.formaPagoId);
    
}

function deleteConceptosLinea(ofertaPorcenId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
       
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/ofertas/concepto/" + ofertaPorcenId, null, function (err, data) {
            if (err) return;
                $('#modalConcepto').modal('hide');
                llamadaAjax("GET", myconfig.apiUrl + "/api/ofertas/conceptos/porcentaje/" + vm.ofertaId(), null, function (err, data) {
                    loadTablaConceptosLineas(data);
                });
        });
    }, function () {
        // cancelar no hace nada
    });
}

function datosOKLineasConceptos() {
    $('#concepto-form').validate({
        rules: {
            txtConceptoCobro: {
                required: true
            },
            txtPorcentajeCobro: {
                required: true,
                number:true
            },
            txtFechaConcepto: {
                required: true,
                greaterThan: '#txtFechaOferta'
            }
        },
        // Messages for form validation
        messages: {
            txtConceptoCobro: {
                required: "Debe dar un concepto"
            },
            txtPorcentajeCobro: {
                required: "Debe proporcionar un porcentaje",
                number: "Se tiene que introducir un numero válido"
            },
            txtFechaConcepto: {
                required: "Debe proporcionar una fecha de factura",
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#concepto-form').valid();
}

// FUNCIONES RELACIONADAS CON LOS PROVEEDORES

function initTablaProveedores() {
    tablaProveedores = $('#dt_proveedoresAsociados').DataTable({
        autoWidth: true,
        paging: true,
        responsive: true,
        "bDestroy": true,
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataProveedores,
        columns: [{
            data: "proveedornombre",
            render: function (data, type, row) {
                if(!data) return row.totalProveedor;
                return data;
            }
        }, {
            data: "totalProveedor",
            render: function (data, type, row) {
                if(!row.proveedornombre) return "";
                return data;
            }
        },{
            data: "totalProveedorIva",
            render: function (data, type, row) {
                if(!row.proveedornombre) return "";
                return data;
            }
        },{
            data: "proveedorId",
            render: function (data, type, row) {
                var html = "";
                var bt = "<button class='btn btn-circle btn-success' onclick='imprimirProveedor(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                if(!row.proveedorId) return html;
                return html = "<div class='pull-right'>" + bt + "</div>";
                
            }
        }]
    });
}

function cargaTablaProveedores(){
    llamadaAjax("GET",  "/api/ofertas/proveedores/lineas/totales/"  + vm.ofertaId(), null, function (err, data) {
        if (err) return;
        if(data) loadTablaProveedores(data);
    });
}

function loadTablaProveedores(data) {
    var dt = $('#dt_proveedoresAsociados').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}


// FUNCIONES RELACIONADAS CON LA DOCUMENTACIÓN

function initTablaDocumentacion() {
    tablaDocumentacion = $('#dt_documentacion').DataTable({
        autoWidth: true,
        paging: true,
        responsive: false,
        "bDestroy": true,
        "columnDefs": [
            { "width": "5%", "targets": 0 },
            { "width": "8%", "targets": 2 },
            { "width": "5%", "targets": 3 },
            { "width": "13%", "targets": 4 },

          ],
        language: {
            processing: "Procesando...",
            info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataDocumentacion,
        columns: [
            {
                
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },{
                data: "carpetaNombre",
            },{
                data: "tipo",
            },{
                data: "documentos",
                render: function (data, type, row) {
                    if(!row.documentos) return 0;
                    return row.documentos.length; ;
                }
            },{
            data: "carpetaId",
            render: function (data, type, row) {
                var html = "";
                var bt = "";
                var bt2 = "";
                var bt3 = "";
                if(usuario.puedeEditar) {
                    var bt = "<button class='btn btn-circle btn-success'  data-toggle='modal' data-target='#modalUploadDoc' onClick='preparaDatosArchivo(" + JSON.stringify(row) + ")' title='Subir documernto'> <i class='fa fa-arrow-up fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-info' data-toggle='modal' data-target='#modalpostSubcarpeta' onclick='nuevaSubcarpeta(" + JSON.stringify(row) + ");' title='Crear subcarpeta'> <i class='fa fa-folder fa-fw'></i> </button>";
                    var bt3 = "<button class='btn btn-circle btn-danger' onclick='deleteCarpeta(" + data +");' title='Eliminar carpeta'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    //if(!usuario.borrarCarpeta) bt3 = "";
                } else {
                    var bt = "<button class='btn btn-circle btn-success'  data-toggle='modal' data-target='#modalUploadDoc' onClick='preparaDatosArchivo(" + JSON.stringify(row) + ")' title='Subir documernto'> <i class='fa fa-arrow-up fa-fw'></i> </button>";
                }
               
                return html = "<div class='pull-right'>" + bt + " " + bt2 + " " + bt3 +"</div>";
                
            }
            }]
    });
}

function cargaTablaDocumentacion(){
    llamadaAjax("GET",  "/api/documentacion/"  + vm.ofertaId() + "/" + vm.tipoOfertaId() + "/" + vm.contratoId(), null, function (err, data) {
        if (err) return;
        if(data) loadTablaDocumentacion(data);
    });
}

function loadTablaDocumentacion(data) {
    var dt = $('#dt_documentacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function format(d) {
    if(!d.documentos) d.documentos = [];
    var doc = d.documentos;
    var html = "";
        html = '<h6 style="padding-left: 5px"> DOCUMENTOS</h6>'
        doc.forEach(e => {
            var l = e.key.split('/');
            var index = l.length - 1;
            html += '<div class="row" style="margin-bottom: 10px">' +
                        '<section class="col col-md-5">' + 
                            '<a href="' + e.location  + '" target="_blank">' + l[index] +'</a>' +
                        '</section>' +
                        '<section class="col col-md-3 text-left">' +
                            '<button class="btn btn-circle btn-danger"  onclick="deleteDocumento(' + e.documentoId + ')" title="Eliminar registro"> <i class="fa fa-trash-o fa-fw"></i> </button>' +
                        '</section>' +
                        '<section class="col col-md-4">' + '</section>' +
                    '</div>' 
        });
    return html;
}

function preparaDatosArchivo(r) {
    uploads = [] //limpiamos las cargas que se hayan podido quedar
    docName = r.carpetaNombre + "_" + vm.referencia() + "_" + vm.nombreCliente();
    carpetaId = r.carpetaId;
    docName = docName.replace(/[\/]/g, "-");
    carpeta = r.carpetaNombre;
    carpetaTipo = r.tipo;
    key = r.carpetaNombre   + "/" +  docName;
    vm.documNombre(docName);
}

function limpiaDatosArchivo(r) {
    docName = null
    carpetaId = null
    docName = null
    carpeta = null
    $('.progress-bar').text(parseInt((0)+'%'));
    $('.progress-bar').width(parseInt((0)+'%'));
}

function nuevaCarpeta() {
    vm.carpetaNombre(null);
}


function aceptarNuevaCarpeta() {
        //CREAMOS EL REGISTRO EN LA TABLA carpetas
        if( vm.carpetaNombre() == '' || vm.carpetaNombre() == null) return mensError('Se tiene que asignar un nombre');
        var a = vm.carpetaNombre();
        a = a.trim();
        a = a.replace(/[\/]/g, "-");
        var data = 
        {
            carpeta: {
                carpetaId: 0,
                nombre: a,
                tipo: "oferta",
                departamentoId: vm.tipoOfertaId()
            }
        }

        llamadaAjax('POST', myconfig.apiUrl + "/api/documentacion/carpeta", data, function (err, data) {
            if (err) return
            $('#modalNuevaCarpeta').modal('hide');
            mensNormal('Carpeta creada con exito');
            cargaTablaDocumentacion();
        });
}

function aceptarNuevaSubCarpeta() {
    //CREAMOS EL REGISTRO EN LA TABLA carpetas
    if( vm.subCarpetaNombre() == '' || vm.subCarpetaNombre() == null) return mensError('Se tiene que asignar un nombre');
    var a =  vm.subCarpetaNombre();
    a = a.trim();
    a = a.replace(/\//g, "-");
    var n = subCarpeta + "/" + a;
    var data = 
    {
        carpeta: {
            carpetaId: 0,
            nombre: n,
            tipo: carpetaTipo,
            departamentoId: vm.tipoOfertaId()
        }
    }

    llamadaAjax('POST', myconfig.apiUrl + "/api/documentacion/carpeta", data, function (err, data) {
        if (err) return
        $('#modalpostSubcarpeta').modal('hide');
        mensNormal('Carpeta creada con exito');
        cargaTablaDocumentacion();
    });
}


function nuevaSubcarpeta(r) {
    vm.subCarpetaNombre(null);
    subCarpeta = r.carpetaNombre;
    carpetaTipo = r.tipo

}

function deleteDocumento(id) {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
        AWS.config.region = parametros.bucket_region_docum; // Región
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: parametros.identity_pool_docum,
        });
        llamadaAjax('GET', "/api/documentacion/" + id, null, function (err, data) {
            if (err) return;
            if(data) {
                var params = {
                    Bucket: parametros.bucket_docum,
                    Key: data.key
            }
    
            //borramos el documento en s3
            var s3 = new AWS.S3({ params });
    
            s3.deleteObject({}, (err, result) => {
                if (err) mensError('Error al borrar el docuemnto');
                //Actualizamos la tabla documentacion
                llamadaAjax('DELETE', myconfig.apiUrl + "/api/documentacion/elimina-documento/" + id, null, function (err, data) {
                    if (err) return;
                    cargaTablaDocumentacion();
                });
            }); 
            
            }
        });
    })
}

function deleteCarpeta(id) {
    var mens = "¿Realmente desea borrar esta carpeta, se borrarán todos los archivos y carpetas que contiene y no se podrá recuperar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            
            llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
                if (err) return;
                var parametros = data;
                llamadaAjax('DELETE', "/api/documentacion/elimina-carpeta/" + id, null, function (err, data2) {
                    if (err) return mensError('Fallo al borrar la documentación en la base de datos');
                    if(data2) {
                        
                    AWS.config.region = parametros.bucket_region_docum; // Región
                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: parametros.identity_pool_docum,
                    });
                    var prefix = data2.nombre;
                    var params = {
                        Bucket: parametros.bucket_docum,
                        Prefix: prefix,
                        Delimeter: "/"
                    }
        
                    var s3 = new AWS.S3({ params });
                    s3.listObjectsV2({}, (err, result) => {
                        if (err) mensError('Error de lectura en la nube');
                        console.log(result);
                        if(result.Contents.length > 0) {



                    var objectKeys = []
                    result.Contents.forEach(e => {
                        objectKeys.push(e.Key);
                    });

                    // Crea un objeto Delete para especificar los objetos que se van a eliminar
                    const objects = objectKeys.map(key => ({ Key: key }));
                    const deleteParams = {
                    Bucket: parametros.bucket_docum,
                    Delete: { Objects: objects }
                    };

                    // Elimina los objetos utilizando el método deleteObjects del objeto S3
                    s3.deleteObjects(deleteParams, function(err, data) {
                        if (err) {
                            mensError('Fallo al borrar la carpeta en la nube');
                        } else {
                            mensNormal('Carpeta eliminada con éxito');
                            cargaTablaDocumentacion();
                        }
}                   );

                        } else {
                            mensAlerta('No se han encontrado archivos en la nube para borrar');
                            cargaTablaDocumentacion();
                        }
                       
                    }); 
            
                  
                    
                    } else {
                        mensError('No se han encontrado carpetas para borrar');
                        cargaTablaDocumentacion();
                    }
                }); 
            })
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}



function uploadDocum(arr) {
    var index = 0;
      
        arr.forEach(e => {
            var repetido = e.repetido;
            var documentoId = e.documentoId;
            var filekey = e.fileKey;
            delete e.fileKey
            delete e.documentoId;
            delete e.repetido;
            delete e.nom;

            AWS.config.region = parametros.bucket_region_docum; // Región
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: parametros.identity_pool_docum,
            });
            var bucket = parametros.bucket_docum;
            var params = {
                Bucket: bucket,
                Key: filekey,
                IdentityPoolId: parametros.identity_pool_docum,
                Body: e,
                ACL: "public-read"
            }
            // Use S3 ManagedUpload class as it supports multipart uploads
            var upload = new AWS.S3.ManagedUpload({
                params: params
            });
            var promise = upload.on('httpUploadProgress', function(evt) {
                $('.progress-bar').text(parseInt((evt.loaded * 100) / evt.total)+'%');
                $('.progress-bar').width(parseInt((evt.loaded * 100) / evt.total)+'%');
              })
              .promise();
            promise.
            then (
                data => {
                    if(data) {
                        //CREAMOS EL REGISTRO EN LA TABLA ofertaDocumantacion
                        var data = 
                        {
                            documentacion: {
                                documentoId: 0,
                                ofertaId: null,
                                contratoId: null,
                                parteId: null,
                                carpetaId: carpetaId,
                                location: data.Location,
                                key: filekey
                            }
                        }
                        if(carpetaTipo == "oferta") {
                            data.documentacion.ofertaId =  vm.ofertaId();
                        }else if(carpetaTipo == "contrato") {
                            data.documentacion.contratoId = vm.contratoId();
                        }
    
                        if(!repetido) {
                            method = 'POST';
                            url = "/api/documentacion";
                        } else {
                            data.documentacion.documentoId = e.documentoId;
                            method = 'PUT';
                            url = "/api/documentacion/" + documentoId;
                        }
        
                        llamadaAjax(method, myconfig.apiUrl + url, data, function (err, data) {
                            if (err) return mensError(err);
                            index++
                            if(index == arr.length) {
                                $('#modalUploadDoc').modal('hide');
                                mensNormal('Archivo subido con exito');
                                limpiaDatosArchivo();
                                cargaTablaDocumentacion();
                            }
                        });
                    }
                },
                err =>{
                    if (err) return mensError(err);
                }
            );        
            });       
}


function aceptarSubirDocumentos() {
    if(vm.documNombre() == '') return mensError("Se tiene que asignar un nombre al documento.");
    //buscamos los parámetros
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        parametros = data;
        var files = $("#upload-input").get(0).files;
        var arr = [];
        if (!files.length) {
            mensError('Debe escoger seleccionar un archivo para subirlo al repositorio');
            return;
        }
        for(var i = 0; i< files.length; i++) {
            var e = files[i];
            var encontrado = false;
            var id = 0;
            var file = e;
            var ext = file.name.split('.').pop().toLowerCase();
            var blob = file.slice(0, file.size, file.type); 
            var newFile = new File([blob], {type: file.type});
            var nom = "";
            nom = vm.documNombre()
            if(files.length > 1) {
                var s = parseInt(i)
                s++
                nom = nom + "-" + s + "." + ext;
            } else {
                nom = nom + "." + ext;
            }
            nom = nom.replace(/\//g, "-");
            newFile.nom = nom;
            var fileKey =  carpeta + "/" + nom
            newFile.fileKey = fileKey;
            newFile.repetido = false;
            arr.push(newFile);
        }
        //buscamos si el documento ya existe en la carpeta de destino
        llamadaAjax('GET', "/api/documentacion/documentos/de/la/carpeta/" + carpetaId, null, function (err, docums) {
            if (err) return;
            if(docums && docums.length > 0) {
                for(var i = 0; i < docums.length; i++) {
                    var d = docums[i];
                    var n = d.key.split('/');
                    var index = n.length - 1
                    
                    for(var j = 0; j < arr.length; j++) {
                        if(n[index] == arr[j].nom) {
                            encontrado = true;
                            arr[j].repetido = true;
                            arr[j].documentoId = d.documentoId;
                            arr[j].repetido = true;
                            break;
                        } 
                    }
                }

                if(encontrado) {
                    var mens = "Ya existen documentos con este nombre en esta carpeta, se reemplazará con el que está apunto de subir. ¿Desea continuar?";
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Aceptar][Cancelar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Aceptar") {
                            method = 'PUT';
                            uploadDocum(arr);
                        }
                        if (ButtonPressed === "Cancelar") {
                            $('#upload-input').val([]);
                        }
                    });

                } else {
                    uploadDocum(arr);
                }
            } else {
                uploadDocum(arr);
            }
        }); 

    });
    
}