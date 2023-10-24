// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var dataRondasRealizadas;
var rondaRealizadaId;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};


function initForm() {
    comprobarLogin();
    // de smart admin
    pageSetUp();
    getVersionFooter();

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
initArbolDocumentacion();
getObjectsdocumentacion() 
}

function initArbolDocumentacion() {
    $('#jstreeDocumentacion').jstree({ 'core' : 
    {
        'data' : [],
    },
    'check_callback' : true,
    "plugins" : [ "themes", "html_data", "ui", "crrm", "contextmenu" ],
    "select_node": true,
    'contextmenu': {
        'items': function(node) {
            if(vm.contratoCerrado()) return;
            var menuItems = {
            // Define las opciones del menú contextual para cada nodo
         
            'Option 1': {
                'label': 'Subir documento',
                'action': function(a, b , c) {
                  console.log(node.type);
                  $('#modalUploadDoc').modal('show');
                  preparaDatosArchivo(node.original);
                }
              },
              'Option 2': {
                'label': 'Crear Subcarpeta',
                'action': function() {
                   $('#modalpostSubcarpeta').modal('show');
                   nuevaSubcarpeta(node.original);
                }
              },
              'Option 3': {
                  'label': 'Eliminar',
                  'action': function() {
                    if(!node.data.folder) {
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
            if(!usuario.puedeEditar) {
                delete menuItems['Option 2'];
                delete menuItems['Option 3'];
            }
            return menuItems;
        }
    }
});

}

function getObjectsdocumentacion() {
    llamadaAjax('GET', "/api/parametros/0", null, function (err, data) {
        if (err) return;
        var parametros = data;
        var carpetas = [];
        var id = 1;
        var antCarpeta = null;
            AWS.config.region = "eu-west-3"; // Región
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId:  "eu-west-3:2d09d557-1507-4aff-8c03-9bf7825c54cd",
            });
            var prefix = "facturas";
            var params = {
                Bucket: "comercializa-server",
                Prefix: prefix,
                Delimeter: "/"
            }

            var s3 = new AWS.S3({ params });
            s3.listObjectsV2({}, (err, result) => {
                if (err) mensError('Error de lectura en la nube');
                console.log(result);
                if(result.Contents.length > 0) {
                    var objectKeys = result.Contents
                    result.Contents.forEach(e => {
                        objectKeys.push(e.Key);
                        var a = e.Key.indexOf("/");
                        var b = e.Key.substring(0, a);
                        if(!antCarpeta) {
                            carpetas.push( { carpetaNombre: b, carpetaId: id });
                            antCarpeta = b;
                        } else {
                            if(b != antCarpeta) {
                                id++;
                                carpetas.push( { carpetaNombre: b, carpetaId: id });
                                antCarpeta = b;
                            } else {
                                antCarpeta = b;
                            }
                        }
                    });
                    ProcesaDocumObjTree(objectKeys, carpetas)
                    //loadDocumentacionTree(objectKeys);
                }
            });
    });
}


function loadDocumentacionTree(data) {
    if(data.length == 0) return;
    var obj = data;
    
    $('#jstreeDocumentacion').jstree(true).settings.core.data = obj;
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
			
                    l = e.Key.split('/');
                    index = l.length - 1;
					docObj = {
                        documentoId: e.documentoId,
						location: e.location,
                        key: e.Key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent: e.carpetaId,
                        icon: "glyphicon glyphicon-file"
					};
                    if(d.carpetaId == e.carpetaId) {
                        regs.push(docObj);
                    }
					docObj = {}; //una vez incluida la factura en el documento se limpian los datos
				
                antdir = d.carpetaId;
				
			} else  {
				//si es otro documento de pago guardamos el anterior y creamos otro
				regs.push(dirObj);
                l = d.carpetaNombre.split('/');
                index = l.length - 1;
				dirObj = {
					carpetaNombre: d.carpetaNombre,
                    carpetaId: d.carpetaId,
                    tipo: d.tipo,
                    text:  l[index],
                    id: d.carpetaId,
                    data: { "folder" : true },
                    parent: d.carpetaPadreId,
				    documentos: [],
				};
                if(!d.carpetaPadreId) dirObj.parent = '#';
				
                    l = e.key.split('/');
                    index = l.length - 1;
					docObj = {
                        documentoId: e.documentoId,
                        location: e.location,
                        key: e.key,
                        text: l[index],
                        id: e.documentoId,
                        data: { "folder" : false },
                        parent:  e.carpetaId,
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
                tipo: d.tipo,
                text: l[index],
                id: d.carpetaId,
                data: { "folder" : true },
                parent: d.carpetaPadreId,
				documentos: [],
			};
            if(!d.carpetaPadreId) dirObj.parent = '#';
			if(e.documentoId) {
                l = e.key.split('/');
                index = l.length - 1;
				docObj = {
                    documentoId: e.documentoId,
                    location: e.location,
                    key: e.key,
                    text: l[index],
                    id: e.documentoId,
                    data: { "folder" : false },
                    parent:  e.carpetaId,
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
		if(cont == carpeta.length) {
			regs.push(dirObj);
		}
		cont++;

	});
    

	return regs;
}


