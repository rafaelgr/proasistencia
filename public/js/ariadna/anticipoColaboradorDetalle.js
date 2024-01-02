/*-------------------------------------------------------------------------- 
preanticipoDetalle.js
Funciones js par la página anticipoProveedorDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var antproveId = 0;
var ContratoId = 0;
var EmpresaId = 0;
var ProveedorId = 0;
var refWoId = 0;
var ruta;
var desdeContrato;
var acumulado = 0;
var tot;
var numServiciadas;
var importeModificar = 0;
var proveedores;
var datosPro;
var servicioId;
var numLineas = 0;
var numServ = 0;

var dataServiciadas;
var dataLineas;
var usuario;

var lineaEnEdicion = false;

var dataAntproveLineas;
var dataBases;

var antNumAnt = ""//recoge el valor que tiene el nif al cargar la página

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

function initForm() {
    var user = comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    
    initTablaServiciadas();

    vm = new admData();
    ko.applyBindings(vm);

    // Eventos de la calculadora de costes
    $('#txtCoste').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtPorcentajeBeneficio').on('blur', cambioCampoConRecalculoDesdeCoste);
    $('#txtImporteBeneficio').on('blur', cambioCampoConRecalculoDesdeBeneficio);
    $('#txtPorcentajeAgente').on('blur', cambioCampoConRecalculoDesdeCoste);
    

    
    eventoCerrar();

    
    
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptarAnticipo);
    $("#btnSalir").click(salir());
    
    //$("#btnImprimir").click(imprimir);
    $("#frmAnticipo").submit(function () {
        return false;
    });

    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    $("#frmServiciadas").submit(function () {
        return false;
    });

    $("#txtPrecio").focus(function () {
        if(vm.contabilizada() && !usuario.puedeEditar) return;
        var val = $('#txtPrecio').val();
        if(!val || val == '') return; 
        $('#txtPrecio').val(null);
    });

    

    //evento de foco en el modal
    $('#modalLinea').on('shown.bs.modal', function () {
        $('#txtDescripcion').focus();
    })

    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioEmpresa(e.added.id);
    });

    $("#txtNumero").on('change', function (e) {
        var numeroAnt = $("#txtNumero").val();
     
        compruebaRepetido(numeroAnt, vm.sproveedorId());
    });

    // Ahora Proveedor en autocomplete
    initAutoProveedor();

    // select2 things
     // select2 things
     $("#cmbDepartamentosTrabajo").select2(select2Spanish());
     loadDepartamentos();

    $("#cmbEmpresaServiciadas").select2(select2Spanish());
    loadEmpresaServiciadas();
    $("#cmbEmpresaServiciadas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioEmpresaServiciada(e.added.id);
    });




    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    $("#cmbContratos").select2(select2Spanish());
    $("#cmbContratos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioContrato(e.added.id);
    });
    // select2 things
    $("#cmbGrupoArticulos").select2(select2Spanish());
    loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioGrupoArticulo(e.added.id);
    });

    
    $('#txtTotalConIva').focus( function () {
        if(vm.contabilizada() && !usuario.puedeEditar) return;
        $('#txtTotalConIva').val('');
    })

    $("#cmbUnidades").select2(select2Spanish());
    loadUnidades();

    // select2 things
    $("#cmbArticulos").select2(select2Spanish());
    // loadArticulos();
    $("#cmbArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioArticulo(e.added.id);
    });

    // select2 things
    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposIva").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioTiposIva(e.added.id);
    });

    $("#cmbTiposRetencion").select2(select2Spanish());
    loadTiposRetencion();
    $("#cmbTiposRetencion").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioTiposRetencion(e.added.id);
    });


    $("#txtCantidad").blur(cambioPrecioCantidad);
    $("#txtPrecio").blur(cambioPrecioCantidad);
    $('#txtPorcentajeRetencionLinea').blur(cambioPrecioCantidad);

    
    initTablaAnticiposLineas();
    initTablaBases();
    initTablaRetenciones();

    antproveId = gup('antproveId');
    cmd = gup("cmd");
    ContratoId = gup("ContratoId");
    EmpresaId = gup("EmpresaId");
    ProveedorId = gup("ProveedorId");
    desdeContrato = gup("desdeContrato");
    proveedores = gup('Proveedores');
    servicioId = gup('ServicioId');
    proveedores = proveedores.split(',');
    if(proveedores.length == 1 && proveedores[0] == "") proveedores = null;
    datosPro = {proveedores: proveedores}

    

    //evento asociado a la carga de un archivo
    $('#upload-input').on('change', function () {
        var files = $(this).get(0).files;
        
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();
        // loop through all the selected files and add them to the formData object
        
        var file = files[0];
        var ext = file.name.split('.').pop().toLowerCase();
                
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, usuario.usuarioId + "@" + file.name);
            
            $.ajax({
                url: '/api/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    filename = data;
                    vm.file(filename);
                    checkVisibility(filename);
                },
                xhr: function () {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function (evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            // update the Bootstrap progress bar with the new percentage
                            $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');
                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                $('.progress-bar').html('Fichero subido');
                            }
                        }
                    }, false);
                    return xhr;
                }
            });
    });

    //Evento asociado al cambio de chkcompleto
    $('#chkCompleto').change(function () {
        if($('#chkCompleto').is(':checked')) {
            $('#lineasanticipo').show();
            $('#basesycuotas').show();
            $('#retenciones').show();
            $('#txtTotalConIva').prop('disabled', true);
        } else  {
            $('#lineasanticipo').hide();
            $('#basesycuotas').hide();
            $('#retenciones').hide();
            $('#txtTotalConIva').prop('disabled', false);
        }
    });


    if (antproveId != 0) {
        // caso edicion
        llamadaAjax("GET",  "/api/anticiposProveedores/" + antproveId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadServiciadasAntprove(antproveId);
            $('#btnAltaServiciada').click(reiniciaValores);
            if($('#chkCompleto').prop('checked')) {
                loadLineasAnticipo(data.antproveId);
                loadBasesAntprove(data.antproveId);
                loadRetencionesAntprove(data.antproveId);
            }
            $('#chkCompleto').click(
                function(e){
                    if(numLineas > 0 && !completo) {
                        $('#chkCompleto').prop('checked', true);
                        mensError('Hay que borrar las lineas del anticipo para poder realizar esta acción.');
                        return;
                    }
                    if(numServ > 0)  {
                        var opcion = $('#chkCompleto').prop('checked');
                        if(opcion) {
                            $('#chkCompleto').prop('checked', false);
                        } else {
                            $('#chkCompleto').prop('checked', true)
                        }
                       
                        mensError('Hay que borrar las serviciadas del anticipo para poder realizar esta acción.');
                        return;
                    }
                    var completo = $('#chkCompleto').prop('checked');
                    var data = {
                        antprove: {
                            "antproveId": antproveId,
                            "completo": completo
                        }
                    }
                    verb = "PUT";
                    url = myconfig.apiUrl + "/api/anticiposProveedores/" + antproveId;
                    var datosArray = [];
                    datosArray.push(data)
                    llamadaAjax(verb, url, datosArray, function (err, data) {
                        if(err) return;
                        var totIva = numeroDbfComprueba(vm.totalConIva());
                        vm.totalConIva(totIva);
                        /* if(!isNaN(vm.totalConIva()) && completo) {
                            var totIva = numeroDbf(vm.totalConIva());
                            vm.totalConIva(totIva);
                        } else {
                            var totIva = parseFloat(vm.totalConIva());
                            vm.totalConIva(totIva)
                        } */
                        mensNormal("Se ha actulizado la propiedad completo");
                    });

                }
            );
    
        })
    } else {
        // caso alta
        vm.generada(0); // por defecto manual
        vm.porcentajeRetencion(0);
        vm.importeServiciada(0);
        vm.importeRetencion(0);
        vm.total('0');
        vm.totalConIva(0);
        vm.sempresaId(EmpresaId);
        vm.scontratoId(ContratoId);
        vm.fecha(spanishDate(new Date()));//fecha  ofertada
        $("#lineasanticipo").hide();
        $("#basesycuotas").hide();
        $('#btnAltaServiciada').hide();
        $('#retenciones').hide();
        document.title = "NUEVO ANTICIPO COLABORADOR";
        if (EmpresaId != 0) {
            loadEmpresas(EmpresaId);
            cambioEmpresa(EmpresaId);
        }
        if (ProveedorId != 0) {
            cargaProveedor(ProveedorId);
            cambioProveedor(ProveedorId);
        }
        if(servicioId && servicioId != '') vm.servicioId(servicioId);
    }

    //Evento asociado al checkbox
    $('#chkCerrados').change(contratosCerrados);

}

function contratosCerrados(id){
    
    if(vm.sempresaServiciadaId()){
        if ($('#chkCerrados').prop('checked')) {
            ruta =  myconfig.apiUrl + "/api/contratos/concat/referencia/direccion/tipo/" + vm.sempresaServiciadaId();//todos los contratos
        }else{
            ruta = myconfig.apiUrl + "/api/contratos/empresa/cliente/" + vm.sempresaServiciadaId();//contratos activos
        }
        if(id){
            loadContratos(id);
        } else{
            loadContratos(vm.scontratoId());
        }
        
    }
    
}

function admData() {
    var self = this;
    self.antproveId = ko.observable();
    self.numero = ko.observable();
    self.fecha = ko.observable();
    self.fechaRecepcion = ko.observable();
    self.empresaId = ko.observable();
    self.proveedorId = ko.observable();
    self.contratoId = ko.observable();
    self.noContabilizar = ko.observable();
    self.conceptoAnticipo = ko.observable();
    self.completo = ko.observable();
    self.emisorIban = ko.observable();
    self.servicioId = ko.observable();
    self.esColaborador = ko.observable();
    self.noFactura = ko.observable();
    //
    self.emisorNif = ko.observable();
    self.emisorNombre = ko.observable();
    self.emisorDireccion = ko.observable();
    self.emisorCodPostal = ko.observable();
    self.emisorPoblacion = ko.observable();
    self.emisorProvincia = ko.observable();
    //
    self.receptorNif = ko.observable();
    self.receptorNombre = ko.observable();
    self.receptorDireccion = ko.observable();
    self.receptorCodPostal = ko.observable();
    self.receptorPoblacion = ko.observable();
    self.receptorProvincia = ko.observable();
    //
    self.total = ko.observable();
    self.antTotal = ko.observable();
    self.totalCuota = ko.observable();
    self.totalConIva = ko.observable();
    self.contabilizada = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
     //
     self.departamentoId = ko.observable();
     self.sdepartamentoId = ko.observable();
     //
     self.posiblesDepartamentos = ko.observableArray([]);
     self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.observaciones = ko.observable();

    // -- Valores para las líneas
    self.antproveLineaId = ko.observable();
    self.linea = ko.observable();
    self.articuloId = ko.observable();
    self.tipoIvaId = ko.observable();
    self.codigo = ko.observable();
    self.antCodigo = ko.observable();
    self.antCuentaRetencion = ko.observable();
    self.porcentaje = ko.observable();
    self.descripcion = ko.observable();
    self.cantidad = ko.observable();
    self.importe = ko.observable();
    self.costeLinea = ko.observable();
    self.totalLinea = ko.observable();
    self.capituloLinea = ko.observable();
    self.importeRetencionLinea = ko.observable();
    self.porcentajeRetencionLinea = ko.observable();
    self.cuentaRetencion = ko.observable();

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
    self.scodigo = ko.observable();
    //
    self.posiblesTiposRetencion = ko.observableArray([]);
    self.elegidosCodigos = ko.observableArray([]);
    



    // Para calculadora de costes
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeAlCliente = ko.observable();
    // Nuevo Total de coste para la anticipo
    self.totalCoste = ko.observable();
    //
    self.generada = ko.observable();
    self.periodo = ko.observable();
    //
    self.tipoClienteId = ko.observable();
    //
    self.porcentajeRetencion = ko.observable();
    self.importeRetencion = ko.observable();

    //valores para carga de archivos
    
    self.file = ko.observable();
   

    //valores para la solapa serviciadas
    self.antproveServiciadoId = ko.observable();
    self.importeServiciada = ko.observable();
    //
    self.sempresaServiciadaId = ko.observable();
    //
    self.posiblesEmpresaServiciadas = ko.observableArray([]);
    self.elegidasEmpresaServiciadas = ko.observableArray([]);
    self.scontratoId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
}

function loadData(data) {
    vm.antproveId(data.antproveId);
    vm.esColaborador(data.esColaborador);
    vm.numero(data.numeroAnticipoProveedor);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.departamentoId(data.departamentoId);
    vm.sdepartamentoId(data.departamentoId);
    vm.proveedorId(data.proveedorId);
    vm.contratoId(data.contratoId);
    vm.generada(data.generada);
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.importeAlCliente(data.totalAlCliente);
    if($('#chkCompleto').prop('checked')) {
        recalcularCostesImportesDesdeCoste();
    } else {
        vm.totalConIva(data.totalConIva);
    }
    //
    vm.receptorNif(data.receptorNif);
    vm.receptorNombre(data.receptorNombre);
    vm.receptorCodPostal(data.receptorCodPostal);
    vm.receptorPoblacion(data.receptorPoblacion);
    vm.receptorProvincia(data.receptorProvincia);
    vm.receptorDireccion(data.receptorDireccion);
    //
    vm.emisorNif(data.emisorNif);
    vm.emisorNombre(data.emisorNombre);
    vm.emisorCodPostal(data.emisorCodPostal);
    vm.emisorPoblacion(data.emisorPoblacion);
    vm.emisorProvincia(data.emisorProvincia);
    vm.emisorDireccion(data.emisorDireccion);
    vm.emisorIban(data.IBAN);
    vm.conceptoAnticipo(data.conceptoAnticipo);
    vm.antproveServiciadoId(0);
    vm.importeServiciada(0);
    vm.servicioId(data.servicioId);
    vm.contabilizada(data.contabilizada);
    

    //
    loadEmpresas(data.empresaId);
    loadDepartamentos(data.departamentoId);
   
    
    cargaProveedor(data.proveedorId);
    loadFormasPago(data.formaPagoId);
    vm.observaciones(data.observaciones);
    //
    vm.porcentajeRetencion(data.porcentajeRetencion);
    vm.importeRetencion(data.importeRetencion);
    if (vm.generada()) {
        // ocultarCamposAnticiposGeneradas();
        mostrarMensajeAnticipoGenerada();
    }
    vm.periodo(data.periodo);
    if (cmd == "nueva") {
        mostrarMensajeAnticipoNueva();
    }
    if(data.noContabilizar == 1){
        $('#chkNoContabilizar').prop("checked", true);
    } else {
        $('#chkNoContabilizar').prop("checked", false);
    }
    if(data.noFactura == 1){
        $('#chkNoFactura').prop("checked", true);
    } else {
        $('#chkNoFactura').prop("checked", false);
    }
    //
    if(data.completo == 1){
        $('#chkCompleto').prop("checked", true);
        $('#lineasanticipo').show();
        $('#basesycuotas').show();
        $('#retenciones').show();
        $('#txtTotalConIva').prop('disabled', true);
    } else {
        $('#chkCompleto').prop("checked", false);
        $('#lineasanticipo').hide();
        $('#basesycuotas').hide();
        $('#retenciones').hide();
        $('#txtTotalConIva').prop('disabled', false);
    }

    if (data.contabilizada == 1 && !usuario.puedeEditar) bloqueaEdicionCampos();
    //
    document.title = "ANTICIPO COLABORADOR: " + vm.numero();

    antNumAnt = data.antproveId;
}


function datosOK() {
    $('#frmAnticipo').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbDepartamentosTrabajo: {
                required: true
            },
            cmbProveedores: {
                required: true
            },
            txtFecha: {
                required: true
            },
           
            cmbFormasPago: {
                required: true
            },
            cmbContratos: {
                required: true
            },
            txtNumero: {
                required: true,
                rangelength: [1, 20]
            },
            txtTotalConIva: {
                required: true
            },
            txtCoceptoAnticipo: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir un receptor"
            },
            cmbDepartamentosTrabajo: {
                required: 'Debe elegir un departamento'
            },
            cmbProveedores: {
                required: 'Debe elegir un emisor'
            },
            txtFecha: {
                required: 'Debe elegir una fecha'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbContratos: {
                required: "Debe elegir un contrato asociado"
            },
            txtNumero: {
                required: "Debe introducir un número de anticipo",
                rangelength: "El rango de digitos debe estar entre 1 y 20"
            },
            txtTotalConIva: {
                required: "Debe introducir una cantidad"
            },
            txtCoceptoAnticipo: {
                required: "Debe introducir un concepto"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmAnticipo").validate().settings;
    return $('#frmAnticipo').valid();
}

var aceptarAnticipo = function () {
    if (!datosOK()) return;

    eventSalir = false;
    if (!vm.total() && vm.completo()) {
        vm.total('0');
        vm.totalCuota('0');
        vm.totalConIva('0');
    }

    var data = generarAnticipoDb();
    var ext;
    // caso alta
    
    var verb = "POST";
    var url =  "/api/anticiposProveedores";
    var returnUrl = "AnticipoColaboradorDetalle.html?desdeContrato="+ desdeContrato+"&ContratoId="+ ContratoId +"&cmd=nueva&antproveId=";
   
    
    
    // caso modificación
    if (antproveId != 0) {
        verb = "PUT";
        url =  "/api/anticiposProveedores/" + antproveId;
        returnUrl = "AnticipoColaboradorGeneral.html?antproveId=";
    }
    var datosArray = [];
    datosArray.push(data)
    llamadaAjax(verb, url, datosArray, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.antproveId();
        if(desdeContrato == "true" && antproveId != 0){
            window.open('ContratoDetalle.html?ContratoId='+ ContratoId +'&docAntcol=true', '_self');
        }
        else{
            window.open(returnUrl, '_self');
        }
       
    });
}
var totConIva;
var generarAnticipoDb = function () {
    if($('#chkNoContabilizar').prop("checked")) {
        vm.noContabilizar(true);
    } else {
        vm.noContabilizar(false);
    }
    if($('#chkNoFactura').prop("checked")) {
        vm.noFactura(true);
    } else {
        vm.noFactura(false);
    }
    //
    if($('#chkCompleto').prop("checked")) {
        if(antproveId != 0) totConIva = numeroDbf(vm.totalConIva());
        vm.completo(true);
        
    } else {
        vm.completo(false);
        totConIva = vm.totalConIva();
        vm.total("0");
    }
    var data = {
        antprove: {
            "antproveId": vm.antproveId(),
            "numeroAnticipoProveedor": vm.numero(),
            "fecha": spanishDbDate(vm.fecha()),
            "empresaId": vm.sempresaId(),
            "empresaId2": vm.sempresaServiciadaId(),
            "proveedorId": vm.sproveedorId(),
            "emisorNif": vm.emisorNif(),
            "emisorNombre": vm.emisorNombre(),
            "emisorDireccion": vm.emisorDireccion(),
            "emisorCodPostal": vm.emisorCodPostal(),
            "emisorPoblacion": vm.emisorPoblacion(),
            "emisorProvincia": vm.emisorProvincia(),
            "receptorNif": vm.receptorNif(),
            "receptorNombre": vm.receptorNombre(),
            "receptorDireccion": vm.receptorDireccion(),
            "receptorCodPostal": vm.receptorCodPostal(),
            "receptorPoblacion": vm.receptorPoblacion(),
            "receptorProvincia": vm.receptorProvincia(),
            "total": numeroDbf(vm.total()),
            "totalConIva": totConIva,
            "formaPagoId": vm.sformaPagoId(),
            "observaciones": vm.observaciones(),
            "coste": vm.coste(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "totalAlCliente": vm.importeAlCliente(),
            "periodo": vm.periodo(),
            "porcentajeRetencion": vm.porcentajeRetencion(),
            "importeRetencion": vm.importeRetencion(),
            "noContabilizar": vm.noContabilizar(),
            "noFactura": vm.noFactura(),
            "departamentoId": vm.sdepartamentoId(),
            "conceptoAnticipo": vm.conceptoAnticipo(),
            "completo": vm.completo(),
            "servicioId": vm.servicioId(),
            "esColaborador": 1

        }
    };
    return data;
}

function salir() {
    var mf = function () {
        
        if(EmpresaId != "" || desdeContrato == "true"){
            window.open('ContratoDetalle.html?ContratoId='+ ContratoId +'&docAntcol=true', '_self');
        }else{
            var url = "AnticipoColaboradorGeneral.html";
            window.open(url, '_self');
        }
    }
    return mf;
}


function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: null, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
    });
}

function loadEmpresaServiciadas(empresaId2){
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresaServiciada = [{ empresaId: null, nombre: "" }].concat(data);
        vm.posiblesEmpresaServiciadas(empresaServiciada);
        $("#cmbEmpresaServiciadas").val([empresaId2]).trigger('change');
        if(vm.sempresaId() == vm.sempresaServiciadaId()) contratosCerrados();
    });
}

function loadFormasPago(formaPagoId) {
    llamadaAjax("GET", "/api/formas_pago", null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([formaPagoId]).trigger('change');
    });
}

var loadContratos = function (contratoId) {
    if(!ruta){
        ruta = myconfig.apiUrl +"/api/contratos/concat/referencia/direccion/tipo/" + vm.sempresaServiciadaId();
    }
    llamadaAjax("GET", ruta, null, function (err, data) {
        if (err) return;
        cargarContratos(data, contratoId);
    });
}

var cargarContratos = function (data, contratoId) {
    var contratos = [{ contratoId: null, contasoc: "" }].concat(data);
    vm.posiblesContratos(contratos);
    if(contratoId){
        $("#cmbContratos").val([contratoId]).trigger('change');
    }else{
        $("#cmbContratos").val(0).trigger('change');
    }
}
    
function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}


function cambioProveedor(proveedorId) {
    if (!proveedorId) return;
    llamadaAjax("GET", "/api/proveedores/" + proveedorId, null, function (err, data) {
        if (err) return;
        vm.emisorNif(data.nif);
        $('#txtProveedor').val(data.nombre);
        vm.sproveedorId(data.proveedorId);
        vm.emisorNombre(data.nombre);
        vm.emisorDireccion(data.direccion);
        vm.emisorCodPostal(data.codPostal);
        vm.emisorPoblacion(data.poblacion);
        vm.emisorProvincia(data.provincia);
        vm.emisorIban(data.IBAN);
        $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
        var numeroAnt = $("#txtNumero").val();
        compruebaRepetido(numeroAnt, proveedorId);
        lanzaAviso();
    });
}

function lanzaAviso() {
    var nif = vm.emisorNif();
    var nombre = vm.emisorNombre();
    var direccion = vm.emisorDireccion();
    var codPostal = vm.emisorCodPostal();
    var poblacion = vm.emisorPoblacion();
    var provincia = vm.emisorProvincia();
    if(nif == "") nif = null;
    if(nombre == "") nombre = null;
    if(direccion == "") direccion = null;
    if(codPostal == "") codPostal = null;
    if(poblacion == "") poblacion = null;
    if(provincia == "") provincia = null;
    if(!nif || !nombre || !direccion || !codPostal || !poblacion || !provincia) {
        mensAlerta("Faltan campos en el emisor");
    }
}


function cambioEmpresa(empresaId) {
    if (!empresaId) return;
    
    llamadaAjax("GET", "/api/empresas/" + empresaId, null, function (err, data) {
        if(err) return;
        if(data){
            vm.receptorNif(data.nif);
            vm.receptorNombre(data.nombre);
            vm.receptorDireccion(data.direccion);
            vm.receptorCodPostal(data.codPostal);
            vm.receptorPoblacion(data.poblacion);
            vm.receptorProvincia(data.provincia);
            $('#chkCerrados').prop('checked', false);
            loadEmpresaServiciadas(data.empresaId);

            var data2 = {
                antprove: {
                    fecha: spanishDbDate(vm.fecha()),
                    empresaId: data.empresaId
    
                }
            }
        }
    });
}

function cambioEmpresaServiciada(empresaId) {
    if (!empresaId) return;
    
    llamadaAjax("GET", "/api/empresas/" + empresaId, null, function (err, data) {
        if(err) return;
        if(data){
            contratosCerrados(data.contratoId);
        }
    });
}

function cambioContrato(contratoId) {
    if (!contratoId || contratoId == 0) return;
    vm.porcentajeBeneficio(0);
    vm.porcentajeAgente(0);
    if (!vm.coste()) vm.coste(0);
}

function obrenerTipoClienteID(contratoId) {
    llamadaAjax("GET", "/api/anticiposProveedores/contrato/tipo/cliente/" + ContratoId, null, function (err, data) {
        vm.tipoClienteId(data[0].tipoCliente);
    });
}

function compruebaRepetido(numeroAnt, proveedorId) {
    if(numeroAnt.length > 0 && proveedorId > 0) {
       

    
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/" +  proveedorId,
            dataType: "json",
            contentType: "application/json",
            data:null,
            success: function (data, status) {
                if(data) {
                    data.forEach( (f) => {
                        var num = f.numeroAnticipoProveedor;
                        
                        if(num == numeroAnt && f.antproveId != vm.antproveId()) {
                            mensError('Ya existe una anticipo con este numero para este proveedor');
                            $('#txtNumero').val(antNumAnt);
                            return;
                        }
                    });
                 //
                //
                }
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
}



/*------------------------------------------------------------------
    Funciones relacionadas con las líneas de anticipos
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea();
    lineaEnEdicion = false;
    llamadaAjax("GET", "/api/anticiposProveedores/nextlinea/" + vm.antproveId(), null, function (err, data) {
        vm.linea(data);
        
        recuperaParametrosPorDefecto();
    });
}

function limpiaDataLinea(data) {
    vm.antproveLineaId(0);
    vm.linea(null);
    vm.articuloId(null);
    vm.tipoIvaId(null);
    vm.porcentaje(null);
    vm.descripcion(null);
    vm.cantidad(null);
    vm.importe(null);
    vm.costeLinea(null);
    vm.totalLinea(null);
    //
    loadGrupoArticulos();
    // loadArticulos();
    loadTiposIva();

    loadTiposRetencion(0);
    //
    loadArticulos();
    loadUnidades();
}

var obtenerValoresPorDefectoDelContratoMantenimiento = function (contratoId) {
    llamadaAjax("GET",  "/api/contratos/" + contratoId, null, function (err, data) {
        if (err) return;
        vm.porcentajeBeneficio(data.porcentajeBeneficio);
        vm.porcentajeAgente(data.porcentajeAgente);
        if (!vm.coste()) vm.coste(0);
        recalcularCostesImportesDesdeCoste();
    });
}

function aceptarLinea() {
    if (!datosOKLineas()) {
        return;
    }

    

    var data = {
        antproveLinea: {
            antproveLineaId: vm.antproveLineaId(),
            linea: vm.linea(),
            antproveId: vm.antproveId(),
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
            porcentajeRetencion: vm.porcentajeRetencionLinea(),
            importeRetencion: vm.importeRetencionLinea(),
            codigoRetencion: vm.codigo(),
            cuentaRetencion: vm.cuentaRetencion()
        }
    }
    var verbo = "POST";
    var url =  "/api/anticiposProveedores/lineas-nuevo";
    if (lineaEnEdicion) {
        verbo = "PUT";
        url =  "/api/anticiposProveedores/lineas-nuevo/" + vm.antproveLineaId();
    }
    llamadaAjax(verbo, url, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        llamadaAjax("GET",  "/api/anticiposProveedores/" + data.antproveId, null, function (err, data) {
            cmd = "";
            loadData(data);
            loadLineasAnticipo(data.antproveId);
            loadBasesAntprove(data.antproveId);
            loadRetencionesAntprove(data.antproveId);
        });
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
                required: true,
                number: true,
                min: 0.00000000000001
            },
            txtTotalLinea: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtCapitulo: {
                required: "Debe dar un texto al capítulo"
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
            txtPrecio: {
                required: 'Necesita un precio',
                min: "El precio no puede ser cero"
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

function initTablaAnticiposLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_lineas'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
        data: dataAntproveLineas,
        columns: [{
            data: "linea"
        }, {
            data: "capituloLinea",
            "visible": false,
            render: function (data, type, row) {
                return "";
            }
        }, {
            data: "unidades"
        }, {
            data: "descripcion",
            render: function (data, type, row) {
                if (!data) return "";
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
            data: "totalLinea",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "antproveLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteAnticipoLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editAnticipoLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                // if (!vm.generada())
                //     html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if(vm.contabilizada() && !usuario.puedeEditar) bt1 = '';
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    $('#txtDescripcion').focus();
    //
    vm.antproveLineaId(data.antproveLineaId);
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
    vm.importeRetencionLinea(data.importeRetencion);
    vm.porcentajeRetencionLinea(data.porcentajeRetencion);
    //
    loadGrupoArticulos(data.grupoArticuloId);
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
    loadTiposRetencion(data.codigoRetencion);
    loadUnidades(data.unidadId);
    //
}

function loadDataLineaDefecto(data) {
    vm.antproveLineaId(0);
    vm.articuloId(data.articuloId);
    vm.porcentaje(data.porcentaje);
    vm.descripcion(data.descripcion);
    vm.cantidad(1);
    vm.importe(0);
    vm.porcentaje(0);
    vm.porcentajeRetencionLinea(0);
    vm.importeRetencionLinea(0);
    vm.codigo(0);
   
   
    
    //
    /*loadGrupoArticulos(data.grupoArticuloId);
    loadArticulos(data.articuloId);
    loadTiposIva(data.tipoIvaId);
    loadUnidades(data.unidadId);*/
    //
    //cambioGrupoArticulo(data.grupoArticuloId)
    cambioTiposIva(data.tipoIvaId)
   
}



function loadTablaAnticipoLineas(data) {
    numLineas = 0;
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(data) numLineas = data.length;
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadLineasAnticipo(id) {
    llamadaAjax("GET", "/api/anticiposProveedores/lineas/" + id, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        dataLineas = data;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        loadTablaAnticipoLineas(data);
    });
}

function loadArticulos(id) {
    llamadaAjax("GET", "/api/articulos", null, function (err, data) {
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
    llamadaAjax("GET", "/api/grupo_articulo/departamento/" + vm.departamentoId(), null, function (err, data) {
        if(err) return;
        var grupos = [{ grupoArticuloId: 0, nombre: "" }].concat(data);
        vm.posiblesGrupoArticulos(grupos);
        if (id) {
            $("#cmbGrupoArticulos").val([id]).trigger('change');
        } else {
            $("#cmbGrupoArticulos").val([0]).trigger('change');
        }
    });
}


function loadTiposIva(id) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([0]).trigger('change');
        }
    });
}

function loadTiposRetencion(id) {
    llamadaAjax("GET", "/api/anticiposProveedores/retenciones/tiposreten/antprove", null, function (err, data) {
        if (err) return;
        vm.posiblesTiposRetencion(data);
        if (id) {
            $("#cmbTiposRetencion").val([id]).trigger('change');
            for( var i = 0; i < data.length; i++) {
                var re = data[i];
                if(re.codigo == id) {
                    vm.antCodigo(id);
                    vm.antCuentaRetencion(re.cuentaPorDefecto);
                    vm.scodigo(id);
                    vm.codigo(id);
                    $("#cmbTiposRetencion").val([id]).trigger('change');
                    break;
                }
            }
        
        } else {
            $("#cmbTiposRetencion").val([0]).trigger('change');
            vm.antCodigo(0);
            vm.scodigo(0);
            vm.codigo(0);
            vm.antCuentaRetencion(null);
            vm.porcentajeRetencionLinea(0);
            vm.importeRetencionLinea(0);
        }
    });
}



function loadUnidades(id) {
    llamadaAjax('GET', "/api/unidades", null, function (err, data) {
        if (err) return;
        var unidades = [{ unidadId: 0, nombre: "", abrev: "" }].concat(data);
        vm.posiblesUnidades(unidades);
        if (id) {
            $("#cmbUnidades").val([id]).trigger('change');
        } else {
            $("#cmbUnidades").val([0]).trigger('change');
        }
    });
}


function cambioArticulo(articuloId) {
    if (!articuloId) return;
    llamadaAjax("GET", "/api/articulos/" + articuloId, null, function (err, data) {
        if (data.descripcion == null) {
            vm.descripcion(data.nombre);
        } else {
            vm.descripcion(data.nombre + ':\n' + data.descripcion);
        }
        vm.cantidad(1);
        if(data.precioUnitario) {
            vm.importe(data.precioUnitario);
        }
        
        $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
        $("#cmbUnidades").val([data.unidadId]).trigger('change');
        cambioTiposIva(data.tipoIvaId);
        cambioPrecioCantidad();
    });
}

function cambioGrupoArticulo(grupoArticuloId) {
    //
    if (!grupoArticuloId) return;
    // montar el texto de capítulo si no lo hay
    //if (!vm.capituloLinea()) {
        var numeroCapitulo = Math.floor(vm.linea());
        var nombreCapitulo = "Capitulo " + numeroCapitulo + ": ";
        // ahora hay que buscar el nombre del capitulo para concatenarlo
        llamadaAjax("GET", "/api/grupo_articulo/" + grupoArticuloId, null, function (err, data) {
            if (err) return;
            nombreCapitulo += data.nombre;
            vm.capituloLinea(nombreCapitulo);
        });
    //}
    llamadaAjax("GET", "/api/articulos/grupo/" + grupoArticuloId, null, function (err, data) {
        var articulos = [{ articuloId: 0, nombre: "" }].concat(data);
        vm.posiblesArticulos(articulos);
    });
}

function cambioTiposIva(tipoIvaId) {
    if (!tipoIvaId) return;
    llamadaAjax("GET", "/api/tipos_iva/" + tipoIvaId, null, function (err, data) {
        if (err) return;
        vm.tipoIvaId(data.tipoIvaId);
        vm.porcentaje(data.porcentaje);
       
    });
}


function cambioTiposRetencion(codigo) {
    if (!codigo) return;
    //comprobamos los tipos de retencion de la anticipo
    var acumulado = 0;
    var retSelec;
    llamadaAjax("GET","/api/anticiposProveedores/retenciones/" + vm.antproveId(), null, function (err, datos) {
        if (err) return;
        if(datos.length == 2) {// si hay dos tipos de retncion diferentes
            retSelec = vm.scodigo();
            //comprobamos que lA nueva retencion introducida no sea diferente de las dos que existen
            for(var i = 0; i < datos.length; i++) {
                if( vm.scodigo() != datos[i].codigoRetencion) {
                    acumulado++;
                }
            }
        }
        if(acumulado == 2) {
            mostrarMensajeTipoNoPermitido();
            vm.codigo(vm.antCodigo());
            vm.scodigo(vm.antCodigo());
            vm.cuentaRetencion(vm.antCuentaRetencion());
            $("#cmbTiposRetencion").val([vm.antCodigo()]).trigger('change');
            //loadTiposRetencion(codigo);
            return;
        }
        if(datos.length == 1 &&  vm.scodigo() != 0) {
            if(datos[0].codigoRetencion != 0 && datos[0].codigoRetencion != vm.scodigo() && !lineaEnEdicion) {
                mostrarMensajeTipoNoPermitido();
                vm.codigo(0);
                vm.scodigo(0);
                vm.cuentaRetencion(null);
                vm.porcentajeRetencionLinea(0);
                vm.importeRetencionLinea(0);
                $("#cmbTiposRetencion").val([0]).trigger('change');
                //loadTiposRetencion(codigo);
                return;
            } else if(datos[0].codigoRetencion != 0 && datos[0].codigoRetencion != vm.scodigo() && lineaEnEdicion){
                mostrarMensajeTipoNoPermitido();
                vm.codigo(vm.antCodigo());
                vm.scodigo(vm.antCodigo());
                vm.cuentaRetencion(vm.antCuentaRetencion());
                $("#cmbTiposRetencion").val([vm.antCodigo()]).trigger('change');
                //loadTiposRetencion(codigo);
                return;
            }
        }
        
        llamadaAjax("GET", "/api/anticiposProveedores/retenciones/tiposreten/antprove/" + codigo, null, function (err, data) {
            if (err) return;
            vm.codigo(data.codigo);
            vm.antCodigo(data.codigo);
            if(vm.codigo() != 0) {
                vm.porcentajeRetencionLinea(data.porcentajePorDefecto);
                vm.cuentaRetencion(data.cuentaPorDefecto);
            } else {
                vm.importeRetencionLinea(0);
                vm.porcentajeRetencionLinea(0);
                vm.cuentaRetencion(null);
            }
            cambioPrecioCantidad();
        });
    });
}




function establecerTotal() {
   /*  if(vm.antTotal()) {
        vm.total(vm.antTotal());
    } */
}

var cambioPrecioCantidad = function () {
    
        //vm.antTotal(vm.total()); //guardamos el total
    
    vm.costeLinea(vm.cantidad() * vm.importe());
    recalcularCostesImportesDesdeCoste();
    vm.totalLinea(obtenerImporteAlClienteDesdeCoste(vm.costeLinea()));
    //calculamos el importe de retencion
    var porcentajeRetencionLinea = vm.porcentajeRetencionLinea();
    if(porcentajeRetencionLinea != 0) {
        vm.importeRetencionLinea(roundToTwo((vm.porcentajeRetencionLinea() * vm.totalLinea())/100))
    } else {
        vm.importeRetencionLinea(0);
        vm.porcentajeRetencionLinea(0);
    }
}

function editAnticipoLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/anticiposProveedores/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deleteAnticipoLinea(antproveLineaId) {
    // mensaje de confirmación
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        var data = {
            antproveLinea: {
                antproveId: vm.antproveId()
            }
        };
        llamadaAjax("DELETE",  "/api/anticiposProveedores/lineas-nuevo/" + antproveLineaId, data, function (err, data) {
            if (err) return;
            llamadaAjax("GET",  "/api/anticiposProveedores/" + vm.antproveId(), null, function (err, data) {
                if (err) return;
                loadData(data);
                loadLineasAnticipo(data.antproveId);
                loadBasesAntprove(data.antproveId);
                loadRetencionesAntprove(data.antproveId);
            });
        });
    }, function () {
        // cancelar no hace nada
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
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_bases'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadBasesAntprove(antproveId) {
    llamadaAjax("GET", "/api/anticiposProveedores/bases/" + antproveId, null, function (err, data) {
        if (err) return;
        // actualizamos los totales
        var t1 = 0; // total sin iva
        var t2 = 0; // total con iva
        var t3 = 0; // tital cuotas
        for (var i = 0; i < data.length; i++) {
            t1 += data[i].base;
            t3 += data[i].cuota;
            t2 += data[i].base + data[i].cuota;
        }
        llamadaAjax("GET", "/api/anticiposProveedores/retenciones/" + antproveId, null, function (err, dataBis) {
            if (err) return;
            for(var j = 0; j < dataBis.length; j++) {
                t2 = t2 - dataBis[j].importeRetencion;
            }
            vm.total(numeral(t1).format('0,0.00'));
            vm.totalCuota(numeral(t3).format('0,0.00'));
            vm.totalConIva(numeral(t2).format('0,0.00'));
           
            loadTablaBases(data);
        });
    });
}


/*
    Funciones relacionadas con la gestión de las retenciones
*/

function initTablaRetenciones() {
    tablaCarro = $('#dt_retenciones').dataTable({
        autoWidth: true,
        
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_retenciones'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
            data: "descripcion",
        },{
            data: "porcentajeRetencion",
            className: "text-left",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "baseRetencion",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "importeRetencion",
            className: "text-right",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }]
    });
}


function loadTablaRetenciones(data) {
    var dt = $('#dt_retenciones').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function loadRetencionesAntprove(antproveId) {
    llamadaAjax("GET", "/api/anticiposProveedores/retenciones/" + antproveId, null, function (err, data) {
        if (err) return;
        
        loadTablaRetenciones(data);
    });
}


// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaProveedor
// carga en el campo txtProveedor el valor seleccionado
var cargaProveedor = function (id) {
    llamadaAjax("GET", "/api/proveedores/" + id, null, function (err, data) {
        if (err) return;
        $('#txtProveedor').val(data.nombre);
        vm.sproveedorId(data.proveedorId);
    });
};

// initAutoProveedor
// inicializa el control del Proveedor como un autocomplete
var initAutoProveedor = function () {
    // incialización propiamente dicha
    $("#txtProveedor").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("POST", "/api/proveedores/activos/proveedores/todos/comerciales/?nombre=" + request.term, datosPro, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nomconcat,
                        id: d.proveedorId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.sproveedorId(ui.item.id);
            cambioProveedor(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("proveedorNecesario", function (value, element) {
        var r = false;
        if (vm.sproveedorId()) r = true;
        return r;
    }, "Debe seleccionar un Proveedor válido");
};



var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    guardarPorcentajes();
    actualizarLineasDeLaAnticipoTrasCambioCostes();
};

var guardarPorcentajes = function(){
    var data = {
        antprove: {
            antproveId: vm.antproveId(),
            empresaId: vm.empresaId(),
            proveedorId: vm.proveedorId(),
            fecha: spanishDbDate(vm.fecha()),
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente()
        }
    }
    if(vm.antproveId() === 0) return;

    llamadaAjax("PUT", "/api/anticiposProveedores/"+vm.antproveId(), data, function (err, data) {
        if (err) return;
        return;
    });
}

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
    actualizarLineasDeLaAnticipoTrasCambioCostes();
}

var recalcularCostesImportesDesdeCoste = function () {
    if(vm.porcentajeAgente() ==0 && vm.porcentajeBeneficio() == 0 ) return;
    if (vm.coste() != null) {
        if (vm.porcentajeBeneficio() != null) {
            vm.importeBeneficio(roundToTwo(vm.porcentajeBeneficio() * vm.coste() / 100));
        }
        vm.ventaNeta(vm.coste() * 1 + vm.importeBeneficio() * 1);
    }
    if (vm.porcentajeAgente() != null) {
        vm.importeAlCliente(roundToTwo(vm.ventaNeta() / ((100 - vm.porcentajeAgente()) / 100)));
        vm.importeAgente(roundToTwo(vm.importeAlCliente() - vm.ventaNeta()));
    }
    vm.importeAlCliente(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    vm.total(roundToTwo(vm.ventaNeta() * 1 + vm.importeAgente() * 1));
    if (vm.tipoClienteId() == 1 /*&& !vm.mantenedorDesactivado()*/) {
        // es un mantenedor
        vm.total(roundToTwo(vm.importeAlCliente() - vm.ventaNeta() + vm.importeBeneficio()));
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

var actualizarLineasDeLaAnticipoTrasCambioCostes = function () {
    if (vm.totalLinea() === undefined || vm.antproveId() === 0) { 
        return;
    }else {
        var url =  "/api/anticiposProveedores/recalculo/" + vm.antproveId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente() + '/' + vm.tipoClienteId();
        
         llamadaAjax("PUT", url, null, function (err, data) {
             if (err) return;
             llamadaAjax("GET",  "/api/anticiposProveedores/" + vm.antproveId(), null, function (err, data) {
                 loadLineasAnticipo(data.antproveId);
                 loadBasesAntprove(data.antproveId);
                 loadRetencionesAntprove(data.antproveId);
             });
         });
    }
    
};

var ocultarCamposPreanticiposGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var mostrarMensajeAnticipoGenerada = function () {
    var mens = "Esta es una preanticipo generada desde contrato. Aunque puede modificar sus valores plantéese si no seria mejor volver a generarla.";
    mensNormal(mens);
}

var mostrarMensajeAnticipoNueva = function () {
    var mens = "Introduzca las líneas de la nueva anticipo en el apartado correspondiente";
    mensNormal(mens);
}

var mostrarMensajeTipoNoPermitido = function() {
    var mens = "Solo se permiten tipos de retencion exentos y otro tipo en una misma anticipo";
    mensNormal(mens);
}

var obtenerImporteAlClienteDesdeCoste = function (coste) {
    var importeBeneficio = 0;
    var ventaNeta = 0;
    var importeAlCliente = 0;
    var importeAgente = 0;
    if (coste != null) {
        if (vm.porcentajeBeneficio()) {
            importeBeneficio = roundToTwo(vm.porcentajeBeneficio() * coste / 100);
        }
        ventaNeta = (coste * 1) + (importeBeneficio * 1);
    }
    if (vm.porcentajeAgente()) {
        importeAlCliente = roundToTwo(ventaNeta / ((100 - vm.porcentajeAgente()) / 100));
        importeAgente = roundToTwo(importeAlCliente - ventaNeta);
    }
    importeAlCliente = roundToTwo((ventaNeta * 1) + (importeAgente * 1));
    if (vm.tipoClienteId() == 1 /*&& !vm.mantenedorDesactivado()*/) {
        // es un mantenedor
        importeAlCliente = roundToTwo(importeAlCliente - ventaNeta + importeBeneficio);
    }
    return importeAlCliente;
}

var imprimir = function () {
    printantprove2(vm.antproveId());
}

function printPreanticipo(id) {
    llamadaAjax("GET", "/api/informes/preanticipos/" + id, null, function (err, data) {
        if (err) return;
        
    });
}

function printantprove2(id) {
    var url = "InfAnticiposProveedores.html?antproveId=" + id;
    window.open(url, "_new");
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


var recuperaParametrosPorDefecto = function (){
    llamadaAjax("GET", "/api/parametros/parametro/grupo", null, function (err, data) {
        if (err) return;
        loadDataLineaDefecto(data);
    });
}


//---- SOLAPA EMPRESAS SERVICIADAS
function initTablaServiciadas() {
    tablaAntproves = $('#dt_serviciada').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Anticipos Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Anticipos filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Anticipos filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Anticipos filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Anticipos filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_serviciada'), breakpointDefinition);
            }
        },
        rowCallback: function (nRow) {
            responsiveHelper_dt_basic.createExpandIcon(nRow);
        },
        drawCallback: function (oSettings) {
            responsiveHelper_dt_basic.respond();
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
        data: dataServiciadas,
        columns: [{
            data: "antproveServiciadoId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "empresa"
        }, {
            data: "referencia"
        }, {
            data: "importe",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
            }
        }, {
            data: "antproveServiciadoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteServiciada(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalServiciado' onclick='editServiciada(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printAnticipo2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_serviciada thead th input[type=text]").on('keyup change', function () {
        tablaAntproves
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}


function loadServiciadasAntprove(antproveId) {
    llamadaAjax("GET", myconfig.apiUrl +  "/api/anticiposProveedores/servicidas/anticipos/proveedor/todas/" + antproveId, null, function (err, data) {
        if (err) return;
        for(var i = 0; i < data.length; i++){
            acumulado += parseFloat(data[i].importe);
        }
        numServiciadas = data.length;
        if(numServiciadas == 0) {
            mostrarMensajeCrearServiciadas();
        }
        setTimeout(function() {
            if($('#chkCompleto').prop("checked")) {
                tot = parseFloat(numeroDbf(vm.total()));
            } else {
                tot = parseFloat(vm.totalConIva());
            }
            vm.importeServiciada(roundToTwo(tot-acumulado).toFixed(2));
            loadTablaServiciadas(data);
        }, 1000);
    });
}

function loadTablaServiciadas(data) {
    numServ = 0;
    var dt = $('#dt_serviciada').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(data) numServ = data.length;
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editServiciada(id) {
    llamadaAjax("GET", "/api/anticiposProveedores/servicidas/anticipos/proveedor/una/para/editar/"+ id, null, function (err, data) {
        if (err) return;
        importeModificar = data.importe;
        loadDataServiciadas(data)
    });
   
}

function loadDataServiciadas(data) {
    $('#chkCerrados').prop("checked", true);
    vm.antproveServiciadoId(data.antproveServiciadoId);
    vm.importeServiciada(data.importe);

    loadEmpresaServiciadas(data.empresaId);
    vm.scontratoId(data.contratoId);
    contratosCerrados();

}

function nuevaServiciada() {
    //primero comprobamos que el colaborador no exceda el límite de lo que tiene anticipado
    var verb = "POST";
    var url =  '/api/anticiposProveedores/nueva/serviciada';
    
    // caso modificación
    if (vm.antproveServiciadoId() != 0) {
       

        verb = "PUT";
        url =  "/api/anticiposProveedores/serviciada/edita/" + vm.antproveServiciadoId();
        returnUrl = "AnticipoColaboradorGeneral.html?antproveId=";
        
    }
    compruebaAnticiposColaborador(verb, function(err, result) {
        if(err) return mensError(err);
        var imp;
        var tot;
        acumulado = 0;
    
        //recalculamos el acumulado de todas las empresas serviciadas de del anticipo
        llamadaAjax("GET", myconfig.apiUrl +  "/api/anticiposProveedores/servicidas/anticipos/proveedor/todas/" + antproveId, null, function (err, data) {
            if (err) return;
            for(var i = 0; i < data.length; i++){
                acumulado += parseFloat(data[i].importe);
            }
            acumulado = roundToTwo(acumulado);
            if(vm.antproveServiciadoId() != 0) {
                imp = acumulado - importeModificar + parseFloat(vm.importeServiciada());
                imp = parseFloat(imp.toFixed(2));
                
            } else {
                imp = acumulado + parseFloat(vm.importeServiciada());
                imp = parseFloat(imp.toFixed(2));
                if($('#chkCompleto').prop("checked")) {
                    tot = parseFloat(numeroDbf(vm.total()));
                } else {
                    tot = parseFloat(vm.totalConIva());
                }
            }
        
            if( imp > tot){
                mostrarMensajeSmart('El total de la suma del importe de las empresas serviciadas supera al de la anticipo');
                return;
            }
            else if(!datosOKServiciada()){
                vm.importeServiciada(0);
                return;
            }
            var data = {
                antproveServiciada: {
                    antproveId: vm.antproveId(),
                    empresaId: vm.sempresaServiciadaId(),
                    contratoId: vm.scontratoId(),
                    importe: vm.importeServiciada()
                }
            }
            llamadaAjax(verb, url, data, function (err, data) {
                if (err) return;
                loadServiciadasAntprove(antproveId);
                $('#modalServiciado').modal('hide');
            });
            
        });
    });
}

function compruebaAnticiposColaborador(verb, callback) {
    llamadaAjax("GET", "/api/comerciales/limite/anticipo/"+ vm.proveedorId() + "/" + vm.sempresaServiciadaId() + "/" + vm.scontratoId(), null, function (err, data) {
        if (err) return callback(err);
        if(Object.keys(data).length === 0 && data.constructor === Object) {
            var err = "Está intentando crear un anticipo para un colaborador que no está vinculado al contrato.";
            return callback(err); 
        } else {
            var imp = 0;
            var totAnt = 0;
            //comprobamos si se ha superado el límite
            // si el limite es null no se hace nada
            if(data.limite == null) return callback(null, null);
            //sumamos lo que le estamos anticipando a lo ya anticipado y vemos si supera el límite
            //caso post 
            if(verb == "POST") {
                imp = parseFloat(vm.importeServiciada());
                totAnt = parseFloat(data.totAnticipado) + imp;
            } else {
                imp = parseFloat(vm.importeServiciada());
                totAnt = (parseFloat(data.totAnticipado) - importeModificar) + imp;
            }
            if(totAnt > data.limite) {
                var err = "Limite para este colaborador sobrepasado en este contrato.<br>" + " Limite: " + numeral(data.limite).format('0,0.00') + ".<br>" + "Total que se intenta anticipar: " + numeral(totAnt).format('0,0.00');
                return callback(err); 
            }
            callback(null, null);
        }

    });
}
function datosOKServiciada() {
    if(vm.importeServiciada() == "") {
        vm.porcentaje(null);
       }
    
    $('#frmServiciadas').validate({
        rules: {
            txtImporteServiciada: {
                required: true,
                number: true,
                min: 0.000000000001
            },
            cmbEmpresaServiciadas: {
               required: true
            },
            cmbContratos: {
                required:true
            }
        
        },
        // Messages for form validation
        messages: {
            txtImporteServiciada: {
                required: "Debe introducir un importe",
                number: "Debe introducir un numero válido",
                min: "El importe no puede ser cero"
            },
            cmbEmpresaServiciadas: {
                required: 'Se tiene que elegir una empresa serviciada'
            },
            cmbContratos: {
                required: 'Se tiene que elegir un contrato'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmServiciadas").validate().settings;
    return $('#frmServiciadas').valid();
}

function reiniciaValores() {
    acumulado = 0;
    importeModificar = 0;
    vm.importeServiciada(0);
    vm.antproveServiciadoId(0);
    vm.scontratoId(null);
    loadEmpresaServiciadas(vm.empresaId());
    loadServiciadasAntprove(antproveId);
    if(ContratoId != 0) {
        $('#chkCerrados').prop('checked', true);
        vm.scontratoId(ContratoId);
        loadContratos(vm.scontratoId());
        cambioContrato(ContratoId);
    }
    
}


function deleteServiciada(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                antproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/anticiposProveedores/serviciada/anticipo/proveedor/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    buscarServiciadas();
                    reiniciaValores();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function buscarServiciadas() {
    var mf = function () {
        loadServiciadasAntprove(antproveId);
    };
    return mf;
}

function bloqueaEdicionCampos() {
    $('#cmbSeries').prop('disabled', true);
    $('#cmbDepartamentosTrabajo').prop('disabled', true);
    $('#cmbEmpresas').prop('disabled', true);
    //$('#cmbContratos').prop('disabled', true);
    $('#cmbFormasPago').prop('disabled', true);
    $("#frmAnticipo :input").prop('readonly', true);
    $('#btnAceptar').hide();
    //
    $('#btnNuevaLinea').hide();
    $("#linea-form :input").prop('readonly', true);
    $('#btnAceptarLinea').hide();
    $('#cmbTiposRetencion').prop('disabled', true);
    $('#cmbGrupoArticulos').prop('disabled', true);
    $('#cmbArticulos').prop('disabled', true);
    $('#cmbUnidades').prop('disabled', true);
    $('#cmbTiposIva').prop('disabled', true);
}


var mostrarMensajeCrearServiciadas = function () {
    var mens = "Es necesario crear empresas serviciadas para esta anticipo en la pestaña correspondinte";
    mensNormal(mens);
}






