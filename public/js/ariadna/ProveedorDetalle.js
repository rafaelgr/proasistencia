/*-------------------------------------------------------------------------- 
proveedorDetalle.js
Funciones js par la página ProveedorDetalle.html
---------------------------------------------------------------------------*/
var proId = 0;
var cmd = "";


var numDigitos = 0; // número de digitos de cuenta contable

var intentos = 0;
var dataFacturas;
var facproveId;
var codigoSugerido;
var antNif = ""//recoge el valor que tiene el nif al cargar la página
var usuario;
var numfactu = 0;
var dataUsuarios;
var dataindices;
var usuarioEnEdicion = false;
var indiceEnEdicion = false;
var tablaFacturas;


datePickerSpanish(); // see comun.js

function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    // 
    getVersionFooter();
    usuario = recuperarUsuario();
    vm = new admData();
    ko.applyBindings(vm);
    // asignación de eventos al clic
    $("#btnAceptar").click(function () {
        aceptar(true)();
    });

    $("#btnAceptar2").click(function () {
        aceptar(false)();
    });

    $("#btnSalir").click(salir());
    $('#btnBuscar').click(buscarFacturasFecha());


    $('#frmProveedor').submit(function () {
        return false;
    });

    $("#frmUsuarios").submit(function () {
        return false;
    });
    $("#modalUsuariosPush-form").submit(function () {
        return false;
    });
    $("#modalIndicesCorrectores-form").submit(function () {
        return false;
    });

    $("#creacionCarpetas-form").submit(function () {
        return false;
    });

    $("#creacionSubcarpetas-form").submit(function () {
        return false;
    });


    $("#frmDoc").submit(function () {
        return false;
    });

    $("#frmloadDoc").submit(function () {
        return false;
    });

    $("#frmIndices").submit(function () {
        return false;
    });

    $("#frmBuscar").submit(function () {
        return false;
    });

    //carga de combos
    $("#cmbTiposIva").select2(select2Spanish());
    loadTiposIva();
    $("#cmbTiposVia").select2(select2Spanish());
    loadTiposVia();
    $("#cmbTiposViaRp").select2(select2Spanish());
    loadTiposViaRp();
    $("#cmbTiposViaRepresentante").select2(select2Spanish());
    loadTiposViaRepresentante();
    $("#cmbFormasPago").select2(select2Spanish());
    loadFormasPago();
    $("#cmbTiposProfesional").select2(select2Spanish());
    loadTiposProfesionales();
    $("#cmbTiposProfesionalIndice").select2(select2Spanish());
    //loadTiposProfesionalesIndice();
    // select2 things
    $("#cmbDepartamentosTrabajo").select2(select2Spanish());
    loadDepartamentos();
    $("#cmbPaises").select2(select2Spanish());
    loadPaises();
    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas();

    $("#cmbTiposProveedor").select2().on('change', function (e) {
        //alert(JSON.stringify(e.added));

        cambioTipoProveedor(e.added);
    });

    /* $("#txtNif").on('change', function (e) {
        var nif = $("#txtNif").val();
        if(!nif || nif == "") return;

        var nif = $("#txtNif").val();
        if(nif != "") {
            nif = nif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');
            $('#txtNif').val(nif);

            var patron = new RegExp(/^\d{8}[a-zA-Z]{1}$/);//VALIDA NIF
            var esNif = patron.test(nif);

            var patron2 = new RegExp(/^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/);
            var esCif = patron2.test(nif);
            if(esNif || esCif) {
                compruebaNifRepetido(nif);
            } else {
                mensError('El nif introducido no tiene un formato valido');
                compruebaNifRepetido(nif);
                //$('#txtNif').val('');
            }
        }
    }); */

    $(".esNif").on('change', function (e) {
        var origin = e.currentTarget.id;
        var nif = $('#' + origin).val();

        if (!nif || nif == "") return;

        if (nif != "") {
            nif = nif.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
            if (origin == "txtNif") vm.nif(nif);
            if (origin == "txtDniRp") vm.dniRp(nif);
            if (origin == "txtDniRepresentante") vm.dniRepresentante(nif);

            var patron = new RegExp(/^\d{8}[a-zA-Z]{1}$/);//VALIDA NIF
            var esNif = patron.test(nif);

            var patron2 = new RegExp(/^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/);
            var esCif = patron2.test(nif);
            if (esNif || esCif) {
                //si es el nif del proveedor comprobamos si está repetido
                if (origin == "txtNif") compruebaNifRepetido(nif);
            } else {
                mensError('El nif introducido no tiene un formato valido');
                if (origin == "txtNif") compruebaNifRepetido(nif);
                //$('#txtNif').val('');
            }
        }
    });


    loadTiposProveedor(1);
    $("#cmbMotivosBaja").select2(select2Spanish());
    loadMotivosBaja();

    $("#cmbTarifas").select2(select2Spanish());
    loadTarifas();

    $("#cmbTiposRetencion").select2(select2Spanish());
    loadTiposRetencion();

    $("#txtCodigo").blur(function () {
        compruebaCodigoProveedor();
    });

    $('#btnNuevaCarpeta').show();
    if (!usuario.puedeEditar) {
        $('#btnNuevaCarpeta').hide();
    }

    initTablaFacturas();
    initTablaUsuariosPush();
    initArbolDocumentacion();
    initTablaindicesCorrectores();

    //abrir en pestaña de facturas de proveedores
    if (gup('doc') != "") {
        $('.nav-tabs a[href="#s2"]').tab('show');
    }

    //validacion de fecha mayor que fecha
    $.validator.addMethod("greaterThan2",
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


    // autosalto en IBAN
    $(function () {
        $(".ibans").keyup(function () {
            if (this.value.length == this.maxLength) {
                var r = $(this).attr('id').substr(0, 7);
                var n = $(this).attr('id').substr(7);
                var n1 = n * 1 + 1;
                var r2 = r + n1;
                $("#" + r2).focus();
            }
        });
    });

    //actuaizacion de visualización del iban
    $(function () {
        $("#txtIban").change(function () {
            this.value = this.value.replace(/[- \s]/g, '');
            vm.iban(this.value);
            var num = 0;
            var cadena = null;
            var n1 = 0;
            for (var j = 1; j < 7; j++) {
                var s = $(this).attr('id').substr(0, 7);
                var s2 = s + j;
                $("#" + s2).val(null);
            }

            console.log(this.value)
            if (this.value.length > 0) {
                for (var i = 0; i < this.value.length; i++) {
                    if (!cadena) {
                        cadena = this.value.substr(i, 1);
                        num++;
                    } else {
                        cadena += this.value.substr(i, 1);
                        num++;
                    }
                    if (num == 4) {
                        var r = $(this).attr('id').substr(0, 7);
                        n1++;
                        var r2 = r + n1;
                        $("#" + r2).val(cadena);
                        num = 0;
                        cadena = null;
                    }
                }

            }
        });
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
        }, 'La fecha de alta debe ser menor que la fecha de baja.');
    //

    $.validator.addMethod("numberGreaterThan",
        function (value, element, params) {
            var fv = parseFloat(value);
            var fp = parseFloat($(params).val());
            if (!/Invalid|NaN/.test(new Date(fv))) {
                return fv > fp;
            }
        }, 'El máximo tiene que ser mayor que el mínimo.');


    // 7 bind to events triggered on the tree
    $('#jstreeDocumentacion').on("click.jstree", function (e) {
        var node = $(e.target).closest('.jstree-node');
        var selectedNodeId = node.attr('id');
        if (e.which === 1) {
            var jsTree = $.jstree.reference(e.target);
            var originalNode = jsTree.get_node(node);
            if (!originalNode.data.folder) {
                var url = originalNode.original.location;
                window.open(url, '_blank');
            }
        }
    });
    // 8 interact with the tree - either way is OK
    $('#demo').on('click', function () {
        $('#jstreeDocumentacion').jstree(true).select_node('child_node_1');
        $('#jstreeDocumentacion').jstree('select_node', 'child_node_1');
        $.jstree.reference('#jstreeDocumentacion').select_node('child_node_1');
    });

    //sublineas de la tabla indices_correctores
    $('#dt_indices').on('click', 'td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = tablaIndices.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(formatDataIndices(row.data())).show();
            tr.addClass('shown');
        }
    });



    // obtener el número de digitos de la contabilidad
    // para controlar la cuenta contable.
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/contabilidad/infcontable/",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            numDigitos = data.numDigitos
            proId = gup('ProveedorId');
            if (proId != 0) {
                var data = {
                    proveedorId: proId
                }
                $('#cmbTiposProveedor').attr('disabled', true);
                $('#txtCodigo').attr('disabled', true)
                // hay que buscar ese elemento en concreto
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/proveedores/" + proId,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        loadData(data);
                        loadFacturasDelProveedor(proId);
                        loadUsuariosPush(proId);
                        compruebaAnticipos(proId);
                        loadIndicesCorrectores(proId);
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
                });
            } else {
                // se trata de un alta ponemos el id a cero para indicarlo.
                vm.proveedorId(0);
                vm.activa(1);
                vm.cuentaContable(null);
                // contador de código
                var inicioCuenta = "40";
                $.ajax({
                    type: "GET",
                    url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor/" + inicioCuenta,
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        // hay que mostrarlo en la zona de datos
                        vm.codigo(data.codigo);
                        codigoSugerido = data.codigo;//guardamos el codigo sugerido para poder usarlo si se cambia el codigo y resulta que ya está asignado
                        $.ajax({
                            type: "GET",
                            url: "/api/tipos_proveedor/" + 1,
                            dataType: "json",
                            contentType: "application/json",
                            success: function (data, status) {
                                vm.inicioCuenta(data.inicioCuenta);
                                var codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos);
                                vm.cuentaContable(codmacta);
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    },
                    error: function (err) {
                        mensErrorAjax(err);
                        // si hay algo más que hacer lo haremos aquí.
                    }
                });

                loadFacturasDelProveedor();
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function admData() {
    var self = this;
    self.proveedorId = ko.observable();
    self.codigo = ko.observable();
    self.serie = ko.observable();
    self.proId = ko.observable();
    self.nombre = ko.observable();
    self.nif = ko.observable();
    self.direccion = ko.observable();
    self.codPostal = ko.observable();
    self.poblacion = ko.observable();
    self.provincia = ko.observable();
    self.telefono = ko.observable();
    self.correo = ko.observable();
    self.telefono2 = ko.observable();
    self.movil = ko.observable();
    self.movil2 = ko.observable();
    self.correo2 = ko.observable();
    self.contacto = ko.observable();
    self.fechaAlta = ko.observable();
    self.fechaBaja = ko.observable();
    self.cuentaContable = ko.observable();
    self.codigoProfesional = ko.observable();
    self.iban = ko.observable();
    self.iban1 = ko.observable();
    self.iban2 = ko.observable();
    self.iban3 = ko.observable();
    self.iban4 = ko.observable();
    self.iban5 = ko.observable();
    self.iban6 = ko.observable();
    self.inicioCuenta = ko.observable();
    self.tipoProOriginalId = ko.observable();
    self.codigoOriginal = ko.observable();
    self.observaciones = ko.observable();
    self.emitirFacturas = ko.observable();
    self.cerTitularidad = ko.observable();
    self.cerFormativoSalud = ko.observable();
    self.activa = ko.observable();
    //DATOS DE LA FIANZA
    self.fianza = ko.observable('0.00');
    self.fianzaAcumulada = ko.observable('0.00');
    self.retencionFianza = ko.observable('0.00');
    self.revisionFianza = ko.observable();

    //
    self.tipoViaId = ko.observable();
    self.stipoViaId = ko.observable();
    //
    self.posiblesTiposVia = ko.observableArray([]);
    self.elegidosTiposVia = ko.observableArray([]);
    //
    self.formaPagoId = ko.observable();
    self.sformaPagoId = ko.observable();
    //
    self.posiblesFormasPago = ko.observableArray([]);
    self.elegidosFormasPago = ko.observableArray([]);
    //
    self.tipoProveedorId = ko.observable();
    self.stipoProveedorId = ko.observable();
    //
    self.posiblesTiposProveedor = ko.observableArray([]);
    self.elegidosTiposProveedor = ko.observableArray([]);
    //
    self.tipoProfesionalId = ko.observable();
    self.stipoProfesionalId = ko.observable();
    //
    self.posiblesTiposProfesional = ko.observableArray([]);
    self.elegidosTiposProfesional = ko.observableArray([]);
    //
    self.motivoBajaId = ko.observable();
    self.smotivoBajaId = ko.observable();
    //
    self.posiblesMotivosBaja = ko.observableArray([]);
    self.elegidosMotivosBaja = ko.observableArray([]);
    //
    self.tarifaProveedorId = ko.observable();
    self.starifaProveedorId = ko.observable();
    //
    self.posiblesTarifas = ko.observableArray([]);
    self.elegidasTarifas = ko.observableArray([]);

    //COMBIO RETENCIONES
    self.codigoRetencion = ko.observable();
    self.scodigoRetencion = ko.observable();
    //
    self.posiblesTiposRetencion = ko.observableArray([]);
    self.elegidosCodigosRetencion = ko.observableArray([]);
    //COMBO TIPOS IVA
    self.tipoIvaId = ko.observable();
    self.stipoIvaId = ko.observable();
    //
    self.posiblesTiposIva = ko.observableArray([]);
    self.elegidosTiposIva = ko.observableArray([]);

    //combo departamentos
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);

    //combo paises
    //
    self.paisId = ko.observable();
    self.spaisId = ko.observable();
    //
    self.posiblesPaises = ko.observableArray([]);
    self.elegidosPaises = ko.observableArray([]);

    //COMBO EMPRESA
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);

    //USUARIOS PUSH
    self.proveedorUsuarioPushId = ko.observable();
    self.nombrePush = ko.observable();
    self.loginPush = ko.observable();
    self.passwordPush = ko.observable();

    //INDICES CORRECTORES
    self.indiceCorrectorId = ko.observable();
    self.nombreIndice = ko.observable();
    self.minimo = ko.observable();
    self.maximo = ko.observable();
    self.porcentajeDescuento = ko.observable();
    //COMBO PROFESIONES INDICE CORRECTOR
    //
    self.stipoProfesionalIndiceId = ko.observable();
    //
    self.posiblesTiposProfesionalIndice = ko.observableArray([]);
    self.elegidosTiposProfesionalIndice = ko.observableArray([]);


    //RECURSO PREVNTIVO
    self.nombreRp = ko.observable();
    self.dniRp = ko.observable();
    self.direccionRp = ko.observable();
    self.poblacionRp = ko.observable();
    self.categoriaProfesional = ko.observable();
    self.nivelFormativoSalud = ko.observable();
    self.codPostalRp = ko.observable();
    self.provinciaRp = ko.observable();
    //
    self.tipoViaRpId = ko.observable();
    self.stipoViaRpId = ko.observable();
    //
    self.posiblesTiposViaRp = ko.observableArray([]);
    self.elegidosTiposViaRp = ko.observableArray([]);

    //REPRESENTANTE
    self.nombreRepresentante = ko.observable();
    self.dniRepresentante = ko.observable();
    self.direccionRepresentante = ko.observable();
    self.poblacionRepresentante = ko.observable();
    self.codPostalRepresentante = ko.observable();
    self.provinciaRepresentante = ko.observable();
    //
    self.stipoViaRepresentanteId = ko.observable();
    //
    self.posiblesTiposViaRepresentante = ko.observableArray([]);
    self.elegidosTiposViaRepresentante = ko.observableArray([]);

    //CARPETAS  Y DOCUMENTOS
    self.carpetaNombre = ko.observable();
    self.subCarpetaNombre = ko.observable();
    self.documNombre = ko.observable();
    //
    self.files = ko.observable();

    //
    self.desdeFecha = ko.observable();
    self.hastaFecha = ko.observable();
}

function loadData(data) {
    vm.proveedorId(data.proveedorId);
    vm.codigo(data.codigo);
    vm.serie(data.serie);
    vm.codigoOriginal(data.codigo);
    vm.proId(data.proId);
    vm.nombre(data.nombre);
    vm.nif(data.nif);
    vm.direccion(data.direccion);
    vm.codPostal(data.codPostal);
    vm.provincia(data.provincia);
    vm.telefono(data.telefono);
    vm.correo(data.correo);
    vm.poblacion(data.poblacion);
    vm.telefono2(data.telefono2);
    vm.movil(data.movil);
    vm.movil2(data.movil2);
    vm.correo2(data.correo2);
    vm.contacto(data.persona_contacto);
    vm.fechaAlta(spanishDate(data.fechaAlta));
    vm.fechaBaja(spanishDate(data.fechaBaja));
    vm.cuentaContable(data.cuentaContable);
    vm.iban(data.IBAN);
    vm.fianza(data.fianza);
    vm.fianzaAcumulada(data.fianzaAcumulada);
    vm.retencionFianza(data.retencionFianza);
    vm.revisionFianza(spanishDate(data.revisionFianza));
    vm.codigoProfesional(data.codigoProfesional);
    vm.observaciones(data.observaciones);
    vm.paisId(data.paisId);
    vm.emitirFacturas(data.emitirFacturas);
    vm.cerTitularidad(data.cerTitularidad);
    vm.cerFormativoSalud(data.cerFormativoSalud)
    vm.activa(data.activa);
    //recurso preventivo
    vm.nombreRp(data.nombreRp);
    vm.dniRp(data.dniRp);
    vm.direccionRp(data.direccionRp);
    vm.poblacionRp(data.poblacionRp);
    vm.codPostalRp(data.codPostalRp);
    vm.provinciaRp(data.provinciaRp);
    vm.categoriaProfesional(data.categoriaProfesional);
    vm.nivelFormativoSalud(data.nivelFormativoSalud);
    //representante
    vm.nombreRepresentante(data.nombreRepresentante);;
    vm.dniRepresentante(data.dniRepresentante);
    vm.nombreRepresentante(data.nombreRepresentante);
    vm.dniRepresentante(data.dniRepresentante);
    vm.direccionRepresentante(data.direccionRepresentante);
    vm.poblacionRepresentante(data.poblacionRepresentante);
    vm.codPostalRepresentante(data.codPostalRepresentante);
    vm.provinciaRepresentante(data.provinciaRepresentante);


    antNif = data.nif;
    // split iban
    if (vm.iban()) {
        var ibanl = vm.iban().match(/.{4}/g);
        var i = 0;
        ibanl.forEach(function (ibn) {
            i++;
            vm['iban' + i](ibn);
        });
    }
    obtenInicioCuenta();

    loadTiposVia(data.tipoViaId);
    loadTiposViaRp(data.tipoViaRpId);
    loadTiposViaRepresentante(data.tipoViaRepresentanteId);
    loadTiposIva(data.tipoIvaId)
    loadFormasPago(data.formaPagoId);
    loadTiposProveedor(data.tipoProveedor);
    //loadTiposProfesional(data.tipoProfesionalId);
    loadMotivosBaja(data.motivoBajaId);
    loadTarifas(data.tarifaId);
    loadTiposRetencion(data.codigoRetencion);
    loadPaises(data.paisId);
    loadEmpresas(data.empresaId);
    buscaDepartamentos();
    buscaProfesiones();
    //loadDepartamentos(data.departamentoId)

    cargaTablaDocumentacion();
}

function obtenInicioCuenta() {
    var codmacta = vm.cuentaContable();
    var inicio = codmacta.substr(0, 2);
    vm.inicioCuenta(inicio);

}

function datosOK() {
    $('#frmProveedor').validate({
        rules: {
            txtNif: {
                required: true
            },
            txtNombre: {
                required: true
            },
            txtCorreo: {
                email: true
            },
            txtCorreo2: {
                email: true
            },
            cmbFormasPago: {
                required: true
            },
            cmbTiposIva: {
                required: true
            },
            cmbTiposProveedor: {
                required: true
            },
            cmbDepartamentosTrabajo: {
                required: true
            },
            cmbTiposProfesional: {
                required: true
            },
            txtFechaAlta: {
                required: true
            },
            txtfechaBaja: {
                greaterThan: "#txtFechaAlta",
            },
            txtCodigo: {
                required: true,
                digits: true
            },
            txtCodigoProfesional: {
                required: true
            },
            txtCuentaContable: {
                required: true
            },
            cmbPaises: {
                required: true,
            },
            cmbEmpresas: {
                required: true,
            }
        },
        // Messages for form validation
        messages: {
            txtNif: {
                required: "Introduzca un NIF"
            },
            txtNombre: {
                required: 'Introduzca el nombre'
            },
            txtCorreo: {
                email: 'Debe usar un correo válido'
            },
            cmbFormasPago: {
                required: "Debe elegir una forma de pago"
            },
            cmbTiposIva: {
                required: "Debe elegir un tipo de iva"
            },
            cmbTiposProveedor: {
                required: "Debe elegir un tipo de proveedor"
            },
            cmbDepartamentosTrabajo: {
                required: "Debe elegir al menos un departamento"
            },
            cmbTiposProfesional: {
                required: "Debe elegir al menos un tipo de profesional"
            },
            txtFechaAlta: {
                required: "Debe seleccionar una fecha"
            },
            txtCodigo: {
                required: "Debe introducir un código para la contabilidad",
                digits: "Debe introducir un número"
            },
            txtCodigoProfesional: {
                required: "Debe introducir un código profesional de proveedor"
            },
            txtCuentaContable: {
                required: "Este campo no puede estar vacio"
            },
            cmbPaises: {
                required: "Debe introducir un código de país"
            },
            cmbEmpresas: {
                required: "Debe introducir una empresa de facturación"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmProveedor").validate().settings;

    // iban
    //vm.iban(vm.iban1() + vm.iban2() + vm.iban3() + vm.iban4() + vm.iban5() + vm.iban6());
    var opciones = $("#frmProveedor").validate().settings;
    if (vm.iban() && vm.iban() != "") {
        if (!IBAN.isValid(vm.iban())) {
            mensError("IBAN incorrecto");
            return false;
        }
    }

    return $('#frmProveedor').valid();
}

function aceptar(salir) {
    var mf = function () {
        if (!datosOK()) return;
        if (!vm.fianza() || vm.fianza() == '') vm.fianza('0.00');
        if (vm.starifaProveedorId() == 0) vm.starifaProveedorId(null);
        if (vm.sempresaId() == 0) vm.sempresaId(null);
        if (!vm.cuentaContable() || vm.cuentaContable() == '') {
            mensError('La cuenta contable está vacia');
            return;
        }
        var data = {
            proveedor: {
                "proveedorId": vm.proveedorId(),
                "codigo": vm.codigo(),
                "serie": vm.serie(),
                "proId": vm.proId(),
                "nombre": vm.nombre(),
                "nif": vm.nif(),
                "direccion": vm.direccion(),
                "poblacion": vm.poblacion(),
                "provincia": vm.provincia(),
                "codPostal": vm.codPostal(),
                "telefono": vm.telefono(),
                "correo": vm.correo(),
                "tipoViaId": vm.stipoViaId(),
                "tipoProveedor": vm.stipoProveedorId(),
                "tipoProfesionalId": vm.stipoProfesionalId(),
                "telefono2": vm.telefono2(),
                "movil": vm.movil(),
                "movil2": vm.movil2(),
                "correo2": vm.correo2(),
                "persona_contacto": vm.contacto(),
                "fechaAlta": spanishDbDate(vm.fechaAlta()),
                "fechaBaja": spanishDbDate(vm.fechaBaja()),
                "activa": vm.activa(),
                "motivoBajaId": vm.smotivoBajaId(),
                "cuentaContable": vm.cuentaContable(),
                "formaPagoId": vm.sformaPagoId(),
                "IBAN": vm.iban(),
                "codigoProfesional": vm.codigoProfesional(),
                "fianza": vm.fianza(),
                "tipoIvaId": vm.stipoIvaId(),
                "fianzaAcumulada": vm.fianzaAcumulada(),
                "retencionFianza": vm.retencionFianza(),
                "revisionFianza": spanishDbDate(vm.revisionFianza()),
                "tarifaId": vm.starifaProveedorId(),
                "codigoRetencion": vm.scodigoRetencion(),
                "observaciones": vm.observaciones(),
                "paisId": vm.spaisId(),
                "emitirFacturas": vm.emitirFacturas(),
                "cerTitularidad": vm.cerTitularidad(),
                "cerFormativoSalud": vm.cerFormativoSalud(),
                "empresaId": vm.sempresaId(),
                "nombreRp": vm.nombreRp(),
                "dniRp": vm.dniRp(),
                "tipoViaRpId": vm.stipoViaRpId(),
                "direccionRp": vm.direccionRp(),
                "poblacionRp": vm.poblacionRp(),
                "codPostalRp": vm.codPostalRp(),
                "provinciaRp": vm.provinciaRp(),
                "categoriaProfesional": vm.categoriaProfesional(),
                "nivelFormativoSalud": vm.nivelFormativoSalud(),
                "nombreRepresentante": vm.nombreRepresentante(),
                "dniRepresentante": vm.dniRepresentante(),
                "nombreRepresentante": vm.nombreRepresentante(),
                "dniRepresentante": vm.dniRepresentante(),
                "direccionRepresentante": vm.direccionRepresentante(),
                "poblacionRepresentante": vm.poblacionRepresentante(),
                "codPostalRepresentante": vm.codPostalRepresentante(),
                "provinciaRepresentante": vm.provinciaRepresentante(),
                "tipoViaRepresentanteId": vm.stipoViaRepresentanteId()
            },
            departamentos: {
                "departamentos": vm.elegidosDepartamentos()
            },
            profesiones: {
                "profesiones": vm.elegidosTiposProfesional()
            }
        };

        var verb = "POST";
        var url = myconfig.apiUrl + "/api/proveedores";
        var returnUrl = "ProveedoresGeneral.html?cmd=nuevo&ProveedorId=";

        // caso modificación
        if (proId != 0) {
            verb = "PUT";
            url = myconfig.apiUrl + "/api/proveedores/" + proId;
            "ProveedoresGeneral.html?ProveedorId=" + proId;
        }
        $.ajax({
            type: verb,
            url: url,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                if (salir) {
                    window.open(returnUrl, '_self');
                } else {
                    if (verb == 'POST') {
                        returnUrl = "ProveedorDetalle.html?ProveedorId=" + data.proveedorId;
                        window.open(returnUrl, '_self');
                        mensNormal('Proveedor guardado.');
                    }

                }
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
        var url = "ProveedoresGeneral.html";
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

function loadTiposViaRp(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposViaRp(tiposVia);
            $("#cmbTiposViaRp").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposViaRepresentante(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_via",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposVia = [{ tipoViaId: 0, nombre: "" }].concat(data);
            vm.posiblesTiposViaRepresentante(tiposVia);
            $("#cmbTiposViaRepresentante").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadEmpresas(empresaId) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: null, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        $("#cmbEmpresas").val([empresaId]).trigger('change');
        if (empresaId) vm.sempresaId(empresaId);
    });
}

function loadTiposIva(id) {
    llamadaAjax("GET", "/api/tipos_iva", null, function (err, data) {
        if (err) return;
        var tiposIva = [{ tipoIvaId: 0, nombre: "" }].concat(data);
        vm.posiblesTiposIva(tiposIva);
        if (id) {
            $("#cmbTiposIva").val([id]).trigger('change');
        } else {
            $("#cmbTiposIva").val([null]).trigger('change');
        }
    });
}

function loadTiposProveedor(id) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_proveedor",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tiposProveedor = [{ tipoProveedorId: null, nombre: "" }].concat(data);
            vm.posiblesTiposProveedor(tiposProveedor);
            $("#cmbTiposProveedor").val([id]).trigger('change');
            vm.tipoProOriginalId(vm.stipoProveedorId());
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}



function loadFormasPago(formaPagoId) {
    llamadaAjax("GET", "/api/formas_pago", null, function (err, data) {
        if (err) return;
        var formasPago = [{ formaPagoId: 0, nombre: "" }].concat(data);
        vm.posiblesFormasPago(formasPago);
        $("#cmbFormasPago").val([formaPagoId]).trigger('change');
    });
}

function loadMotivosBaja(id) {
    llamadaAjax("GET", '/api/motivos_baja', null, function (err, data) {
        if (err) return;
        var motivoBaja = [{ motivoBajaId: 0, nombre: "" }].concat(data);
        vm.posiblesMotivosBaja(motivoBaja);
        $("#cmbMotivosBaja").val([id]).trigger('change');
    });
}

function loadTarifas(id) {
    $.ajax({
        type: "GET",
        url: "/api/tarifas_proveedor",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var tarifas = [{ tarifaProveedorId: 0, nombre: "" }].concat(data);
            vm.posiblesTarifas(tarifas);
            $("#cmbTarifas").val([id]).trigger('change');
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function loadTiposRetencion(id) {
    llamadaAjax("GET", "/api/facturasProveedores/retenciones/tiposreten/facprove", null, function (err, data) {
        if (err) return;
        vm.posiblesTiposRetencion(data);
        if (id) {
            $("#cmbTiposRetencion").val([id]).trigger('change');
            vm.scodigoRetencion(id);

        } else {
            $("#cmbTiposRetencion").val([0]).trigger('change');
            vm.scodigoRetencion(0);

        }
    });
}

function loadDepartamentos(departamentosIds) {
    llamadaAjax("GET", "/api/departamentos/usuario/" + usuario.usuarioId, null, function (err, data) {
        var ids = [];
        if (err) return;
        var departamentos = data;
        vm.posiblesDepartamentos(departamentos);
        if (departamentosIds) {
            vm.elegidosDepartamentos(departamentosIds);
            for (var i = 0; i < departamentosIds.length; i++) {
                ids.push(departamentosIds[i].departamentoId)
            }
            $("#cmbDepartamentosTrabajo").val(ids).trigger('change');
        }
    });
}

function loadTiposProfesionales(tiposProfesionalesIds) {
    $.ajax({
        type: "GET",
        url: "/api/tipos_profesional/",
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var ids = [];
            var tiposProfesionales = data
            vm.posiblesTiposProfesional(tiposProfesionales);
            if (tiposProfesionalesIds) {
                vm.elegidosTiposProfesional(tiposProfesionalesIds);
                for (var i = 0; i < tiposProfesionalesIds.length; i++) {
                    ids.push(tiposProfesionalesIds[i].tipoProfesionalId)
                }
                $("#cmbTiposProfesional").val(ids).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


function loadTiposProfesionalesIndice(tiposProfesionalesIds) {
    $.ajax({
        type: "GET",
        url: "/api/proveedores/profesiones/asociadas/todas/" + vm.proveedorId(),//LAS PROFESIONES QUE TIENE ASIGNADAS EL PROVEEDOR SON LAS ELEGIBLES EN EL COMBO
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var ids = [];
            var tiposProfesionales = data
            vm.posiblesTiposProfesionalIndice(tiposProfesionales);
            $("#cmbTiposProfesionalIndice").val([]).trigger('change');
            if (tiposProfesionalesIds) {
                vm.elegidosTiposProfesionalIndice(tiposProfesionalesIds);
                for (var i = 0; i < tiposProfesionalesIds.length; i++) {
                    ids.push(tiposProfesionalesIds[i].tipoProfesionalId)
                }
                $("#cmbTiposProfesionalIndice").val(ids).trigger('change');
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}



function loadPaises(id) {
    llamadaAjax("GET", "/api/proveedores/recupera/cod/pais", null, function (err, data) {
        if (err) return;
        var paises = [{ paisId: null, nombre: "" }].concat(data);
        vm.posiblesPaises(paises);
        if (id) {
            $("#cmbPaises").val([id]).trigger('change');
        } else {
            $("#cmbPaises").val([null]).trigger('change');
        }
    });
}



function buscaDepartamentos() {
    llamadaAjax("GET", "/api/proveedores/departamentos/asociados/" + proId, null, function (err, data) {
        if (err) return;
        loadDepartamentos(data);
    });
}

function buscaProfesiones() {
    llamadaAjax("GET", "/api/proveedores/profesiones/asociadas/todas/" + proId, null, function (err, data) {
        if (err) return;
        loadTiposProfesionales(data);
    });
}




function compruebaCodigoProveedor() {
    var codmacta;
    if (vm.stipoProveedorId()) {
        if (vm.codigo()) {
            var codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos);
            vm.cuentaContable(codmacta);
            llamadaAjax("GET", "/api/proveedores/codigo/proveedor/" + vm.cuentaContable(), null, function (err, data) {
                if (!data) {
                    if (vm.stipoProveedorId() == vm.tipoProOriginalId()) {
                        if (vm.codigoOriginal()) vm.codigo(vm.codigoOriginal());
                        if (vm.inicioCuenta() && vm.codigo() && numDigitos) { }
                        codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos);
                        vm.cuentaContable(codmacta);
                    }
                }
                if (data) {
                    if (vm.stipoProveedorId() == vm.tipoProOriginalId()) {
                        if (vm.codigoOriginal()) vm.codigo(vm.codigoOriginal());
                        codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos);
                        vm.cuentaContable(codmacta);
                    } else {
                        mostrarMensajeSmart('La cuenta contable ya existe');
                        vm.codigo(codigoSugerido);
                        codmacta = montarCuentaContable(vm.inicioCuenta(), vm.codigo(), numDigitos);
                        vm.cuentaContable(codmacta);
                    }
                }
            });
        }
    }
}
function cambioTipoProveedor(data) {
    if (data) {
        if (vm.cuentaContable() && vm.cuentaContable() != '') {
            // mensaje de confirmación
            var mens = "Al cambiar el tipo de proveedor se cambiará su cuenta contable ¿Realmente desea cambiar el tipo de proveedor registro?";
            $.SmartMessageBox({
                title: "<i class='fa fa-info'></i> Mensaje",
                content: mens,
                buttons: '[Aceptar][Cancelar]'
            }, function (ButtonPressed) {
                if (ButtonPressed === "Aceptar") {
                    $.ajax({
                        type: "GET",
                        url: "/api/tipos_proveedor/" + data.id,
                        dataType: "json",
                        contentType: "application/json",
                        success: function (data, status) {
                            vm.inicioCuenta(data.inicioCuenta);
                            // contador de código
                            $.ajax({
                                type: "GET",
                                url: myconfig.apiUrl + "/api/proveedores/nuevoCod/proveedor/" + data.inicioCuenta,
                                dataType: "json",
                                contentType: "application/json",
                                data: JSON.stringify(data),
                                success: function (datos, status) {
                                    //guardamos el codigo sugerido para poder usarlo si se cambia el codigo y resulta que ya está asignado
                                    codigoSugerido = datos.codigo;
                                    vm.codigo(datos.codigo)
                                    compruebaCodigoProveedor();

                                },
                                error: function (err) {
                                    mensErrorAjax(err);
                                    // si hay algo más que hacer lo haremos aquí.
                                }
                            });

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
        } else {
            $.ajax({
                type: "GET",
                url: "/api/tipos_proveedor/" + data.id,
                dataType: "json",
                contentType: "application/json",
                success: function (data, status) {
                    vm.inicioCuenta(data.inicioCuenta);
                    compruebaCodigoProveedor();
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });

            /* mensError("No hay una cuenta contable por defecto, recargue la página");
            return; */
        }
    }
}


function compruebaNifRepetido(nif) {
    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/proveedores/comprueba/nif/repetido/" + nif,
        dataType: "json",
        contentType: "application/json",
        data: null,
        success: function (data, status) {
            if (data && data.proveedorId != vm.proveedorId()) {
                mensError('Ya existe un proveedor con este NIF');

            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}


//---- Solapa facturas
function initTablaFacturas() {
    var buttonCommon = {
        exportOptions: {
            format: {
                body: function (data, row, column, node) {
                    // Strip $ from salary column to make it numeric
                    if (column === 5 || column === 6 || column === 7) {
                        //regresar = importe.toString().replace(/\./g,',');
                        var dato = numeroDbf(data);
                        console.log(dato);
                        return dato;
                    } else {
                        if (column === 0 || column === 9) {
                            return "";
                        } else {
                            return data;
                        }
                    }
                }
            }
        }
    };
    tablaFacturas = $('#dt_factura').DataTable({
        bSort: true,
        paging: false,

        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'Br><'col-sm-6 col-xs-6 hidden-xs' 'l C >r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        buttons: [
            'copy',
            'csv',
            $.extend(true, {}, buttonCommon, {
                extend: 'excel',
                title: ''
            }),
            {

                extend: 'pdf',
                title: '',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            },
            'print'
        ],
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },
        columnDefs: [

            {
                "type": "datetime-moment",
                "targets": [3, 4],
                "render": function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        if (!data) return null;
                        return moment(data).format('DD/MM/YYYY');
                    }
                    // Si es para ordenar, usa un formato que DataTables pueda entender (p. ej., 'YYYY-MM-DD HH:mm:ss')
                    else if (type === 'sort') {
                        if (!data) return null;
                        return moment(data).format('YYYY-MM-DD HH:mm:ss');
                    }
                    // En otros casos, solo devuelve los datos sin cambios
                    else {
                        if (!data) return null;
                        return data;
                    }
                }
            }
        ],

        autoWidth: true,

        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(), data;

            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            total = api
                .column(5, { search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0);




            ///////

            // Total over all pages
            total2 = api
                .column(6, { search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0);

            // Total over all pages
            total3 = api
                .column(7, { search: 'applied' })
                .data()
                .reduce(function (a, b) {
                    return Math.round((intVal(a) + intVal(b)) * 100) / 100;
                }, 0);





            // Update footer
            $(api.columns(5).footer()).html(
                numeral(total).format('0,0.00')
            );

            $(api.columns(6).footer()).html(
                numeral(total2).format('0,0.00')
            );

            $(api.columns(7).footer()).html(
                numeral(total3).format('0,0.00')
            );


            //////


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
        data: dataFacturas,
        columns: [{
            data: "facproveId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "numeroFacturaProveedor"
        }, {
            data: "receptorNombre"
        }, {
            data: "fecha"

        }, {
            data: "fecha_recepcion"
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
            data: "importeRetencion",
            render: function (data, type, row) {
                var string = numeral(data).format('0,0.00');
                return string;
            }
        }, {
            data: "vFPago"
        }, {
            data: "facproveId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteFactura(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editFactura(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                //var bt3 = "<button class='btn btn-circle btn-success' onclick='printFactura2(" + data + ");' title='Imprimir PDF'> <i class='fa fa-print fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "" + /*bt3 +*/ "</div>";
                return html;
            }
        }]
    });

    //function sort by date
    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
        "date-uk-pre": function (a) {
            var ukDatea = a.split('/');
            return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
        },

        "date-uk-asc": function (a, b) {
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        },

        "date-uk-desc": function (a, b) {
            return ((a < b) ? 1 : ((a > b) ? -1 : 0));
        }
    });

    // Apply the filter
    $("#dt_factura thead th input[type=text]").on('keyup change', function () {
        tablaFacturas
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();
    });


}


function loadFacturasDelProveedor(proveedorId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/facturasProveedores/proveedor/facturas/solapa/muestra/tabla/datos/factura/" + proveedorId, null, function (err, data) {
        if (err) return;
        loadTablaFacturas(data);
    });
}

function loadTablaFacturas(data) {
    var dt = $('#dt_factura').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    if (data) {
        numfactu = data.length;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function editFactura(id) {
    var url = "FacturaProveedorDetalle.html?facproveId=" + id + '&desdeProveedor=true';
    window.open(url, '_new');
}

function deleteFactura(id) {
    // mensaje de confirmación
    var mens = "¿Realmente desea borrar este registro?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {
            $.ajax({
                type: "GET",
                url: myconfig.apiUrl + "/api/facturasProveedores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    if (data.nombreFacprovePdf) {
                        $.ajax({
                            type: "DELETE",
                            url: myconfig.apiUrl + "/api/doc/" + data.nombreFacprovePdf,
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            success: function (data, status) {
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    }
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });

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
                    var fn = buscarFacturas();
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

function buscarFacturas() {
    var mf = function () {
        loadFacturasDelProveedor(proId);
    };
    return mf;
}



function compruebaAnticipos(id) {
    llamadaAjax('GET', "/api/anticiposProveedores/proveedor/recupera/todos/" + id, null, function (err, data) {
        if (err) return;
        if (data.length > 0 || numfactu > 0) {
            $("#txtNif").prop("disabled", true);
            $("#txtCodigo").prop("disabled", true);
        } else {
            $("#txtNif").prop("disabled", false);
            $("#txtCodigo").prop("disabled", false);
        }
    });
}

// --------------- Solapa de Usuarios
function initTablaUsuariosPush() {
    tablaSeries = $('#dt_usuarios').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C>r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },

        autoWidth: true,
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
        data: dataUsuarios,
        columns: [{
            data: "proveedorUsuarioPushId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "nombre"
        }, {
            data: "login"
        }, {
            data: "password"
        }, {
            data: "proveedorUsuarioPushId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteUsuariosPush(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editUsuariosPush(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

}


function loadUsuariosPush(proveedorId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/proveedores/usuarios/proveedor/app/" + proveedorId, null, function (err, data) {
        if (err) return;
        loadTablaUsuariosPush(data);
    });
}

function loadTablaUsuariosPush(data) {
    var dt = $('#dt_usuarios').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function guardarUsuarioPush() {
    //COMPROBAMOS PRIMERO QUE NO HAYA YA UN USUARIO CON ESTE LOGIN Y CONTRASEÑA 

    var encontrado = 0;
    var data = {
        usuarioPush: {
            nombre: vm.nombrePush(),
            login: vm.loginPush(),
            password: vm.passwordPush(),
            proveedorId: proId
        }
    }

    $.ajax({
        type: "GET",
        url: myconfig.apiUrl + "/api/proveedores/login/usuPush/password/registro/" + vm.loginPush() + "/" + vm.passwordPush(),
        dataType: "json",
        contentType: "application/json",
        data: null,
        success: function (datos, status) {
            // si se devuelve un registro el login/password ya existe y hay que comprobar que se trate de otro registro y 
            //no que simplemente estemos editando y ayamos aceprado sin cambiar nada
            if (datos) {
                if (datos.length > 0) {
                    for (var i = 0; i < datos.length; i++) {
                        if (datos[i].proveedorUsuarioPushId != vm.proveedorUsuarioPushId()) {
                            mensError("Ya existe un proveedor con este usuario y contraseña");
                            encontrado = 1;
                            break;
                        }
                    }

                    if (encontrado) return;
                    if (!usuarioEnEdicion) {
                        if (!datosOKUsuariosPush()) return;
                        $.ajax({
                            type: "POST",
                            url: myconfig.apiUrl + "/api/proveedores/usuarios/proveedor/app/nuevo",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            success: function (data, status) {
                                // hay que mostrarlo en la zona de datos
                                loadUsuariosPush(vm.proveedorId());
                                $('#modalUsuariosPush').modal('hide');
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    } else {
                        $.ajax({
                            type: "PUT",
                            url: myconfig.apiUrl + "/api/proveedores/usuarios/proveedor/app/modifica/" + vm.proveedorUsuarioPushId(),
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            success: function (data, status) {
                                // hay que mostrarlo en la zona de datos
                                usuarioEnEdicion = false;
                                empSerieId = 0;
                                loadUsuariosPush(vm.proveedorId());
                                $('#modalUsuariosPush').modal('hide');
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    }

                } else {
                    if (!usuarioEnEdicion) {
                        if (!datosOKUsuariosPush()) return;
                        $.ajax({
                            type: "POST",
                            url: myconfig.apiUrl + "/api/proveedores/usuarios/proveedor/app/nuevo",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            success: function (data, status) {
                                // hay que mostrarlo en la zona de datos
                                loadUsuariosPush(vm.proveedorId());
                                $('#modalUsuariosPush').modal('hide');
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    } else {
                        $.ajax({
                            type: "PUT",
                            url: myconfig.apiUrl + "/api/proveedores/usuarios/proveedor/app/modifica/" + vm.proveedorUsuarioPushId(),
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            success: function (data, status) {
                                // hay que mostrarlo en la zona de datos
                                usuarioEnEdicion = false;
                                empSerieId = 0;
                                loadUsuariosPush(vm.proveedorId());
                                $('#modalUsuariosPush').modal('hide');
                            },
                            error: function (err) {
                                mensErrorAjax(err);
                                // si hay algo más que hacer lo haremos aquí.
                            }
                        });
                    }
                }
            }
        },
        error: function (err) {
            mensErrorAjax(err);
            // si hay algo más que hacer lo haremos aquí.
        }
    });
}

function deleteUsuariosPush(id) {
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
                url: myconfig.apiUrl + "/api/proveedores/usuarios/proveedor/app/elimina/" + id,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    loadUsuariosPush(vm.proveedorId());
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            limpiaModalUsuariosPush();
            // no hacemos nada (no quiere borrar)
        }
    });
}

function limpiaModalUsuariosPush() {
    vm.proveedorUsuarioPushId(null);
    vm.nombrePush(null);
    vm.loginPush(null);
    vm.passwordPush(null);

}

function editUsuariosPush(id) {
    usuarioEnEdicion = true;
    cargaModalUsuariosPush(id);
}

function cargaModalUsuariosPush(id) {
    limpiaModalUsuariosPush();
    if (id) {
        llamadaAjax("GET", myconfig.apiUrl + "/api/proveedores/usuario/proveedor/app/" + id, null, function (err, data) {
            if (err) return;
            vm.proveedorUsuarioPushId(data.proveedorUsuarioPushId);
            vm.nombrePush(data.nombre);
            vm.loginPush(data.login);
            vm.passwordPush(data.password);
            $('#modalUsuariosPush').modal('show');
        });
    }
}

function datosOKUsuariosPush() {
    $('#modalUsuariosPush-form').validate({
        rules: {
            txtNombrePush: {
                required: true
            },
            txtLoginPush: {
                required: true,
            },
            txtPasswordPush: {
                required: true,
            }
        },
        // Messages for form validation
        messages: {
            txtNombrePush: {
                required: "Debe elegir un nombre"
            },
            txtLoginPush: {
                required: "Debe elegir un usuario"
            },
            txtPasswordPush: {
                required: "Debe elegir una contraseña"
            },
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#modalUsuariosPush-form").validate().settings;
    return $('#modalUsuariosPush-form').valid();
}

//FUNCIONES REALCIONADAS CON LA DOCUMENTACIÓN

function initArbolDocumentacion() {
    $('#jstreeDocumentacion').jstree({
        'core':
        {
            'data': [],
        },
        'check_callback': true,
        "plugins": ["themes", "html_data", "ui", "crrm", "contextmenu"],
        "select_node": true,
        'contextmenu': {
            'items': function (node) {
                var menuItems = {
                    // Define las opciones del menú contextual para cada nodo

                    'Option 1': {
                        'label': 'Subir documento',
                        'action': function (a, b, c) {
                            console.log(node.type);
                            $('#modalUploadDoc').modal('show');
                            preparaDatosArchivo(node.original);
                        }
                    },
                    'Option 2': {
                        'label': 'Crear Subcarpeta',
                        'action': function () {
                            $('#modalpostSubcarpeta').modal('show');
                            nuevaSubcarpeta(node.original);
                        }
                    },
                    'Option 3': {
                        'label': 'Eliminar',
                        'action': function () {
                            if (!node.data.folder) {
                                deleteDocumento(node.id);
                            } else {
                                deleteCarpeta(node.id);
                            }
                        }
                    }

                }
                if (!node.data.folder) {
                    delete menuItems['Option 1'];
                    delete menuItems['Option 2'];
                }
                if (!usuario.puedeEditar) {
                    delete menuItems['Option 2'];
                    delete menuItems['Option 3'];
                }
                return menuItems;
            }
        }
    });

}
function cargaTablaDocumentacion() {
    llamadaAjax("GET", "/api/documentacion/proveedor/" + vm.proveedorId(), null, function (err, data) {
        if (err) return;
        loadDocumentacionTree(data);
        //if(data) loadTablaDocumentacion(data);
    });
}

function loadDocumentacionTree(data) {
    //if(data.length == 0) return;
    var obj = data;

    $('#jstreeDocumentacion').jstree(true).settings.core.data = obj;
    $('#jstreeDocumentacion').jstree(true).refresh();

    //$('#jstreeDocumentacion').jstree(true).redraw();


}

function loadTablaDocumentacion(data) {
    var dt = $('#dt_documentacion').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    dt.fnAddData(data);
    dt.fnDraw();
}

function formatData(d) {
    if (!d.documentos) d.documentos = [];
    var doc = d.documentos;
    var html = "";
    html = '<h6 style="padding-left: 5px"> DOCUMENTOS</h6>'
    var a;
    doc.forEach(e => {
        var l = e.key.split('/');
        var index = l.length - 1;
        a = '<div class="row" style="margin-bottom: 10px">' +
            '<section class="col col-md-5">' +
            '<a href="' + e.location + '" target="_blank">' + l[index] + '</a>' +
            '</section>' +
            '<section class="col col-md-3 text-left">' +
            '<button  class="btn btn-circle btn-danger"  onclick="deleteDocumento(' + e.documentoId + ')" title="Eliminar registro"> <i class="fa fa-trash-o fa-fw"></i> </button>' +
            '</section>' +
            '<section class="col col-md-4">' + '</section>' +
            '</div>'
        html += a;
    });
    if (!d.subcarpetas) d.subcarpetas = [];
    var subC = d.subcarpetas;
    html += '<h6 style="padding-left: 5px"> Subcarpetas</h6>'
    var b;
    subC.forEach(e => {
        b = '<div class="row" style="margin-bottom: 10px">' +
            '<section class="col col-md-3 text-left">' +
            '<button  class="dt-control"></button>' +
            '</section>' +
            '<section class="col col-md-5">' +
            '<a href="" target="_blank">' + e.carpetaNombre + '</a>' +
            '</section>' +
            '<section class="col col-md-3 text-left">' +
            '<button  class="btn btn-circle btn-danger"  onclick="deleteCarpeta(' + e.carpetaId + ')" title="Eliminar registro"> <i class="fa fa-trash-o fa-fw"></i> </button>' +
            '</section>' +
            '<section class="col col-md-2">' + '</section>' +
            '</div>'
        html += b;
    });
    return html;
}

function formatFecha(f) {
    if (f) return spanishDate(f);
    return ' ';
}

function preparaDatosArchivo(r) {
    vm.files(null);
    docName = r.carpetaNombre + "_" + vm.proveedorId() + "_" + vm.nombre();
    carpetaId = r.carpetaId;
    docName = docName.replace(/[\/]/g, "-");
    console.log(docName);
    carpeta = r.carpetaNombre;
    key = r.carpetaNombre + "/" + docName;
    carpetaTipo = r.tipo;
    vm.documNombre(docName);
}

function limpiaDatosArchivo(r) {
    docName = null
    carpetaId = null
    docName = null
    carpeta = null
    $('.progress-bar').text(parseInt((0) + '%'));
    $('.progress-bar').width(parseInt((0) + '%'));
}

function nuevaCarpeta() {
    vm.carpetaNombre(null);
}


function aceptarNuevaCarpeta() {
    //CREAMOS EL REGISTRO EN LA TABLA carpetas
    if (vm.carpetaNombre() == '' || vm.carpetaNombre() == null) return mensError('Se tiene que asignar un nombre');
    var a = vm.carpetaNombre();
    a = a.trim();
    a = a.replace(/[\/]/g, "-");
    var data =
    {
        carpeta: {
            carpetaId: 0,
            nombre: a,
            tipo: "proveedor",
            departamentoId: null
        }
    }

    llamadaAjax('POST', myconfig.apiUrl + "/api/documentacion/carpeta", data, function (err, data) {
        if (err) return
        $('#modalNuevaCarpeta').modal('hide');
        mensNormal('Carpeta creada con exito');
        cargaTablaDocumentacion();
    });
}

function aceptarNuevaSubCarpeta() {
    //CREAMOS EL REGISTRO EN LA TABLA carpetas
    if (vm.subCarpetaNombre() == '' || vm.subCarpetaNombre() == null) return mensError('Se tiene que asignar un nombre');
    var a = vm.subCarpetaNombre();
    a = a.trim();
    a = a.replace(/\//g, "-");
    var n = subCarpeta + "/" + a;
    var data =
    {
        carpeta: {
            carpetaId: 0,
            nombre: n,
            tipo: carpetaTipo,
            departamentoId: null,
        }
    }

    llamadaAjax('POST', myconfig.apiUrl + "/api/documentacion/carpeta/" + parent, data, function (err, data) {
        if (err) return
        $('#modalpostSubcarpeta').modal('hide');
        mensNormal('Carpeta creada con exito');
        cargaTablaDocumentacion();
    });
}


function nuevaSubcarpeta(r) {
    vm.subCarpetaNombre(null);
    subCarpeta = r.carpetaNombre;
    carpetaTipo = r.tipo
    parent = r.carpetaId
}


function deleteDocumento(id) {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
        AWS.config.region = parametros.bucket_region_docum; // Región
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: parametros.identity_pool_docum,
        });
        llamadaAjax('GET', "/api/documentacion/" + id, null, function (err, data) {
            if (err) return;
            if (data) {
                var params = {
                    Bucket: parametros.bucket_docum,
                    Key: data.key
                }

                //borramos el documento en s3
                var s3 = new AWS.S3({ params });

                s3.deleteObject({}, (err, result) => {
                    if (err) mensError('Error al borrar el docuemnto');
                    //Actualizamos la tabla documentacion
                    llamadaAjax('DELETE', myconfig.apiUrl + "/api/documentacion/elimina-documento/" + id, null, function (err, data) {
                        if (err) return;
                        cargaTablaDocumentacion();
                    });
                });

            }
        });
    })
}

function deleteCarpeta(id) {
    var mens = "¿Realmente desea borrar esta carpeta, se borrarán todos los archivos y carpetas que contiene y no se podrá recuperar?";
    $.SmartMessageBox({
        title: "<i class='fa fa-info'></i> Mensaje",
        content: mens,
        buttons: '[Aceptar][Cancelar]'
    }, function (ButtonPressed) {
        if (ButtonPressed === "Aceptar") {

            llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
                if (err) return;
                var parametros = data;
                llamadaAjax('DELETE', "/api/documentacion/elimina-carpeta/" + id, null, function (err, data2) {
                    if (err) return mensError('Fallo al borrar la documentación en la base de datos');
                    if (data2) {

                        AWS.config.region = parametros.bucket_region_docum; // Región
                        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                            IdentityPoolId: parametros.identity_pool_docum,
                        });
                        var prefix = data2.nombre;
                        var params = {
                            Bucket: parametros.bucket_docum,
                            Prefix: prefix,
                            Delimeter: "/"
                        }

                        var s3 = new AWS.S3({ params });
                        s3.listObjectsV2({}, (err, result) => {
                            if (err) mensError('Error de lectura en la nube');
                            console.log(result);
                            if (result.Contents.length > 0) {



                                var objectKeys = []
                                result.Contents.forEach(e => {
                                    objectKeys.push(e.Key);
                                });

                                // Crea un objeto Delete para especificar los objetos que se van a eliminar
                                const objects = objectKeys.map(key => ({ Key: key }));
                                const deleteParams = {
                                    Bucket: parametros.bucket_docum,
                                    Delete: { Objects: objects }
                                };

                                // Elimina los objetos utilizando el método deleteObjects del objeto S3
                                s3.deleteObjects(deleteParams, function (err, data) {
                                    if (err) {
                                        mensError('Fallo al borrar la carpeta en la nube');
                                    } else {
                                        mensNormal('Carpeta eliminada con éxito');
                                        cargaTablaDocumentacion();
                                    }
                                });

                            } else {
                                mensAlerta('No se han encontrado archivos en la nube para borrar');
                                cargaTablaDocumentacion();
                            }

                        });



                    } else {
                        mensError('No se han encontrado carpetas para borrar');
                        cargaTablaDocumentacion();
                    }
                });
            })
        }
        if (ButtonPressed === "Cancelar") {
            // no hacemos nada (no quiere borrar)
        }
    });
}

function aceptarSubirDocumentos() {
    if (vm.documNombre() == '') return mensError("Se tiene que asignar un nombre al documento.");
    //buscamos los parámetros
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        parametros = data;
        var files = $("#upload-input").get(0).files;
        var arr = [];
        if (!files.length) {
            mensError('Debe escoger seleccionar un archivo para subirlo al repositorio');
            return;
        }
        for (var i = 0; i < files.length; i++) {
            var e = files[i];
            var encontrado = false;
            var id = 0;
            var file = e;
            var ext = file.name.split('.').pop().toLowerCase();
            var blob = file.slice(0, file.size, file.type);
            var newFile = new File([blob], { type: file.type });
            var nom = "";
            nom = vm.documNombre()
            if (files.length > 1) {
                var s = parseInt(i)
                s++
                nom = nom + "-" + s + "." + ext;
            } else {
                nom = nom + "." + ext;
            }
            nom = nom.replace(/\//g, "-");
            newFile.nom = nom;
            var fileKey = carpeta + "/" + nom
            newFile.fileKey = fileKey;
            newFile.repetido = false;
            arr.push(newFile);
        }
        //buscamos si el documento ya existe en la carpeta de destino
        llamadaAjax('GET', "/api/documentacion/documentos/de/la/carpeta/" + carpetaId, null, function (err, docums) {
            if (err) return;
            if (docums && docums.length > 0) {
                for (var i = 0; i < docums.length; i++) {
                    var d = docums[i];
                    var n = d.key.split('/');
                    var index = n.length - 1

                    for (var j = 0; j < arr.length; j++) {
                        if (n[index] == arr[j].nom) {
                            encontrado = true;
                            arr[j].repetido = true;
                            arr[j].documentoId = d.documentoId;
                            arr[j].repetido = true;
                            break;
                        }
                    }
                }

                if (encontrado) {
                    var mens = "Ya existen documentos con este nombre en esta carpeta, se reemplazará con el que está apunto de subir. ¿Desea continuar?";
                    $.SmartMessageBox({
                        title: "<i class='fa fa-info'></i> Mensaje",
                        content: mens,
                        buttons: '[Aceptar][Cancelar]'
                    }, function (ButtonPressed) {
                        if (ButtonPressed === "Aceptar") {
                            method = 'PUT';
                            uploadDocum(arr);
                        }
                        if (ButtonPressed === "Cancelar") {
                            $('#upload-input').val([]);
                        }
                    });

                } else {
                    uploadDocum(arr);
                }
            } else {
                uploadDocum(arr);
            }
        });

    });

}

function uploadDocum(arr) {
    var index = 0;

    arr.forEach(e => {
        var repetido = e.repetido;
        var documentoId = e.documentoId;
        var filekey = e.fileKey;
        delete e.fileKey
        delete e.documentoId;
        delete e.repetido;
        var nom = e.nom;
        delete e.nom;

        AWS.config.region = parametros.bucket_region_docum; // Región
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: parametros.identity_pool_docum,
        });
        var bucket = parametros.bucket_docum;
        var params = {
            Bucket: bucket,
            Key: filekey,
            IdentityPoolId: parametros.identity_pool_docum,
            Body: e,
            ACL: "public-read"
        }
        var ext = nom.split('.').pop().toLowerCase();
        if (ext == "pdf") params.ContentType = 'application/pdf'
        // Use S3 ManagedUpload class as it supports multipart uploads
        var upload = new AWS.S3.ManagedUpload({
            params: params
        });
        var promise = upload.on('httpUploadProgress', function (evt) {
            $('.progress-bar').text(parseInt((evt.loaded * 100) / evt.total) + '%');
            $('.progress-bar').width(parseInt((evt.loaded * 100) / evt.total) + '%');
        })
            .promise();
        promise.
            then(
                data => {
                    if (data) {
                        //CREAMOS EL REGISTRO EN LA TABLA documentacion
                        var data =
                        {
                            documentacion: {
                                documentoId: 0,
                                proveedorId: null,
                                contratoId: null,
                                parteId: null,
                                carpetaId: carpetaId,
                                proveedorId: vm.proveedorId(),
                                location: data.Location,
                                key: filekey
                            }
                        }


                        if (!repetido) {
                            method = 'POST';
                            url = "/api/documentacion";
                        } else {
                            data.documentacion.documentoId = e.documentoId;
                            method = 'PUT';
                            url = "/api/documentacion/" + documentoId;
                        }

                        llamadaAjax(method, myconfig.apiUrl + url, data, function (err, data) {
                            if (err) return mensError(err);
                            index++
                            if (index == arr.length) {
                                $('#modalUploadDoc').modal('hide');
                                mensNormal('Archivo subido con exito');
                                limpiaDatosArchivo();
                                cargaTablaDocumentacion();
                            }
                        });
                    }
                },
                err => {
                    if (err) return mensError(err);
                }
            );
    });
}

function buscarFacturasFecha() {
    var mf = function () {
        if (!datosOKFechas()) return;
        $.ajax({
            type: "GET",
            url: myconfig.apiUrl + "/api/facturasProveedores/recupera/facturas/proveedor/por/fecha/" + vm.proveedorId() + "/" + spanishDbDate(vm.desdeFecha()) + "/" + spanishDbDate(vm.hastaFecha()),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                //comprobamos si hay facturas a cero para mostrar mensaje de advertencia
                loadTablaFacturas(data);
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    };
    return mf;
}

function datosOKFechas() {
    // Segun se incorporen criterios de filtrado
    // habrá que controlarlos aquí
    $('#frmBuscar').validate({
        rules: {
            txtHastaFecha: {
                greaterThan2: "#txtDesdeFecha"
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



// --------------- Solapa de Indices correctores
function initTablaindicesCorrectores() {
    tablaIndices = $('#dt_indices').DataTable({
        bSort: false,
        "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs' 'l C>r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        "oColVis": {
            "buttonText": "Mostrar / ocultar columnas"
        },

        autoWidth: true,

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
        data: dataindices,
        columns: [{

            className: 'dt-control',
            orderable: false,
            data: null,
            defaultContent: '',
            //data:"carpetaId",
        }, {
            data: "indiceCorrectorId",
            render: function (data, type, row) {
                var html = "<i class='fa fa-file-o'></i>";
                if (data) {
                    html = "<i class='fa fa-files-o'></i>";
                }
                return html;
            }
        }, {
            data: "nombre"
        }, {
            data: "minimo"
        }, {
            data: "maximo"
        }, {
            data: "porcentajeDescuento"
        }, {
            data: "indiceCorrectorId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger' onclick='deleteIndiceCorrector(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success' onclick='editIndiceCorrector(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }]
    });

}


function loadIndicesCorrectores(proveedorId) {
    llamadaAjax("GET", myconfig.apiUrl + "/api/proveedores/indices-correctores/proveedor/" + proveedorId, null, function (err, data) {
        if (err) return;
        loadTablaIndicesCorrectores(data);
    });
}

function loadTablaIndicesCorrectores(data) {
    var dt = $('#dt_indices').dataTable();
    if (data !== null && data.length === 0) {
        data = null;
    }
    dt.fnClearTable();
    if (data != null) dt.fnAddData(data);
    dt.fnDraw();
}

function guardarIndiceCorrector() {
    var data = {
        indiceCorrector: {
            nombre: vm.nombreIndice(),
            proveedorId: vm.proveedorId(),
            minimo: vm.minimo(),
            maximo: vm.maximo(),
            porcentajeDescuento: vm.porcentajeDescuento(),
            profesiones: vm.elegidosTiposProfesionalIndice()
        }
    }

    if (!indiceEnEdicion) {
        if (!datosOKIndicesCorrectores()) return;
        $.ajax({
            type: "POST",
            url: myconfig.apiUrl + "/api/proveedores/indices-correctores/proveedor/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                loadIndicesCorrectores(vm.proveedorId());
                $('#modalIndicesCorrectores').modal('hide');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    } else {
        $.ajax({
            type: "PUT",
            url: myconfig.apiUrl + "/api/proveedores/indices-correctores/proveedor/" + vm.indiceCorrectorId(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // hay que mostrarlo en la zona de datos
                indiceEnEdicion = false;
                empSerieId = 0;
                loadIndicesCorrectores(vm.proveedorId());
                $('#modalIndicesCorrectores').modal('hide');
            },
            error: function (err) {
                mensErrorAjax(err);
                // si hay algo más que hacer lo haremos aquí.
            }
        });
    }
}

function deleteIndiceCorrector(id) {
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
                url: myconfig.apiUrl + "/api/proveedores/indices-correctores/" + id,
                dataType: "json",
                contentType: "application/json",
                data: null,
                success: function (data, status) {
                    loadIndicesCorrectores(vm.proveedorId());
                },
                error: function (err) {
                    mensErrorAjax(err);
                    // si hay algo más que hacer lo haremos aquí.
                }
            });
        }
        if (ButtonPressed === "Cancelar") {
            limpiaModalIndicesCorrectores();
            // no hacemos nada (no quiere borrar)
        }
    });
}

function limpiaModalIndicesCorrectores() {
    vm.indiceCorrectorId(null);
    vm.nombreIndice(null);
    vm.minimo(null);
    vm.maximo(null);
    vm.porcentajeDescuento(null);
    vm.elegidosTiposProfesionalIndice([]);
    //vm.posiblesTiposProfesionalIndice([]);
}

function editIndiceCorrector(id) {
    indiceEnEdicion = true;
    cargaModalIndicesCorrectores(id);
}

function cargaModalIndicesCorrectores(id) {
    limpiaModalIndicesCorrectores();
    if (id) {//ES UN PUT
        llamadaAjax("GET", myconfig.apiUrl + "/api/proveedores/indices-correctores/" + id, null, function (err, data) {
            if (err) return;
            vm.indiceCorrectorId(data.indiceCorrectorId);
            vm.nombreIndice(data.nombre);
            vm.minimo(data.minimo);
            vm.maximo(data.maximo);
            vm.porcentajeDescuento(data.porcentajeDescuento);
            loadTiposProfesionalesIndice(data.lin);
            $('#modalIndicesCorrectores').modal('show');
            //cargamos los tipos profesionales asociados al indice
            /*  llamadaAjax("GET", myconfig.apiUrl + " /api/tipos_profesional/indice/" + id, null, function (err, data2) {
              if (err) return;
               loadTiposProfesionalesIndice(data2);
              $('#modalIndicesCorrectores').modal('show');
              }); */
        });
    } else {//ES UN POST
        indiceEnEdicion = false;
        loadTiposProfesionalesIndice(null);
    }
}

function datosOKIndicesCorrectores() {
    $('#modalIndicesCorrectores-form').validate({
        rules: {
            txtNombreIndice: {
                required: true
            },
            txtMinimo: {
                required: true,
            },
            txtMaximo: {
                required: true,
                numberGreaterThan: "#txtMinimo"
            },
            txtPorcentajeDescuento: {
                required: true,
            }
        },
        // Messages for form validation
        messages: {
            txtNombreIndice: {
                required: "Debe elegir un nombre"
            },
            txtMinimo: {
                required: "Debe elegir un mínimo"
            },
            txtMaximo: {
                required: "Debe elegir un máximo"
            },
            txtPorcentajeDescuento: {
                required: "Debe elegir un porcentaje de descuento",
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    return $('#modalIndicesCorrectores-form').valid();
}


function formatDataIndices(d) {
    if (!d.lin) d.lin = [];
    var lin = d.lin;
    var html = "";
    html = '<h5> PROFESIONES ASOCIADAS</h5>'
    html += '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">'
    lin.forEach(e => {
        html +=
            '<tr>' +
            '<td>' +
            e.nombreProfesion +
            '</td>' +
            '</tr>'

    });
    html += '</table>'
    return html
}



