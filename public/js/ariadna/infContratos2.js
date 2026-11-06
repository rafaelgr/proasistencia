// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
var usuario;
// License Key

// Crear opciones
var options = new Stimulsoft.Viewer.StiViewerOptions();
options.appearance.scrollbarsMode = true;
options.toolbar.showSendEmailButton = true;
options.toolbar.viewMode = Stimulsoft.Viewer.StiWebViewMode.Continuous;

// Configurar servidor y localización
StiOptions.WebServer.url = "/api/streport";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../../Localization/es.xml", true);

obtainKeyNew();//obtiene la clave de usuario de stimulsoft de la configuracion



// Inicializar visor PASANDO SOLO EL OBJETO options con container
options.container = "viewerContent";  // ID del div donde se mostrará
const viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

// Capturar eventos
viewer.onEmailReport = function (event) {
    console.log('EMAIL REPORT');
};

function initForm() {
    $('#StiViewerReportPanel').css("text-align", "left");
    comprobarLogin();
    usuario = recuperarUsuario();
    // de smart admin
    //pageSetUp();
    getVersionFooter();
    datePickerSpanish();
    vm = new admData();
    ko.applyBindings(vm);
    // avoid form submmit
    $("#frmRptContratos").submit(function () {
        return false;
    });
    $("#frmExportar").submit(function () {
        return false;
    });
    //

    recuperaDepartamento(function (err, data) {
        if (err) return;
        let datos = null;
        if (data) {
            vm.contratoId(gup('ContratoId'));
            vm.contratoInteresesId(gup('ContratoInteresesId'));
            vm.esAdicional(gup('esAdicional'));
            vm.esContrato(gup('esContrato'));
            vm.esRecepcion(gup('esRecepcion'));
            vm.esRecepcionDF(gup('esRecepcionDF'));
            vm.empresaId(gup('EmpresaId'));
            vm.contratoAdicionalId(gup('contratoAdicionalId'));
            verb = "GET";
            var url = myconfig.apiUrl + "/api/contratos/obtiene/objeto/contrato/" + vm.contratoId();
            if (vm.esAdicional()) {
                datos = {
                    contratoId: vm.contratoId(),
                    contratoAdicionalId: vm.contratoAdicionalId(),
                    contratoInteresesId: vm.contratoInteresesId()
                }
                url = myconfig.apiUrl + "/api/contratos/obtiene/objeto/contrato/adicional"
                verb = "POST";
            }

            if (vm.esRecepcion() || vm.esRecepcionDF()) {
                url = myconfig.apiUrl + "/api/contratos/obtiene/objeto/contrato/acta/recepcion/" + vm.contratoId();
                verb = "GET";
            }
            llamadaAjax(verb, url, datos, function (err, data) {
                obtainReportJson(data);
                $('#selector').hide();
            });
        }
    });

}

function obtainKeyNew() {
    llamadaAjax('GET', '/api/configuracion', null, function (err, data) {
        if (err) return;
        if (data) {
            Stimulsoft.Base.StiLicense.key = data.sti_key_new
        }
    });
}

function admData() {
    var self = this;
    self.facturaId = ko.observable();
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    //
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    //
    self.clienteId = ko.observable();
    self.sclienteId = ko.observable();
    //
    self.posiblesClientes = ko.observableArray([]);
    self.elegidosClientes = ko.observableArray([]);
    //
    self.departamentoId = ko.observable();
    self.sdepartamentoId = ko.observable();
    //
    self.posiblesDepartamentos = ko.observableArray([]);
    self.elegidosDepartamentos = ko.observableArray([]);
    // 
    self.comercialId = ko.observable();
    self.scomercialId = ko.observable();
    //
    self.posiblesColaboradores = ko.observableArray([]);
    self.elegidosColaboradores = ko.observableArray([]);
    //
    self.scontratoId = ko.observable();
    self.contratoId = ko.observable();
    self.contratoInteresesId = ko.observable();
    self.esAdicional = ko.observable();
    self.esContrato = ko.observable();
    self.esRecepcion = ko.observable();
    self.esRecepcionDF = ko.observable();
    self.contratoAdicionalId = ko.observable();
    //
    self.posiblesContratos = ko.observableArray([]);
    self.elegidosContratos = ko.observableArray([]);
    self.observaciones = ko.observable();
    self.observacionesPago = ko.observable();
    //
    self.tipoComercialId = ko.observable();
    self.stipoComercialId = ko.observable();
    //
    self.posiblesTiposComerciales = ko.observableArray([]);
    self.elegidosTiposComerciales = ko.observableArray([]);
    //
};




function obtainReportJson(obj) {

    let file = null
    if (vm.esContrato()) {
        if (vm.empresaId() == 2 && vm.contratoId()) file = "/reports/contrato_proas.mrt";
        if (vm.empresaId() == 7 && vm.contratoId()) file = "/reports/contrato_reabita2.mrt";
        if (vm.empresaId() == 13 && vm.contratoId()) file = "/reports/contrato_misuk.mrt";
    }
    if (vm.esAdicional()) {
        if (vm.empresaId() == 2) file = "/reports/contrato_proas_adicional.mrt";
        if (vm.empresaId() == 7) file = "/reports/contrato_reabita_adicional.mrt";
    }
    if (vm.esRecepcion()) {
        if (vm.empresaId() == 2 && vm.contratoId()) file = "/reports/acta_recepcion_proas.mrt";
        if (vm.empresaId() == 7 && vm.contratoId()) file = "/reports/acta_recepcion_reabita.mrt";
    }
    if (vm.esRecepcionDF()) {
        if (vm.empresaId() == 2 && vm.contratoId()) file = "/reports/acta_recepcion_proas_DF.mrt";
        if (vm.empresaId() == 7 && vm.contratoId()) file = "/reports/acta_recepcion_reabita_DF.mrt";
    }
    if (!file) return mensError("No se ha encontrado el archivo de informe.");

    //file = "/reports/acta_recepcion_proas.mrt";
    const report = new Stimulsoft.Report.StiReport();

    if (!file) {
        mensError("No se ha encontrado el archivo de informe para esta empresa");
        return;
    }

    // Cargar el reporte desde archivo .mrt
    report.loadFile(file);
    report.culture = "es-ES";

    // Crear DataSet y registrar
    const dataSet = new Stimulsoft.System.Data.DataSet("datos_contrato");
    dataSet.readJson(obj);

    report.dictionary.databases.clear();
    report.regData(dataSet.dataSetName, "", dataSet);
    report.dictionary.synchronize();

    // Habilitar HTML en todos los textos
    report.pages.list.forEach(page => {
        page.components.list.forEach(component => {
            if (component instanceof Stimulsoft.Report.Components.StiText) {
                component.allowHtml = true;
            }
        });
    });

    //report.renderAsync();
    // Asignar y renderizar
    viewer.report = report;

    /*  const jsonString = JSON.stringify(obj, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'datosReporte.json';
        link.click();  */
}

function obtenerOpcionesCarpetas() {

    let tipo = "contrato";
    vm.departamentoId(8);

    $.ajax({
        url: '/api/documentacion/carpetas/por/tipo-y-departamento/' +
            tipo + '/' + vm.departamentoId(),
        type: 'GET',
        dataType: 'json',

        success: function (data) {

            cargarRadioCarpetas(data);

            // Abrir modal después de cargar los datos
            $('#modalCorreoActa').modal('show');
        },

        error: function (xhr, status, error) {
            console.error(
                'Error cargando opciones de correo:',
                error
            );
        }
    });
}

function cargarRadioCarpetas(opciones) {

    const contenedor = $('#radioCarpetas');

    contenedor.empty();

    opciones.forEach((opcion, index) => {

        const nombre = opcion.nombre.split('/').pop();

        const radio = $('<input>', {
            type: 'radio',
            id: `radioCarpetas${index + 1}`,
            name: 'firmaActaGroup',
            value: opcion.carpetaId
        });

        if (index === 0) {
            radio.prop('checked', true);
        }

        const label = $('<label>', {
            for: `radioCarpetas${index + 1}`
        }).css({
            marginLeft: '8px',
            fontWeight: 'normal',
            cursor: 'pointer'
        }).text(nombre);

        const div = $('<div>').css({
            marginBottom: '8px'
        });

        div.append(radio, label);

        contenedor.append(div);
    });
}


async function guardarInformeEnCarpeta() {

    const carpetaId =
        $('input[name="firmaActaGroup"]:checked').val();

    if (!carpetaId) {
        mensError("Debe seleccionar una carpeta.");
        return;
    }

    if (!viewer.report) {
        mensError("No hay ningún informe cargado.");
        return;
    }

    const boton = $('#btnAceptarEnvio');

    try {

        boton.prop('disabled', true);

        const report = viewer.report;

        // 1. Renderizar el informe
        await new Promise((resolve, reject) => {

            try {
                report.renderAsync(
                    () => resolve(),
                    error => reject(error)
                );
            } catch (error) {
                reject(error);
            }
        });

        // 2. Exportar el informe a PDF
        const blob = await new Promise((resolve, reject) => {

            try {

                const servicio =
                    new Stimulsoft.Report.Export.StiPdfExportService();

                const configuracion =
                    new Stimulsoft.Report.Export.StiPdfExportSettings();

                const stream =
                    new Stimulsoft.System.IO.MemoryStream();

                servicio.exportToAsync(
                    function (error) {

                        if (error) {
                            reject(new Error(error));
                            return;
                        }

                        try {

                            const bytes = stream.toArray();

                            const pdfBlob = new Blob(
                                [new Uint8Array(bytes)],
                                { type: 'application/pdf' }
                            );

                            resolve(pdfBlob);

                        } catch (error) {
                            reject(error);
                        }

                    },
                    report,
                    stream,
                    configuracion
                );

            } catch (error) {
                reject(error);
            }
        });


        // 3. Preparar formulario
        const formData = new FormData();

        formData.append(
            'archivo',
            blob,
            `Informe_${vm.contratoId()}.pdf`
        );

        formData.append('carpetaId', carpetaId);
        formData.append('contratoId', vm.contratoId());

        // 4. Enviar a la API
        await $.ajax({
            url: '/api/documentacion/subir/informe',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false
        });

        $('#modalCorreoActa').modal('hide');

        mensSuccess("Informe guardado correctamente.");

    } catch (error) {

        console.error("Error guardando informe:", error);

        mensError("No se ha podido guardar el informe.");

    } finally {

        boton.prop('disabled', false);
    }
}