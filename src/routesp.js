const express = require('express');
const ProdSchema = require('./productos');

const cloudinary = require('cloudinary').v2;

const multer = require('multer');

const router= express.Router(); 

const upload = multer({ dest: 'uploads/' });

  router.post("/productos", upload.single('imagen'), (req, res) => {
    
    const producto= ProdSchema(req.body);

    if (req.file) {
      cloudinary.uploader.upload(req.file.path, { folder: 'proyecto' })
        .then(result => {
          producto.imagen = result.secure_url;
          producto.save()
            .then(data => res.json(data))
            .catch(error => res.json({ message: error }));
        })
        .catch(error => {
          console.log(error);
          res.status(500).send(error);
        });
    } else {  
      producto.save()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));
    }
  });

  router.get('/productos',(req,res)=>{
    ProdSchema.aggregate([
        {
            $lookup: {
              from: "categorias",
              localField: "categoria",
              foreignField: "_id",
              as: "categoria"
            }
        },
    ])
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});
router.get('/productos/:id',(req,res)=>{
    const {id} = req.params;
    ProdSchema
    .findById(id).aggregate([
        {
            $lookup: {
              from: "categorias",
              localField: "categoria",
              foreignField: "_id",
              as: "categoria"
            }
        },
    ])
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});

///actualizar
router.put('/productos/:id',(req,res)=>{
    const {id} = req.params;
    const {nombre,descripcion,imagen,precio,sabor,presentacion,existencia,categoria} = req.body;
    ProdSchema
    .updateOne({_id:id},{$set:{nombre,descripcion,imagen,precio,sabor,presentacion,existencia,categoria}})
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});

//eliminar 
router.delete('/productos/:id',(req,res)=>{
    const {id} = req.params;
    ProdSchema.deleteOne({_id:id})
    .then((data)=>res.json(data))
    .catch((error)=>res.json({message:error}));
});


module.exports = router;