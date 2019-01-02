/*-------------------------------------------------------------------------- 
servicioDetalle.js
Funciones js par la pÃ¡gina ServicioDetalle.html
---------------------------------------------------------------------------*/

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataLocales;
var dataActuaciones;
var servicioId;
var localEnEdicion = false;
var cmd = "";

var breakpointDefinition = {
    tablet: 724,
    phone: 480
};

var servicioId = 0;

function initForm() {
    comprobarLogin();
    var user = JSON.parse(getCookie("usuario"));
    
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignaciÃ³n de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#btnAlta").click(crearActuacion());


    $("#frmServicio").submit(function () {
        return false;
    });


    $("#frmLocales").submit(function () {
        return false;
    });

    $("#localAfectado-form").submit(function () {
        return false;
    });

    $("#frmNuevo").submit(function () {
        return false;
    });

    $("#cmbTipoProfesional").select2(select2Spanish());
    loadTiposProfesionales();
    //
    $("#cmbUsuarios").select2(select2Spanish());
    loadUsuarios();
    //
    $("#cmbAgentes").select2(select2Spanish());
    loadAgentes();
    $("#cmbAgentes").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));
        if (e.added) cambioAgente(e.added.id);
    });
    $('#cmbDeDia').select2(select2Spanish());
    
    $('#cmbADia').select2(select2Spanish());

    initAutoCliente();

    datePickerSpanish(); // see comun.js
   
    initTablaLocalesAfectados();

    initTablaActuaciones();
    
    servicioId = gup('ServicioId');
    cmd = gup("cmd");

    if (servicioId != 0) {
        var data = {
            servicioId: servicioId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/servicios/" + servicioId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                buscarTodosLocalesAfectados(servicioId);
                loadActuacionesDelServicio(servicioId);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.servicioId(0);
        vm.provincia('Madrid');
        loadUsuarios(user.usuarioId);
        vm.fechaCreacion(moment(new Date()).format('DD/MM/YYYY'));
        $('#LocalesAfectados').hide();
    }
}

function admData() {
    var self = this;
    self.servicioId = ko.observable();
   
    self.calle = ko.observable();
    self.numero = ko.observable();
    self.poblacion = ko.observable();
    self.codPostal = ko.observable();
    self.provincia = ko.observable();
    
    self.descripcion = ko.observable();
    self.notasPrivadas = ko.observable();
    self.autorizacion = ko.observable();
    
    self.fechaCreacion = ko.observable();
    //
    self.tipoProfesionalId = ko.observable();
    self.stipoProfesionalId = ko.observable();
    //
    self.posiblesTiposProfesionales = ko.observableArray([]);
    self.elegidosTiposProfesionales = ko.observableArray([]);

    //
    self.usuarioId = ko.observable();
    self.susuarioId = ko.observable();
    //
    self.posiblesUsuarios = ko.observableArray([]);
    self.elegidosUsuarios = ko.observableArray([]);

    //
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);

     //
     self.clienteId = ko.observable();
     self.sclienteId = ko.observable();
     //
     self.posiblesClientes = ko.observableArray([]);
     self.elegidosClientes = ko.observableArray([]);

     //MODAL LOCALES AFECTADOS

     self.localAfectadoId = ko.observable();
     self.localAfectado = ko.observable();
     self.personaContacto = ko.observable();
     self.telefono1 = ko.observable();
     self.telefono2 = ko.observable();
     self.correoElectronico = ko.observable();
     self.deHoraAtencion = ko.observable();
     self.aHoraAtencion = ko.observable();
     self.deHoraAtencion2 = ko.observable();
     self.aHoraAtencion2 = ko.observable();
     self.cargo = ko.observable();
     self.comentarios = ko.observable();
     //
     self.posiblesDeDias = ko.observableArray([
        {
            'deDiaNombre': '',
            'deDiaSemana': ' '
        },
        {
            'deDiaNombre': 'Lunes',
            'deDiaSemana': 'Lunes'
        }, 
        {
            'deDiaNombre': 'Martes',
            'deDiaSemana': 'Martes'
        },
        {
            'deDiaNombre': 'Miercoles',
            'deDiaSemana': 'Miercoles'
        }, 
        {
            'deDiaNombre': 'Jueves',
            'deDiaSemana': 'Jueves'
        }, 
        {
            'deDiaNombre': 'Viernes',
            'deDiaSemana': 'Viernes'
        }, 
        {
            'deDiaNombre': 'Sabado',
            'deDiaSemana': 'Sabado'
        }, 
        {
            'deDiaNombre': 'Domingo',
            'deDiaSemana': 'Domingo'
        }
    ]);
    self.deDiaSemana = ko.observable();
     self.sdeDiaSemana = ko.observable();
     //
     self.elegidosDeDias = ko.observableArray([]);

     //

     self.posiblesADias = ko.observableArray([
        {
            'aDiaNombre': '',
            'aDiaSemana': ' '
        },
       
        {
            'aDiaNombre': 'Lunes',
            'aDiaSemana': 'Lunes'
        }, 
        {
            'aDiaNombre': 'Martes',
            'aDiaSemana': 'Martes'
        },
        {
            'aDiaNombre': 'Miercoles',
            'aDiaSemana': 'Miercoles'
        }, 
        {
            'aDiaNombre': 'Jueves',
            'aDiaSemana': 'Jueves'
        }, 
        {
            'aDiaNombre': 'Viernes',
            'aDiaSemana': 'Viernes'
        }, 
        {
            'aDiaNombre': 'Sabado',
            'aDiaSemana': 'Sabado'
        }, 
        {
            'aDiaNombre': 'Domingo',
            'aDiaSemana': 'Domingo'
        }
    ]);
    self.aDiaSemana = ko.observable();
     self.saDiaSemana = ko.observable();
     //
     self.elegidosADias = ko.observableArray([]);
    
}


function loadData(data) {
    vm.servicioId(data.servicioId);
    vm.usuarioId(data.usuarioId);
    vm.comercialId(data.agenteId);
    vm.clienteId(data.clienteId);
    vm.sclienteId(data.clienteId);
    vm.tipoProfesionalId(data.tipoProfesionalId);
    vm.calle(data.calle);
    vm.numero(data.numero);
    vm.poblacion(data.poblacion);
    vm.codPostal(data.codPostal);
    vm.provincia(data.provincia);
   
    vm.fechaCreacion(spanishDate(data.fechaCreacion));
   
    vm.descripcion(data.descripcion);
    vm.notasPrivadas(data.notasPrivadas);
    vm.autorizacion(data.autorizacion);

    //
    loadTiposProfesionales(data.tipoProfesionalId);
    loadUsuarios(data.usuarioId);
    loadAgentes(data.agenteId);
    
   
    cargaCliente(data.clienteId);
    if(data.comercialId) {
        initAutoCliente(data.comercialId)
    }

    if (cmd == "nueva") {
        mostrarMensajeServicioNuevo();
        cmd = "";
    }
   
}
    


function datosOK() {
    
    $('#frmServicio').validate({
        rules: {
            txtDescripcion: { 
                required: true
            },
            txtCalle: {required: true},
            txtNumero: {required: true},
            txtPoblacion: {required: true},
            txtProvincia: {required: true},
            txtFechaCreacion: {required: true}
           
        },
        // Messages for form validation
        messages: {
            txtDescripcion: { required: 'Deve introducir una descripciÃ³n'},
            txtCalle: {required: 'Requerido'},
            txtNumero: {required: 'Requerido'},
            txtPoblacion: {required: 'Debe introducir una poblaciÃ³n'},
            txtProvincia: {required: 'Debe introducir una provincia'},
            txtLocalAfectado: {required: 'Debe introducir un local'},
            txtPersonaContacto: {required: 'Debe intoducir una persona  de contacto'},
            txtTelefono1: {required: 'Necesita un telefono'},
            txtFechaCreacion: {required: 'Deve introducir una fecha de creaciÃ³n'}

        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmServicio').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        var cli = $('#txtCliente').val();
        if(cli == '')  vm.sclienteId(null);

        if(vm.susuarioId() == "0") vm.susuarioId(null);
        if(vm.scomercialId() == "0") vm.scomercialId(null);
        if(vm.sclienteId() == undefined || vm.sclienteId() == "   ") vm.sclienteId(null);
        if(vm.stipoProfesionalId() == "0") vm.stipoProfesionalId(null);


        var data = {
            servicio: {
                "servicioId":  vm.servicioId(),
                "usuarioId": vm.susuarioId(),
                "agenteId": vm.scomercialId(),
                "clienteId": vm.sclienteId(),
                "tipoProfesionalId": vm.stipoProfesionalId(),
                "calle": vm.calle(),
                "numero": vm.numero(),
                "poblacion": vm.poblacion(),
                "codpostal": vm.codPostal(),
                "provincia": vm.provincia(),
                
                "descripcion": vm.descripcion(),
                "notasPrivadas": vm.notasPrivadas(),
                "autorizacion": vm.autorizacion(),
                
                "fechaCreacion": spanishDbDate(vm.fechaCreacion()),
            }
        };
        if (servicioId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/servicios",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var returnUrl = "ServicioDetalle.html?cmd=nueva&ServicioId=" +  vm.servicioId();
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
                url: myconfig.apiUrl + "/api/servicios/" + servicioId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var returnUrl = "ServicioGeneral.html?ServicioId=" + vm.servicioId();
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
        var url = "ServicioGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadTiposProfesionales(tipoProfesionalId) {
    llamadaAjax("GET", "/api/tipos_profesional", null, function (err, data) {
        if (err) return;
        var profesional = [{ tipoProfesionalId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposProfesionales(profesional);
        $("#cmbTipoProfesional").val([tipoProfesionalId]).trigger('change');
    });
}

function loadUsuarios(usuarioId) {
    llamadaAjax("GET", "/api/usuarios", null, function (err, data) {
        if (err) return;
        var usuarios = [{ usuarioId: 0, nombre: "" }].concat(data);
        vm.posiblesUsuarios(usuarios);
        $("#cmbUsuarios").val([usuarioId]).trigger('change');
    });
}

function loadAgentes(agenteId) {
    llamadaAjax("GET", "/api/comerciales", null, function (err, data) {
        if (err) return;
        var agentes = [{ comercialId: 0, nombre: "" }].concat(data);
        vm.posiblesComerciales(agentes);
        $("#cmbAgentes").val([agenteId]).trigger('change');
    });
}


function loadComboDeDia(deDia){
    if(!deDia) {
        $("#cmbDeDia").val('').trigger('change');
    } else {
        $("#cmbDeDia").val([deDia.deDiaSemana]).trigger('change');
    }
    //$("#cmbDeDia option[value="+ deDia.deDiaSemana+"]").attr("selected",true).trigger('change');    
}



function loadComboADia(aDia){
    if(!aDia) {
        $("#cmbADia").val('').trigger('change');
    } else {
        $("#cmbADia").val([aDia.aDiaSemana]).trigger('change');
    }
    //$("#cmbADia option[value="+ aDia.aDiaSemana+"]").attr("selected",true).trigger('change');    
}


function cambioAgente(agenteId) {
    if (!agenteId) return;

    initAutoCliente(agenteId);
    //limpiamos los campos relacioneados con el agente cambiado
    $('#txtCliente').val('');
    vm.calle('');
    vm.numero('');
    vm.poblacion('');
    vm.codPostal('');
    vm.provincia('');
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
                cambioCliente(ui.item.id);
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

var mostrarMensajeServicioNuevo = function () {
    var mens = "Introduzca los locales afectados del nuevo servicio en el apartado correspondiente";
    mensNormal(mens);
}

//funciones relacionadas con los locales afectados

function initTablaLocalesAfectados() {
    tablaCarro = $('#dt_locales').DataTable({
        autoWidth: true,
        "columnDefs": [
            { "width": "20%", "targets": 0 },
            { "width": "13%", "targets": 3 },
            { "width": "8%", "targets": 6 },

          ],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_locales'), breakpointDefinition);
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
            emptyTable: "NingÃºn dato disponible en esta tabla",
            paginate: {
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ãšltimo"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataLocales,
        columns: [{
            data: "local"
        }, {
            data: "personaContacto"
        }, {
            data: "cargo"
        }, {
            data: "telefono1"
        }, {
            data: "correoElectronico"
        }, {
            data: "comentarios"
        }, {
            data: "localAfectadoId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteLocalAfectado(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLocalAfectado' onclick='editLocalAfectado(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                // if (!vm.generada())
                //     html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}



function loadTablaLocalesAfectados(data) {
    var dt = $('#dt_locales').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}


function buscarLocalesAfectados() {
    var mf = function () {
        /*if (!datosOK()) {
            return;
        }*/
        // obtener el n.serie del certificado para la firma.
       // var aBuscar = $('#txtBuscar').val();
        // enviar la consulta por la red (AJAX)
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/locales_afectados",
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadTablaLocalesAfectados(data);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo mÃ¡s que hacer lo haremos aquÃ­.
                }
        });
    };
    return mf;
}

 function buscarTodosLocalesAfectados(id){
    var url = myconfig.apiUrl + "/api/locales_afectados/servicio/" + id;
    llamadaAjax("GET",url, null, function(err, data){
        loadTablaLocalesAfectados(data);
    });
}

function editLocalAfectado(id) {
    localEnEdicion = true;
    llamadaAjax("GET", "/api/locales_afectados/" + id, null, function (err, data) {
        if (err) return;
        if (data)  loadDataLocalAfectado(data);
    });
}

function deleteLocalAfectado(localAfectadoId) {
    // mensaje de confirmaciÃ³n
    var mens = "Â¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            localAfectado: {
                localAfectadoId: localAfectadoId
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/locales_afectados/" + localAfectadoId, data, function (err, data) {
            if (err) return;
            buscarTodosLocalesAfectados(servicioId);
        });
    }, function () {
        // cancelar no hace nada
    });
}

function loadDataLocalAfectado(data) {
    vm.localAfectadoId(data.localAfectadoId);
    vm.localAfectado(data.local);
    vm.personaContacto(data.personaContacto);
    vm.telefono1(data.telefono1);
    vm.telefono2(data.telefono2);
    vm.correoElectronico(data.correoElectronico);
    vm.deHoraAtencion(data.deHoraAtencion);
    vm.aHoraAtencion(data.aHoraAtencion);
    vm.deHoraAtencion2(data.deHoraAtencion2);
    vm.aHoraAtencion2(data.aHoraAtencion2);
    vm.cargo(data.cargo);
    vm.comentarios(data.comentarios);
    //
    loadComboDeDia(data);
    loadComboADia(data);

}
function limpiarLocalAfectado() {
    vm.localAfectadoId(null);
    vm.localAfectado(null);
    vm.personaContacto(null);
    vm.telefono1(null);
    vm.telefono2(null);
    vm.correoElectronico(null);
    vm.deHoraAtencion(null);
    vm.aHoraAtencion(null);
    vm.deHoraAtencion2(null);
    vm.aHoraAtencion2(null);
    vm.cargo(null);
    vm.comentarios(null);
}

function aceptarLocalAfectado() {
    if (!datosOKLocalAfectado()) {
        return;
    }
    var data = {
        localAfectado: {
            servicioId: vm.servicioId(),
            localAfectadoId: vm.localAfectadoId(),
            local: vm.localAfectado(),
            personaContacto: vm.personaContacto(),
            telefono1: vm.telefono1(),
            telefono2: vm.telefono2(),
            correoElectronico: vm.correoElectronico(),
            deHoraAtencion: vm.deHoraAtencion(),
            aHoraAtencion: vm.aHoraAtencion(),
            deHoraAtencion2: vm.deHoraAtencion2(),
            aHoraAtencion2: vm.aHoraAtencion2(),
            deDiaSemana: vm.sdeDiaSemana(),
            aDiaSemana: vm.saDiaSemana(),
            cargo: vm.cargo(),
            comentarios: vm.comentarios()
        }
    }
    var verbo = "POST";
    var url = myconfig.apiUrl + "/api/locales_afectados";
    if (localEnEdicion) {
        verbo = "PUT";
        url = myconfig.apiUrl + "/api/locales_afectados/" + vm.localAfectadoId();
    }
    llamadaAjax(verbo, url, data, function (err, data) {
        if (err) return;
        $('#modalLocalAfectado').modal('hide');
        buscarTodosLocalesAfectados(servicioId);
        limpiarLocalAfectado();
    });
}

function datosOKLocalAfectado() {
    $('#localAfectado-form').validate({
        rules: {
            txtLocalAfectado: {
                required: true
            },
            txtPersonaContacto: {
                required: true
            },
            txtTelefono1: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtLocalAfectado: {
                required: "Debe introducir un local"
            },
            txtPersonaContacto: {
                required: "Debe introducir una persona de contacto"
            },
            txtTelefono1: {
                required: 'Se necesita un telefono'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#localAfectado-form").validate().settings;
    return $('#localAfectado-form').valid();
}

function nuevoLocalAfectado() {
    limpiarLocalAfectado();
    loadComboDeDia(null);
    loadComboADia(null);
    localEnEdicion = false;
}

//---- Solapa actuaciones
function initTablaActuaciones() {
    tablaActuaciones = $('#dt_actuacion').DataTable({
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
                "sTitle": "Actuaciones Seleccionadas",
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
                "sMessage": "Actuaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "csv",
                "sMessage": "Actuaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "xls",
                "sMessage": "Actuaciones filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "print",
                "sMessage": "Actuaciones filtradas <i>(pulse Esc para cerrar)</i>",
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
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_actuacion'), breakpointDefinition);
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
        data: dataActuaciones,
        columns: [ {
            data: "actuacionId"
        },{
            data: "servicioId"
        },{
            data: "nombrecliente"
        }, {
            data: "fechaActuacion",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        },{
            data: "fechaPrevistaCierre",
            render: function (data, type, row) {
                if(data == null) {
                    data = ""
                    return  data;
                } else {
                    return moment(data).format('DD/MM/YYYY');
                }
                
            }
        }, {
            data: "nombreproveedor"
        }, {
            data: "nobreestactuacion"
        }, {
            data: "nombreestpresupuesto"
        },  {
            data: "actuacionId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteActuacion(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editActuacion(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_actuacion thead th input[type=text]").on('keyup change', function () {
        tablaActuaciones
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

}

function loadActuacionesDelServicio(servicioId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/actuaciones/sevicio/" + servicioId, null, function (err, data) {
        if (err) return;
        loadTablaActuaciones(data);
    });
}

function loadTablaActuaciones(data) {
    var dt = $('#dt_actuacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function deleteActuacion(id) {
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
                url: myconfig.apiUrl + "/api/actuaciones/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadActuacionesDelServicio(vm.servicioId());
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

function editActuacion(id) {
    var url = "ActuacionDetalle.html?ActuacionId=" + id+"&ServicioId="+vm.servicioId();
    window.open(url, '_new');
}

function crearActuacion() {
    var mf = function () {
        var url = "ActuacionDetalle.html?ActuacionId=0&ServicioId="+vm.servicioId();
        window.open(url, '_self');
    };
    return mf;
}

