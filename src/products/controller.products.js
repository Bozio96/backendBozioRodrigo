const {Router} = require('express');
const productManager = require('../dao/ProductManager');
const pm = new productManager('/products.json')
const uploader = require('../utils/multer.utils');
const router = Router();


//-------------------DB----------------------------------
router.get('/', async (req,res)=>{
  try {
      const limit = parseInt(req.query.limit)||10;
      const page = parseInt(req.query.page)||1;
      /* const query = req.query.query || ''; */
      const category = req.query.category || '';
      /* const query = req.query.query ? { $or: [{ name: { $regex: req.query.query, $options: 'i' } }, { category: { $regex: req.query.query, $options: 'i' } }] } : {}; */
      const sort = req.query.sort || '';

      const result = await pm.buscarConPaginacion(limit, page, category , sort);
      /* const result = await pm.buscarConPaginacion(query, {limit, page, sort}) */

      const data = {
        status: "success",
        payload: result.products, //Array de productos
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage ? `http://${req.headers.host}/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&category=${category}` : null,
        nextLink: result.hasNextPage ? `http://${req.headers.host}/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&category=${category}` : null
      }

     res.render('products.handlebars', {
      products: data.payload,
      totalPages: data.totalPages,
      prevPage: data.prevPage,
      nextPage: data.nextPage,
      page: data.page,
      hasPrevPage: data.hasPrevPage,
      hasNextPage: data.hasNextPage,
      prevLink: data.prevLink,
      nextLink: data.nextLink,
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
     })

  } catch (error) {
    res.json({status: "error", payload: error.message})
  }
})

router.post('/', /* uploader.single('file'),  */async (req,res)=>{
  try {
    const {title, description, code, price, stock, category, thumbnails} = req.body
    const newProductInfo = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      //thumbnails: req.file.filename //Comentado para no usar multer y poder pasar productos por JSON y no form
      thumbnails
    }
    const newProduct = await pm.crearUno(newProductInfo)
    res.json({
      status: "success",
      message: "Producto Agregado con exito",
      payload: newProduct
    })
  } catch (error) {
    res.json({message: error})
  }
})

router.get('/:pid', async (req,res)=>{
  try {
    const {pid} = req.params;
    const product = await pm.buscarUno(pid)
    if(!product){
      res.status(404).json({error: 'Product not found'})
    }else{
      res.status(200).json(product)
    }
  } catch (error) {
    res.status(500).json({message: 'Internal server error'})
  }
}) //Corregir los codigos de estado, si falla devuelve 200

router.patch('/:pid', uploader.single('file'), async(req,res)=>{
  try{
    const {pid} = req.params;
    const data = req.body
    await pm.actualizarUno(pid, data);
    res.status(200).json('Producto actualizado')
  }catch(error)
  {
    res.json({message: error})
  }
})

router.delete('/:pid', async(req,res)=>{
  try {
    const {pid} = req.params;
    pm.eliminarUno(pid);
    res.status(200).json('Producto Eliminado')
  } catch (error) {
    res.json({message: error})
  }
})

//Metodo Privado
/* router.delete('/deleteAll', async (req,res)=>{
  await pm.eliminarTodos()
  res.json({message: 'DB vaciada'})
}) */

//METODO NO IMPLEMENTADO EN ESTA ENTREGA
/* router.get('/loadItems', async (req,res)=>{
  try {
    const products = await pm.getProducts() //Modificarlo para que sea con base de datos
    res.json({message: products })    
  } catch (error) {
    res.json(error)
  }
}) */

//--------------------FS--------------------------------
/* router.get('/', async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await pm.getProducts();
      const result = limit ? products.slice(0, limit) : products;
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
 */

/* router.get('/:pid', async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await pm.getProductById(pid);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.status(200).json(product);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }); */

/* router.post('/', (req,res)=>{
  try {
    const {title, description, code, price, stock, category, thumbnails} = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
    }
    const products = pm.getProductsArchivo();
    const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || []
    };

    products.push(newProduct);
    pm.saveProductsArchivo(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
}); */

/* router.patch('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = req.body;
    pm.updateProduct(pid, updatedProduct);
    res.status(200).json("Producto actualizado con exito");
  });

router.delete('/:pid', (req, res) => {
    const pid = parseInt(req.params.pid);
    pm.deleteProduct(pid);
    res.status(200).json("Producto eliminado con exito");
  }); */

module.exports = router
