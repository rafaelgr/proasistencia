/*-------------------------------------------------------------------------- 
prefacturaGeneral.js
Funciones js par la página PrefacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataPrefacturas;
var prefacturaId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    $('#btnBuscar').click(buscarPrefacturas());
    $('#btnAlta').click(crearPrefactura());
    $('#btnPrint').click(imprimirPrefactura);
    $('#frmBuscar').submit(function () {
        return false
    });

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        cargarPrefacturas()();
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarPrefacturas();
    //});
    //
    vm = new admData();
    ko.applyBindings(vm);

    recuperaDepartamento(function(err, data) {
        if(err) return;
        initTablaPrefacturas();
        // comprobamos parámetros
        prefacturaId = gup('PrefacturaId');
        if (prefacturaId !== '') {
    
            // Si nos pasan una prefafctura determinada esa es
            // la que mostramos en el grid
            cargarPrefacturas()(prefacturaId);
    
        } else {
    
            // Por defecto ahora a la entrada se van a cargar todas 
            // las facturas que tengamos en el sistema. En un futuro este
            // criterio puede cambiar y habrá que adaptarlo.
            cargarPrefacturas()();
        }
    
    });

   
    $('#chkTodos').change(function () {
        if (this.checked) {
            cargarPrefacturas2All();
        } else {
            cargarPrefacturas2();
        }
    });

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
}

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 


function initTablaPrefacturas() {
    tablaPrefacturas = $('#dt_prefactura').DataTable({
        bSort: false,
        /* "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>", */
        dom:  "<'dt-toolbar'<'col-sm-12 col-xs-12'<'col-sm-9 col-xs-9' Br> <'col-sm-3 col-xs-3'Cl>>>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
       /*  "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Prefacturas Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        }, */
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_prefactura'), breakpointDefinition);
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
        data: dataPrefacturas,
        columns: [{
            data: "facturaId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "referencia"
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
            data: "total",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "vFac"
        }, {
            data: "vFPago"
        }, {
            data: "observaciones"
        }, {
            data: "dirTrabajo"
        }, {
            data: "prefacturaId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deletePrefactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                if(row.contratoId == 8 || row.contPlanificacionId) { bt1 = "";}
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editPrefactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printPrefactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_prefactura thead th input[type=text]").on('keyup change', function () {
        tablaPrefacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaPrefacturas.columns(8).visible(false);
    tablaPrefacturas.columns(10).visible(false);
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtHastaFecha: {
                greaterThan: "#txtDesdeFecha"
            }
        },
        // Messages for form validation
        messages: {

        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaPrefacturas(data) {
    var dt = $('#dt_prefactura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarPrefacturas() {
    var mf = function () {
        if (!datosOK()) return;
        cargarPrefacturas()();
    };
    return mf;
}

function crearPrefactura() {
    var mf = function () {
        var url = "PrefacturaDetalle.html?PrefacturaId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deletePrefactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                prefacturaId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/prefacturas/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarPrefacturas();
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

function editPrefactura(id) {
    // hay que abrir la página de detalle de prefactura
    // pasando en la url ese ID
    var url = "PrefacturaDetalle.html?PrefacturaId=" + id;
    window.open(url, '_new');
}


function printPrefactura(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/prefacturas/" + id,
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

function printPrefactura2(id) {
    var url = "InfPrefacturas.html?prefacturaId=" + id;
    window.open(url, "_new");
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

function cargarPrefacturas() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: prefacturaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturas/" + prefacturaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturas(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            var desdeFecha = null;
            var hastaFecha = null;
            if(vm.desdeFecha() && vm.hastaFecha()) {
                desdeFecha = spanishDbDate(vm.desdeFecha());
                hastaFecha = spanishDbDate(vm.hastaFecha());
            }
            var url = myconfig.apiUrl + "/api/prefacturas/usuario/logado/departamento/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + desdeFecha + "/" + hastaFecha;
            if( $('#chkTodos').prop('checked'))  url = myconfig.apiUrl + "/api/prefacturas/usuario/logado/departamento/all/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + desdeFecha + "/" + hastaFecha;
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturas(data);
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


function cargarPrefacturas2() {
    var desdeFecha = null;
    var hastaFecha = null;

    if(!datosOK()) return;
    if(vm.desdeFecha() && vm.hastaFecha()) {
        desdeFecha = spanishDbDate(vm.desdeFecha());
        hastaFecha = spanishDbDate(vm.hastaFecha());
    }
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/prefacturas/usuario/logado/departamento/" + usuario.usuarioId + "/" + vm.sdepartamentoId() + "/" + desdeFecha + "/" + hastaFecha,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaPrefacturas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cargarPrefacturas2All() {
    var desdeFecha = null;
    var hastaFecha = null;

    if(!datosOK()) return;
    if(vm.desdeFecha() && vm.hastaFecha()) {
        desdeFecha = spanishDbDate(vm.desdeFecha());
        hastaFecha = spanishDbDate(vm.hastaFecha());
    }
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/prefacturas/usuario/logado/departamento/all/" + usuario.usuarioId+ "/" + vm.sdepartamentoId() + "/" + desdeFecha + "/" + hastaFecha,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaPrefacturas(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


imprimirPrefactura = function () {
    var url = "InfPrefacturas.html";
    window.open(url, '_blank');
}