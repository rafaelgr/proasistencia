/*-------------------------------------------------------------------------- 
usuarioDetalle.js
Funciones js par la página UsuarioDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;
var lineaEnEdicion = false;



var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var dataDepartamentosLineas;
$("#cmbDepartamentosTrabajo").select2(select2Spanish());

$("#linea-form").submit(function () {
    return false;
});

$("#frmLinea").submit(function () {
    return false;
});



var posiblesNiveles = [{
    id: 1,
    nombre: "Usuario"
}, {
    id: 2,
    nombre: "Jefe de Equipo"
}, {
    id: 3,
    nombre: "Vigilante"
}];

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmUsuario").submit(function() {
        return false;
    });

    adminId = gup('UsuarioId');
   

    initTablaDepartamentosClienteLineas();

    if (adminId != 0) {
        var data = {
                usuarioId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/usuarios/" + adminId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                loadLineasDepartamentoUsuario(data.usuarioId);
            },
                            error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.usuarioId(0);
        $('#lineasdepartamento').hide()
    }
}

function admData() {
    var self = this;
    self.usuarioId = ko.observable();
    self.nombre = ko.observable();
    self.login = ko.observable();
    self.password = ko.observable();
    self.email = ko.observable();
    self.posiblesNiveles = ko.observable(posiblesNiveles);
    self.nivel = ko.observable();

    self.usuarioDepartamentoId = ko.observable();
    //comnbo de los departamentos asociados
    self.departamentoId = ko.observable();
    //
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);

}

function loadData(data) {
    vm.usuarioId(data.usuarioId);
    vm.nombre(data.nombre);
    vm.login(data.login);
    vm.password(data.password);
    vm.email(data.email);
    for (var i = 0; i < posiblesNiveles.length; i++) {
        if (posiblesNiveles[i].id == data.nivel) {
            vm.nivel(posiblesNiveles[i]);
        }
    }
}

function datosOK() {
    // antes de la validación de form hay que verificar las password
    if ($('#txtPassword1').val() !== "") {
        // si ha puesto algo, debe coincidir con el otro campo
        if ($('#txtPassword1').val() !== $('#txtPassword2').val()) {
            mostrarMensajeSmart('Las contraseñas no coinciden');
            return false;
        }
        vm.password($("#txtPassword1").val());
    }
    // controlamos que si es un alta debe dar una contraseña.
    if (vm.usuarioId() === 0 && $('#txtPassword1').val() === "") {
        mostrarMensajeSmart('Debe introducir una contraseña en el alta');
        return false;
    }
    $('#frmUsuario').validate({
        rules: {
            cmbNivel: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtLogin: {
                required: true
            },
            txtEmail: {
                required: true,
                email: true
            }
        },
        // Messages for form validation
        messages: {
            cmbNivel: {
                required: "Debe seleccionar un nivel"
            },
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtLogin: {
                required: 'Introduzca el login'
            },
            txtEmail: {
                required: 'Introduzca el correo',
                email: 'Debe usar un correo válido'
            }
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmUsuario").validate().settings;
    if (vm.nivel()) {
        opciones.rules.cmbNivel.required = false;
    } else {
        opciones.rules.cmbNivel.required = true;
    }
    return $('#frmUsuario').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            usuario: {
                "usuarioId": vm.usuarioId(),
                "login": vm.login(),
                "email": vm.email(),
                "nombre": vm.nombre(),
                "password": vm.password(),
                "nivel": vm.nivel().id
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/usuarios",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UsuariosGeneral.html?UsuarioId=" + vm.usuarioId();
                    window.open(url, '_self');
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "PUT",
                url: myconfig.apiUrl + "/api/usuarios/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "UsuariosGeneral.html?UsuarioId=" + vm.usuarioId();
                    window.open(url, '_self');
                },
                                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
    };
    return mf;
}

function salir() {
    var mf = function() {
        var url = "UsuariosGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

//FUNCIONES RELACIONADAS CON LOS DEPARTAMENTOS ASOCIADOS

function initTablaDepartamentosClienteLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
        autoWidth: true,
        "columnDefs": [
            { "width": "60%", "targets": 0 }
          ],
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
        data: dataDepartamentosLineas,
        columns: [ {
            data: "nombreDepartamento",
            className: "text-left"
        },  {
            data: "usuarioDepartamentoId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteDepartamentoAsociado(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' data-toggle='modal' data-target='#modalDepartamento' onclick='editDepartamentoUsuario(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}




function loadTablatarifaClienteLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
        $('#btnCopiar').hide();
    }
    dt.fnClearTable();
    if (data != null){
        dt.fnAddData(data);
        $('#btnCopiar').show();
    }
    dt.fnDraw();
}


function  loadLineasDepartamentoUsuario(id) {
    llamadaAjax("GET", "/api/usuarios/departamentos/" + id, null, function (err, data) {
        if (err) return;
        loadTablatarifaClienteLineas(data);
    });
}

function loadDepartamentos(id) {
    llamadaAjax("GET", "/api/departamentos", null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        if (id) {
            $("#cmbDepartamentosTrabajo").val([id]).trigger('change');
        } else {
            $("#cmbDepartamentosTrabajo").val([0]).trigger('change');
        }
    });
}


function loadCapitulos(id){
    llamadaAjax("GET", "/api/grupo_articulo", null, function (err, data) {
        if (err) return;
        var capitulos = [{ grupoArticuloId: 0, nombre: "Todos" }].concat(data);
        vm.posiblesCapitulos(capitulos);
        if (id) {
            $("#cmbCapitulos").val([id]).trigger('change');
        } else {
            $("#cmbCapitulos").val([0]).trigger('change');
        }
    });
}

function cambioArticulo(articuloId) {
    if (!articuloId) return;
    llamadaAjax("GET", "/api/articulos/" + articuloId, null, function (err, data) {
        vm.precioUnitario(data.precioUnitario);
    });
}


function editDepartamentoUsuario(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/usuarios/departamento/buscar/" + id, null, function (err, data) {
        if (err) return;
        if (data) {
            loadDepartamentos(data.departamentoId);
            vm.usuarioDepartamentoId(id);
            vm.departamentoId(data.departamentoId);

        } 

    });
}

function nuevoDepartamentoAsociado() {
    limpiaDataLinea();
    lineaEnEdicion = false;
}

function limpiaDataLinea() {
    vm.usuarioDepartamentoId(0);
    vm.departamentoId(0);
    
    loadDepartamentos();
}



function aceptarDepartamento() {
    if(!datosOKNuevoDepartamentoAsociado()) {
        return;
    }
  
    var data = {
        departamento: {
            usuarioDepartamentoId: vm.usuarioDepartamentoId(),
            departamentoId: vm.sdepartamentoId(),
            usuarioId: vm.usuarioId()
        }
    }
    //compruebaArticuloRepetido en misma tarifaCliente
                var verbo = "POST";
                var url = myconfig.apiUrl + "/api/usuarios/departamento";
                if (lineaEnEdicion) {
                    verbo = "PUT";
                    url = myconfig.apiUrl + "/api/usuarios/departamento/" + vm.usuarioDepartamentoId();
                }
                llamadaAjax(verbo, url, data, function (err, data) {
                    if (err) return;
                    $('#modalDepartamento').modal('hide');
                    loadLineasDepartamentoUsuario(vm.usuarioId());
                });
}


function deleteDepartamentoAsociado(usuarioDepartamentoId) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        var data = {
            departamento: {
                usuarioDepartamentoId: usuarioDepartamentoId
            }
        };
        llamadaAjax("DELETE", myconfig.apiUrl + "/api/usuarios/departamento/" + usuarioDepartamentoId, data, function (err, data) {
            if (err) return;
            loadLineasDepartamentoUsuario(vm.usuarioId());
        });
    }, function () {
        // cancelar no hace nada
    });
}

function datosOKNuevoDepartamentoAsociado() {
    $('#linea-form').validate({
        rules: {
            
            cmbDepartamentosTrabajo: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
           
            cmbDepartamentosTrabajo: {
                required: 'Debe elegir un departamento'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#linea-form').valid();
}
