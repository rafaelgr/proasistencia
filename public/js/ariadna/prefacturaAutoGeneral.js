/*-------------------------------------------------------------------------- 
PrefacturaAutoGeneral.js
Funciones js par la página FacturaGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataPrefacturasAuto;
var PrefacturaAutoId;
var usuario;



var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();

    vm = new admData();
    ko.applyBindings(vm);
    usuario = recuperarIdUsuario();
    recuperaDepartamento(function(err, data) {
        if(err) return;
        if(data) {
            initTablaPrefacturasAuto();
            // comprobamos parámetros
            preprefacturaAutoAutoId = gup('FacturaId');
            if (PrefacturaAutoId !== '') {
                // Si nos pasan una prefafctura determinada esa es
                // la que mostramos en el grid
                cargarPrefacturasAuto()(PrefacturaAutoId);
            } else {
                // Por defecto ahora a la entrada se van a cargar todas 
                // las prefacturasAuto que tengamos en el sistema. En un futuro este
                // criterio puede cambiar y habrá que adaptarlo.
                cargarPrefacturasAuto()();
             }

        }
    });

     //Evento asociado al cambio de departamento
     $("#cmbDepartamentosTrabajo").on('change', function (e) {
        //alert(JSON.stringify(e.added));
        cambioDepartamento(this.value);
        vm.sdepartamentoId(this.value);
        cargarPrefacturasAuto()();
    });


    // de smart admin
    pageSetUp();
    getVersionFooter();
    
    //
    $('#btnBuscar').click(buscarPrefacturasAuto());
    $('#btnAlta').click(crearFactura());
    $('#btnPrint').click(imprimirPrefacturaAuto);
    $('#frmBuscar').submit(function () {
        return false
    });
    //$('#txtBuscar').keypress(function (e) {
    //    if (e.keyCode == 13)
    //        buscarPrefacturasAuto();
    //});
    //
    

    $('#chkTodos').change(function () {
        if (this.checked) {
            cargarPrefacturasAuto2All();
        } else {
            cargarPrefacturasAuto2();
        }
    })
}

function admData() {
    var self = this;
    
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    
} 






function initTablaPrefacturasAuto() {
    tablaPrefacturasAuto = $('#dt_prefacturaAuto').DataTable({
        bSort: true,
        "aoColumnDefs": [
            { "sType": "date-uk", "aTargets": [5] },
        ],
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
        /* "oTableTools": {
            "aButtons": [
                {
                    "sExtends": "pdf",
                    "sTitle": "PrefacturasAuto Seleccionadas",
                    "sPdfMessage": "proasistencia PDF Export",
                    "sPdfSize": "A4",
                    "sPdfOrientation": "landscape",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "copy",
                    "sMessage": "PrefacturasAuto filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "csv",
                    "sMessage": "PrefacturasAuto filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "xls",
                    "sMessage": "PrefacturasAuto filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                },
                {
                    "sExtends": "print",
                    "sMessage": "PrefacturasAuto filtradas <i>(pulse Esc para cerrar)</i>",
                    "oSelectorOpts": { filter: 'applied', order: 'current' }
                }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        }, */
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_prefacturaAuto'), breakpointDefinition);
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
        data: dataPrefacturasAuto,
        columns: [{
            data: "prefacturaAutoId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (row.contafich || row.contabilizada) {
                    html = "<i class='fa fa-file'></i>";
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
                var string = numeral(data).format('0.00');
                return string;
            }
        }, {
            data: "totalConIva",
            render: function (data, type, row) {
                var string = numeral(data).format('0.00');
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
            data: "prefacturaAutoId",
            render: function (data, type, row) {
                console.log(type +" "+ row);
                var bt1 = "";
                if(!row.contabilizada) {
                    var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ","+row.departamentoId+ ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                }
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + bt3 + "</div>";
                return html;
            }
        }]
    });

    //function sort by date
    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function ( a ) {
            var ukDatea = a.split('/');
            return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        },
        
        "date-uk-asc": function ( a, b ) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },
        
        "date-uk-desc": function ( a, b ) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });


    // Apply the filter
    $("#dt_prefacturaAuto thead th input[type=text]").on('keyup change', function () {
        tablaPrefacturasAuto
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });

    // Hide some columns by default
    tablaPrefacturasAuto.columns(8).visible(false);
    tablaPrefacturasAuto.columns(10).visible(false);
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

function loadTablaPrefacturasAuto(data) {
    var dt = $('#dt_prefacturaAuto').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function buscarPrefacturasAuto() {
    var mf = function () {
        cargarPrefacturasAuto()();
    };
    return mf;
}

function crearFactura() {
    var mf = function () {
        var url = "PrefacturaAutoDetalle.html?FacturaId=0";
        window.open(url, '_new');
    };
    return mf;
}

function deleteFactura(id, departamentoId) {
    // mensaje de confirmación
    var url = myconfig.apiUrl + "/api/prefacturasAuto/" + id;
    var mens = "¿Qué desea hacer con este registro?";
    mens += "<ul>"
    mens += "<li><strong>Descontabilizar:</strong> Elimina la marca de contabilizada, con lo que puede ser contabilizada de nuevo</li>";
    mens += "<li><strong>Borrar:</strong> Elimina completamente la prefacturaAuto. ¡¡ Atención !! Puede dejar huecos en los números de prefacturaAuto de la serie</li>";
    mens += "</ul>"
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Cancelar][Descontabilizar prefacturaAuto][Borrar prefacturaAuto]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Borrar prefacturaAuto") {
            mens = "<ul>"
            mens += "<li><strong>¡¡ Atención !! Se borrá tambien la liquidación asociada a la prefacturaAuto</strong></li>";
            mens += "<li>¿Desea continuar?</li>";
            mens += "</ul>"
            $.SmartMessageBox({
                title: "<i class='fa fa-info'></i> Mensaje",
                content: mens,
                buttons: '[Cancelar][Borrar]'
            },function (ButtonPressed2) {
                if (ButtonPressed2 === "Borrar") {
                    var data = { 
                        prefacturaAuto: {
                            facturaId: id,
                            departamentoId: departamentoId 
                        }
                    };
                    if(departamentoId == 7) {
                        url =  myconfig.apiUrl + "/api/prefacturasAuto/parte/relacionado/" + id;
                    }
                    llamadaAjax("POST", myconfig.apiUrl + "/api/prefacturasAuto/desmarcar-prefactura/" + id, null, function (err) {
                        if (err) return;
                        llamadaAjax("DELETE", myconfig.apiUrl + "/api/liquidaciones/borrar-factura/" + id, data,function (err) {
                            if (err) return;
                            llamadaAjax("DELETE", url, data, function (err) {
                                if (err) return;
                                mostrarMensajeFacturaBorrada();
                                buscarPrefacturasAuto()();
                            });
                        });
                    });
                }
                if (ButtonPressed2 === "Cancelar") {
                    // no hacemos nada (no quiere borrar)
                }
            });
            
        }
        if (ButtonPressed === "Descontabilizar prefacturaAuto") {
            var data = { facturaId: id };
            llamadaAjax("POST", myconfig.apiUrl + "/api/prefacturasAuto/descontabilizar/" + id, null, function (err) {
                if (err) return;
                $('#chkTodos').prop('checked',false);
                mostrarMensajeFacturaDescontabilizada();
                buscarPrefacturasAuto()();
            });
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

var mostrarMensajeFacturaDescontabilizada = function () {
    var mens = "La prefacturaAuto se ha descontabilizado correctamente.";
    mensNormal(mens);
}

var mostrarMensajeFacturaBorrada = function () {
    var mens = "La prefacturaAuto se ha borrado correctamente.";
    mensNormal(mens);
}

function editFactura(id) {
    // hay que abrir la página de detalle de prefacturaAuto
    // pasando en la url ese ID
    var url = "PrefacturaAutoDetalle.html?PrefacturaAutoId=" + id;
    window.open(url, '_new');
}

function cargarPrefacturasAuto() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: facturaId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturasAuto/" + facturaId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturasAuto(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/prefacturasAuto/usuario/logado/departamento/" +usuario + "/" + vm.sdepartamentoId(),
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaPrefacturasAuto(data);
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

function printPrefacturaAuto2(id) {
    var url = "InfPrefacturaAutos.html?facturaId=" + id;
    window.open(url, '_new');
}

function printPrefacturaAuto(id) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/prefacturasAuto/" + id, null, function (err, data) {
        if (err) return;
        empresaId = data.empresaId;
        llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/" + empresaId, null, function (err, empresa) {
            if (err) return;
            var shortid = "rJkSiTZ9g";
            if (empresa.infPrefacturaAutos) shortid = empresa.infPrefacturaAutos;
            var url = "/api/informes/prefacturasAuto/" + id;
            if (shortid == "rJRv-UF3l" || shortid == "SynNJ46oe") {
                url = "/api/informes/facturas2/" + id;
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

function cargarPrefacturaAutos2() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/prefacturasAuto/usuario/logado/departamento/" +usuario + "/" + vm.sdepartamentoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaPrefacturasAuto(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function cargarPrefacturasAuto2All() {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/PrefacturaAutos/usuario/logado/departamento/all/"  +usuario + "/" + vm.sdepartamentoId(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            loadTablaPrefacturasAuto(data);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

imprimirPrefacturaAuto = function () {
    var url = "InfPrefacturasAuto.html";
    window.open(url, '_blank');
}