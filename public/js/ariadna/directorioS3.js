// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataRondasRealizadas;
var rondaRealizadaId;
var directorio
var objectsS3 = [];
var parametros = {};

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();
    directorio = gup('dir');

    if(directorio != "facturas_proveedores/") $('#frmBuscar').hide()

    vm = new admData();
    ko.applyBindings(vm);

    $('#btndescargar').click(descargarRenombrar);
    
     // 7 bind to events triggered on the tree
     $('#jstreeDocumentacion').on("click.jstree", function (e) {
        var node = $(e.target).closest('.jstree-node');
        var selectedNodeId = node.attr('id');
        if (e.which === 1) {
            var jsTree = $.jstree.reference(e.target);
            var originalNode = jsTree.get_node(node);
            if(!originalNode.data.folder)  {
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

/* var to = false;
    $('#search-input').keyup(function () {
      if(to) { clearTimeout(to); }
      to = setTimeout(function () {
        var v = $('#search-input').val();
        $('#jstreeDocumentacion').jstree(true).search(v);
      }, 250);
    }); */
    $("#frmBuscar").submit(function () {
        return false;
    });

    $('#cmbAnos').select2(select2Spanish());
    loadAnyos();

    $("#cmbEmpresas").select2(select2Spanish());
    loadEmpresas(2);
    initAutoProveedor();


    initArbolDocumentacion();
    getObjectsdocumentacion() 
}

function admData() {
    var self = this;

    //AUTOCOMPLETE PROVEEDORES
    self.proveedorId = ko.observable();
    self.sproveedorId = ko.observable();

    //COMBO EMPRESA
    self.empresaId = ko.observable();
    self.sempresaId = ko.observable();
    //
    self.posiblesEmpresas = ko.observableArray([]);
    self.elegidosEmpresas = ko.observableArray([]);
    
    //COMBO AÑOS
    self.optionsAnos = ko.observableArray([]);
    self.ano = ko.observable(); 
    self.sano = ko.observable();
    self.selectedAnos = ko.observableArray([]);
    
} 

function   loadAnyos(){
    //recuperamos los años que hay en las facturas de proveedores en la base de datos
    llamadaAjax("GET", "/api/facturasProveedores/get-anyos/facprove", null, function (err, data) {
        console.log(data);
        if (err) return;
        var anos = [];
        var ano = {}
        var anoText;
        var d = new Date();
        var n = d.getFullYear();//estableceremos el año actual por defecto en el desplegable
        var t = data[0].ano.toString();
        vm.sano(t);
        for(var i = 0; i < data.length; i++){
            var s = data[i];
            anoText = s.ano.toString();
          ano = {
            nombreAno: anoText,
            ano: s.ano
          };
          anos.push(ano);
        }
        vm.optionsAnos(anos);
        $("#cmbAnos").val([n]).trigger('change');
    });
}

function loadEmpresas(id) {
    llamadaAjax("GET", "/api/empresas", null, function (err, data) {
        if (err) return;
        var empresas = [{ empresaId: 0, nombre: "" }].concat(data);
        vm.posiblesEmpresas(empresas);
        vm.sempresaId(id);
        $("#cmbEmpresas").val([id]).trigger('change');
    });
}

// initAutoProveedor
// inicializa el control del Proveedor como un autocomplete
var initAutoProveedor = function () {
    // incialización propiamente dicha
    $("#txtProveedor").autocomplete({
        source: function (request, response) {
            // call ajax
            llamadaAjax("GET", "/api/proveedores/activos/proveedores/todos/?nombre=" + request.term, null, function (err, data) {
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
            vm.sproveedorId(ui.item.id);
        }
    });
    // regla de validación para el control inicializado
    jQuery.validator.addMethod("proveedorNecesario", function (value, element) {
        var r = false;
        if (vm.sproveedorId()) r = true;
        return r;
    }, "Debe seleccionar un Proveedor válido");
};

var descargarRenombrar = function() {
    if(objectsS3.length == 0) return;
    //
    var a = vm.sempresaId().toString();
    var b = vm.sano().toString();
    var patronTexto = b + "-" + a;
    //patronTexto = patronTexto.toString();
    selectObjects(patronTexto)
    .then(objetosFiltrados => {
        renombrarObjetos(objetosFiltrados)
        .then((objetosRenombrados) => {
            descargarObjetos(objetosRenombrados)
            .then(() => {
                console.log('Descarga completa');
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


async function selectObjects(patronTexto) {
     // Filtrar los objetos según el patrón de texto
     let objetosFiltrados = objectsS3.filter(objeto => {
        return objeto.Key.includes(patronTexto); // Puedes ajustar aquí tu criterio de filtrado
    });
    return objetosFiltrados;
}

async function renombrarObjetos(obj) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "/api/facturasProveedores/recupera/numregis",
            method: 'PUT',
            contentType: 'application/json', // Establece el tipo de contenido a JSON
            data: JSON.stringify(obj), // Convierte el array a formato JSON
            success: function(response) {
                // Resuelve la promesa con la respuesta recibida
                resolve(response);
            },
            error: function(xhr, status, error) {
                // Rechaza la promesa con el error
                mensError("Fallo al renombrar los archivos.");
                reject(error);
            }
        });
    });
}

function initArbolDocumentacion() {
    $('#jstreeDocumentacion').jstree({ 'core' : 
    {
        'data' : [],
    },
    'check_callback' : true,
    "plugins" : [ "themes", "html_data", "ui", "crrm", "contextmenu", "search" ],
    "select_node": true,
    'multiple': true, // Habilita la selección múltiple
    'contextmenu': {
        'items': function(node) {
            var menuItems = {
            // Define las opciones del menú contextual para cada nodo
         
            'Option 1': {
                'label': 'Descargar',
                'action': function(a, b , c) {
                    const selectedNodes = $('#jstreeDocumentacion').jstree('get_selected', true);
                    for (let i = 0; i < selectedNodes.length; i++) {
                        descargaObjectdocumentacion(selectedNodes[i].original);
                    }
                }
              } 
            } 
            return menuItems;
        }
    }
});

}

// Función para listar objetos con paginación
async function listAllObjects(parametros) {
    let objects = [];
    let continuationToken = null;

  
    AWS.config.region = parametros.bucket_region_server; // Región
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId:  parametros.identity_pool_server,
    });
    var s3 = new AWS.S3();
      
      
  
    do {
        const params = {
            Bucket: parametros.bucket_server,
            Prefix: directorio,
            ContinuationToken: continuationToken
          };
       
      const response = await s3.listObjectsV2(params).promise();
      objects = objects.concat(response.Contents);
      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    objectsS3 = objects
    return objects;
  }

async function getObj(parametros) {


    AWS.config.region = parametros.bucket_region_server; // Región
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId:  parametros.identity_pool_server,
    });
    var s3 = new AWS.S3();
    
    const params = {
        Bucket: parametros.bucket_server,
        Key: obj.Key
      };

      const response = await s3.getObject(params).promise();
      return response;
}


async function descargarObjetos(objetos) {
    AWS.config.region = parametros.bucket_region_server; // Región
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: parametros.identity_pool_server,
    });
    const s3 = new AWS.S3();

    for (const objeto of objetos) {
        const params = {
            Bucket: parametros.bucket_server,
            Key: objeto.Key,
        };

        try {
            const { Body } = await s3.getObject(params).promise();
            const url = URL.createObjectURL(new Blob([Body]));
            const nombreDescarga = objeto.RenombrarA; // Usa el nombre de descarga alternativo si está definido
            descargarArchivo(url, nombreDescarga);
        } catch (error) {
            console.error(`Error al descargar el objeto ${objeto.Key}: ${error}`);
        }
    }
}



function descargarArchivo(url, nombreArchivo) {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nombreArchivo);
    link.setAttribute('target', '_blank'); // Agregar el atributo target="_blank"
    document.body.appendChild(link);
    link.click();
}

  
function getObjectsdocumentacion() {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        parametros = data;
        var carpetas = [];
        var id = 1;
        var documentoId = 1;
        var antCarpeta = null;
        //var obj = [];
        var archivos = [];
      
       
        listAllObjects(parametros)
        .then(obj => {
            // objects contiene todos los objetos del bucket
             // Descargar archivos y guardarlos en el directorio temporal local
            
             obj.forEach(e => {
                e.location = parametros.raiz_url_server + e.Key;
                var a = e.Key.indexOf("/");
                var b = e.Key.substring(0, a);
                if(!antCarpeta) {
                    carpetas.push( { carpetaNombre: b, carpetaId: id });
                    archivos.push( { data: e, carpetaId: id, documentoId: documentoId });
                    antCarpeta = b;
                } else {
                    if(b != antCarpeta) {
                        id++;
                        carpetas.push( { carpetaNombre: b, carpetaId: id });
                        archivos.push( {  data: e, carpetaId: id, documentoId: documentoId });
                        antCarpeta = b;
                    } else {
                        archivos.push( {  data: e, carpetaId: id, documentoId: documentoId })
                        antCarpeta = b;
                    }
                }
                documentoId++;
                //console.log(documentoId);
            });
            var regs = ProcesaDocumObjTree(archivos, carpetas)
            loadDocumentacionTree(regs);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    });
}

function descargaObjectdocumentacion(obj) {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
       
        // Reemplaza con la URL de tu objeto S3
        const s3Url = parametros.raiz_url_server + obj.key;

        // Nombre con el que se guardará el archivo en el navegador
        l = obj.key.split('/');
        index = l.length - 1;
        const fileName = l[index];

        downloadS3Object(s3Url, fileName);
    });
}

function downloadS3Object(s3Url, fileName) {

// Función para descargar el archivo desde S3
  fetch(s3Url, {
    method: 'GET',
  })
    .then((response) => {
        return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = s3Url.split('/').pop(); // Nombre del archivo basado en la URL
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error al descargar el objeto S3:', error);
    });
}


function loadDocumentacionTree(data) {
   /*  var cont = 50
    var d = [];
    for(i=0; i < cont; i++) {
        d.push(data[i]);
    } */
    if(data.length == 0) return;
   /*  var obj = d;
    console.log(d); */
    $('#jstreeDocumentacion').jstree(true).settings.core.data = data;
    $('#jstreeDocumentacion').jstree(true).refresh();
}

function ProcesaDocumObjTree(doc, carpeta) {
	//if((doc.length == 1 && !doc[0].facproveId) || (doc.length == 1 && !doc[0].antproveId)) return doc;
	var antdir = null;
	var cont = 1;
	var regs = [];
	var docObj = {
		
	};
	var dirObj = {
		
	};
    var l = [];
    var index;

	carpeta.forEach(d => {
        doc.forEach(e => {
		if(antdir) {
			if(antdir == d.carpetaId ) {
                    l = e.data.Key.split('/');
                    index = l.length - 1;
                    var s = parseInt(e.data.Size);
                    var r = s / 1024;
                    r = roundToTwo(r).toString()
                    //var html = '<div style="width: 100%"><span style="width: 20%;text-align: left;">' + l[index] + '</span><span  style="width: 20%;text-align: left;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</span><span style="width: 20%;text-align: left;">' + r + ' KB ' + '</span></div>'
                    //var html = '<ul style="list-style-type: none; color: black"><li style="display: inline; margin-right: 10px;">' + l[index] + '</li><li style="display: inline; margin-right: 10px;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</li><li style="display: inline; margin-right: 10px;">' + r + ' KB ' + '</li></ul>'
					docObj = {
                        documentoId: e.documentoId,
						location: e.data.location,
                        key: e.data.Key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent:  'c' + d.carpetaId,
                        icon: "glyphicon glyphicon-file"
					};
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				
                antdir = d.carpetaId;
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				
                l = d.carpetaNombre.split('/');
                index = l.length - 1;
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    text:  l[index],
                    id:  'c' + d.carpetaId,
                    data: { "folder" : true },
                    parent: '#',
				    documentos: [],
				};
                regs.push(dirObj);
                //if(!d.carpetaPadreId) dirObj.parent = '#';
				
                    l = e.data.Key.split('/');
                    index = l.length - 1;
                    var s = parseInt(e.data.Size);
                    var r = s / 1024;
                    r = roundToTwo(r).toString()
                    //var html = '<span style="margin-right: 30px;">' + l[index] + '</span><span  style="margin-right: 30px;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</span><span style="margin-right: 30px;">' + r + ' KB ' + '</span>'
					docObj = {
                        documentoId: e.documentoId,
                        location: e.data.location,
                        key: e.data.Key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent:  'c100',
                        icon: "glyphicon glyphicon-file"
						
					};
					
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				

				
				antdir = d.carpetaId;
			} 

		}
		if(!antdir) {
            l = d.carpetaNombre.split('/');
            index = l.length - 1;
			dirObj = {
				carpetaNombre: d.carpetaNombre,
                carpetaId: d.carpetaId,
                text: l[index],
                state: { "opened": true },
                id:  'c' + d.carpetaId,
                data: { "folder" : true },
                parent: '#',
				documentos: [],
			};
            //if(!d.carpetaPadreId) dirObj.parent = '#';
            regs.push(dirObj);
			if(e.documentoId) {
                l = e.data.Key.split('/');
                index = l.length - 1;
                var s = parseInt(e.data.Size);
                var r = s / 1024;
                r = roundToTwo(r).toString()
                //var html = '<span style="margin-right: 30px;">' + l[index] + '</span><span  style="margin-right: 30px;">' + moment(e.data.LastModified).format('DD/MM/YYYY')  + '</span><span style="margin-right: 30px;">' + r + ' KB ' + '</span>'
				docObj = {
                    documentoId: e.documentoId,
                    location: e.data.location,
                    key: e.data.Key,
                    text: l[index],
                    id: e.documentoId,
                    data: { "folder" : false },
                    parent:   'c' + d.carpetaId,
                    icon: "glyphicon glyphicon-file"
                };
                
				if(d.carpetaId == e.carpetaId) {
                    regs.push(docObj);
                }
				docObj = {};
			}
            antdir = d.carpetaId;
		}
        });
        //si se trata del ultimo registro lo guardamos
		/* if(cont == carpeta.length) {
			regs.push(dirObj);
		} */
		cont++;

	});
    

	return regs;
}

