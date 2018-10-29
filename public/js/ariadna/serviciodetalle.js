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
    $("#frmServicio").submit(function () {
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
}


function loadData(data) {
    vm.servicioId(data.servicioId);
    vm.usuarioId(data.usuarioId);
    vm.comercialId(data.agenteId);
    vm.clienteId(data.clienteId);
    vm.tipoProfesionalId(data.tipoProfesionalId);
    vm.calle(data.calle);
    vm.numero(data.numero);
    vm.poblacion(data.poblacion);
    vm.codPostal(data.codPostal);
    vm.provincia(data.provincia);
    vm.localAfectado(data.localAfectado);
    vm.personaContacto(data.personaContacto);
    vm.telefono1(data.telefono1);
    vm.telefono2(data.telefono2);
    vm.correoElectronico(data.correoElectronico);
    vm.deHoraAtencion(data.deHoraAtencion);
    vm.aHoraAtencion(data.aHoraAtencion);
    vm.deDiaSemana(data.deDiaSemana);
    vm.aDiaSemana(data.aDiaSemana);
    vm.descripcion(data.descripcion);
    vm.autorizacion(data.autorizacion);

    //
    loadTiposProfesionales(data.tipoProfesionalId);
    loadUsuarios(data.usuarioId);
    loadAgentes(data.agenteId);
    cargaCliente(data.clienteId);
}
    


function datosOK() {
    
    $('#frmServicio').validate({
        rules: {
           
        },
        // Messages for form validation
        messages: {
            
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
        if (!datosOK())
            return;
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
                "localAfectado": vm.localAfectado(),
                "personaContacto": vm.personaContacto(),
                "telefono1": vm.telefono1(),
                "telefono2": vm.telefono2(),
                "correoElectronico": vm.correoElectronico(),
                "deHoraAtencion": vm.deHoraAtencion(),
                "aHoraAtencion": vm.aHoraAtencion(),
                "deDiaSemana": vm.deDiaSemana(),
                "aDiaSemana": vm.aDiaSemana(),
                "descripcion": vm.descripcion(),
                "autorizacion": vm.autorizacion()
            }
        };
        if (adminId == 0) {
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
                    var url = "ServicioGeneral.html?ServicioId=" + vm.servicioId();
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
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "ServicioGeneral.html?ServicioId=" + vm.servicioId();
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

function loadClientes(clienteId, agenteId) {
    var url = "/api/clientes/agente/" + agenteId
    if(!agenteId) {
        url = "/api/clientes"
    }
    llamadaAjax("GET",  url, null, function (err, data) {
        if (err) return;
        var clientes = [{ clienteId: 0, nombre: "" }].concat(data);
        vm.posiblesClientes(clientes);
        $("#cmbClientes").val([clienteId]).trigger('change');
    });
}

function cambioAgente(agenteId) {
    if (!agenteId) return;

    initAutoCliente(agenteId);
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
    llamadaAjax("GET", "/api/clientes/" + id, null, function (err, data) {
        if (err) return;
        $('#txtCliente').val(data.nombre);
        vm.sclienteId(data.clienteId);
        vm.tipoClienteId(data.tipoClienteId);
    });
};



var initAutoCliente = function (id) {
    var url = "/api/clientes/?nombre=";
    llamadaAjax("GET",  '/api/clientes/agente/' + id, null, function (err, dataUno) {
        if (err) return;
        // incialización propiamente dicha
        $("#txtCliente").autocomplete({
            source: function (request, response) {
                if(dataUno.length > 0) {
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
        // regla de validación para el control inicializado
        jQuery.validator.addMethod("clienteNecesario", function (value, element) {
            var r = false;
            if (vm.sclienteId()) r = true;
            return r;
        }, "Debe seleccionar un cliente válido");
        
    });
    var url = "/api/clientes/?nombre=";
    if(id) {
        
    }
};
