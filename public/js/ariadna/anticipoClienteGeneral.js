/*-------------------------------------------------------------------------- 
anticipoClienteGeneral.js
Funciones js par la página AntclienGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataAntcliens;
var antClienId;
var usuario;



var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

function initForm() {
    comprobarLogin();
    usuario = recuperarIdUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    //
    //
    $('#btnBuscar').click(buscarAntcliens());
    $('#btnAlta').click(crearAntclien());
    $('#btnPrint').click(imprimirAntclien);
    $('#frmBuscar').submit(function () {
        return false
    });
    
    $('#chkTodos').change(function () {
        if (this.checked) {
            cargarAntcliens2All();
        } else {
            cargarAntcliens2();
        }
    })

    //Evento asociado al cambio de departamento
    $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        cargarAntcliens()();
    });

    vm = new admData();
    ko.applyBindings(vm);

    recuperaDepartamento(function(err, data) {
        initTablaAntcliens();
        // comprobamos parámetros
        antClienId = gup('AntclienId');
        if (antClienId !== '') {

            // Si nos pasan una prefafctura determinada esa es
            // la que mostramos en el grid
            cargarAntcliens()(antClienId);
    
        } else {
    
            // Por defecto ahora a la entrada se van a cargar todas 
            // las anticipos que tengamos en el sistema. En un futuro este
            // criterio puede cambiar y habrá que adaptarlo.
            cargarAntcliens()();
        }
    });
}




function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 





function initTablaAntcliens() {
    tablaAntcliens = $('#dt_antclien').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "Antcliens Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "Antcliens filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "Antcliens filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "Antcliens filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "Antcliens filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_antclien'), breakpointDefinition);
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
        data: dataAntcliens,
        columns: [{
            data: "antClienId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
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
        },  {
            data: "totalConIva",
            render: function (data, type, row) {
                var string = numeral(data).format('0.00');
                return string;
            }
        },  {
            data: "vFPago"
        }, {
            data: "observaciones"
        },  {
            data: "antClienId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteAntclien(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editAntclien(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printAntclien2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 +  "</div>";
                return html;
            }
        }]
    });

    // Apply the filter
    $("#dt_antclien thead th input[type=text]").on('keyup change', function () {
        tablaAntcliens
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });
}

function datosOK() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
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
    return $('#frmBuscar').valid();
}

function loadTablaAntcliens(data) {
    var dt = $('#dt_antclien').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarAntcliens() {
    var mf = function () {
        cargarAntcliens()();
    };
    return mf;
}

function crearAntclien() {
    var mf = function () {
        var url = "AnticipoClienteDetalle.html?AntClienId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteAntclien(id, noCalculadora) {
    var mens;
    $.ajax({//buscamos la factura asociada para extraer su facproveId
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposClientes/factura/asociada/" + id,
        dataType: "json",
        contentType: "application/json",
        data: null,
        success: function (data, status) {
            if(data.length > 0) {
                mens = "Este registro tiene facturas asociadas, ¿realmente desea borrarlo?";
            } else {
                 mens = "¿Realmente desea borrar este registro?";
            }
            // mensaje de confirmación
    
            $.SmartMessageBox({
                title: "<i class='fa fa-info'></i> Mensaje",
                content: mens,
                buttons: '[Aceptar][Cancelar]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Aceptar") {
                    $.ajax({
                        type: "DELETE",
                        url: myconfig.apiUrl + "/api/anticiposClientes/" + id,
                        dataType: "json",
                        contentType: "application/json",
                        data: null,
                        success: function (data, status) {
                            var fn = buscarAntcliens()
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
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

var mostrarMensajeAntclienDescontabilizada = function () {
    var mens = "El anticipo se ha descontabilizado correctamente.";
    mensNormal(mens);
}

var mostrarMensajeAntclienBorrada = function () {
    var mens = "El anticipo se ha borrado correctamente.";
    mensNormal(mens);
}

function editAntclien(id) {
    // hay que abrir la página de detalle de antclien
    // pasando en la url ese ID
    var url = "AnticipoClienteDetalle.html?AntClienId=" + id;
    window.open(url, '_new');
}

function cargarAntcliens() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: antClienId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/anticiposClientes/" + antClienId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaAntcliens(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/anticiposClientes/usuario/logado/departamento/" +usuario + "/" + vm.sdepartamentoId(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaAntcliens(data);
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

function printAntclien2(id) {
    var url = "InfAntcliens.html?antClienId=" + id;
    window.open(url, '_new');
}

function printAntclien(id) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/anticiposClientes/" + id, null, function (err, data) {
        if (err) return;
        empresaId = data.empresaId;
        llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + empresaId, null, function (err, empresa) {
            if (err) return;
            var shortid = "rJkSiTZ9g";
            if (empresa.infAntcliens) shortid = empresa.infAntcliens;
            var url = "/api/informes/anticiposClientes/" + id;
            if (shortid == "rJRv-UF3l" || shortid == "SynNJ46oe") {
                url = "/api/informes/anticiposClientes2/" + id;
            }
            llamadaAjax("GET", url, null, function (err, data) {
                if (err) return;
                informePDF(data, shortid);
            });
        });
    });
}

function informePDF(data, shortid) {
    var infData = {
        "template": {
            "shortid": shortid
        },
        "data": data
    }
    f_open_post("POST", myconfig.reportUrl + "/api/report", infData);
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

function cargarAntcliens2() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposClientes/usuario/logado/departamento/" +usuario + "/" + vm.sdepartamentoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaAntcliens(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cargarAntcliens2All() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/anticiposClientes/usuario/logado/departamento/all/"  +usuario + "/" + vm.sdepartamentoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaAntcliens(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

imprimirAntclien = function () {
    var url = "InfAntcliens.html";
    window.open(url, '_blank');
}