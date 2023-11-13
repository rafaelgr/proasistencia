/*-------------------------------------------------------------------------- 
liquidacionEColaboradores.js
Funciones js par la página LiquidacionEColaboradores.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataComerciales;
var comercialId;
var comercialId = 0;
var departamentoId = 0;
var comerciales;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};



datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();

    $("#cmbColaboradores").select2(select2Spanish());

    $("#cmbTiposComerciales").select2(select2Spanish());
    loadTiposComerciales();

    $('#cmbTiposComerciales').change(function(e) {
        if(!e.added) return;
        loadColaboradores(e.added);
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
    //
    $('#btnBuscar').click(buscarColaboradores());
    $('#btnAlta').click(enviarCorreos());
    $('#btnDownload').click(buscarFicheros());
    $('#frmBuscar').submit(function () {
        return false
    });
    // ocultamos el botón de alta hasta que se haya producido una búsqueda
    $("#btnAlta").hide();

    initTablaComerciales();
    // comprobamos parámetros
    comercialId = gup('ComercialId');
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

    //Evento de marcar/desmarcar todos los checks
    $('#checkMain').click(
        function(e){
            if($('#checkMain').prop('checked')) {
                $('.checkAll').prop('checked', true);
                updateAll(true);
            } else {
                $('.checkAll').prop('checked', false);
                updateAll(false);
            }
        }
    );
    

}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    self.titleReg = ko.observable();
    self.numReg = ko.observable();
    self.totalReg = ko.observable();

    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);
    self.sComercialId = ko.observable();
    //
    self.tipoComerciallId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);
    
}

function initTablaComerciales() {
    tablaCarro = $('#dt_comercial').dataTable({
        autoWidth: true,
        paging: false,
        columnDefs: [{
            "width": "20%",
            "targets": 0
        }],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_comercial'), breakpointDefinition);
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
        data: dataComerciales,
        columns: [{
            data: "comercialId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s" class="checkAll">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data: "comercialNombre"
        }, {
            data: "direccion"
        }, {
            data: "poblacion"
        }, {
            data: "emailConfi"
        }, {
            data: "telefono1",
           
        }, {
            data: "comercialId",
            render: function (data, type, row) {
                //var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteComercial(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editComercial(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printComercial(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
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




function loadComerciales(id){
    llamadaAjax('GET', "/api/comerciales", null, function (err, data) {
        if (err) return
        var comerciales = [{
            comercialId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesComerciales(comerciales);
        $("#cmbComerciales").val([id]).trigger('change');
    });
}

function loadTiposComerciales(tipoComercialId) {
    llamadaAjax("GET", "/api/tipos_comerciales", null, function (err, data) {
        if (err) return;
        var tipos = data;
        vm.posiblesTiposComerciales(tipos);
        $("#cmbTiposComerciales").val([tipoComercialId]).trigger('change');
    });
}



function loadColaboradores(e) {
    if(e) {
        var tipoComercialId = e.id;
        llamadaAjax("GET", "/api/comerciales/colaboradores/activos/por/tipo/" + tipoComercialId, null, function (err, data) {
            if (err) return;
            var colaboradores = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(colaboradores);
            $("#cmbColaboradores").val([0]).trigger('change');
        });
    }
}



function updateAll(opcion) {
    var datos = null;
    var sel = 0;
    var tb = $('#dt_comercial').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(opcion) sel = 1
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            var data = {
                comercial: {
                    comercialId: datos[i].comercialId,
                    nombre: datos[i].comercialNombre,
                    nif: datos[i].nif,
                    sel: sel
                }
        };
                
               
        var url = "", type = "";
         // updating record
         var type = "PUT";
         var url = sprintf('%s/api/comerciales/%s', myconfig.apiUrl, datos[i].comercialId);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        }
    }
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


function loadTablaComerciales(data) {
    var dt = $('#dt_comercial').dataTable();
    comerciales = data;
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.comercialId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                comercial: {
                    comercialId: v.comercialId,
                    nombre: v.comercialNombre,
                    nif: v.nif,
                    sel: 0
                }
            };
            if (this.checked) {
                data.comercial.sel = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/comerciales/%s', myconfig.apiUrl, v.comercialId);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {

                },
                error: function (err) {
                    mensErrorAjax(err);
                }
            });
        });
    });
}



function buscarColaboradores() {
    var mf = function () {
        if (!datosOK()) return;
        comercialId = vm.sComercialId();
        tipoComercialId = vm.stipoComercialId();

        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/comerciales/envio/liquidacion/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) +"/"+ comercialId  +"/"+ tipoComercialId,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                loadTablaComerciales(data);
                // mostramos el botén de alta
                $("#btnAlta").show();
                $('#checkMain').prop('checked', false);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function buscarFicheros() {
    var mf = function () {
        var url = "ficheros/contabilidad";
        window.open(url, '_blank');
    };
    return mf;
}

function contabilizarComerciales() {
    var mf = function () {
        // de momento nada
        if (!datosOK()) return;
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/comerciales/contabilizar/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // borramos datos
                $("#btnAlta").hide();
                mensNormal('El fichero ' + data + ' para contabilización ya está preparado');
                vm.desdeFecha(null);
                vm.hastaFecha(null);
                loadTablaComerciales(null);
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
        var test = $('#chkTest').prop('checked')
        $('#progress').show();
        var url = myconfig.apiUrl + "/api/liquidaciones/preparar-correos/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) +   "/" + tipoComercialId;
        llamadaAjax("POST", url, null, function (err, data) {
            if (err) {
                $('#progress').hide();
                return;
            }
            url = myconfig.apiUrl + "/api/liquidaciones/enviar-correos/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()) + "/" + test;
            llamadaAjax("POST", url, data, function (err, data) {
                if (err) {
                    $('#progress').hide();
                    return;
                }
                $("#btnAlta").hide();
                $('#progress').hide();
                $("#resEnvio").html(data);
                $("#modalResultado").modal('show');
                llamadaAjax("PUT", '/api/liquidaciones/borrar-directorio/liquidacion', null, function (err, data2) {
                    if (err) {
                        $('#progress').hide();
                        return;
                    }
                });
            });

        });
    };
    return mf;
}



function editComercial(id) {
    // hay que abrir la página de detalle de comercial
    // pasando en la url ese ID
    var url = "ComercialDetalle.html?ComercialId=" + id;
    window.open(url, '_blank');
}


function printComercial(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/Comerciales/" + id,
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