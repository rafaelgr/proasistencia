/*-------------------------------------------------------------------------- 
contratoGeneral.js
Funciones js par la página ContratoGeneral.html

---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataContratos;
var dataFacturas
var contratoId;
var usuario;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var totalContratos = 0;
var totalFacturas = 0;
var antDepartamentoId = 0;


datePickerSpanish(); // see comun.js

var vm = null;

function initForm() {
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    pageSetUp();
    getVersionFooter();
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
    //
    $.validator.addMethod("notEqualTo", function(value, element, param){
        if(value == "0") return false
        return true;
    });
    vm = new admData();
    ko.applyBindings(vm);
    //
    $('#btnBuscar').click(buscarContratos());
    $('#btnAlta').click(generarLiquidaciones());
    $('#btnBorrar').click(borrarUltimaLiquidacion());
    $('#frmBuscar').submit(function () {
        return false
    });
    //
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());

    //Evento de marcar/desmarcar todos los checks
    $('#checkMain').click(
        function(e){
            if($('#checkMain').prop('checked')) {
                $('.checkAll').prop('checked', true);
                updateAllContratos(true);
            } else {
                $('.checkAll').prop('checked', false);
                updateAllContratos(false);
            }
        }
    );

    function borrarUltimaLiquidacion() {
        var mf = function() {
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        if(departamentoId == 0) {
            mensError("No hay seleccionado ningún departamento");
            return;
        }
        var mens = "Se borrará la última liquidación del departamento seleccionado. ¿Desea continuar?";
        $.SmartMessageBox({
            title: "<i class='fa fa-info'></i> Mensaje",
            content: mens,
            buttons: '[Aceptar][Cancelar]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Aceptar") {
                var data = {
                    departamentoId: departamentoId
                };
                $.ajax({
                    type: "DELETE",
                    url: myconfig.apiUrl + "/api/liquidaciones/borrar/ultima/contratos",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        mensNormal("Se ha borrado la liquidación con fecha de inicio " + data + " del departamento seleccionado");
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
        return mf
    }
    

    //loadTiposContrato();
    //Recuperamos el departamento de trabajo
    recuperaDepartamento(function(err, data) {
        if(err) return;
        ajustaDepartamentos(data)

        $("#cmbEmpresas").select2(select2Spanish());
        loadEmpresas();

        $("#cmbComerciales").select2(select2Spanish());
        loadComerciales();

        $('#cmbPeriodos').select2(select2Spanish());

        $('#cmbAnos').select2(select2Spanish());
        loadAnyos();

        // ocultamos el botón de alta hasta que se haya producido una búsqueda
        $("#btnAlta").hide();

        initTablaContratos();
        // comprobamos parámetros
        contratoId = gup('contratoId');
    });
}

function ajustaDepartamentos(data) {
    //ELIMINAMOS TODOS LOS DEPARTAMENTOS EXECTO OBRAS DEL COMBO
    var id = $("#cmbDepartamentosTrabajo").val();//departamento de trabajo
     for (var i = 0; i < data.length; i++) {
            if (data[i].departamentoId != 8) {
                data.splice(i, 1);//eliminamos un elemto del array y modificamops su tamaño
                i = -1;//devolvemos el contador al principio para que vualva a inspeccionar desde el principio del array
            }
    }
    console.log(data);
    var departamentos = [{
        departamentoId: 0,
        nombre: ""
    }].concat(data);
    vm.posiblesDepartamentos(departamentos);
    if(id != 8)  {
        $("#cmbDepartamentosTrabajo").val([0]).trigger('change');
        vm.sdepartamentoId(0);
    }
}


function updateAllContratos() {
    var datos = null;
    var sel = 0;
    var tb = $('#dt_contrato').dataTable().api();
    var datos = tb.rows( {page:'current'} ).data();
    if(datos) {
        for( var i = 0; i < datos.length; i++) {
            var data = {
                contrato: {
                    contratoComisionistaId: v.contratoComisionistaId,
                    sel: sel
            }
        };
                
               
        var url = "", type = "";
         // updating record
         var type = "PUT";
         var url = sprintf('%sapi/contratos/comisionista/%s', myconfig.apiUrl, datos[i].contratoId);
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



function   loadAnyos(){
    var d = new Date();
    var n = d.getFullYear();
    n = n - 1
    var anos = [];
    var ano = {}
    var anoText;
    var limit = n + 1
    for(var i = n; i <= limit; i++){
        anoText = i.toString();
      ano = {
        nombreAno: anoText,
        ano: i
      };
      anos.push(ano);
    }
    vm.optionsAnos(anos);
    $("#cmbAnos").val([ n + 1]).trigger('change');
}

// tratamiento knockout

function admData() {
    var self = this;
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesComerciales = ko.observableArray([]);
    self.elegidosComerciales = ko.observableArray([]);

    self.optionsPeriodos = ko.observableArray([
        {
            'nombrePeriodo': 'Enero',
            'periodo': '1'
        }, 
        {
            'nombrePeriodo': 'Febrero',
            'periodo': '2'
        }, 
        {
            'nombrePeriodo': 'Marzo',
            'periodo': '3'
        },
        {
            'nombrePeriodo': 'Abril',
            'periodo': '4'
        },
        {
            'nombrePeriodo': 'Mayo',
            'periodo': '5'
        },
        {
            'nombrePeriodo': 'Junio',
            'periodo': '6'
        },
        {
            'nombrePeriodo': 'Julio',
            'periodo': '7'
        },
        {
            'nombrePeriodo': 'Agosto',
            'periodo': '8'
        },
        {
            'nombrePeriodo': 'Septiembre',
            'periodo': '9'
        },
        {
            'nombrePeriodo': 'Octubre',
            'periodo': '10'
        },
        {
            'nombrePeriodo': 'Noviembre',
            'periodo': '11'
        }
        ,
        {
            'nombrePeriodo': 'Diciembre',
            'periodo': '12'
        }
    ]);

    self.selectedPeriodos = ko.observableArray([]);
    self.speriodo = ko.observable();

    self.optionsAnos = ko.observableArray([]);
    self.ano = ko.observable(); 
    self.sano = ko.observable();
    self.selectedAnos = ko.observableArray([]);
}

function initTablaContratos() {
    tablaCarro = $('#dt_contrato').dataTable({
        autoWidth: false,
        paging: false,
        "columnDefs": [ {
            "targets": 0,
            "orderable": false,
            "width": "20%"
            } ],
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_contrato'), breakpointDefinition);
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
        data: dataContratos,
        columns: [{
            data: "contratoComisionistaId",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input id="chk%s" type="checkbox" name="chk%s"  class="checkAll">', data, data);
                //html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
                return html;
            }
        }, {
            data:  "referencia"
        }, {
            data: "comisionista"
        },{
            data: "importeContrato",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        },{
            data: "certificacionFinal",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        },{
            data: "fechaFinal",
            render: function (data, type, row) {
                return moment(data).format('DD/MM/YYYY');
            }
        }, {
            data: "nombreEmpresa"
        }, {
            data: "nombreCliente"
        },{
            data: "contratoComisionistaId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editContrato(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var bt3 = "<button class='btn btn-circle btn-success' onclick='printContrato(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
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
            cmbDepartamentosTrabajo: {
                required: true,
                notEqualTo: 0
            },
            cmbPeriodos: {
                required: true
            }

        },
        // Messages for form validation
        messages: {
            txtDesdeFecha: {
                required: "Debe seleccionar una fecha"
            },
            txtHastaFecha: {
                required: "Debe seleccionar una fecha"
            },
            cmbDepartamentosTrabajo: {
                required: "Se tiene que elegir un departamento",
                notEqualTo: "Se tiene que elegir un departamento"
            },
            cmbPeriodos: {
                required: "Intruduzca un periodo de liquidación"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#frmBuscar').valid();
}

function loadTablaContratos(data) {
    var dt = $('#dt_contrato').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if(data && data.length > 0) totalContratos = data.length;
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
    data.forEach(function (v) {
        var field = "#chk" + v.contratoComisionistaId;
        if (v.sel == 1) {
            $(field).attr('checked', true);
        }
        $(field).change(function () {
            var quantity = 0;
            var data = {
                contratoComisionista: {
                    contratoComisionistaId: v.contratoComisionistaId,
                    sel: 0
                }
            };
            if (this.checked) {
                data.contratoComisionista.sel = 1;
            }
            var url = "", type = "";
            // updating record
            var type = "PUT";
            var url = sprintf('%s/api/contratos/comisionista/%s', myconfig.apiUrl, v.contratoComisionistaId);
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


function buscarContratos() {
    var mf = function () {
        componFechas();
        if (!datosOK()) return;
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
        var comercialId = 0;
        if (vm.scomercialId()) comercialId = vm.scomercialId();
        var url = myconfig.apiUrl + "/api/contratos/contratos/beneficio/comercial/" + vm.desdeFecha() + "/" + vm.hastaFecha();
        $('#tbContrato').show();
        url += "/" + departamentoId;
        url += "/" + empresaId;
        url += "/" + comercialId;
        url += "/" + usuario.usuarioId;
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                antDepartamentoId = departamentoId;
                loadTablaContratos(data);
                $('#checkMain').prop('checked', true);
               
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

function componFechas() {
    var option = parseInt(vm.speriodo());
    var ano = vm.sano();
    var dFecha = "";
    var hFecha = "";
    var diasMes = null;
    
    switch (option) {
        case 1:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-01-01";
            hFecha = ano + "-01-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
        case 2:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-02-01";
            hFecha = ano + "-02-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
        case 3:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-03-01";
            hFecha = ano + "-03-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 4:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-04-01";
            hFecha = ano + "-04-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 5:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-05-01";
            hFecha = ano + "-05-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 6:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-06-01";
            hFecha = ano + "-06-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 7:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-07-01";
            hFecha = ano + "-07-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 8:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-08-01";
            hFecha = ano + "-08-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 9:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-09-01";
            hFecha = ano + "-09-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 10:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-10-01";
            hFecha = ano + "-10-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 11:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-11-01";
            hFecha = ano + "-11-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
          case 12:
            diasMes = new Date(ano, option, 0).getDate();
            dFecha = ano + "-12-01";
            hFecha = ano + "-12-" + diasMes;
            vm.desdeFecha(dFecha);
            vm.hastaFecha(hFecha);
          break;
      }
}


function generarLiquidaciones() {
    var mf = function () {
        // de momento nada
        if (!datosOK()) return;
        var departamentoId = 0;
        if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
        var empresaId = 0;
        if (vm.sempresaId()) empresaId = vm.sempresaId();
        var comercialId = 0;
        if (vm.scomercialId()) comercialId = vm.scomercialId();
        var url = myconfig.apiUrl + "/api/liquidaciones/checkContratos/" + vm.desdeFecha() + "/" + vm.hastaFecha();
        url += "/" + departamentoId;
        url += "/" + empresaId;
        url += "/" + comercialId;
        url += "/" + usuario.usuarioId;
        // Vamos a comprobar si hay datos previos
        generaLiquidaciones2();
        /* $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
                if (data.length > 0) {
                    var mens = "Ya hay liquidaciones generadas de estas Contratos. ¿Desea borrarlas y generarlas de nuevo?";
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Aceptar][Cancelar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Aceptar") {
                            generaLiquidaciones2();
                        }
                        if (ButtonPressed === "Cancelar") {
                            // no hacemos nada (no quiere borrar)
                        }
                    });

                } else {
                    generaLiquidaciones2();
                }
            },
            error: function (err) {
                mensErrorAjax(err);
            }
        })
 */
    };
    return mf;
}

function generaLiquidaciones2() {
    var departamentoId = 0;
    if (vm.sdepartamentoId()) departamentoId = vm.sdepartamentoId();
    var empresaId = 0;
    if (vm.sempresaId()) empresaId = vm.sempresaId();
    var comercialId = 0;
    if (vm.scomercialId()) comercialId = vm.scomercialId();
    var url = myconfig.apiUrl + "/api/liquidaciones/contratos/" + vm.desdeFecha() + "/" + vm.hastaFecha();
    url += "/" + departamentoId;
    url += "/" + empresaId;
    url += "/" + comercialId;
    url += "/" + usuario.usuarioId;
    $.ajax({
        type: "POST",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            // borramos datos
            $("#btnAlta").hide();
            mensNormal('Las liquidaciones han sido generadas, puede consultarlas en el punto de menú específico');
            vm.desdeFecha(null);
            vm.hastaFecha(null);
            loadTablaContratos(null);
            loadComerciales(0);
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function deleteContrato(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            var data = {
                contratoId: id
            };
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/Contratos/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var fn = buscarContratos();
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

function editContrato(id) {
    // hay que abrir la página de detalle del contrato
    // pasando en la url ese ID
    var url = "";
    if( vm.sdepartamentoId() == 7) {
        url = "FacturaDetalle.html?FacturaId=" + id;
        window.open(url, '_blank');
        return;
    }
    url = "ContratoDetalle.html?ContratoId=" + id;
    window.open(url, '_blank');
}

function cargarContratos() {
    var mf = function (id) {
        if (id) {
            var data = {
                id: contratoId
            }
            // hay que buscar ese elemento en concreto
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/Contratos/" + contratoId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaContratos(data);
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        } else {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/Contratos",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    loadTablaContratos(data);
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

function printContrato(id) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/informes/Contratos/" + id,
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

function loadTiposContrato(id) {
    llamadaAjax('GET', "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        if (err) return;
        var tipos = [{
            departamentoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesDepartamentos(tipos);
        $("#cmbDepartamentosTrabajo").val([id]).trigger('change');
    });
}

function loadEmpresas(id) {
    llamadaAjax('GET', "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{
            empresaId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}

function loadComerciales(id) {
    $.ajax({
        type: "GET",
        url: "/api/comerciales/colaboradores/activos",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposComerciales = [{ comercialId: 0, nombre: "" }].concat(data);
            vm.posiblesComerciales(tiposComerciales);
            //if (id){
            //    vm.scomercialId(id);
            //}
            $("#cmbComerciales").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}