/*-------------------------------------------------------------------------- 
tipoProfesionalDetalle.js
Funciones js par la página TipoProfesionalDetalle.html
---------------------------------------------------------------------------*/
var empId = 0;
let usuario;
datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmTipoProfesional").submit(function() {
        return false;
    });
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamentos();

    empId = gup('tipoProfesionalId');
    if (empId != 0) {
        var data = {
                tipoProfesionalId: empId
            }
            // hay que buscar ese elemento en concreto
            let url =  myconfig.apiUrl + "/api/tipos_profesional/departamentos/" + empId;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data, status) {
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
        vm.tipoProfesionalId(0);
    }
}

function admData() {
    var self = this;
    self.tipoProfesionalId = ko.observable();
    self.nombre = ko.observable();

     //combo departamentos
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
}

function loadData(data) {
    var ids = [];
    vm.tipoProfesionalId(data[0].tipoProfesionalId);
    vm.nombre(data[0].nombre);
    for(let d of data) {
        ids.push(d.departamentoId)
    }
    loadDepartamentos(ids)
}

function datosOK() {
    $('#frmTipoProfesional').validate({
        rules: {
            txtNombre: {
                required: true
            },
            cmbDepartamentosTrabajo: {
                required: true
            },
        },
        // Messages for form validation
        messages: {
            txtNombre: {
                required: "Debe dar un nombre"
            },
              cmbDepartamentosTrabajo: {
                required: "Debe elegir al menos un departamento"
            },
        },
        // Do not change code below
        errorPlacement: function(error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmTipoProfesional").validate().settings;
    return $('#frmTipoProfesional').valid();
}


function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            tipoProfesional: {
                "tipoProfesionalId": vm.tipoProfesionalId(),
                "nombre": vm.nombre()
            },
             departamentos: {
                "departamentos": vm.elegidosDepartamentos()
            },
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/tipos_profesional",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    //loadData(data);
                    // Nos volvemos al general
                    var url = "TipoProfesionalGeneral.html?TipoProfesionalId=" + vm.tipoProfesionalId();
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
                url: myconfig.apiUrl + "/api/tipos_profesional/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    //loadData(data);
                    // Nos volvemos al general
                    var url = "TipoProfesionalGeneral.html?TipoProfesionalId=" + vm.tipoProfesionalId();
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
        var url = "TipoProfesionalGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}


function loadDepartamentos(departamentosIds) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var departamentos = data;
        vm.posiblesDepartamentos(departamentos);
        if(departamentosIds) {
            vm.elegidosDepartamentos(departamentosIds);
            $("#cmbDepartamentosTrabajo").val(departamentosIds).trigger('change');
        } else {
             $("#cmbDepartamentosTrabajo").val([]).trigger('change');
        }
    });
}
