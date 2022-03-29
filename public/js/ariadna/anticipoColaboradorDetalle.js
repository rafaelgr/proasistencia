/*-------------------------------------------------------------------------- 
preanticipoDetalle.js
Funciones js par la página AnticipoColaboradorDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var antcolId = 0;
var ContratoId = 0;
var EmpresaId = 0;
var ColaboradorId = 0;
var refWoId = 0;
var ruta;
var desdeContrato;
var acumulado = 0;
var tot;
var numServiciadas;
var importeModificar = 0;
var colaboradores;

var dataServiciadas;
var usuario;

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

  
    
    eventoCerrar();

    
    
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptarAnticipo);
    $("#btnSalir").click(salir());
    
    //$("#btnImprimir").click(imprimir);
    $("#frmAnticipo").submit(function () {
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

    
    // select2 things
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();
    $("#cmbEmpresas").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioEmpresa(e.added.id);
    });

    $("#txtNumero").on('change', function (e) {
        var numeroAnt = $("#txtNumero").val();
     
        compruebaRepetido(numeroAnt, vm.scomercialId());
    });

    // Ahora Colaborador en autocomplete
    initAutoColaborador();

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
   

    
    $('#txtTotalConIva').focus( function () {
        if(vm.contabilizada() && !usuario.puedeEditar) return;
        $('#txtTotalConIva').val('');
    })

    antcolId = gup('antcolId');
    cmd = gup("cmd");
    ContratoId = gup("ContratoId");
    EmpresaId = gup("EmpresaId");
    ColaboradorId = gup("ColaboradorId");
    desdeContrato = gup("desdeContrato");
    colaboradores = gup('Colaboradores');
  
    colaboradores = colaboradores.split(',');
    if(colaboradores.length == 1 && colaboradores[0] == "") colaboradores = null;
 

    if (antcolId != 0) {
        // caso edicion
        llamadaAjax("GET",  "/api/anticiposColaboradores/" + antcolId, null, function (err, data) {
            if (err) return;
            loadData(data);
            loadServiciadasAntprove(antcolId);
            $('#btnAltaServiciada').click(reiniciaValores);
           
        })
    } else {
        // caso alta
        vm.antcolId(0);
        vm.importeServiciada(0);
        
        vm.totalConIva(0);
        vm.sempresaId(EmpresaId);
        vm.scontratoId(ContratoId);
        vm.fecha(spanishDate(new Date()));//fecha  ofertada
       
        document.title = "NUEVO ANTICIPO COLABORADOR";
        if (EmpresaId != 0) {
            loadEmpresas(EmpresaId);
            cambioEmpresa(EmpresaId);
        }
        if (ColaboradorId != 0) {
            cargaColaborador(ColaboradorId);
            cambioColaborador(ColaboradorId);
        }
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
    self.antcolId = ko.observable();
    self.numero = ko.observable();
    self.fecha = ko.observable();
    self.fechaRecepcion = ko.observable();
    self.empresaId = ko.observable();
    self.comercialId = ko.observable();
    self.contratoId = ko.observable();
    self.noContabilizar = ko.observable();
    self.conceptoAnticipo = ko.observable();
    self.completo = ko.observable();
    self.emisorIban = ko.observable();
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
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesColaboradores = ko.observableArray([]);
    self.elegidosColaboradores = ko.observableArray([]);
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
    self.periodo = ko.observable();

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
    vm.antcolId(data.antcolId);
    vm.numero(data.numeroAnticipoColaborador);
    vm.fecha(spanishDate(data.fecha));
    vm.empresaId(data.empresaId);
    vm.departamentoId(data.departamentoId);
    vm.sdepartamentoId(data.departamentoId);
    vm.comercialId(data.comercialId);
    //vm.contratoId(data.contratoId);
    vm.totalConIva(data.totalConIva);
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
    

    //
    loadEmpresas(data.empresaId);
    loadDepartamentos(data.departamentoId);
   
    
    cargaColaborador(data.colaboradorId);
    loadFormasPago(data.formaPagoId);
    vm.observaciones(data.observaciones);
    //
    
    vm.periodo(data.periodo);
    if (cmd == "nueva") {
        mostrarMensajeAnticipoNueva();
    }
    
    document.title = "ANTICIPO COLABORADOR: " + vm.numero();

    antNumAnt = data.antcolId;
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
            cmbColaboradores: {
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
            cmbColaboradores: {
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
    var data = generarAnticipoDb();
    var ext;
    // caso alta
    
    var verb = "POST";
    var url =  "/api/anticiposColaboradores";
    var returnUrl = "AnticipoColaboradorDetalle.html?desdeContrato="+ desdeContrato+"&ContratoId="+ ContratoId +"&cmd=nueva&antcolId=";
   
    
    
    // caso modificación
    if (antcolId != 0) {
        verb = "PUT";
        url =  "/api/anticiposColaboradores/" + antcolId;
        returnUrl = "AnticipoColaboradorGeneral.html?antcolId=";
    }
    var datosArray = [];
    datosArray.push(data)
    llamadaAjax(verb, url, datosArray, function (err, data) {
        loadData(data);
        returnUrl = returnUrl + vm.antcolId();
        if(desdeContrato == "true" && antcolId != 0){
            window.open('ContratoDetalle.html?ContratoId='+ ContratoId +'&docAnt=true', '_self');
        }
        else{
            window.open(returnUrl, '_self');
        }
       
    });
}
var totConIva;
var generarAnticipoDb = function () {
  
    var data = {
        antcol: {
            "antcolId": vm.antcolId(),
            "numeroAnticipoColaborador": vm.numero(),
            "fecha": spanishDbDate(vm.fecha()),
            "empresaId": vm.sempresaId(),
            "colaboradorId": vm.scomercialId(),
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
            "departamentoId": vm.sdepartamentoId(),
            "conceptoAnticipo": vm.conceptoAnticipo(),
        }
    };
    return data;
}

function salir() {
    var mf = function () {
        
        if(EmpresaId != "" || desdeContrato == "true"){
            window.open('ContratoDetalle.html?ContratoId='+ ContratoId +'&docAnt=true', '_self');
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


function cambioColaborador(comercialId) {
    if (!comercialId) return;
    llamadaAjax("GET", "/api/comerciales/" + comercialId, null, function (err, data) {
        if (err) return;
        vm.emisorNif(data.nif);
        $('#txtColaborador').val(data.nombre);
        vm.scomercialId(data.comercialId);
        vm.emisorNombre(data.nombre);
        vm.emisorDireccion(data.direccion);
        vm.emisorCodPostal(data.codPostal);
        vm.emisorPoblacion(data.poblacion);
        vm.emisorProvincia(data.provincia);
        vm.emisorIban(data.IBAN);
        $("#cmbFormasPago").val([data.formaPagoId]).trigger('change');
        var numeroAnt = $("#txtNumero").val();
        compruebaRepetido(numeroAnt, comercialId);
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



function obrenerTipoClienteID(contratoId) {
    llamadaAjax("GET", "/api/anticiposColaboradores/contrato/tipo/cliente/" + ContratoId, null, function (err, data) {
        vm.tipoClienteId(data[0].tipoCliente);
    });
}

function compruebaRepetido(numeroAnt, comercialId) {
    if(numeroAnt.length > 0) {
       

    
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/anticiposColaboradores/colaborador/anticipos/solapa/muestra/tabla/datos/anticipo/" +  comercialId,
            dataType: "json",
            contentType: "application/json",
            data:null,
            success: function (data, status) {
                if(data) {
                    data.forEach( (f) => {
                        var num = f.numeroAnticipoColaborador;
                        
                        if(num == numeroAnt && f.antcolId != vm.antcolId()) {
                            mensError('Ya existe una anticipo con este numero para este colaborador');
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




    

// ----------- Funciones relacionadas con el manejo de autocomplete

// cargaColaborador
// carga en el campo txtColaborador el valor seleccionado
var cargaColaborador = function (id) {
    llamadaAjax("GET", "/api/comerciales/" + id, null, function (err, data) {
        if (err) return;
        $('#txtColaborador').val(data.nombre);
        vm.scomercialId(data.comercialId);
    });
};

// initAutoColaborador
// inicializa el control del Colaborador como un autocomplete
var initAutoColaborador = function () {
    // incialización propiamente dicha
    $("#txtColaborador").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/comerciales/activos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nombre,
                        id: d.comercialId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.scomercialId(ui.item.id);
            cambioColaborador(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("colaboradorNecesario", function (value, element) {
        var r = false;
        if (vm.scomercialId()) r = true;
        return r;
    }, "Debe seleccionar un Colaborador válido");
};



var cambioCampoConRecalculoDesdeCoste = function () {
    recalcularCostesImportesDesdeCoste();
    guardarPorcentajes();
    actualizarLineasDeLaAnticipoTrasCambioCostes();
};

var guardarPorcentajes = function(){
    var data = {
        antprove: {
            antcolId: vm.antcolId(),
            empresaId: vm.empresaId(),
            comercialId: vm.comercialId(),
            fecha: spanishDbDate(vm.fecha()),
            porcentajeBeneficio: vm.porcentajeBeneficio(),
            porcentajeAgente: vm.porcentajeAgente()
        }
    }
    if(vm.antcolId() === 0) return;

    llamadaAjax("PUT", "/api/anticiposColaboradores/"+vm.antcolId(), data, function (err, data) {
        if (err) return;
        return;
    });
}


var ocultarCamposPreanticiposGeneradas = function () {
    $('#btnAceptar').hide();
    $('#btnNuevaLinea').hide();
    // los de input para evitar que se lance 'onblur'
    $('#txtCoste').prop('disabled', true);
    $('#txtPorcentajeBeneficio').prop('disabled', true);
    $('#txtImporteBeneficio').prop('disabled', true);
    $('#txtPorcentajeAgente').prop('disabled', true);
}

var imprimir = function () {
    printantprove2(vm.antcolId());
}

function printPreanticipo(id) {
    llamadaAjax("GET", "/api/informes/preanticipos/" + id, null, function (err, data) {
        if (err) return;
        
    });
}

function printantprove2(id) {
    var url = "InfAnticiposColaboradores.html?antcolId=" + id;
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


function loadServiciadasAntprove(antcolId) {
    llamadaAjax("GET", myconfig.apiUrl +  "/api/anticiposColaboradores/servicidas/anticipos/colaborador/todas/" + antcolId, null, function (err, data) {
        if (err) return;
        for(var i = 0; i < data.length; i++){
            acumulado += parseFloat(data[i].importe);
        }
        numServiciadas = data.length;
        if(numServiciadas == 0) {
            mostrarMensajeCrearServiciadas();
        }
        setTimeout(function() {
            tot = parseFloat(vm.totalConIva());
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
    llamadaAjax("GET", "/api/anticiposColaboradores/servicidas/anticipos/colaborador/una/para/editar/"+ id, null, function (err, data) {
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
    var imp;
    var tot;
    acumulado = 0;

    //recalculamos el acumulado de todas las empresas serviciadas de la anticipo
    llamadaAjax("GET", myconfig.apiUrl +  "/api/anticiposColaboradores/servicidas/anticipos/colaborador/todas/" + antcolId, null, function (err, data) {
        if (err) return;
        for(var i = 0; i < data.length; i++){
            acumulado += parseFloat(data[i].importe);
        }
        acumulado = roundToTwo(acumulado);
        if(vm.antproveServiciadoId() != 0) {
            imp = acumulado - importeModificar + parseFloat(vm.importeServiciada());
            
        } else {
            imp = acumulado + parseFloat(vm.importeServiciada());
            tot = parseFloat(vm.totalConIva());
        }
    
        if( imp > tot){
            mostrarMensajeSmart('El total de la suma del importe de las empresas serviciadas supera al de la anticipo');
            return;
        }
        else if(!datosOKServiciada()){
            vm.importeServiciada(0);
            return;
        }
        var verb = "POST";
        var url =  '/api/anticiposColaboradores/nueva/serviciada';
        
        // caso modificación
        if (vm.antproveServiciadoId() != 0) {
           
    
            verb = "PUT";
            url =  "/api/anticiposColaboradores/serviciada/edita/" + vm.antproveServiciadoId();
            returnUrl = "AnticipoColaboradorGeneral.html?antcolId=";
            
        }
        var data = {
            antproveServiciada: {
                antcolId: vm.antcolId(),
                empresaId: vm.sempresaServiciadaId(),
                contratoId: vm.scontratoId(),
                importe: vm.importeServiciada()
            }
        }
        llamadaAjax(verb, url, data, function (err, data) {
            if (err) return;
            loadServiciadasAntprove(antcolId);
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
    loadServiciadasAntprove(antcolId);
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
                antcolId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/anticiposColaboradores/serviciada/anticipo/colaborador/" + id,
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
        loadServiciadasAntprove(antcolId);
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






