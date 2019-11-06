/*-------------------------------------------------------------------------- 
grupoArticuloDetalle.js
Funciones js par la página GrupoArticuloDetalle.html
---------------------------------------------------------------------------*/
var empId = 0;
var idUsuario;

datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    idUsuario = recuperarIdUsuario();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(aceptar());
    $("#btnSalir").click(salir());
    $("#frmGrupoArticulo").submit(function () {
        return false;
    });

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamentos();

    empId = gup('GrupoArticuloId');
    if (empId != 0) {
        var data = {
            grupoArticuloId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/grupo_articulo/" + empId,
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
        vm.grupoArticuloId(0);
    }
}

function admData() {
    var self = this;
    self.grupoArticuloId = ko.observable();
    self.nombre = ko.observable();
    self.cuentaventas = ko.observable();
    self.cuentacompras = ko.observable();
   //
   self.departamentoId = ko.observable();
   self.sdepartamentoId = ko.observable();
   //
   self.posiblesDepartamentos = ko.observableArray([]);
   self.elegidosDepartamentos = ko.observableArray([]);
}

function loadData(data) {
    vm.grupoArticuloId(data.grupoArticuloId);
    vm.nombre(data.nombre);
    vm.cuentacompras(data.cuentacompras);
    vm.cuentaventas(data.cuentaventas);
    loadDepartamentos(data.departamentoId);
}

function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + idUsuario, null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: null, nombre: "" }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        if(departamentoId) {
            vm.departamentoId(departamentoId);
        }
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}
    

function datosOK() {
    $('#frmGrupoArticulo').validate({
        rules: {
            txtNombre: { required: true },
            txtCuentaCompras: { required: true, rangelength: [9, 9] },
            txtCuentaVentas: { required: true, rangelength: [9, 9] },
            cmbDepartamentosTrabajo: {
                required: true
            },
        },
        // Messages for form validation
        messages: {
            txtNombre: { required: "Debe dar un nombre" },
            txtCuentaCompras: { required: "Debe dar una cuenta de compras", rangelength: "La longitud tiene que ser de nueve digitos" },
            txtCuentaVentas: { required: "Debe dar una cuenta de ventas", rangelength: "La longitud tiene que ser de nueve digitos" },
            cmbDepartamentosTrabajo: {
                required: 'Debe elegir un departamento'
            },
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmGrupoArticulo").validate().settings;
    return $('#frmGrupoArticulo').valid();
}


function aceptar() {
    var mf = function () {
        if (!datosOK())
            return;
        var data = {
            grupoArticulo: {
                "grupoArticuloId": vm.grupoArticuloId(),
                "nombre": vm.nombre(),
                "cuentacompras": vm.cuentacompras(),
                "cuentaventas": vm.cuentaventas(),
                "departamentoId": vm.sdepartamentoId(),
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/grupo_articulo",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data[1]);
                    // Nos volvemos al general
                    
                    var url = "GrupoArticuloGeneral.html?GrupoArticuloId=" + vm.grupoArticuloId() + '&cuentas=' + data[0];
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
                url: myconfig.apiUrl + "/api/grupo_articulo/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data[1]);
                    // Nos volvemos al general
                    var url = "GrupoArticuloGeneral.html?GrupoArticuloId=" + vm.grupoArticuloId() + '&cuentas=' + data[0];
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
        var url = "GrupoArticuloGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

