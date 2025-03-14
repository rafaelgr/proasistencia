﻿/*-------------------------------------------------------------------------- 
tipoProyectoDetalle.js
Funciones js par la página TipoProyectoDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;
var usuario;

var posiblesNiveles = [{
    id: 0,
    nombre: "TipoProyecto"
}, {
    id: 1,
    nombre: "Jefe de Equipo"
}, {
    id: 2,
    nombre: "Vigilante"
}];

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    usuario = recuperarUsuario();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmTipoProyecto").submit(function () {
        return false;
    });
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamento();

    $("#cmbTiposProfesional").select2(select2Spanish());
    loadTiposProfesionales();

    adminId = gup('TipoProyectoId');
    if (adminId != 0) {
        var data = {
            tipoProyectoId: adminId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/tipos_proyectos/" + adminId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.tipoProyectoId(0);
        $('#chkActivo').prop("checked", true);//valor por defecto de la propiedad
    }
}

function admData() {
    var self = this;
    self.tipoProyectoId = ko.observable();
    self.nombre = ko.observable();
    self.abrev = ko.observable();
    self.activo = ko.observable();
    self.visibleApp = ko.observable();
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    //
    self.tipoProfesionalId = ko.observable();
    self.stipoProfesionalId = ko.observable();
    //
    self.posiblesTiposProfesional = ko.observableArray([]);
    self.elegidosTiposProfesional = ko.observableArray([]);
}

function loadData(data) {
    vm.tipoProyectoId(data.tipoProyectoId);
    vm.nombre(data.nombre);
    vm.abrev(data.abrev);
    vm.visibleApp(data.visibleApp);
    vm.activo(data.activo);
    loadDepartamento(data.tipoMantenimientoId);
    loadTiposProfesionales(data.tiposProfesionales);
}

function datosOK() {
    $('#frmTipoProyecto').validate({
        rules: {
            cmbNivel: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtAbrev: {
                required: true
            },
            cmbDepartamentosTrabajo: {
                required:true
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
            txtAbrev: {
                required: 'Introduzca una breviatura'
            },
            cmbDepartamentosTrabajo: {
                required:"Debe introducir un deparatamento"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmTipoProyecto").validate().settings;
    return $('#frmTipoProyecto').valid();
}

function aceptar() {
    var mf = function () {
        if (!datosOK()) return;
        var data = {
            tipoProyecto: {
                "tipoProyectoId": vm.tipoProyectoId(),
                "nombre": vm.nombre(),
                "abrev": vm.abrev(),
                "tipoMantenimientoId": vm.sdepartamentoId(),
                "activo": vm.activo(),
                "visibleApp": vm.visibleApp(),
                "profesiones": {
                    "profesiones": vm.elegidosTiposProfesional()
                }
            }
        };
        if (adminId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_proyectos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "TiposProyectoGeneral.html?TipoProyectoId=" + vm.tipoProyectoId();
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
                url: myconfig.apiUrl + "/api/tipos_proyectos/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var url = "TiposProyectoGeneral.html?TipoProyectoId=" + vm.tipoProyectoId();
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
    var mf = function () {
        var url = "TiposProyectoGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadDepartamento(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        if(departamentoId) {
            vm.departamentoId(departamentoId);
        }
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}

function loadTiposProfesionales(tiposProfesionalesIds) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_profesional/",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var ids = [];
            var tiposProfesionales  = data
            vm.posiblesTiposProfesional(tiposProfesionales);
            if(tiposProfesionalesIds) {
                vm.elegidosTiposProfesional(tiposProfesionalesIds);
                for ( var i = 0; i < tiposProfesionalesIds.length; i++ ) {
                    ids.push(tiposProfesionalesIds[i])
                }
                $("#cmbTiposProfesional").val(ids).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

    