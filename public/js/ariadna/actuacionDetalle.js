/*-------------------------------------------------------------------------- 
actuacionDetalle.js
Funciones js par la pÃ¡gina ActuacionDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataLocales;
var dataReparaciones;
var actuacionId;
var localEnEdicion = false;
var DesdeGeneral = "";

var breakpointDefinition = {
    tablet: 724,
    phone: 480
};

var actuacionId = 0;
var servicioId = 0;

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
    $("#btnAlta").click(crearReparacion());

    $("#frmActuacion").submit(function () {
        return false;
    });

    $("#frmNuevo").submit(function () {
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

    initTablaReparaciones();

    datePickerSpanish(); // see comun.js

    
    actuacionId = gup('ActuacionId');
    DesdeGeneral = gup("DesdeGeneral");
    servicioId = gup('ServicioId');

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
                loadReparacionesDeActuacion(actuacionId);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.actuacionId(0);
        vm.servicioId(servicioId);
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
    vm.servicioId(data.servicioId)
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
            
            txtCliente: {required: true},
            txtFechaCreacion: {required: true},
            cmbProveedores: { required: true}
           
        },
        // Messages for form validation
        messages: {
            txtCliente: {required: 'Debe introducir un cliente'},
            txtFechaCreacion: {required: 'Debe introducir una fecha de creación'},
            cmbProveedores: { required: 'Debe introducir un proveedor'}

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
                "estadoActuacionId": vm.sestadoActuacionId(),
                "estadoPresupuestoId": vm.sestadoPresupuestoId(),
                "rechazoPresupuestoId": vm.srechazoPresupuestoId(),
                "notaInterna": vm.interna(),
                "notaAgente": vm.notaAgente(),
                "notaProveedor": vm.notaProveedor(),
                "facturaIndividual": vm.facturaIndividual(),
                "facturadaCliente":  vm.facturadaCliente(),
                "facturadaProveedor":vm.facturadaProveedor(),
                "fechaActuacion": spanishDbDate(vm.fechaCreacion()),
                "fechaPrevistaCierre": spanishDbDate(vm.fechaCierre()),

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
                    var returnUrl = "ServicioDetalle.html?ServicioId=" +  vm.servicioId();
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
                    var returnUrl = "ServicioDetalle.html?ServicioId=" + vm.servicioId();
                    if(DesdeGeneral == 'true') {
                        returnUrl = "ActuacionGeneral.html?ActuacionId=" + vm.actuacionId();
                    }
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
        var url = "ServicioDetalle.html?ServicioId=" + vm.servicioId();
        if(DesdeGeneral == 'true') {
            url = "ActuacionGeneral.html";
        }
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

//---- SOLAPA REPARACIONES
function initTablaReparaciones() {
    tablaReparaciones = $('#dt_reparacion').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [{
                "sExtends": "pdf",
                "sTitle": "Reparaciones Seleccionadas",
                "sPdfMessage": "proasistencia PDF Export",
                "sPdfSize": "A4",
                "sPdfOrientation": "landscape",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "copy",
                "sMessage": "Reparaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "csv",
                "sMessage": "Reparaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "xls",
                "sMessage": "Reparaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "print",
                "sMessage": "Reparaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_reparacion'), breakpointDefinition);
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
                last: "último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataReparaciones,
        columns: [ {
            data: "reparacionId"
        },{
            data: "actuacionId"
        },{
            data: "articulo"
        }, {
            data: "fechaReparacion",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "importeCliente",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        }, {
            data: "tarifaCliNombre"
        }, {
            data: "importeProveedor",
            render: function (data, type, row) {
                return numeral(data).format('0,0.00');
                
            }
        }, {
            data: "tarifaProNombre"
        },  {
            data: "reparacionId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteReparacion(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editReparacion(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_actuacion thead th input[type=text]").on('keyup change', function () {
        tablaReparaciones
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

}

function loadReparacionesDeActuacion(actuacionId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/reparaciones/actuaciones/" + actuacionId, null, function (err, data) {
        if (err) return;
        loadTablaReparaciones(data);
    });
}

function loadTablaReparaciones(data) {
    var dt = $('#dt_reparacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function deleteReparacion(id) {
    // mensaje de confirmaciÃ³n
    var mens = "Â¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                actuacionId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/reparaciones/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadReparacionesDelServicio(vm.servicioId());
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editReparacion(id) {
    var url = "ReparacionDetalle.html?ReparacionId=" + id+"&ActuacionId="+vm.actuacionId();
    window.open(url, '_new');
}

function crearReparacion() {
    var mf = function () {
        var url = "ReparacionDetalle.html?ReparacionId=0&ActuacionId="+vm.actuacionId();
        window.open(url, '_self');
    };
    return mf;
}



