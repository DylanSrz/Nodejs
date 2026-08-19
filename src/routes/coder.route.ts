import express, { type Request, type Response } from 'express'
import { Coder } from '../models/coder.model.js'
import { Ruta } from '../models/ruta.model.js'
import { Clan } from '../models/clan.model.js'

const router = express.Router()

// GET // consultar todos los coders
router.get('/', async (req: Request, res: Response) => {

    const coders = await Coder.find().populate('clan')

    res.json(coders)

})

// GET // consultar todos los coders
router.get('/:id', async (req: Request, res: Response) => {

    const coder = await Coder.findById(req.params.id).populate('clan')

    if (!coder) {
        return res.status(404).json({message: 'coder no encontrado'})
    }

    res.json(coder)

})

// GET // consultar coders por un clan especifico.
router.get('/clan/:id', async (req: Request, res: Response) => {

    const id = req.params.id as string

    const coders = await Coder.find({clan: id})

    res.json(coders)
})

// GET // consultar coders por una ruta especifica.
router.get('/ruta/:id', async (req: Request, res: Response) => {

    const idRuta = req.params.id as string

    const clanes = await Clan.find({ruta: idRuta})

    const clanesRuta = clanes.map((clan) => clan._id)

    const coders = await Coder.find({clan: clanesRuta})

    res.json(coders)
})


// POST // crear un coder
router.post('/', async (req: Request, res: Response) => {

    const {name, email, clan} = req.body

    const newCoder = await Coder.create(
        {
            name,
            email,
            clan
        }
    )

    res.status(201).json({message: 'coder creado', newCoder})

})

// PUT // actualizar datos de un coder
router.put('/:id', async (req:Request, res: Response) => {

    const {name, email, clan} = req.body

    const coder = await Coder.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    )

    res.json({message: 'Informacion de coder actualizada.', coder})
})

// DELETE // eliminar un coder
router.delete('/:id', async (req: Request, res: Response) => {

    await Coder.findByIdAndDelete(req.params.id)

    res.json({message: 'Expulsado por convivencia'})
})



export default router