/*-------------------------------------------------------------------------- 
empresaDetalle.js
Funciones js par la página EmpresaDetalle.html
---------------------------------------------------------------------------*/
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var empId = 0;
var dataSeries;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

var serieEnEdicion = false;
var empSerieId = 0;
var dataCuentasLineas;
var lineaEnEdicion = false;

datePickerSpanish(); // see comun.js

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
    $("#btnGuardarPlantilla").click(aceptar());
    $("#btnImportar").click(importar());

    $("#frmEmpresa").submit(function () {
        return false;
    });
    $("#frmSeries").submit(function () {
        return false;
    });
    
    $("#series-form").submit(function () {
        return false;
    });
    
    $("#frmLinea").submit(function () {
        return false;
    });

    $("#linea-form").submit(function () {
        return false;
    });

    


    //comprobamos si el puerto 465 está configurado con correo seguro
    //o si el correo no seguro está configurado con el puerto 465
    /*$('#chkSecure').click(function() {
        if(!$(this).is(':checked') && vm.portCorreo() == 465) {
          var mens = 'No se permite correo no seguro por el puerto 465';
          mensNormal(mens);
          vm.portCorreo(25);
        }
        if($(this).is(':checked') && vm.portCorreo() != 465) {
            var mens = 'No se permite correo seguro por un puerto diferente al 465';
            mensNormal(mens);
            vm.portCorreo(465);
        }
      });*/

      /*$('#txtPort').blur(function(){
        if(!$('#chkSecure').is(':checked') && vm.portCorreo() == 465) {
            var mens = 'No se permite correo no seguro por el puerto 465';
            mensNormal(mens);
            vm.portCorreo(25);
          }
          if($('#chkSecure').is(':checked') && vm.portCorreo() != 465) {
            var mens = 'No se permite correo seguro por un puerto diferente al 465';
            mensNormal(mens);
            vm.portCorreo(465);
        }
      });*/

    // select2 things
    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();

    $("#cmbSerieMantenimiento").select2(select2Spanish());
    $("#cmbSerieSeguros").select2(select2Spanish());
    $('#cmbSerieRectificativas').select2(select2Spanish());
    $('#cmbSerieRectificativas').select2(select2Spanish());
    $('#cmbSerieReparaciones').select2(select2Spanish());
    $('#cmbTiposFormaPago').select2(select2Spanish());

    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
     loadDepartamentos();

    $("#cmbTipoProyecto").select2(select2Spanish());
    loadTipoProyecto();

    $("#cmbSerieFac").select2(select2Spanish());

    initTablaSeries();
    initTablaCuentasLineas();
    
    
    // carga del editor de plantillas
    CKEDITOR.replace('ckeditor', { height: '380px', startupFocus: true });

    empId = gup('EmpresaId');
    if (empId != 0) {
        var data = {
            empresaId: empId
        }
        // hay que buscar ese elemento en concreto
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/empresas/" + empId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadData(data);
                loadSeriesDelContrato(empId);
                loadLineasCuenta(empId)
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        // se trata de un alta ponemos el id a cero para indicarlo.
        vm.empresaId(0);
    }
}

function admData() {
    var self = this;
    self.empresaId = ko.observable();
    self.proId = ko.observable();
    self.nombre = ko.observable();
    self.nif = ko.observable();
    self.fechaAlta = ko.observable();
    self.fechaBaja = ko.observable();
    self.activa = ko.observable();
    self.contacto1 = ko.observable();
    self.contacto2 = ko.observable();
    self.direccion = ko.observable();
    self.codPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    self.telefono1 = ko.observable();
    self.telefono2 = ko.observable();
    self.fax = ko.observable();
    self.email = ko.observable();
    self.emailReparaciones = ko.observable();
    self.observaciones = ko.observable();
    self.hostCorreo = ko.observable();
    self.portCorreo = ko.observable();
    self.secureCorreo = ko.observable();
    self.usuCorreo = ko.observable();
    self.passCorreo = ko.observable();
    self.asunto = ko.observable();
    self.dniFirmante = ko.observable();
    self.firmante = ko.observable();
    self.contabilidad = ko.observable();
    self.seriePre = ko.observable();
    self.sereRep = ko.observable();
    self.infFacCliRep = ko.observable();
    self.infFacCliObr = ko.observable();
    //
    self.tipoViaId = ko.observable();
    self.stipoViaId = ko.observable();
    //
    self.posiblesTiposVia = ko.observableArray([]);
    self.elegidosTiposVia = ko.observableArray([]);
    //
    self.infOfertas = ko.observable();
    self.infFacturas = ko.observable();
    self.infPreFacturas = ko.observable();
    // 

    //SERIES
    //
    self.tiporegi = ko.observable();
    self.stiporegi = ko.observable();
    //
    self.posiblesTiposRegis = ko.observableArray([]);
    self.elegidosTiposRegis = ko.observableArray([]);
    //
    //
    self.tiporegi = ko.observable();
    self.stiporegiSeg = ko.observable();
    //
    self.posiblesTiposRegisSeg = ko.observableArray([]);
    self.elegidosTiposRegisSeg = ko.observableArray([]);

    //
    self.tiporegi = ko.observable();
    self.stiporegiRec = ko.observable();
    //
    self.posiblesTiposRegisRec = ko.observableArray([]);
    self.elegidosTiposRegisRec = ko.observableArray([]);

     //
     self.tiporegi = ko.observable();
     self.stiporegiRep = ko.observable();
     //
     self.posiblesTiposRegisRep = ko.observableArray([]);
     self.elegidosTiposRegisRep = ko.observableArray([]);
 

    //
    self.plantillaCorreoFacturas = ko.observable();


    //MODAL
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    //
    self.tipoProyectoId = ko.observable();
    self.stipoProyectoId = ko.observable();
    //
    self.posiblesTipoProyecto = ko.observableArray([]);
    self.elegidosTipoProyecto = ko.observableArray([]);

    //LINEAS FORSMAS PAGO/CUENTAS CONTABLES

    self.empresaCuentapagoId = ko.observable(),
    self.cuentapago = ko.observable();
    self.cuentacobro = ko.observable();
    //
    self.tipoFormaPagoId = ko.observable();
    self.stipoFormaPagoId = ko.observable();
    //
    self.posiblesTiposFormaPago = ko.observableArray([]);
    self.elegidosTiposFormaPago = ko.observableArray([]);
}


function loadData(data) {
    vm.empresaId(data.empresaId);
    vm.proId(data.proId);
    vm.nombre(data.nombre);
    vm.nif(data.nif);
    vm.fechaAlta(spanishDate(data.fechaAlta));
    vm.fechaBaja(spanishDate(data.fechaBaja));
    vm.activa(data.activa);
    vm.contacto1(data.contacto1);
    vm.contacto2(data.contacto2);
    vm.direccion(data.direccion);
    vm.codPostal(data.codPostal);
    vm.provincia(data.provincia);
    vm.telefono1(data.telefono1);
    vm.telefono2(data.telefono2);
    vm.fax(data.fax);
    vm.email(data.email);
    vm.emailReparaciones(data.emailReparaciones);
    vm.observaciones(data.observaciones);
    vm.hostCorreo(data.hostCorreo);
    vm.portCorreo(data.portCorreo);
    vm.secureCorreo(data.secureCorreo);
    vm.usuCorreo(data.usuCorreo);
    vm.passCorreo(data.passCorreo);
    vm.asunto(data.asuntoCorreo);
    vm.poblacion(data.poblacion);
    vm.dniFirmante(data.dniFirmante);
    vm.firmante(data.firmante);
    vm.contabilidad(data.contabilidad);
    //vm.seriePre(data.seriePre);
    loadTiposVia(data.tipoViaId);
    vm.infOfertas(data.infOfertas);
    vm.infFacturas(data.infFacturas);
    vm.infPreFacturas(data.infPreFacturas);
    vm.infFacCliRep(data.infFacCliRep);
    vm.infFacCliObr(data.infFacCliObr);
    // 
    vm.plantillaCorreoFacturas(data.plantillaCorreoFacturas);
    CKEDITOR.instances.plantilla.setData(vm.plantillaCorreoFacturas());

    //
    loadSerieRectificativas(data.serieFacR);
    loadSeriesFact();
}

function datosOK() {
    $('#frmEmpresa').validate({
        rules: {
            txtNif: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtEmail: {
                email: true
            },
            txtContabilidad: {
                required: true
            },
            
            
        },
        // Messages for form validation
        messages: {
            txtNif: {
                required: "Introduzca un NIF"
            },
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtEmail: {
                email: 'Debe usar un correo válido'
            },
            txtContabilidad: {
                required: 'Indique la contabilidad'
            },
           
           
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmEmpresa").validate().settings;
    return $('#frmEmpresa').valid();
}

function datosImportOK() {
    $('#frmEmpresa').validate({
        rules: {
            txtProId: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            txtProId: {
                required: "Introduzca un código"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmEmpresa").validate().settings;
    return $('#frmEmpresa').valid();
}

function aceptar() {
    var mf = function () {
        comprobarVacios();
        if (!datosOK()) return;
        vm.plantillaCorreoFacturas(CKEDITOR.instances.plantilla.getData());
        var data = {
            empresa: {
                "empresaId": vm.empresaId(),
                "proId": vm.proId(),
                "nombre": vm.nombre(),
                "nif": vm.nif(),
                "fechaAlta": spanishDbDate(vm.fechaAlta()),
                "fechaBaja": spanishDbDate(vm.fechaBaja()),
                "activa": vm.activa(),
                "contacto1": vm.contacto1(),
                "contacto2": vm.contacto2(),
                "direccion": vm.direccion(),
                "poblacion": vm.poblacion(),
                "provincia": vm.provincia(),
                "codPostal": vm.codPostal(),
                "telefono1": vm.telefono1(),
                "telefono2": vm.telefono2(),
                "fax": vm.fax(),
                "email": vm.email(),
                "emailReparaciones": vm.emailReparaciones(),
                "observaciones": vm.observaciones(),
                "dniFirmante": vm.dniFirmante(),
                "firmante": vm.firmante(),
                "contabilidad": vm.contabilidad(),
                "tipoViaId": vm.stipoViaId(),
                //"seriePre": vm.seriePre(),
                "serieFac": vm.stiporegi(),
                "serieFacS": vm.stiporegiSeg(),
                "serieFacR": vm.stiporegiRec(),
                "serieFacRep": vm.stiporegiRep(),
                "infOfertas": vm.infOfertas(),
                "infFacturas": vm.infFacturas(),
                "infPreFacturas": vm.infPreFacturas(),
                "plantillaCorreoFacturas": vm.plantillaCorreoFacturas(),
                "asuntoCorreo": vm.asunto(),
                "hostCorreo": vm.hostCorreo(),
                "portCorreo": vm.portCorreo(),
                "secureCorreo": vm.secureCorreo(),
                "usuCorreo": vm.usuCorreo(),
                "passCorreo": vm.passCorreo(),
                "infFacCliRep": vm.infFacCliRep(),
                "infFacCliObr": vm.infFacCliObr()
            }
        };
        if (empId == 0) {
            $.ajax({
                type: "POST",
                url: myconfig.apiUrl + "/api/empresas",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "EmpresasGeneral.html?EmpresaId=" + vm.empresaId();
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
                url: myconfig.apiUrl + "/api/empresas/" + empId,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // hay que mostrarlo en la zona de datos
                    loadData(data);
                    // Nos volvemos al general
                    var url = "EmpresasGeneral.html?EmpresaId=" + vm.empresaId();
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

function importar() {
    var mf = function () {
        if (!datosImportOK())
            return;
        $('#btnImportar').addClass('fa-spin');
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/sqlany/empresas/" + vm.proId(),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                $('#btnImportar').removeClass('fa-spin');
                // la cadena será devuelta como JSON
                var rData = JSON.parse(data);
                // comprobamos que no está vacía
                if (rData.length == 0) {
                    // mensaje de que no se ha encontrado
                }
                data = rData[0];
                data.empresaId = vm.empresaId(); // Por si es un update
                // hay que mostrarlo en la zona de datos
                loadData(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function salir() {
    var mf = function () {
        var url = "EmpresasGeneral.html";
        window.open(url, '_self');
    }
    return mf;
}

function loadTiposVia(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposVia(tiposVia);
            $("#cmbTiposVia").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadSerieMantenimiento(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas/series/" + vm.contabilidad(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var series = data;
            vm.posiblesTiposRegis(series);
            $("#cmbSerieMantenimiento").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadSerieRectificativas(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas/series/" + vm.contabilidad(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var series = data;
            vm.posiblesTiposRegisRec(series);
            $("#cmbSerieRectificativas").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadSeriesFact(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas/series/" + vm.contabilidad(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var series = [{tiporegi: 100, nomregis: null}].concat(data);
            vm.posiblesTiposRegis(series);
            $("#cmbSerieFac").val([id]).trigger('change');
            return;
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadSerieReparaciones(id) {
    $.ajax({
        type: "GET",
        url: "/api/empresas/series/" + vm.contabilidad(),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var series = data;
            vm.posiblesTiposRegisRep(series);
            $("#cmbSerieReparaciones").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadDepartamentos(departamentoId) {
    llamadaAjax("GET", "/api/departamentos", null, function (err, data) {
        if (err) return;
        var departamentos = [{ departamentoId: 0, nombre: '' }].concat(data);
        vm.posiblesDepartamentos(departamentos);
        $("#cmbDepartamentosTrabajo").val([departamentoId]).trigger('change');
    });
}


function loadTipoProyecto(id) {
    llamadaAjax('GET', "/api/tipos_proyectos", null, function (err, data) {
        if (err) return;
        var tipos = [{
            tipoProyectoId: 0,
            nombre: ""
        }].concat(data);
        vm.posiblesTipoProyecto(tipos);
        $("#cmbTipoProyecto").val([id]).trigger('change');
    });
}

function comprobarVacios(){
        if(/^\s+|\s+$/.test(vm.passCorreo()) || vm.passCorreo() == "") {
            vm.passCorreo(null);
        }
        if(/^\s+|\s+$/.test(vm.hostCorreo()) || vm.hostCorreo() == "") {
            vm.hostCorreo(null);
        }
        if(/^\s+|\s+$/.test(vm.usuCorreo()) || vm.usuCorreo() == "") {
            vm.usuCorreo(null);
        }
        if(/^\s+|\s+$/.test(vm.portCorreo()) || vm.portCorreo() == "") {
            vm.portCorreo(null);
        }
}

// --------------- Solapa de Series
function initTablaSeries() {
    tablaSeries = $('#dt_series').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C T >r>" +
        "t" +
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        "oTableTools": {
            "aButtons": [{
                "sExtends": "pdf",
                "sTitle": "Prefacturas Seleccionadas",
                "sPdfMessage": "proasistencia PDF Export",
                "sPdfSize": "A4",
                "sPdfOrientation": "landscape",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "copy",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "csv",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "xls",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            },
            {
                "sExtends": "print",
                "sMessage": "Prefacturas filtradas <i>(pulse Esc para cerrar)</i>",
                "oSelectorOpts": {
                    filter: 'applied',
                    order: 'current'
                }
            }
            ],
            "sSwfPath": "js/plugin/datatables/swf/copy_csv_xls_pdf.swf"
        },
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_series'), breakpointDefinition);
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
        data: dataSeries,
        columns: [{
            data: "empresaSerieId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "departamentoNombre"
        }, {
            data: "tipoProyectoNombre"
        }, {
            data: "serie_prefactura"
        }, {
            data: "serie_factura"
        }, {
            data: "empresaSerieId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteSeries(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editSeries(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printPrefactura(" + data + ");' title='Imprimir PDF'> <i class='fa fa-file-pdf-o fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

}

function loadSeriesDelContrato(empresaId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/empresaSerie/" + empresaId, null, function (err, data) {
        if (err) return;
        loadTablaSeries(data);
    });
}

function loadTablaSeries(data) {
    var dt = $('#dt_series').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function guardarSeries() {
    var departamentoId = vm.sdepartamentoId();
    var tipoProyectoId = vm.stipoProyectoId();
    var tiporegi = vm.stiporegi();
    var seriepre =  vm.seriePre();
    if(departamentoId == 0) vm.sdepartamentoId(null);
    if(tipoProyectoId == 0) vm.stipoProyectoId(null);
    if(tiporegi == 100) vm.stiporegi(null);
    if(seriepre = '') vm.seriePre(null);
    var data = {
        empresaSerie: {
            empresaId: vm.empresaId(),
            departamentoId: vm.sdepartamentoId(),
            tipoProyectoId: vm.stipoProyectoId(),
            serie_factura: vm.stiporegi(),
            serie_prefactura: vm.seriePre()
        }
    }
    if (!serieEnEdicion) {
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/empresas/empresaSerie",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadSeriesDelContrato(vm.empresaId());
                $('#modalSeries').modal('hide');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/empresas/empresaSerie/" + empSerieId,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                serieEnEdicion = false;
                empSerieId = 0;
                loadSeriesDelContrato(vm.empresaId());
                $('#modalSeries').modal('hide');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
}

function deleteSeries(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "DELETE",
                url: myconfig.apiUrl + "/api/empresas/empresaSerie/del/contrato/" + id,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    loadSeriesDelContrato(vm.empresaId());
                    limpiaModal();
                    $('#modalSeries').modal('hide');
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            limpiaModal();
            // no hacemos nada (no quiere borrar)
        }
    });
}

function limpiaModal() {
    loadDepartamentos(0);
    loadTipoProyecto(0);
    loadSeriesFact(100);
    vm.seriePre(null);
}

function editSeries(id) {
    cargaModalSeries(id);
}

function cargaModalSeries(id) {
    limpiaModal();
    if(id) {
        llamadaAjax("GET", myconfig.apiUrl + "/api/empresas/empresaSerie/un/registro/" + id, null, function (err, data) {
            if (err) return;
            //loadTablaSeries(data);
            serieEnEdicion = true;
            empSerieId = id;
            loadDepartamentos(data.departamentoId);
            loadTipoProyecto(data.tipoProyectoId)
            loadSeriesFact(data.serie_factura);
            vm.seriePre(data.serie_prefactura);
            $('#modalSeries').modal('show');
        });
    }
}

// FUNCIONES RELACIONADAS CON LA TABLA FORMAS PAGO / CUENTAS CONTABLES

function nuevaLinea() {
    limpiaDataLinea();
}

function limpiaDataLinea(data) {
    vm.empresaCuentapagoId (0);
    vm.cuentapago(null);
    vm.cuentacobro(null);
    //
    loadTiposFormaPago();
}

function comprobarCuenta() {
    if (!datosOKLineas()) {
        return;
    }
    var codmacta = $('#txtCuentaPago').val();
    var codmacta2 = $('#txtCuentaCobro').val();
    var data = [];
    data.push(codmacta);
    data.push(codmacta2);
    
    llamadaAjax("POST", "/api/empresas/empresaCuentas/cuenta/pago/comprueba/existe/" + vm.contabilidad(), data, function (err, data) {
        if (err) return;
        if (data.length > 0) {
            mostrarMensaje(data);
        } else {
            aceptarLinea();
        }
    });
}

function mostrarMensaje(data) {
    var mens = 'La cuenta Contable ' + data + ' no existe en la contabilidad de la empresa, ¿ desea continuar ?';
    if (data.length > 1) mens = 'Las cuentas Contables ' + data + ' no existen en la contabilidad de la empresa, ¿ desea continuar ?';
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Cancelar][Aceptar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            aceptarLinea();
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada
        }
    });
}

function aceptarLinea() {
    var data = {
        empresaCuentas: {
            empresaCuentapagoId: vm.empresaCuentapagoId(),
            empresaId: vm.empresaId(),
            tipoFormaPagoId: vm.stipoFormaPagoId(),
            cuentapago: vm.cuentapago(),
            cuentacobro: vm.cuentacobro()
        }
    }
    var verbo = "POST";
    var url = myconfig.apiUrl + "/api/empresas/empresaCuentas/alta";
    if (lineaEnEdicion) {
        verbo = "PUT";
        url = myconfig.apiUrl + "/api/empresas/empresaCuentas/modifica/" + vm.empresaCuentapagoId();
    }
    llamadaAjax(verbo, url, data, function (err, data) {
        if (err) return;
        $('#modalLinea').modal('hide');
        loadLineasCuenta(empId);
    });
}

function deleteCuentaLinea(id) {
    // mensaje de confirmación
    var url = myconfig.apiUrl + "/api/empresas/empresaCuentas/" + id;
    var mens = "¿Realmente desea borrar este registro?";
    mensajeAceptarCancelar(mens, function () {
        
        llamadaAjax("DELETE", url, null, function (err, data) {
            if (err) return;
            loadLineasCuenta(empId);
        });
    }, function () {
        // cancelar no hace nada
    });
}

function editCuentaLinea(id) {
    lineaEnEdicion = true;
    llamadaAjax("GET", "/api/empresas/empresaCuentas/lineas/registro/uno/" + id, null, function (err, data) {
        if (err) return;
        if (data) loadDataLinea(data);
    });
}

function datosOKLineas() {
    $('#linea-form').validate({
        rules: {
            cmbTiposFormaPago: {
                required: true
            },
            txtCuentaPago: {
                required: true,
                minlength: 9,
                maxlength: 9
            },
            txtCuentaCobro: {
                required: true,
                minlength: 9,
                maxlength: 9
            }
        },
        // Messages for form validation
        messages: {
            cmbTiposFormaPago: {
                required: "Debe introducir un tipo de forma de pago"
            },
            txtCuentaPago: {
                required: "Debe introducir una cuenta contable",
                minlength: "La cuenta debe tener 9 digitos",
                maxlength: "La cuenta debe tener 9 digitos"
            },
            txtCuentaCobro: {
                required: "Debe introducir una cuenta contable",
                minlength: "La cuenta debe tener 9 digitos",
                maxlength: "La cuenta debe tener 9 digitos"
            },
            cmbTiposIva: {
                required: 'Debe elegir un tipo de IVA'
            },
            txtLinea: {
                required: 'Necesita un número de linea'
            },
            txtDescripcion: {
                required: 'Necesita una descripcion'
            },
            txtCantidad: {
                required: 'Necesita una cantidad'
            },
            txtPrecio: {
                required: 'Necesita un precio'
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#linea-form").validate().settings;
    return $('#linea-form').valid();
}

function initTablaCuentasLineas() {
    tablaCarro = $('#dt_lineas').DataTable({
        autoWidth: true,
        preDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper_dt_basic) {
                responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#dt_lineas'), breakpointDefinition);
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
        data: dataCuentasLineas,
        columns: [ {
            data: "TipoFormaPagoNombre"
        }, {
            data: "cuentapago",
           
        }, {
            data: "cuentacobro",
           
        }, {
            data: "empresaCuentapagoId",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='deleteCuentaLinea(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#modalLinea' onclick='editCuentaLinea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                // if (!vm.generada())
                //     html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });
}

function loadDataLinea(data) {
    vm.empresaCuentapagoId(data.empresaCuentapagoId),
    vm.cuentapago(data.cuentapago),
    vm.cuentacobro(data.cuentacobro);
    loadTiposFormaPago(data.tipoFormaPagoId);
}



function loadTablaCuentasLineas(data) {
    var dt = $('#dt_lineas').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) {
        numLineas = data.length;
        dt.fnAddData(data);
    }
    dt.fnDraw();
}


function loadLineasCuenta(id) {
    llamadaAjax("GET", "/api/empresas/empresaCuentas/lineas/" + id, null, function (err, data) {
        if (err) return;
        loadTablaCuentasLineas(data);
    });
}

function loadTiposFormaPago(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_forma_pago",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposFormaPago = [{ tipoFormaPagoId: null, nombre: "" }].concat(data);
            vm.posiblesTiposFormaPago(tiposFormaPago);
            $("#cmbTiposFormaPago").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}





