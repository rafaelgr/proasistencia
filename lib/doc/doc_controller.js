/*
 * doc.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var docDb = require('./doc_db_mysql'); // to access mysql db



router.get('/' , function (req, res) {
    docDb.get(function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    });
});

router.get('/docs/',  function (req, res) {
    
    docDb.getDocs(function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    });
});

router.get('/images/',  function (req, res) {
    
    docDb.getImages(function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    });
});


router.post('/',  function (req, res) {
    
    var doc = req.body;
    docDb.post(doc, function (err, docs) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(docs);
        }
    });
});

router.get('/:id',  function (req, res) {
    
    var id = req.params.id;
    docDb.getById(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        if (docs.length == 0) return res.status(404).send('Document not found');
        res.json(docs);
    });
});

router.get('/byPwId/:id',  function (req, res) {
    
    var id = req.params.id;
    docDb.getByPwId(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        res.json(docs);
    });
});

router.get('/byPwId/docs/:id',  function (req, res) {
    
    var id = req.params.id;
    docDb.getByPwIdDocs(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        res.json(docs);
    });
});

router.get('/byPwId/images/:id',  function (req, res) {
    
    var id = req.params.id;
    docDb.getByPwIdImages(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        res.json(docs);
    });
});

router.get('/byWoId/:id',  function (req, res) {
    
    var id = req.params.id;
    docDb.getByWoId(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        res.json(docs);
    });
});

router.get('/byWoId/images/:id',  function (req, res) {
    
    var id = req.params.id;
    docDb.getByWoIdImages(id, function (err, docs) {
        if (err) return res.status(500).send(err.message);
        res.json(docs);
    });
});

router.put('/:id',  function (req, res) {
    
    var id = req.params.id;
    var doc = req.body;
    docDb.put(doc, function (err, group) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(group);
        }
    });
});

router.delete('/:id',  function (req, res) {
    
    var file = req.query.file;
    var id = req.params.id;
    if (!id || !file) {
        return res.status(400).send('Document with id and file name needed');
    }
    docDb.delete(id, file, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

router.delete('/uploads/:id',  function (req, res) {
    
    var id = req.params.id;
    if (!id) {
        return res.status(400).send('An id is needed');
    }
    docDb.deleteUploads(id, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    });
});

module.exports = router;