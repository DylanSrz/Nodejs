import express, { type Request, type Response } from 'express'
import Product from '../models/product.js'
import Category from '../models/category.js'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {

    const {name, price} = req.body

    const product = await Product.create({
        name,
        price
    })

    res.json({message: 'Producto creado', product})

})

// para listar todos los productos
router.get('/', async (req: Request, res: Response) => {

    const {category} = req.query

    let filtros = {}

    if (category) {
        filtros = {
            category_id: category
        }
    }
    
    const products = await Product.findAll({
        include: Category,
        where: filtros,
        order: [['createdAt','desc']]
    })

    res.json(products)

})

// para buscar un producto
router.get('/:id', async (req: Request, res: Response) => {

    const id = Number(req.params.id)
    
    const product = await Product.findByPk(id)

    res.json(product)

})

// para actualizar un producto
router.put('/:id', async (req: Request, res: Response) => {

    const id = Number(req.params.id)
    const {name, price, category_id, status} = req.body

    const product = await Product.findByPk(id)

    if (!product) {
        return res.status(404).json({message: 'Producto no encontrado.'})
    }

    product.update({name, price, category_id, status});

    res.json({message: 'producto actualizado', product});

})

// para eliminar un producto
router.delete('/:id', async (req: Request, res: Response) => {

    const id = Number(req.params.id)
    
    const product = await Product.findByPk(id)

    if (!product) {
        return res.status(404).json({message: 'Producto no encontrado.'})
    }

    product?.destroy()

    res.json({message: 'Producto eliminado'})

})

export default router