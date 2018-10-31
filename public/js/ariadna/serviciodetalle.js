/*-------------------------------------------------------------------------- 
usuarioDetalle.js
Funciones js par la página UsuarioDetalle.html
---------------------------------------------------------------------------*/
var adminId = 0;

function initForm() {
    comprobarLogin();
    var user = JSON.parse(getCookie("usuario"));
    
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
    $('#cmbDeDia').select2(select2Spanish());
    
    $('#cmbADia').select2(select2Spanish());

    initAutoCliente();

    datePickerSpanish(); // see comun.js
   
    
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
        vm.provincia('Madrid');
        loadUsuarios(user.usuarioId);
        vm.fechaCreacion(moment(new Date()).format('DD/MM/YYYY'));
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
    self.descripcion = ko.observable();
    self.autorizacion = ko.observable();
    self.cargo = ko.observable();
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

     //
     self.posiblesDeDias = ko.observableArray([
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
    vm.localAfectado(data.localAfectado);
    vm.personaContacto(data.personaContacto);
    vm.telefono1(data.telefono1);
    vm.telefono2(data.telefono2);
    vm.correoElectronico(data.correoElectronico);
    vm.deHoraAtencion(data.deHoraAtencion);
    vm.aHoraAtencion(data.aHoraAtencion);
    vm.cargo(data.cargo);
    vm.fechaCreacion(spanishDate(data.fechaCreacion));
   
    vm.descripcion(data.descripcion);
    vm.autorizacion(data.autorizacion);

    //
    loadTiposProfesionales(data.tipoProfesionalId);
    loadUsuarios(data.usuarioId);
    loadAgentes(data.agenteId);
    loadComboDeDia(data);
    loadComboADia(data);
    cargaCliente(data.clienteId);
    if(data.comercialId) {
        initAutoCliente(data.comercialId)
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
            txtLocalAfectado: {required: true},
            txtPersonaContacto: {required: true},
            txtTelefono1: {required: true},
            txtFechaCreacion: {required: true}
           
        },
        // Messages for form validation
        messages: {
            txtDescripcion: { required: 'Deve introducir una descripción'},
            txtCalle: {required: 'Requerido'},
            txtNumero: {required: 'Requerido'},
            txtPoblacion: {required: 'Debe introducir una población'},
            txtProvincia: {required: 'Debe introducir una provincia'},
            txtLocalAfectado: {required: 'Debe introducir un local'},
            txtPersonaContacto: {required: 'Debe intoducir una persona  de contacto'},
            txtTelefono1: {required: 'Necesita un telefono'},
            txtFechaCreacion: {required: 'Deve introducir una fecha de creación'}

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
                "localAfectado": vm.localAfectado(),
                "personaContacto": vm.personaContacto(),
                "telefono1": vm.telefono1(),
                "telefono2": vm.telefono2(),
                "correoElectronico": vm.correoElectronico(),
                "deHoraAtencion": vm.deHoraAtencion(),
                "aHoraAtencion": vm.aHoraAtencion(),
                "deDiaSemana": vm.sdeDiaSemana(),
                "aDiaSemana": vm.saDiaSemana(),
                "descripcion": vm.descripcion(),
                "autorizacion": vm.autorizacion(),
                "cargo": vm.cargo(),
                "fechaCreacion": spanishDbDate(vm.fechaCreacion()),
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


function loadComboDeDia(deDia){
    $("#cmbDeDia option[value="+ deDia.deDiaSemana+"]").attr("selected",true).trigger('change');    
}



function loadComboADia(aDia){
    $("#cmbADia option[value="+ aDia.aDiaSemana+"]").attr("selected",true).trigger('change');    
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
        // incialización propiamente dicha
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
        // regla de validación para el control inicializado
        jQuery.validator.addMethod("clienteNecesario", function (value, element) {
            var r = false;
            if (vm.sclienteId()) r = true;
            return r;
        }, "Debe seleccionar un cliente válido");
        
    });
    
};
