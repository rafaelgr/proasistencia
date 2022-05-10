/*-------------------------------------------------------------------------- 
prefacturaDetalle.js
Funciones js par la página facturaProveedorDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var facproveId = 0;
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

var dataServiciadas;
var dataLineas;
var usuario;
var numLineas = 0;
var comp;
var fechaRe = null;



var lineaEnEdicion = false;

var dataFacproveLineas;
var dataBases;

var dataAnticipos;

var antNumFact = ""//recoge el valor que tiene el nif al cargar la página

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
    //
    $.validator.addMethod("greaterThan",
        function (value, element, params) {
            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) >= new Date(fp);
            } else {
                // esto es debido a que permitimos que la segunda fecha nula
                return true;
            }
        }, 'La fecha de recpción debe ser mayor que la fecha de la factura.');
   

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
    $("#btnAceptar").click(aceptarFactura);
    $("#btnSalir").click(salir());
    
    //$("#btnImprimir").click(imprimir);
    $("#frmFactura").submit(function () {
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
    
    $('#frmAnt').submit(function () {
        return false;
    });

    $('#frmVinculaAnticipos').submit(function () {
        return false;
    });

    //evento de foco en el modal
    $('#modalLinea').on('shown.bs.modal', function () {
        $('#txtDescripcion').focus();
    })

    // select2 things
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamentos();

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioEmpresa(e.added.id);
    });


    $("#cmbDepartamentosTrabajo").select2().on('change', function (e) {
        if (e.added) loadDepartamentos(e.added.id);
    });

    $("#txtFechaRecepcion").on('change', function (e) {
        if(fechaRe) {
            var ano = moment(fechaRe).year();

            var ano2 = moment(vm.fechaRecepcion(), "DD/MM/YYYY").format('YYYY-MM-DD');
            ano2 = moment(ano2).year();
            if(ano != ano2) {
                mensError("Una vez establecido el año este no se puede cambiar");
                vm.fechaRecepcion(moment(fechaRe).format("DD/MM/YYYY"));
                return;
            }
        }
    });

    $("#cmbTiposOperacion").select2(select2Spanish());
    loadTiposOperacion(1);

    $("#txtNumero").on('change', function (e) {
        var numeroFact = $("#txtNumero").val();
     
        compruebaRepetido(numeroFact, vm.sproveedorId());
    });
    

    $('#txtPrecio').focus( function () {
        if(vm.contabilizada() && !usuario.puedeEditar) return;
        $('#txtPrecio').val('');
    })

    // Ahora Proveedor en autocomplete
    initAutoProveedor();
    initAutoProveedorNif();

    initTablaAnticipos();

   // select2 things
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
    //loadGrupoArticulos();
    $("#cmbGrupoArticulos").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioGrupoArticulo(e.added.id);
    });



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

   
    

    
    initTablaFacturasLineas();
    initTablaBases();
    initTablaRetenciones();
    initTablaAnticiposAsociados();
    

    facproveId = gup('facproveId');
    cmd = gup("cmd");
    ContratoId = gup("ContratoId");
    EmpresaId = gup("EmpresaId");
    ProveedorId = gup("ProveedorId");
    desdeContrato = gup("desdeContrato");

    

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
                },
                error: function (xhr, textStatus, errorThrwon) {
                    var m = xhr.responseText;
                    if (!m) m = "Error al cargar";
                    mensError(m);
                    return;
                }
            });
    });

    if (facproveId != 0) {
        // caso edicion
        llamadaAjax("GET",  "/api/facturasProveedores/" + facproveId, null, function (err, data) {
            if (err) return;
            vm.stipoOperacionId(data.tipoOperacionId);
            loadData(data);
            loadLineasFactura(data.facproveId);
            loadBasesFacprove(data.facproveId);
            loadRetencionesFacprove(data.facproveId);
            loadServiciadasFacprove(facproveId);
            $('#btnAltaServiciada').click(reiniciaValores);
            /*llamadaAjax("GET",  "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/" + data.proveedorId, null, function (err, data2) {
                if (err) return;
                var result = [];
                if(data2) {
                    if(data2.length > 0) {
                        data2.forEach(function (f) {
                            if(f.facproveId == null) {
                                result.push(f);
                            }
                        })
                    }
                    if(result.length > 0 && !data.antproveId) {
                        initTablaAnticipos();
                        $("#modalAnticipo").modal({show: true});
                        loadTablaAnticipos(result);
                    }
                }
            })*/
             //actualización de propiedad al click
             var proveedorId = data.proveedorId;
             var empresaId = data.empresaId;
             var fecha = moment(data.fecha).format('YYYY-MM-DD');
             $('#chkEnviadaCorreo').click(
                 function(e){
                     var enviadaCorreo = $('#chkEnviadaCorreo').prop('checked');
                     var data = {
                         facprove: {
                             "facproveId": facproveId,
                             "empresaId": empresaId,
                             "proveedorId":  proveedorId,
                             "fecha": fecha,
                             "enviadaCorreo": enviadaCorreo
                         }
                     }
                     verb = "PUT";
                     url = myconfig.apiUrl + "/api/facturasProveedores/" + facproveId;
                     var datosArray = [];
                     datosArray.push(data)
                     llamadaAjax(verb, url, datosArray, function (err, data) {
                         if(err) return;
                         mensNormal("Se ha actulizado la propiedad de enviar por correo");
                     });

                 }
             );
     
        });
    } else {
        // caso alta
        vm.generada(0); // por defecto manual
        vm.porcentajeRetencion(0);
        vm.importeServiciada(0);
        vm.importeRetencion(0);
        vm.sempresaId(EmpresaId);
        vm.scontratoId(ContratoId);
        vm.fechaRecepcion(spanishDate(new Date()));//fecha de recepcion ofertada
        $("#lineasfactura").hide();
        $("#basesycuotas").hide();
        $('#btnAltaServiciada').hide();
        document.title = "NUEVA FACTURA COLABORADOR";
        if (EmpresaId != 0) {
            loadEmpresas(EmpresaId);
            cambioEmpresa(EmpresaId);
        }
        if (ProveedorId != 0) {
            cargaProveedor(ProveedorId);
            cambioProveedor(ProveedorId);
        }
        /*if (ContratoId != 0) {
            loadContratos(ContratoId);
            cambioContrato(ContratoId);
        }*/

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
    self.facproveId = ko.observable();
    self.ref = ko.observable();    
    self.numero = ko.observable();
    self.numeroRef = ko.observable();
    self.fecha = ko.observable();
    self.fechaRecepcion = ko.observable();
    self.empresaId = ko.observable();
    self.proveedorId = ko.observable();
    self.contratoId = ko.observable();
    self.noContabilizar = ko.observable();
    self.numregis = ko.observable();
    self.importeAnticipo = ko.observable();
    self.restoPagar = ko.observable();
    self.conceptoAnticipo = ko.observable();
    self.emisorIban = ko.observable();
    self.fianza = ko.observable();
    self.enviadaCorreo = ko.observable();
    self.contabilizada = ko.observable();

    self.numero2 = ko.observable();
    self.fechaRecepcion2 = ko.observable();
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
    self.anticipo = ko.observable();
    self.antproveId = ko.observable();
    self.contado = ko.observable();

    // -- Valores para las líneas
    self.facproveLineaId = ko.observable();
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
    //
    self.tipoOperacionId = ko.observable();
    self.stipoOperacionId = ko.observable();
    //
    self.posiblesTiposOperacion = ko.observableArray([]);
    self.elegidosTiposOperacion = ko.observableArray([]);    



    // Para calculadora de costes
    self.coste = ko.observable();
    self.porcentajeBeneficio = ko.observable();
    self.importeBeneficio = ko.observable();
    self.ventaNeta = ko.observable();
    self.porcentajeAgente = ko.observable();
    self.importeAgente = ko.observable();
    self.importeAlCliente = ko.observable();
    // Nuevo Total de coste para la factura
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
    self.nombreFacprovePdf = ko.observable();
    self.antiguoPdf = ko.observable();

    //valores para la solapa serviciadas
    self.facproveServiciadoId = ko.observable();
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
    $('#cmbEmpresas').prop('disabled', true);
    vm.tipoOperacionId(data.tipoOperacionId);
    vm.facproveId(data.facproveId);
    vm.ref(data.ref);
    vm.numero(data.numeroFacturaProveedor);
    vm.numero2(data.numeroFacturaProveedor2)
    vm.numregis(data.numregisconta);
    vm.fecha(spanishDate(data.fecha));
    vm.fechaRecepcion(spanishDate(data.fecha_recepcion));
    fechaRe = data.fecha_recepcion;
    vm.fechaRecepcion2(spanishDate(data.fecha_recepcion2));
    vm.empresaId(data.empresaId);
    vm.proveedorId(data.proveedorId);
    vm.contratoId(data.contratoId);
    vm.generada(data.generada);
    vm.coste(data.coste);
    vm.porcentajeBeneficio(data.porcentajeBeneficio);
    vm.porcentajeAgente(data.porcentajeAgente);
    vm.importeAlCliente(data.totalAlCliente);
    vm.importeAnticipo(numeral(data.importeAnticipo).format('0,0.00'));
    vm.contado(numeral(data.contado).format('0,0.00'));
    vm.conceptoAnticipo(data.conceptoAnticipo);
    vm.emisorIban(data.IBAN);
    vm.fianza(numeral(data.fianza).format('0,0.00'));
    vm.restoPagar(data.restoPagar);
    vm.enviadaCorreo(data.enviadaCorreo);
    vm.contabilizada(data.contabilizada);
    recalcularCostesImportesDesdeCoste();
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
    vm.facproveServiciadoId(0);
    vm.importeServiciada(0);
    vm.nombreFacprovePdf(data.nombreFacprovePdf);
    vm.antiguoPdf(data.nombreFacprovePdf);
    vm.anticipo(data.anticipo);
    vm.antproveId(data.antproveId)

    //
    loadEmpresas(data.empresaId);
    loadDepartamentos(data.departamentoId);
    loadTiposOperacion(data.tipoOperacionId)
    
    cargaProveedor(data.proveedorId);
    loadFormasPago(data.formaPagoId);
    vm.observaciones(data.observaciones);
    //
    vm.porcentajeRetencion(data.porcentajeRetencion);
    vm.importeRetencion(data.importeRetencion);
    if (vm.generada()) {
        // ocultarCamposFacturasGeneradas();
        mostrarMensajeFacturaGenerada();
    }
    vm.periodo(data.periodo);
    if (cmd == "nueva") {
        mostrarMensajeFacturaNueva();
    }
     //buscamos anticipos completos existemtes para el proveedor, si los hay abrimos el modal
     llamadaAjax("GET",  "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/" + vm.proveedorId(), null, function (err, result) {
        if (err) return;
        if(result) {
            if(result.length > 0) {
                cargaTablaAnticipos(true);
        }
        }
    });
    llamadaAjax("GET",  "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/" + vm.proveedorId() + "/" + data.departamentoId, null, function (err, data2) {
        if (err) return;
        if(data2) {
            if(data2.length > 0) {
                var mens = "Existen anticipos incompletos para este proveedor, puede vincularlos en la pestaña anticipos";
                // mensaje de AVISO con confirmación
                $.SmartMessageBox({
                    title: "<i class='fa fa-info'></i> Mensaje",
                    content: mens,
                    buttons: '[Aceptar]'
                }, function (ButtonPressed) {
                    if (ButtonPressed === "Aceptar") {
                        
                    }
                });
            }
        }
    });
    //se carga el pdf de la factura si existe
    if(vm.nombreFacprovePdf()) {
        loadDoc(vm.nombreFacprovePdf());
    }
    if(data.noContabilizar == 1){
        $('#chkNoContabilizar').prop("checked", true);
    } else {
        $('#chkNoContabilizar').prop("checked", false);
    }
    //
    document.title = "FACTURA COLABORADOR: " + vm.numero();

    antNumFact = data.facproveId;
    if(!vm.antproveId()) {
        $('#btnDesVincularAnticipo').hide();
        $('#btnVincularAnticipo').show();
    }

    cargaTablaAnticiposAsociados(data.departamentoId);

    if (data.contabilizada == 1 && !usuario.puedeEditar) bloqueaEdicionCampos();
}


function datosOK() {
    $('#frmFactura').validate({
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
            txtFechaRecepcion: {
                greaterThan: "#txtFecha"
            },
            cmbFormasPago: {
                required: true
            },
            cmbContratos: {
                required: true
            },
            txtNumero: {
                rangelength: [1, 20]
            },
            cmbTiposOperacion: {
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
                rangelength: "El rango de digitos debe estar entre 1 y 20"
            },
            cmbTiposOperacion: {
                required: "Debe elegir un tipo de operacion"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmFactura").validate().settings;
    return $('#frmFactura').valid();
}

var aceptarFactura = function () {
    if (!datosOK()) return;

    eventSalir = false;
    if (!vm.total()) {
        vm.total('0');
        vm.totalCuota('0');
        vm.totalConIva('0');
        vm.restoPagar('0');
    }

    var data = generarFacturaDb();
    var ext;
    // caso alta
    var dataPdf;
    if(vm.file()){
        ext = vm.file().split('.').pop().toLowerCase();
        var dataPdf = {
            doc: {
                file: vm.file(),
                ext: ext
            }
        };
    };
    if(!vm.file() && vm.antiguoPdf()) {
        ext = vm.antiguoPdf().split('.').pop().toLowerCase();
        var dataPdf = {
            doc: {
                file: vm.nombreFacprovePdf(),
                oldFile: vm.antiguoPdf(),
                ext: ext
            }
        };
    }
    var verb = "POST";
    var url =  "/api/facturasProveedores";
    var returnUrl = "FacturaColaboradorDetalle.html?desdeContrato="+ desdeContrato+"&ContratoId="+ ContratoId +"&cmd=nueva&facproveId=";
    
    
    // caso modificación
    if (facproveId != 0) {
        verb = "PUT";
        url =  "/api/facturasProveedores/" + facproveId;
        returnUrl = "FacturaColaboradorGeneral.html?ConservaFiltro=true&facproveId=";
    }
    var datosArray = [];
    datosArray.push(data, dataPdf)
    llamadaAjax(verb, url, datosArray, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.facproveId();
        if(desdeContrato == "true" && facproveId != 0){
            window.open('ContratoDetalle.html?ContratoId='+ ContratoId +'&doc=true', '_self');
        }
        else{
            window.open(returnUrl, '_self');
        }
       
    });
}

var generarFacturaDb = function () {
    if($('#chkNoContabilizar').prop("checked")) {
        vm.noContabilizar(true);
    } else {
        vm.noContabilizar(false);
    }
    var data = {
        facprove: {
            "facproveId": vm.facproveId(),
            "numeroFacturaProveedor": vm.numero(),
            "numeroFacturaProveedor2": vm.numero2(),
            "numero": vm.numeroRef(),
            "fecha": spanishDbDate(vm.fecha()),
            "fecha_recepcion": spanishDbDate(vm.fechaRecepcion()),
            "fecha_recepcion2": spanishDbDate(vm.fechaRecepcion2()),
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
            "totalConIva": numeroDbf(vm.totalConIva()),
            "formaPagoId": vm.sformaPagoId(),
            "observaciones": vm.observaciones(),
            "coste": vm.coste(),
            "porcentajeAgente": vm.porcentajeAgente(),
            "porcentajeBeneficio": vm.porcentajeBeneficio(),
            "totalAlCliente": vm.importeAlCliente(),
            "periodo": vm.periodo(),
            "porcentajeRetencion": vm.porcentajeRetencion(),
            "importeRetencion": vm.importeRetencion(),
            "nombreFacprovePdf": vm.nombreFacprovePdf(),
            "ref": vm.ref(),
            "noContabilizar": vm.noContabilizar(),
            "departamentoId": vm.sdepartamentoId(),
            "restoPagar": numeroDbf(vm.restoPagar()),
            "conceptoAnticipo": vm.conceptoAnticipo(),
            "tipoOperacionId": vm.stipoOperacionId(),
            "enviadaCorreo": vm.enviadaCorreo(),
            "esColaborador": 1

        }
    };
    if(vm.stipoOperacionId() == 2) {
        data.facprove.totalConIva =  numeroDbf(vm.total());
    }
    return data;
}

function salir() {
    var mf = function () {
        if(EmpresaId != "" || desdeContrato == "true"){
            window.open('ContratoDetalle.html?ContratoId='+ ContratoId +'&doc=true', '_self');
        }else{
            var url = "FacturaColaboradorGeneral.html?ConservaFiltro=true";
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

function loadTiposOperacion(tipoOperacionId) {
    llamadaAjax("GET", "/api/facturasProveedores/tipo/operacion/factura", null, function (err, data) {
        if (err) return;
        var tipoOperacion = [{ tipoOperacionId: null, nombre: "" }].concat(data);
        vm.posiblesTiposOperacion(tipoOperacion);
        if(tipoOperacionId) vm.stipoOperacionId(tipoOperacionId);
        $("#cmbTiposOperacion").val([tipoOperacionId]).trigger('change');
    });
}


function loadEmpresaServiciadas(empresaId2) {
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
        var departamentos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        if(departamentoId) {
            vm.departamentoId(departamentoId);
            if(departamentoId == 7) {
                $('#prefacturas').show();
            } else {
                $('#prefacturas').hide();
            }
        }
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}
    


function cambioProveedor(proveedorId) {
    if (!proveedorId) return;
    llamadaAjax("GET", "/api/proveedores/" + proveedorId, null, function (err, data) {
        if (err) return;
        vm.emisorNif(data.nif);
        vm.emisorNombre(data.nombre);
        vm.emisorDireccion(data.direccion);
        vm.emisorCodPostal(data.codPostal);
        vm.emisorPoblacion(data.poblacion);
        vm.emisorProvincia(data.provincia);
        vm.emisorIban(data.IBAN);
        $('#txtProveedor').val(data.nombre);
        $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
        var numeroFact = $("#txtNumero").val();
        compruebaRepetido(numeroFact, proveedorId);
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
                facprove: {
                    fecha_recepcion: spanishDbDate(vm.fechaRecepcion()),
                    empresaId: data.empresaId

                }
            }
            llamadaAjax("POST", "/api/facturasProveedores/nueva/ref/cambio/empresa", data2, function (err, result) {
                if(err) return;
                if(result) {
                    vm.ref(result.ref);
                    vm.numeroRef(result.numero);
                    if(facproveId > 0 && vm.nombreFacprovePdf()) {
                        vm.nombreFacprovePdf(result.ref+'.pdf');
                    }
                }
            });
            
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
    llamadaAjax("GET", "/api/facturasProveedores/contrato/tipo/cliente/" + ContratoId, null, function (err, data) {
        vm.tipoClienteId(data[0].tipoCliente);
    });
}

function compruebaRepetido(numeroFact, proveedorId) {
    if(numeroFact.length > 0) {
       
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/proveedor/facturas/solapa/muestra/tabla/datos/factura/" +  proveedorId,
            dataType: "json",
            contentType: "application/json",
            data:null,
            success: function (data, status) {
                if(data) {
                    data.forEach( (f) => {
                        var num = f.numeroFacturaProveedor;
                        var ano = moment(spanishDbDate(vm.fecha())).year();
                        
                        if(num == numeroFact && f.facproveId != vm.facproveId() && ano == f.ano) {
                            mensError('Ya existe una factura con este numero para este proveedor');
                            $('#txtNumero').val(antNumFact);
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
    Funciones relacionadas con las líneas de facturas
--------------------------------------------------------------------*/

function nuevaLinea() {
    limpiaDataLinea();
    lineaEnEdicion = false;
    llamadaAjax("GET", "/api/facturasProveedores/nextlinea/" + vm.facproveId(), null, function (err, data) {
        vm.linea(data);
        
        recuperaParametrosPorDefecto();
    });
}

function limpiaDataLinea(data) {
    vm.facproveLineaId(0);
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
        facproveLinea: {
            facproveLineaId: vm.facproveLineaId(),
            linea: vm.linea(),
            facproveId: vm.facproveId(),
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
    var url =  "/api/facturasProveedores/lineas";
    if (lineaEnEdicion) {
        verbo = "PUT";
        url =  "/api/facturasProveedores/lineas/" + vm.facproveLineaId();
    }
    llamadaAjax(verbo, url, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        llamadaAjax("GET",  "/api/facturasProveedores/" + data.facproveId, null, function (err, data) {
            cmd = "";
            loadData(data);
            loadLineasFactura(data.facproveId);
            loadBasesFacprove(data.facproveId);
            loadRetencionesFacprove(data.facproveId);
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
                number: true
            },
            txtCantidad: {
                required: true
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
            txtCantidad: {
                required: 'Necesita una cantidad'
            },
            txtPrecio: {
                required: 'Necesita un precio'
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

function initTablaFacturasLineas() {
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
        data: dataFacproveLineas,
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
            data: "facproveLineaId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteFacturaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editFacturaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                // if (!vm.generada())
                //     html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if(vm.contabilizada() && !usuario.puedeEditar) bt1 = "";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    $('#txtDescripcion').focus();
    //
    vm.facproveLineaId(data.facproveLineaId);
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
    vm.facproveLineaId(0);
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



function loadTablaFacturaLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length == 0) {
        data = null;
        numLineas = 0
    }
    dt.fnClearTable();
    if (data != null) {
        dt.fnAddData(data);
        numLineas = data.length;
    }
    dt.fnDraw();
}


function loadLineasFactura(id) {
    llamadaAjax("GET", "/api/facturasProveedores/lineas/" + id, null, function (err, data) {
        if (err) return;
        var totalCoste = 0;
        dataLineas = data;
        data.forEach(function (linea) {
            totalCoste += (linea.coste * linea.cantidad);
            vm.totalCoste(numeral(totalCoste).format('0,0.00'));
        })
        loadTablaFacturaLineas(data);
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
    var url;
    url = "/api/grupo_articulo/departamento/" + vm.departamentoId();
    /*if(id) {
        url =  "/api/grupo_articulo";
    } else {
        url = "/api/grupo_articulo/departamento/" + vm.departamentoId();
    }*/
    llamadaAjax("GET", url, null, function (err, data) {
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
    llamadaAjax("GET", "/api/facturasProveedores/retenciones/tiposreten/facprove", null, function (err, data) {
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
        //vm.antCodigo()
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
        vm.importe(data.precioUnitario);
        if(vm.tipoOperacionId() == 2) {
            $("#cmbTiposIva").val([7]).trigger('change');
            cambioTiposIva(7);
            $("#cmbTiposIva").prop( "disabled", true);
        }  else {
            $("#cmbTiposIva").val([data.tipoIvaId]).trigger('change');
            cambioTiposIva(data.tipoIvaId);
            $("#cmbTiposIva").prop( "disabled", false);
        }
        $("#cmbUnidades").val([data.unidadId]).trigger('change');
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
    //comprobamos los tipos de retencion de la factura
    var acumulado = 0;
    var retSelec;
    llamadaAjax("GET","/api/facturasProveedores/retenciones/" + vm.facproveId(), null, function (err, datos) {
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
            mostratMnesajeTipoNoPermitido();
            vm.codigo(vm.antCodigo());
            vm.scodigo(vm.antCodigo());
            vm.cuentaRetencion(vm.antCuentaRetencion());
            $("#cmbTiposRetencion").val([vm.antCodigo()]).trigger('change');
            //loadTiposRetencion(codigo);
            return;
        }
        if(datos.length == 1 &&  vm.scodigo() != 0) {
            if(datos[0].codigoRetencion != 0 && datos[0].codigoRetencion != vm.scodigo()) {
                mostratMnesajeTipoNoPermitido();
                vm.codigo(vm.antCodigo());
                vm.scodigo(vm.antCodigo());
                vm.cuentaRetencion(vm.antCuentaRetencion());
                $("#cmbTiposRetencion").val([vm.antCodigo()]).trigger('change');
                //loadTiposRetencion(codigo);
                return;
            }
        }
        
        llamadaAjax("GET", "/api/facturasProveedores/retenciones/tiposreten/facprove/" + codigo, null, function (err, data) {
            if (err) return;
            vm.codigo(data.codigo);
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
    if(vm.antTotal()) {
        vm.total(vm.antTotal());
    }
}

var cambioPrecioCantidad = function () {
    
        vm.antTotal(vm.total()); //guardamos el total
    
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

function editFacturaLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/facturasProveedores/linea/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0) loadDataLinea(data[0]);
    });
}

function deleteFacturaLinea(facproveLineaId) {
    // mensaje de confirmación
    //var url =  "/api/facturasProveedores/lineas/con/parte/" + facproveLineaId;
    var url = "/api/facturasProveedores/lineas/" + facproveLineaId
    var mensaje = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mensaje, function () {
        var data = {
            facproveLinea: {
                facproveId: vm.facproveId(),
                departamentoId: vm.departamentoId()
            }
        };
        /*if(vm.departamentoId() != 7) {
            url = "/api/facturasProveedores/lineas/" + facproveLineaId
        }*/
        llamadaAjax("DELETE", url, data, function (err, data) {
            if (err) return;
            llamadaAjax("GET",  "/api/facturasProveedores/" + vm.facproveId(), null, function (err, data) {
                if (err) return;
                loadData(data);
                loadLineasFactura(data.facproveId);
                loadBasesFacprove(data.facproveId);
                loadRetencionesFacprove(data.facproveId);
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


function loadBasesFacprove(facproveId) {
    llamadaAjax("GET", "/api/facturasProveedores/bases/" + facproveId, null, function (err, data) {
        if (err) return;
        // actualizamos los totales
        var t1 = 0; // total sin iva
        var t2 = 0; // total con iva
        var t3 = 0; // tital cuotas
        for (var i = 0; i < data.length; i++) {
            t1 += data[i].base;
            t3 += data[i].cuota;
            var tipiOpera =  vm.stipoOperacionId();
            if(vm.stipoOperacionId() == 2) {
                t2 += data[i].base;
            } else {
                t2 += data[i].base + data[i].cuota;
            }
        }
        llamadaAjax("GET", "/api/facturasProveedores/retenciones/" + facproveId, null, function (err, dataBis) {
            if (err) return;
            for(var j = 0; j < dataBis.length; j++) {
                t2 = t2 - dataBis[j].importeRetencion;
            }
            vm.total(numeral(t1).format('0,0.00'));
            vm.totalCuota(numeral(t3).format('0,0.00'))
            vm.totalConIva(numeral(t2).format('0,0.00'));
            recalculaRestoPagar()
            loadTablaBases(data);
        });
    });
}

function recalculaRestoPagar() {
    var importeAnticipo = numeroDbf(vm.importeAnticipo());
    var importeFianza = numeroDbf(vm.fianza());
    var contado = numeroDbf(vm.contado());
    var totConIva =  numeroDbf(vm.totalConIva());
    var totSinImporteAnticipo = totConIva-importeAnticipo;
    var totalSinFian = totSinImporteAnticipo-importeFianza;
    var totalSinContado = totalSinFian - contado
    vm.restoPagar(numeral(totalSinContado).format('0,0.00'));

    //ACTUALIZAMOS LA FACTURA EN LA BASE DE DATOS
    var data = {
        facprove: {
            "facproveId": vm.facproveId(),
            "empresaId": vm.empresaId(),
            "proveedorId": vm.proveedorId(),
            "fecha": spanishDbDate(vm.fecha()),
            "importeAnticipo": importeAnticipo,
            "restoPagar": totalSinContado,
            "conceptoAnticipo": vm.conceptoAnticipo()
        }
    };
    var datosArray = [];
    datosArray.push(data)
    llamadaAjax("PUT", "/api/facturasProveedores/" + vm.facproveId(), datosArray, function (err, data) {
        if (err) return;
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


function loadRetencionesFacprove(facproveId) {
    llamadaAjax("GET", "/api/facturasProveedores/retenciones/" + facproveId, null, function (err, data) {
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
            llamadaAjax("POST", "/api/proveedores/activos/proveedores/todos/comerciales/?nombre="  + request.term, null, function (err, data) {
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


// initAutoProveedor
// inicializa el control del Proveedor como un autocomplete
var initAutoProveedorNif = function () {
    // incialización propiamente dicha
    $("#txtEmisorNif").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/proveedores/activos/proveedores/todos/colaboradores/por/nif/?nif=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nif,
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
    actualizarLineasDeLaFacturaTrasCambioCostes();
};

var guardarPorcentajes = function(){
    var data = {
        facprove: {
            facproveId: vm.facproveId(),
            empresaId: vm.empresaId(),
            proveedorId: vm.proveedorId(),
            fecha: spanishDbDate(vm.fecha()),
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente()
        }
    }
    if(vm.facproveId() === 0) return;

    llamadaAjax("PUT", "/api/facturasProveedores/"+vm.facproveId(), data, function (err, data) {
        if (err) return;
        return;
    });
}

var cambioCampoConRecalculoDesdeBeneficio = function () {
    recalcularCostesImportesDesdeBeneficio();
    actualizarLineasDeLaFacturaTrasCambioCostes();
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

var actualizarLineasDeLaFacturaTrasCambioCostes = function () {
    if (vm.totalLinea() === undefined || vm.facproveId() === 0) { 
        return;
    }else {
        var url =  "/api/facturasProveedores/recalculo/" + vm.facproveId() + '/' + vm.coste() + '/' + vm.porcentajeBeneficio() + '/' + vm.porcentajeAgente() + '/' + vm.tipoClienteId();
        
         llamadaAjax("PUT", url, null, function (err, data) {
             if (err) return;
             llamadaAjax("GET",  "/api/facturasProveedores/" + vm.facproveId(), null, function (err, data) {
                 loadLineasFactura(data.facproveId);
                 loadBasesFacprove(data.facproveId);
                 loadRetencionesFacprove(data.facproveId);
             });
         });
    }
    
};

var ocultarCamposPrefacturasGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var mostrarMensajeFacturaGenerada = function () {
    var mens = "Esta es una prefactura generada desde contrato. Aunque puede modificar sus valores plantéese si no seria mejor volver a generarla.";
    mensNormal(mens);
}

var mostrarMensajeFacturaNueva = function () {
    var mens = "Introduzca las líneas de la nueva factura en el apartado correspondiente";
    mensNormal(mens);
}

var mostratMnesajeTipoNoPermitido = function() {
    var mens = "Solo se permiten tipos de retencion exentos y otro tipo en una misma factura";
    mensNormal(mens);
}

var mostrarMensajeExito = function () {
    var mens = "Operación realizada con exito";
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
    printfacprove2(vm.facproveId());
}

function printPrefactura(id) {
    llamadaAjax("GET", "/api/informes/prefacturas/" + id, null, function (err, data) {
        if (err) return;
        informePDF(data);
    });
}

function printfacprove2(id) {
    var url = "InfFacturasProveedores.html?facproveId=" + id;
    window.open(url, "_new");
}

function informePDF(data) {
    var shortid = "HyGQ0yAP";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
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

//funciones de la pestaña de facturas en PDF

function loadDoc(filename) {
    var ext = filename.split('.').pop().toLowerCase();
    if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
        // see it in container
        var url = "/../../../ficheros/facturas_proveedores/" + filename;
        if (ext == "pdf") {
            // <iframe src="" width="100%" height="600px"></iframe>
            $("#docContainer").html('<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>');
        } else {
            // .html("<img src=' + this.href + '>");
            $("#docContainer").html('<img src="' + url + '" width="100%">');;
        }
        $("#msgContainer").html('');
    } else {
        $("#msgContainer").html('Vista previa no dispònible');
        $("#docContainer").html('');
    }
}


 function checkVisibility(filename) {
    var ext = filename.split('.').pop().toLowerCase();
    if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
        // see it in container
        var url = "/ficheros/uploads/" + filename;
        if (ext == "pdf") {
            // <iframe src="" width="100%" height="600px"></iframe>
            $("#docContainer").html('<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>');
        } else {
            // .html("<img src=' + this.href + '>");
            $("#docContainer").html('<img src="' + url + '" width="100%">');;
        }
        $("#msgContainer").html('');
    } else {
        $("#msgContainer").html('Vista previa no dispònible');
        $("#docContainer").html('');
    }
}

//---- SOLAPA EMPRESAS SERVICIADAS
function initTablaServiciadas() {
    tablaFacproves = $('#dt_serviciada').DataTable({
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
                    "sTitle": "Facturas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Facturas filtradas <i>(pulse Esc para cerrar)</i>",
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
            data: "facproveServiciadoId",
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
            data: "facproveServiciadoId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteServiciada(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalServiciado' onclick='editServiciada(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_serviciada thead th input[type=text]").on('keyup change', function () {
        tablaFacproves
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    
}


function loadServiciadasFacprove(facproveId) {
    llamadaAjax("GET", myconfig.apiUrl +  "/api/facturasProveedores/servicidas/facturas/proveedor/todas/" + facproveId, null, function (err, data) {
        if (err) return;
        for(var i = 0; i < data.length; i++){
            acumulado += parseFloat(data[i].importe);
        }
        numServiciadas = data.length;
        if(numServiciadas == 0) {
            mostrarMensajeCrearServiciadas();
        }
        setTimeout(function() {
            tot = parseFloat(numeroDbf(vm.total()));
            vm.importeServiciada(roundToTwo(tot-acumulado).toFixed(2));
            loadTablaServiciadas(data);
        }, 1000);
    });
}

function loadTablaServiciadas(data) {
    var dt = $('#dt_serviciada').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editServiciada(id) {
    llamadaAjax("GET", "/api/facturasProveedores/servicidas/facturas/proveedor/una/para/editar/"+ id, null, function (err, data) {
        if (err) return;
        importeModificar = data.importe;
        loadDataServiciadas(data)
    });
   
}

function loadDataServiciadas(data) {
    $('#chkCerrados').prop("checked", true);
    vm.facproveServiciadoId(data.facproveServiciadoId);
    vm.importeServiciada(data.importe);

    loadEmpresaServiciadas(data.empresaId);
    vm.scontratoId(data.contratoId);
    contratosCerrados();

}

function nuevaServiciada() {
    var imp;
    var tot;
    acumulado = 0;

    //recalculamos el acumulado de todas las empresas serviciadas de la factura
    llamadaAjax("GET", myconfig.apiUrl +  "/api/facturasProveedores/servicidas/facturas/proveedor/todas/" + facproveId, null, function (err, data) {
        if (err) return;
        for(var i = 0; i < data.length; i++){
            acumulado += parseFloat(data[i].importe);
        }
        acumulado = roundToTwo(acumulado);
        if(vm.facproveServiciadoId() != 0) {
            imp = acumulado - importeModificar + parseFloat(vm.importeServiciada());
            tot = parseFloat(numeroDbf(vm.total()));
        } else {
            imp = acumulado + parseFloat(vm.importeServiciada());
            tot = parseFloat(numeroDbf(vm.total()));
        }
    
        if( imp > tot){
            mostrarMensajeSmart('El total de la suma del importe de las empresas serviciadas supera al de la factura');
            return;
        }
        else if(!datosOKServiciada()){
            vm.importeServiciada(0);
            return;
        }
        var verb = "POST";
        var url =  '/api/facturasProveedores/nueva/serviciada';
        
        // caso modificación
        if (vm.facproveServiciadoId() != 0) {
           
    
            verb = "PUT";
            url =  "/api/facturasProveedores/serviciada/edita/" + vm.facproveServiciadoId();
            returnUrl = "FacturaColaboradorGeneral.html?ConservaFiltro=true&facproveId=";
            
        }
        var data = {
            facproveServiciada: {
                facproveId: vm.facproveId(),
                empresaId: vm.sempresaServiciadaId(),
                contratoId: vm.scontratoId(),
                importe: vm.importeServiciada()
            }
        }
        llamadaAjax(verb, url, data, function (err, data) {
            if (err) return;
            loadServiciadasFacprove(facproveId);
            $('#modalServiciado').modal('hide');
        });
        
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
                number: true
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
                number: "Debe introducir un numero válido"
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
    vm.facproveServiciadoId(0);
    vm.scontratoId(null);
    loadEmpresaServiciadas(vm.empresaId());
    loadServiciadasFacprove(facproveId);
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
                facproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturasProveedores/serviciada/factura/proveedor/" + id,
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
        loadServiciadasFacprove(facproveId);
    };
    return mf;
}


var mostrarMensajeCrearServiciadas = function () {
    var mens = "Es necesario crear empresas serviciadas para esta factura en la pestaña correspondinte";
    mensNormal(mens);
}

//FUNCIONES MODAL ANTICIPOS

function initTablaAnticipos() {
    tablaAnticipos = $('#dt_anticipos').DataTable({
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
        data: dataAnticipos,
        columns: [{
            data: "antproveId",
            render: function (data, type, row) {
                if(row.completo == 1) {
                    var html = '<label class="input">';
                    html += sprintf('<input id="radio%s" type="radio"  name="antGroup" value="%s">', data, data);
                    //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                    html += '</label>';
                    return html;
                } else {
                    var html = '<label class="input">';
                    html += sprintf('<input id="chk%s" type="checkbox" name="anticipos" value="'+data+'">', data, data);
                    //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                    html += '</label>';
                    return html;
                }
            }
        }, {
            data: "numeroAnticipoProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "totalConIva"
        },   {
            data: "vFPago"
        }]
    });
}

function loadTablaAnticipos(data) {
    var dt = $('#dt_anticipos').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function vinculaAnticipo() {
    if(vm.antproveId()) {
        mensError('No se puede vincular, esta factura ya tiene un anticipo completo');
        return;
    }
    if(comp) {
        vinculaAnticipoCompleto();
    } else {
        vinculaAnticiposIncompletos()
    }
}

function vinculaAnticipoCompleto() {
    //si opcion = false se desvincula un anticipo de la factura
    var id = $('input:radio[name=antGroup]:checked').val();
    if(!id) {
        mensError('No se ha elegido ningún anticipo');
        return;
    }
    //recuperas el anticipo seleccionado para saver si es completo o no
    llamadaAjax("GET",  "/api/anticiposProveedores/" + id, null, function (err, dato) {
        if (err) return;
        vm.antproveId(id);
        var datosArrayAnt = [];
        var datosArrayFact = [];
   
        var data = {
            antprove: {
                antproveId: vm.antproveId(),
                facproveId: vm.facproveId()
            }
    }   

        var data2 = {
            facprove: {
                antproveId: vm.antproveId(),
                facproveId: vm.facproveId(),
                empresaId: vm.sempresaId(),
                proveedorId: vm.sproveedorId(),
                fecha: spanishDbDate(vm.fecha()),
                conceptoAnticipo: dato.conceptoAnticipo,
                importeAnticipo: dato.totalConIva
            }
        }
    
        datosArrayAnt.push(data);
        datosArrayFact.push(data2);
        if(dato.completo == 1) {
            if(numLineas > 0) {
                mensError('Esta clase de anticipos por el total de la factura no tiene que tener lineas ni empresas serviciadas creadas.');
                return;
            }
            llamadaAjax("PUT", "/api/anticiposProveedores/"+ vm.antproveId(), datosArrayAnt, function (err, data) {
                if (err) return;
                llamadaAjax("PUT", "/api/facturasProveedores/"+ vm.facproveId(), datosArrayFact, function (err, data2) {
                    if (err) return;
                    if(data) {
                        $('#modalAnticipo').modal('hide');
                        vm.anticipo(data.numeroAnticipoProveedor);
                        vm.antproveId(data.antproveId);
                        $('#btnVincularAnticipo').hide();
                        $('#btnDesVincularAnticipo').show();
                         //INSERTAMOS LA LINEAS, BASES Y RETENCIONES DEL ANTICIPO EN LA FACTURA
                         llamadaAjax("POST",  "/api/facturasProveedores/inserta/desde/antprove/" + vm.antproveId() + "/" + vm.facproveId(), null, function (err, data) {
                            if(err) {
                                var datosArrayAnt = [];
                                var datosArrayFact = [];
           
                                var data = {
                                    antprove: {
                                        antproveId: vm.antproveId(),
                                        facproveId: null
                                    }
                                }
                        
                                var data2 = {
                                    facprove: {
                                        antproveId: null,
                                        facproveId: vm.facproveId(),
                                        empresaId: vm.sempresaId(),
                                        proveedorId: vm.sproveedorId(),
                                        fecha: spanishDbDate(vm.fecha())
                                    }
                                }
                            
                                datosArrayAnt.push(data);
                                datosArrayFact.push(data2);
        
                                llamadaAjax("PUT", "/api/anticiposProveedores/"+ vm.antproveId(), datosArrayAnt, function (err, data) {
                                    if (err) return;
                                    llamadaAjax("PUT", "/api/facturasProveedores/"+ vm.facproveId(), datosArrayFact, function (err, data2) {
                                        if (err) return;
                                        vm.anticipo('');
                                        vm.antproveId(null);
                                        $('#btnVincularAnticipo').show();
                                        $('#btnDesVincularAnticipo').hide();
                                    });
                                });
                            }
                            if(data) {
                                //window.open('FacturaProveedorDetalle.html?facproveId='+ vm.facproveId(), '_self');
                                
                                loadLineasFactura(vm.facproveId());
                                loadBasesFacprove(vm.facproveId());
                                loadRetencionesFacprove(vm.facproveId());
                                loadServiciadasFacprove(vm.facproveId());
                            }
                        });
                       
                    }
                });
            });
        } else {
            llamadaAjax("PUT", "/api/anticiposProveedores/"+ vm.antproveId(), datosArrayAnt, function (err, data) {
                if (err) return;
                llamadaAjax("PUT", "/api/facturasProveedores/"+ vm.facproveId(), datosArrayFact, function (err, data2) {
                    if (err) return;
                    if(data) {
                        $('#modalAnticipo').modal('hide');
                        window.open('FacturaColaboradorDetalle.html?facproveId='+ vm.facproveId(), '_self');
                        /*vm.anticipo(data.numeroAnticipoProveedor);
                        vm.antproveId(data.antproveId);
                        $('#btnVincularAnticipo').hide();
                        $('#btnDesVincularAnticipo').show();*/
                         
                       
                    }
                });
            });
        }
    });
}


function vinculaAnticiposIncompletos() {
    var impAnticipo = 0;
    var selected;
    var impFianza = parseFloat(vm.fianza());
    var impContado = parseFloat(vm.contado());
    var result = numeroDbf(vm.totalConIva());
    var id = []
    $('#dt_anticipos input[type=checkbox]').each(function(){
        if (this.checked) {
            selected = $(this).val();
            id.push(selected);
        }
    }); 
    if(id.length == 0) {
        mensError("No se ha elegido ningún anticipo");
        return;
    }
   
        var datosArrayAnt = [];
        id.forEach(function(f) {
            
            var  antProve = {
                    antproveId: f,
                    facproveId: vm.facproveId()
                }
        
            datosArrayAnt.push(antProve);
        })
       
        llamadaAjax("POST", "/api/anticiposProveedores/vincula/varios/", datosArrayAnt, function (err, data) {
            if (err) return;
            $('#modalAnticipo').modal('hide');
            llamadaAjax("GET", "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/completo/" + vm.proveedorId() + "/" +vm.facproveId() + "/" + vm.departamentoId(), null, function (err, anticipos) {
                if (err) return;
                //actualizamos la casilla importe anticipo con los totales de los anticipos vinculados
            anticipos.forEach(function(a) {
                impAnticipo += a.totalConIva;
            });

            if(impAnticipo > 0) {
                result = result - impAnticipo
                //vm.restoPagar(numeral(result).format('0,0.00'));
                vm.importeAnticipo(numeral(impAnticipo).format('0,0.00'));
                vm.conceptoAnticipo(anticipos[0].conceptoAnticipo);
            }
            if(impFianza > 0) {
                result = result - impFianza;
            }
            if(impContado > 0) {
                result = result - impContado
            }
            //ACTUALIZAMOS LA FACTURA EN LA BASE DE DATOS
            var data = {
                facprove: {
                    "facproveId": vm.facproveId(),
                    "empresaId": vm.empresaId(),
                    "proveedorId": vm.proveedorId(),
                    "fecha": spanishDbDate(vm.fecha()),
                    "importeAnticipo": impAnticipo,
                    "restoPagar": result,
                    "conceptoAnticipo": vm.conceptoAnticipo()
                }
            };
            var datosArray = [];
            datosArray.push(data)
            llamadaAjax("PUT", "/api/facturasProveedores/" + vm.facproveId(), datosArray, function (err, data) {
                if (err) return;
                loadTablaAnticiposAsociados(anticipos);//CARGAMOS LA TABLA
                recalculaRestoPagar();
            });
                
            });
        });
}

function desvinculaAnticipoCompleto() {
    if(vm.antproveId()) {
        var datosArrayAnt = [];
        var datosArrayFact = [];
   
        var data = {
            antprove: {
                antproveId: vm.antproveId(),
                facproveId: null
            }
        }

        var data2 = {
            facprove: {
                antproveId: null,
                facproveId: vm.facproveId(),
                empresaId: vm.sempresaId(),
                proveedorId: vm.sproveedorId(),
                fecha: spanishDbDate(vm.fecha()),
                conceptoAnticipo: null,
                importeAnticipo: 0

            }
        }
    
        datosArrayAnt.push(data);
        datosArrayFact.push(data2);

        //recuperas el anticipo seleccionado para saver si es completo o no
        llamadaAjax("GET",  "/api/anticiposProveedores/" + vm.antproveId(), null, function (err, dato) {
            if (err) return;
            if(dato.completo == 1) {
                // mensaje de confirmación
                 var mensaje = "¿Realmente desea desvincular este anticipo?";
                 mensajeAceptarCancelar(mensaje, function () {
            llamadaAjax("PUT", "/api/anticiposProveedores/"+ vm.antproveId(), datosArrayAnt, function (err, data) {
                if (err) return;
                llamadaAjax("PUT", "/api/facturasProveedores/"+ vm.facproveId(), datosArrayFact, function (err, data2) {
                    if (err) return;
                    if(data) {
                        mostrarMensajeExito();
                        vm.anticipo('');
                        vm.antproveId(null);
                        $('#btnVincularAnticipo').show();
                        $('#btnDesVincularAnticipo').hide();
                        llamadaAjax("DELETE",  "/api/facturasProveedores/borra/desde/antprove/" + vm.antproveId() + "/" + vm.facproveId(), null, function (err, data) {
                            if(err) return
                            if(data) {
                                //window.open('FacturaProveedorDetalle.html?facproveId='+ vm.facproveId(), '_self');
                                
                                loadLineasFactura(vm.facproveId());
                                loadBasesFacprove(vm.facproveId());
                                loadRetencionesFacprove(vm.facproveId());
                                loadServiciadasFacprove(vm.facproveId());
                            }
                        });
                       
                    }
                });
            });
    
                 }, function () {
                // cancelar no hace nada
                });
            } else {
                // mensaje de confirmación
                var mensaje = "¿Realmente desea desvincular este anticipo?";
                mensajeAceptarCancelar(mensaje, function () {
                    llamadaAjax("PUT", "/api/anticiposProveedores/"+ vm.antproveId(), datosArrayAnt, function (err, data) {
                        if (err) return;
                        llamadaAjax("PUT", "/api/facturasProveedores/"+ vm.facproveId(), datosArrayFact, function (err, data2) {
                            if (err) return;
                            if(data) {
                                window.open('FacturaColaboradorDetalle.html?facproveId='+ vm.facproveId(), '_self');
                                //mostrarMensajeExito();
                                //vm.anticipo('');
                                //vm.antproveId(null);
                                //$('#btnVincularAnticipo').show();
                                //$('#btnDesVincularAnticipo').hide();
                                // loadLineasFactura(vm.facproveId());
                                // loadBasesFacprove(vm.facproveId());
                                // loadRetencionesFacprove(vm.facproveId());
                                // loadServiciadasFacprove(vm.facproveId());
                            }
                        });
                    });
    
                }, function () {
                // cancelar no hace nada
                });
            }
        });
    }
}

function cargaTablaAnticipos(completo){
    comp = completo;
    if(comp) {
        var cantidad = numeroDbf(vm.importeAnticipo());
        if(cantidad > 0) {
            mensError('Ya existen anticipos vinculados');
            return;
        }
        llamadaAjax("GET",  "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/" + vm.proveedorId(), null, function (err, data2) {
            if (err) return;
            var result = [];
            if(data2) {
                if(data2.length > 0) {
                    data2.forEach(function (f) {
                        if(f.facproveId == null) {
                            result.push(f);
                        }
                    })
                }
                if(result.length > 0 && !vm.antproveId()) {
                    $("#modalAnticipo").modal({show: true});
                    loadTablaAnticipos(result);
                } else {
                    loadTablaAnticipos(null);
                }
            } else {
                loadTablaAnticipos(null);
            }
        })
    } else {
        llamadaAjax("GET",  "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/" + vm.proveedorId() + "/" + vm.departamentoId(), null, function (err, data2) {
            if (err) return;
            var result = [];
            if(data2) {
                if(data2.length > 0) {
                    data2.forEach(function (f) {
                        if(f.facproveId == null) {
                            result.push(f);
                        }
                    })
                }
                if(result.length > 0 && !vm.antproveId()) {
                    $("#modalAnticipo").modal({show: true});
                    loadTablaAnticipos(result);
                } else {
                    loadTablaAnticipos(null);
                }
            }
        })
    }
}


//FUNCIONES RELACIONADAS CON LOS ANTICIPOS ASOCIADOS

function initTablaAnticiposAsociados() {
    tablaAnticipos = $('#dt_anticiposAsociados').DataTable({
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
        data: dataAnticipos,
        columns: [{
            data: "antproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "numeroAnticipoProveedor"
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "totalConIva"
        },  {
            data: "vFPago"
        }, {
            data: "antproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='desvinculaAnticipoIncompleto(" + data + ");' title='Desvincular anticipo'> <i class='fa fa-trash-o fa-fw'></i> </button>";
               //var brecalculaRestoPagar = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 /*+ " " + brecalculaRestoPagar */+ "</div>";
                if(vm.contabilizada() && !usuario.puedeEditar) html = '';
                return html;
            }
        }]
    });
}

function cargaTablaAnticiposAsociados(departamentoId){
    llamadaAjax("GET",  "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/completo/" + vm.proveedorId() + "/"+ vm.facproveId() + "/" + departamentoId,null, function (err, data) {
        if (err) return;
        loadTablaAnticiposAsociados(data);
    })
}

function loadTablaAnticiposAsociados(data) {
    var dt = $('#dt_anticiposAsociados').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    anticipos = data;
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function desvinculaAnticipoIncompleto(anticipoId) {
    var impAnticipo = 0
    var impFianza = numeroDbf(vm.fianza());
    var result = numeroDbf(vm.totalConIva());
    llamadaAjax("DELETE", "/api/anticiposProveedores/desvincula/" + anticipoId, null, function (err, data) {
        if (err) return;
        //recperamos los anticipos que queden asociados y recalculamos
        llamadaAjax("GET", "/api/anticiposProveedores/proveedor/anticipos/solapa/muestra/tabla/datos/anticipo/incompleto/completo/" + vm.proveedorId() + "/" + vm.facproveId() + "/" + vm.departamentoId(), null, function (err, anticipos) {
            if (err) return;

            //actualizamos la casilla importe anticipo con los totales de los anticipos vinculados
            if(anticipos) { //si hay anticipos asociados
                anticipos.forEach(function(a) {
                    if(a.totalConIva > 0) {
                        impAnticipo += a.totalConIva;
                    }
                });
                if(impAnticipo > 0) {
                    result = result - impAnticipo
                    //vm.restoPagar(numeral(result).format('0,0.00'));
                    vm.importeAnticipo(numeral(impAnticipo).format('0,0.00'));
                    vm.conceptoAnticipo(anticipos[0].conceptoAnticipo);
                }
            } else {//SI NO HAY ANTICIPOS ASOCIADOS
                    vm.importeAnticipo(numeral(impAnticipo).format('0,0.00'));
                    vm.conceptoAnticipo('');
            }
            if(impFianza > 0) {
                result = result - impFianza;
            }
            
            //ACTUALIZAMOS LA FACTURA EN LA BASE DE DATOS
            var data = {
                facprove: {
                    "facproveId": vm.facproveId(),
                    "empresaId": vm.empresaId(),
                    "proveedorId": vm.proveedorId(),
                    "fecha": spanishDbDate(vm.fecha()),
                    "importeAnticipo": impAnticipo,
                    "restoPagar": result,
                    "conceptoAnticipo": vm.conceptoAnticipo()
                }
            };
            var datosArray = [];
            datosArray.push(data)
            llamadaAjax("PUT", "/api/facturasProveedores/" + vm.facproveId(), datosArray, function (err, data) {
                if (err) return;
                recalculaRestoPagar();
                loadTablaAnticiposAsociados(anticipos);//limpiamos la tabla
            });
        });
    });
}

function bloqueaEdicionCampos() {
    $('#cmbSeries').prop('disabled', true);
    $('#cmbDepartamentosTrabajo').prop('disabled', true);
    $('#cmbEmpresas').prop('disabled', true);
    //$('#cmbContratos').prop('disabled', true);
    $('#cmbFormasPago').prop('disabled', true);
    $("#frmFactura :input").prop('readonly', true);
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
    // 
    $('#btnVincularAnticipoIncompletos').hide();
    $('#btnVincularAnticipo').hide();
}



