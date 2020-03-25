/*-------------------------------------------------------------------------- 
antClienDetalle.js
Funciones js par la página AnticipoClienteDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var antClienId = 0;
var cmd = "";

var lineaEnEdicion = false;

var dataAntCliensLineas;
var dataBases;
var dataCobros;
var usuario;
var usaCalculadora;
var antSerie = null;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    usuario = recuperarIdUsuario();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();

    eventoCerrar();

    vm = new admData();
    ko.applyBindings(vm);

    

    // asignación de eventos al clic
    $("#btnAceptar").click(aceptarAntClien);
    $("#btnSalir").click(salir());
    $("#btnImprimir").click(imprimir);
    $("#frmAntClien").submit(function () {
        return false;
    });

    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioEmpresa(e.added.id);
    });

    // Ahora cliente en autocomplete
    initAutoCliente();

    // select2 things
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
    
    antClienId = gup('AntClienId');
    cmd = gup("cmd");

    if (antClienId != 0) {
        // caso edicion
        llamadaAjax("GET", myconfig.apiUrl + "/api/anticiposClientes/" + antClienId, null, function (err, data) {
            if (err) return;
            loadData(data);
            $('#txtFecha').prop('disabled', true);
            
        })
    } else {
        // caso alta
        vm.antClienId(0);
        $("#btnImprimir").hide();
        document.title = "NUEVO ANTICIPO";
    }
}

function admData() {
    var self = this;
    self.antClienId = ko.observable();
    self.numeroAnticipoCliente = ko.observable();
    self.fecha = ko.observable();
    self.empresaId = ko.observable();
    self.clienteId = ko.observable();
    self.contratoId = ko.observable();
    self.tipoContratoId = ko.observable();
    self.departamento = ko.observable();
    self.departamentoId = ko.observable();
    self.serie = ko.observable();
    self.ano = ko.observable();
    self.numero = ko.observable();
    self.noContabilizar = ko.observable();
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
    self.conceptoAnticipo = ko.observable();
    //
    self.totalConIva = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
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
    self.scontratoId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
    self.observaciones = ko.observable();
    //
    self.observaciones = ko.observable();

    // Nuevo Total de coste para la antClien
    self.totalCoste = ko.observable();
    //
    
    self.periodo = ko.observable();
    // 
    self.tipoClienteId = ko.observable();
}

function loadData(data) {
    vm.antClienId(data.antClienId);
    vm.numeroAnticipoCliente(data.numeroAnticipoCliente);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.clienteId(data.clienteId);
    vm.contratoId(data.contratoId);
    vm.departamentoId(data.departamentoId);
    vm.serie(data.serie);
    vm.ano(data.ano);
    vm.numero(data.numero);
    antSerie = vm.serie();
    //
    vm.emisorNif(data.emisorNif);
    vm.emisorNombre(data.emisorNombre);
    vm.emisorCodPostal(data.emisorCodPostal);
    vm.emisorPoblacion(data.emisorPoblacion);
    vm.emisorProvincia(data.emisorProvincia);
    vm.emisorDireccion(data.emisorDireccion);
    //
    vm.receptorNif(data.receptorNif);
    vm.receptorNombre(data.receptorNombre);
    vm.receptorCodPostal(data.receptorCodPostal);
    vm.receptorPoblacion(data.receptorPoblacion);
    vm.receptorProvincia(data.receptorProvincia);
    vm.receptorDireccion(data.receptorDireccion);
    vm.conceptoAnticipo(data.conceptoAnticipo);
    vm.totalConIva(data.totalConIva);
    //
    loadEmpresas(data.empresaId);
    cargaCliente(data.clienteId);
    loadFormasPago(data.formaPagoId);
    loadContratos(data.contratoId);
    loadDepartamento(data.departamentoId);
    if(!data.contratoId)  obtenerDepartamentoContrato(null);
    vm.observaciones(data.observaciones); 
    vm.periodo(data.periodo);

    if(data.noContabilizar == 1){
        $('#chkNoContabilizar').prop("checked", true);
    } else {
        $('#chkNoContabilizar').prop("checked", false);
    }
    
    //
    document.title = "Anticipo: " + vm.numeroAnticipoCliente();
}


function datosOK() {
    $('#frmAntClien').validate({
        rules: {
            cmbEmpresas: {
                required: true
            },
            cmbClientes: {
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
              txtTotalConIva: {
                required: true,
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir un emisor"
            },
            cmbClientes: {
                required: 'Debe elegir un receptor'
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
            txtTotalConIva: {
                required: "debe de introducir una cantiad"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmAntClien").validate().settings;
    return $('#frmAntClien').valid();
}

var aceptarAntClien = function () {
    if (!datosOK()) return;


    eventSalir = false;
    
    if (!vm.totalConIva()) {
        vm.totalConIva('0');
    }
    var data = generarAntClienDb();

    // caso alta
    var verb = "POST";
    var url = myconfig.apiUrl + "/api/anticiposClientes";
    var returnUrl = "AnticipoClienteGeneral.html?AntClienId=";
    // caso modificación
    if (antClienId != 0) {
        verb = "PUT";
        url = myconfig.apiUrl + "/api/anticiposClientes/" + antClienId;
        var serie = vm.serie();
        if(antSerie == serie) {
            data.antClien.serie = null;
        }
    }

    llamadaAjax(verb, url, data, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.antClienId();
        window.open(returnUrl, '_self');
        if(!antSerie) {
            vm.serie(null);
        }
    });
}

var generarAntClienDb = function () {

    if($('#chkNoContabilizar').prop("checked")) {
        vm.noContabilizar(true);
    } else {
        vm.noContabilizar(false);
    }

     var data = {
        antClien: {
            "antClienId": vm.antClienId(),
            "numeroAnticipoCliente": vm.numeroAnticipoCliente(),
            "fecha": spanishDbDate(vm.fecha()),
            "empresaId": vm.sempresaId(),
            "clienteId": vm.sclienteId(),
            "contratoId": vm.scontratoId(),
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
            "totalConIva": vm.totalConIva(),
            "formaPagoId": vm.sformaPagoId(),
            "observaciones": vm.observaciones(),
            "periodo": vm.periodo(),
            "departamentoId": vm.departamentoId(),
            "conceptoAnticipo": vm.conceptoAnticipo(),
            "serie": vm.serie(),
            "noContabilizar": vm.noContabilizar()
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        var url = "AnticipoClienteGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
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
    var url = "/api/contratos/empresa-cliente/usuario/departamentos/" + vm.sempresaId() + "/" + vm.sclienteId()  + "/" + usuario;
    if (contratoId) url = "/api/contratos/uno/campo/departamento/" + contratoId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
        cargarContratos(data);
    });
}

var cargarContratos = function (data) {
    var contratos = [{ contratoId: 0, referencia: "" }].concat(data);
    vm.posiblesContratos(contratos);
    $("#cmbContratos").val([data.contratoId]).trigger('change');
}


function cambioCliente(clienteId) {
    if (!clienteId) return;
    llamadaAjax("GET", "/api/clientes/" + clienteId, null, function (err, data) {
        if (err) return;
        vm.receptorNif(data.nif);
        vm.receptorNombre(data.nombreComercial);
        vm.receptorDireccion(data.direccion);
        vm.receptorCodPostal(data.codPostal);
        vm.receptorPoblacion(data.poblacion);
        vm.receptorProvincia(data.provincia);
        vm.tipoClienteId(data.tipoClienteId);
        $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
        loadContratos();
    });
}

function cambioEmpresa(empresaId) {
    if (!empresaId) return;
    llamadaAjax("GET", "/api/empresas/" + empresaId, null, function (err, data) {
        vm.emisorNif(data.nif);
        vm.emisorNombre(data.nombre);
        vm.emisorDireccion(data.direccion);
        vm.emisorCodPostal(data.codPostal);
        vm.emisorPoblacion(data.poblacion);
        vm.emisorProvincia(data.provincia);
        loadContratos();
        //obtenerSerie(empresaId);
        vm.serie('ANT');
    });
}

function cambioContrato(contratoId) {
    if (!contratoId || contratoId == 0) return;
    obtenerValoresPorDefectoDelContratoMantenimiento(contratoId);
    obtenerDepartamentoContrato(contratoId);
}

function obtenerDepartamentoContrato(contratoId) {
    if(!contratoId) return;
    llamadaAjax("GET", "/api/departamentos/contrato/asociado/" + contratoId, null, function (err, data) {
        if (err) return;
        if(data) {
            //vm.departamento(data.nombre);
            vm.departamentoId(data.departamentoId);
            loadDepartamento(data.departamentoId);
        }
    });
}

function loadDepartamento(departamentoId) {
    if(!departamentoId) return;
        llamadaAjax("GET", "/api/departamentos/" + departamentoId, null, function (err, data) {
            if (err) return;
            if(data) {
                usaCalculadora = data.usaCalculadora;
                vm.departamento(data.nombre);
                if(data.departamentoId == 7) $('#contrato').hide();
                if(!data.usaCalculadora) {
                    $('#calculadora').hide();
                    vm.porcentajeAgente(0);
                    vm.porcentajeBeneficio(0);
                    obtenerDepartamentoContrato();
                }
            }

        });
}



// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id) {
    llamadaAjax("GET", "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.tipoClienteId(data.tipoClienteId);
    });
};

// initAutoCliente
// inicializa el control del cliente como un autocomplete
var initAutoCliente = function () {
    // incialización propiamente dicha
    $("#txtCliente").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/clientes/?nombre=" + request.term, null, function (err, data) {
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
            vm.sclienteId(ui.item.id);
            cambioCliente(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("clienteNecesario", function (value, element) {
        var r = false;
        if (vm.sclienteId()) r = true;
        return r;
    }, "Debe seleccionar un cliente válido");
};

var imprimir = function () {
    printAntClien2(vm.antClienId());
}

function printAntClien2(id) {
    var url = "InfAntCliens.html?antClienId=" + id;
    window.open(url, '_new');
}

function printAntClien(id) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + vm.empresaId(), null, function (err, empresa) {
        if (err) return;
        var shortid = "rJkSiTZ9g";
        if (empresa.infAntCliens) shortid = empresa.infAntCliens;
        var url = "/api/informes/anticiposClientes/" + id;
        if (shortid == "rJRv-UF3l" || shortid == "SynNJ46oe") {
            url = "/api/informes/anticiposClientes2/" + id;
        }
        llamadaAjax("GET", url, null, function (err, data) {
            if (err) return;
            informePDF(data, shortid);
        });
    });

}

function informePDF(data, shortid) {
    var infData = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", infData);
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

var obtenerValoresPorDefectoDelContratoMantenimiento = function (contratoId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/contratos/" + contratoId, null, function (err, data) {
        if (err) return;
        vm.contratoId(data.contratoId);
        vm.empresaId(data.empresaId);
    });
}

function obtenerSerie(empresaId) {
    if(!empresaId) return;
        llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + empresaId, null, function (err, data) {
            if(err) return;
            if(vm.serie) antSerie = vm.serie();
            vm.serie(data.seriePre);
        });
}



