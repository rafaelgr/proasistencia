

/*-------------------------------------------------------------------------- 
facturaGeneral.js
Funciones js par la página FacproveGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataFacproves;
var facproveId;
var proveedorId = 0;
var empresaId = 0;
var departamentoId = 0;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarIdUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();

    
    initAutoProveedor();

   
    $('#cmbEmpresas').select2();
    loadEmpresas();

    $('#cmbDepartamentosTrabajo').select2().on('change', function (e) {
        if (e.added) cambioDepartamento(e.added.id);
    });
   
   
    //
    $.validator.addMethod("greaterThan",
        function (value, element, params) {
            var fv = moment(value, "DD/MM/YYYY").format("YYYY-MM-DD");
            var fp = moment($(params).val(), "DD/MM/YYYY").format("YYYY-MM-DD");
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return new Date(fv) >= new Date(fp);
            } else {
                // esto es debido a que permitimos que la segunda fecha nula
                return true;
            }
        }, 'La fecha final debe ser mayor que la inicial.');
    //
    vm = new admData();
    ko.applyBindings(vm);
     //Recuperamos el departamento de trabajo
     recuperaDepartamento(function(err, data) {
        if(err) return;
        var dep = vm.sdepartamentoId();
        if(dep != 7) $('#btnBuscar').hide();
        
    });
    //
    $('#btnBuscar').click(buscarFacproves());
    $('#btnAlta').click(enviarCorreos());
    $('#btnDownload').click(buscarFicheros());
    $('#frmBuscar').submit(function () {
        return false
    });
    // ocultamos el botón de alta hasta que se haya producido una búsqueda
    $("#btnAlta").hide();

    initTablaFacproves();
    // comprobamos parámetros
    facproveId = gup('FacproveId');
    //
    var socket = io.connect('/');
    socket.on('message', function (data) {
        alert(data);
    });
    socket.on('progress', function (data) {
        vm.titleReg(data.titleReg);
        vm.numReg(data.numReg);
        vm.totalReg(data.totalReg);
        // calculate the percentage of upload completed
        var percentComplete = vm.numReg() / vm.totalReg();
        percentComplete = parseInt(percentComplete * 100);
        // update the Bootstrap progress bar with the new percentage
        $('.progress-bar').text(percentComplete + '%');
        $('.progress-bar').width(percentComplete + '%');
        // once the upload reaches 100%, set the progress bar text to done
        if (percentComplete === 100) {
            $('.progress-bar').html('Proceso terminado');
        }
    });

    
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    self.titleReg = ko.observable();
    self.numReg = ko.observable();
    self.totalReg = ko.observable();
    self.proveedor = ko.observable();

    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidasEmpresas = ko.observableArray([]);
    self.sEmpresaId = ko.observable();

    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
}

function initTablaFacproves() {
    tablaCarro = $('#dt_facprove').dataTable({
        autoWidth: true,
        paging: false,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_facprove'), breakpointDefinition);
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
                last: "Último"
            },
            aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
            }
        },
        data: dataFacproves,
        columns: [{
            data: "facproveId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "emisorNombre"
        }, {
            data: "receptorNombre"
        }, {
            data: "vNum"
        }, {
            data: "fecha",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "total"
        }, {
            data: "totalConIva"
        }, {
            data: "formaPago"
        }, {
            data: "observaciones"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFacprove(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFacprove(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printFacprove(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtDesdeFecha: {
                required: true
            },
            txtHastaFecha: {
                required: true,
                greaterThan: "#txtDesdeFecha"
            },

        },
        // Messages for form validation
        messages: {
            txtDesdeFecha: {
                required: "Debe seleccionar una fecha"
            },
            txtHastaFecha: {
                required: "Debe seleccionar una fecha"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

// initAutoProveedor
// inicializa el control del Proveedor como un autocomplete
var initAutoProveedor = function () {
    // incialización propiamente dicha
    $("#txtProveedor").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("POST", "/api/proveedores/activos/proveedores/todos/?nombre=" + request.term, null, function (err, data) {
                if (err) return;
                var r = []
                data.forEach(function (d) {
                    var v = {
                        value: d.nomconcat,
                        id: d.proveedorId
                    };
                    r.push(v);
                });
                response(r);
            });
        },
        minLength: 2,
        select: function (event, ui) {
            vm.proveedor(ui.item.value);
            proveedorId = ui.item.id;
        }
    });
};


function loadEmpresas(id){
    llamadaAjax('GET', "/api/empresas", null, function (err, data) {
        if (err) return
        var empresas = [{
            empresaId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}

/*function loadDepartamentos(id){
    llamadaAjax('GET', "/api/departamentos/usuario/" + usuario, null, function (err, data) {
        if (err) return
        var departamentos = [{
            departamentoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentosTrabajo").val([id]).trigger('change');
    });
}*/


function loadTablaFacproves(data) {
    var dt = $('#dt_facprove').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.facproveId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                facprove: {
                    facproveId: v.facproveId,
                    empresaId: v.empresaId,
                    proveedorId: v.proveedorId,
                    fecha: moment(v.fecha).format('YYYY-MM-DD'),
                    sel: 0
                }
            };
            if (this.checked) {
                data.facprove.sel = 1;
            }
            var datosArray = [];
            datosArray.push(data)
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/facturasProveedores/%s', myconfig.apiUrl, v.facproveId);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(datosArray),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        });
    });
}

function buscarProveedores(done){
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/proveedores/todosProveedores",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            //loadComboProveedores(data);
            return done(data, status);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function buscarFacproves() {
    var mf = function () {
        if (!datosOK()) return;
        empresaId = vm.sEmpresaId();
        departamentoId = vm.sdepartamentoId();

        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/correo/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + proveedorId + "/"  + empresaId + "/" + departamentoId + "/" + usuario,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaFacproves(data);
                // mostramos el botén de alta
                $("#btnAlta").show();
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function cambioDepartamento(id) {
    if(id == 7) {
        $('#btnBuscar').show();
    } else {
        $('#btnBuscar').hide();
    }
}

function buscarFicheros() {
    var mf = function () {
        var url = "ficheros/contabilidad";
        window.open(url, '_new');
    };
    return mf;
}

function contabilizarFacproves() {
    var mf = function () {
        // de momento nada
        if (!datosOK()) return;
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/facturasProveedores/contabilizar/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // borramos datos
                $("#btnAlta").hide();
                mensNormal('El fichero ' + data + ' para contabilización ya está preparado');
                vm.desdeFecha(null);
                vm.hastaFecha(null);
                loadTablaFacproves(null);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function enviarCorreos() {
    var mf = function () {
        if (!datosOK()) return;
        $('#progress').show();
        var url = myconfig.apiUrl + "/api/facturasProveedores/preparar-correos/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + proveedorId + "/"  + empresaId + "/" + departamentoId + "/" + usuario;
        llamadaAjax("POST", url, null, function (err, data) {
            if (err) {
                $('#progress').hide();
                return;
            }
            url = myconfig.apiUrl + "/api/facturasProveedores/enviar-correos/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha());
            llamadaAjax("POST", url, data, function (err, data) {
                if (err) {
                    $('#progress').hide();
                    return;
                }
                $("#btnAlta").hide();
                $('#progress').hide();
                $("#resEnvio").html(data);
                $("#modalResultado").modal('show');
                // mensNormal('Las facturasProveedores se han enviado por correo');
            });

        });
    };
    return mf;
}

function deleteFacprove(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                facproveId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarFacproves();
                    fn();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function editFacprove(id) {
    // hay que abrir la página de detalle de factura
    // pasando en la url ese ID
    var url = "FacproveDetalle.html?FacproveId=" + id;
    window.open(url, '_new');
}

function cargarFacproves() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: facproveId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + facproveId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacproves(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaFacproves(data);
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

function printFacprove(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/facturasProveedores/" + id,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            informePDF(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function informePDF(data) {
    var shortid = "HyGQ0yAP";
    var data = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", data);
}

var f_open_post = function (verb, url, data, target) {
    var form = document.createElement("form");
    form.action = url;
    form.method = verb;
    form.target = target || "_blank";

    var input = document.createElement("textarea");
    input.name = "template[shortid]";
    input.value = data.template.shortid;
    form.appendChild(input);

    input = document.createElement("textarea");
    input.name = "data";
    input.value = JSON.stringify(data.data);
    form.appendChild(input);

    form.style.display = 'none';
    document.body.appendChild(form);
    form.submit();
};