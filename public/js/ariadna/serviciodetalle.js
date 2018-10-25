/*-------------------------------------------------------------------------- 
usuarioDetalle.js
Funciones js par la página UsuarioDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

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
    $("#frmServicio").submit(function() {
        return false;
    });

    adminId = gup('ServicioId');
    if (adminId != 0) {
        var data = {
                servicioId: adminId
            }
            // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/servicios/" + adminId,
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
        vm.servicioId(0);
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
    self.localAfectado = ko.observable();
    self.personaContacto = ko.observable();
    self.telefono1 = ko.observable();
    self.telefono2 = ko.observable();
    self.correoElectronico = ko.observable();
    self.deHoraAtencion = ko.observable();
    self.aHoraAtencion = ko.observable();
    self.deDiaSemana = ko.observable();
    self.aDiaSemana = ko.observable();
    self.descripcion = ko.observable();
    self.autorizacion = ko.observable();
}
   

function loadData(data) {
    vm.servicioId(data.servicioId);
    vm.nombre(data.nombre);
    vm.login(data.login);
    vm.password(data.password);
    vm.email(data.email);
    
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
    if (vm.servicioId() === 0 && $('#txtPassword1').val() === "") {
        mostrarMensajeSmart('Debe introducir una contraseña en el alta');
        return false;
    }
    $('#frmServicio').validate({
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
    var opciones = $("#frmServicio").validate().settings;
    if (vm.nivel()) {
        opciones.rules.cmbNivel.required = false;
    } else {
        opciones.rules.cmbNivel.required = true;
    }
    return $('#frmServicio').valid();
}

function aceptar() {
    var mf = function() {
        if (!datosOK())
            return;
        var data = {
            servicio: {
                "servicioId": vm.servicioId(),
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
                url: myconfig.apiUrl + "/api/servicios",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ServiciosGeneral.html?ServicioId=" + vm.servicioId();
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
                url: myconfig.apiUrl + "/api/servicios/" + adminId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ServiciosGeneral.html?ServicioId=" + vm.servicioId();
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
        var url = "ServiciosGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}
