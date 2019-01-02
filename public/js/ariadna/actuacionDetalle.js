/*-------------------------------------------------------------------------- 
actuacionDetalle.js
Funciones js par la pÃ¡gina ActuacionDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataLocales;
var dataActuaciones;
var actuacionId;
var localEnEdicion = false;
var cmd = "";

var breakpointDefinition = {
    tablet: 724,
    phone: 480
};

var actuacionId = 0;

function initForm() {
    comprobarLogin();
    
    
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignaciÃ³n de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmActuacion").submit(function () {
        return false;
    });

    

   

    $("#cmbEstadosPresupuesto").select2(select2Spanish());
    loadEstadosPresupuesto();
    //
    $("#cmbEstadosActuacion").select2(select2Spanish());
    loadEstadosActuacion();
    //
    $("#cmbRechazosPresupuesto").select2(select2Spanish());
    loadRechazosPresupuesto();
    //
   
    $("#cmbProveedores").select2(select2Spanish());
    loadProveedores();
   
    initAutoCliente();

    datePickerSpanish(); // see comun.js

    
    actuacionId = gup('ActuacionId');
    cmd = gup("cmd");

    if (actuacionId != 0) {
        var data = {
            actuacionId: actuacionId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/actuaciones/" + actuacionId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.actuacionId(0);
        vm.provincia('Madrid');
        loadEstadosActuacion();
        vm.fechaCreacion(moment(new Date()).format('DD/MM/YYYY'));
    }
}

function admData() {
    var self = this;
    self.actuacionId = ko.observable();
    self.servicioId = ko.observable();
    
    
    self.interna = ko.observable();
    self.notaAgente = ko.observable();
    self.notaProveedor = ko.observable();
    self.facturaIndividual = ko.observable();
    self.facturadaCliente = ko.observable();
    self.facturadaProveedor = ko.observable();
    
    self.fechaCreacion = ko.observable();
    self.fechaCierre = ko.observable();
    //
    self.estadoPresupuestoId = ko.observable();
    self.sestadoPresupuestoId = ko.observable();
    //
    self.posiblesEstadosPresupuesto = ko.observableArray([]);
    self.elegidosEstadosPresupuesto = ko.observableArray([]);
    //
    self.estadoActuacionId = ko.observable();
    self.sestadoActuacionId = ko.observable();
    //
    self.posiblesEstadosActuacion = ko.observableArray([]);
    self.elegidosEstadosActuacion = ko.observableArray([]);
    //
    self.rechazoPresupuestoId = ko.observable();
    self.srechazoPresupuestoId = ko.observable();
    //
    self.posiblesRechazosPresupuesto = ko.observableArray([]);
    self.elegidosRechazosPresupuesto = ko.observableArray([]);
    
    //
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();
    //
    self.posiblesProveedores = ko.observableArray([]);
    self.elegidosProveedores = ko.observableArray([]);

     //
     self.clienteId = ko.observable();
     self.sclienteId = ko.observable();
     //
     self.posiblesClientes = ko.observableArray([]);
     self.elegidosClientes = ko.observableArray([]);
}


function loadData(data) {
    vm.actuacionId(data.actuacionId);
    vm.proveedorId(data.proveedorId);
    vm.estadoActuacionId(data.estadoActuacionId);
    vm.estadoPresupuestoId(data.estadoPresupuestoId);
    vm.rechazoPresupuestoId(data.rechazoPresupuestoId);

    vm.clienteId(data.clienteId);
    vm.sclienteId(data.clienteId);
    
   
    vm.fechaCreacion(spanishDate(data.fechaActuacion));
    vm.fechaCierre(spanishDate(data.fechaPrevistaCierre));
   
    vm.interna(data.notaInterna);
    vm.notaAgente(data.notaAgente);
    vm.notaProveedor(data.notaProveedor);
    vm.facturaIndividual(data.facturaIndividual);
    vm.facturadaCliente(data.facturadaCliente);
    vm.facturadaProveedor(data.facturadaProveedor);

    //
    loadEstadosPresupuesto(data.estadoPresupuestoId);
    loadEstadosActuacion(data.estadoActuacionId);
    loadRechazosPresupuesto(data.rechazoPresupuestoId)
    loadProveedores(data.proveedorId);
    cargaCliente(data.clienteId);
}
    


function datosOK() {
    
    $('#frmActuacion').validate({
        rules: {
            
            
            txtFechaCreacion: {required: true}
           
        },
        // Messages for form validation
        messages: {
            
            txtFechaCreacion: {required: 'Deve introducir una fecha de creación'}

        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmActuacion').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        var cli = $('#txtCliente').val();
        if(cli == '')  vm.sclienteId(null);

        
        


        var data = {
            actuacion: {
                "actuacionId":  vm.actuacionId(),
                "servicioId": vm.servicioId(),
                "proveedorId": vm.sproveedorId(),

                "clienteId": vm.sclienteId(),
                "notaInterna": vm.intrerna(),
                "notaAgente": vm.notaAgente(),
                "facturaIndividual": vm.facturaIndividual(),
                
                "fechaCreacion": spanishDbDate(vm.fechaCreacion()),
            }
        };
        if (actuacionId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/actuaciones",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var returnUrl = "ActuacionDetalle.html?cmd=nueva&ActuacionId=" +  vm.actuacionId();
                    window.open(returnUrl, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/actuaciones/" + actuacionId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var returnUrl = "ActuacionGeneral.html?ActuacionId=" + vm.actuacionId();
                    window.open(returnUrl, '_self');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
                }
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "ActuacionGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadEstadosPresupuesto(estadoPresupuestolId) {
    llamadaAjax("GET", "/api/estados_presupuesto", null, function (err, data) {
        if (err) return;
        var estadosPresupuesto = [{ estadoPresupuestoId: 0, nombre: "" }].concat(data);
        vm.posiblesEstadosPresupuesto(estadosPresupuesto);
        $("#cmbEstadosPresupuesto").val([estadoPresupuestolId]).trigger('change');
    });
}

function loadEstadosActuacion(estadoActuacionId) {
    llamadaAjax("GET", "/api/estados_actuacion", null, function (err, data) {
        if (err) return;
        var estadosActuacion = [{ estadoActuacionId: 0, nombre: "" }].concat(data);
        vm.posiblesEstadosActuacion(estadosActuacion);
        $("#cmbEstadosActuacion").val([estadoActuacionId]).trigger('change');
    });
}

function loadRechazosPresupuesto(rechazoPresupuestoId) {
    llamadaAjax("GET", "/api/rechazos_presupuesto", null, function (err, data) {
        if (err) return;
        var rechazosPresupuestos = [{ rechazoPresupuestoId: 0, nombre: "" }].concat(data);
        vm.posiblesRechazosPresupuesto(rechazosPresupuestos);
        $("#cmbRechazosPresupuesto").val([rechazoPresupuestoId]).trigger('change');
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



function cambioCliente(clienteId) {
    if (!clienteId) return;

    llamadaAjax("GET", "/api/clientes/" + clienteId, null, function (err, data) {
        if(err) return;
        if(data) {
            //seperamos el numero de la direccion
            var cadenas = data.direccion2.split(',');

            vm.calle(cadenas[0]);
            vm.numero(cadenas[1]);
            vm.poblacion(data.poblacion2);
            vm.codPostal(data.codPostal2);
            vm.provincia(data.provincia2);
        }
    });
}


//autocomplete

// cargaCliente
// carga en el campo txtCliente el valor seleccionado
var cargaCliente = function (id) {
    if(!id) {
        vm.clienteId("");
    } else {
        llamadaAjax("GET", "/api/clientes/" + id, null, function (err, data) {
            if (err) return;
            $('#txtCliente').val(data.nombre);
            vm.clienteId(data.clienteId);
        });
    }
};



var initAutoCliente = function (id) {
    if(!id) {
        id = 0;
    }
    var url = "/api/clientes/?nombre=";
    llamadaAjax("GET",  '/api/clientes/agente/' + id, null, function (err, dataUno) {
        if (err) return;
        // incializaciÃ³n propiamente dicha
        $("#txtCliente").autocomplete({
            source: function (request, response) {
                if(dataUno.length > 0 && id != 0) {
                    url = "/api/clientes/agente/cliente/" + request.term + "/" + id;
                } else {
                    url = "/api/clientes/?nombre=" + request.term;
                }
                // call ajax
                llamadaAjax("GET", url, null, function (err, data) {
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
                //cambioCliente(ui.item.id);
            }
        });
        // regla de validaciÃ³n para el control inicializado
        jQuery.validator.addMethod("clienteNecesario", function (value, element) {
            var r = false;
            if (vm.sclienteId()) r = true;
            return r;
        }, "Debe seleccionar un cliente vÃ¡lido");
        
    });
    
};



