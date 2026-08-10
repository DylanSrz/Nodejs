import express, { type Request, type Response } from 'express'
import Product from '../models/product.js'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {

    const {name, price} = req.body

    const product = await Product.create({
        name,
        price
    })

    res.json({message: 'Producto creado', Product})

})

router.get('/', async (req: Request, res: Response) => {
    
    const products = await Product.findAll()

    res.json(products)

})

router.get('/:id', async (req: Request, res: Response) => {

    const id = Number(req.params.id)
    
    const product = await Product.findByPk(id)

    res.json(product)

})

export default router