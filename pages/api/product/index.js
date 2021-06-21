import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'

connectDB()

export default async(req, res) => {
    switch(req.method) {
        case "GET":
            await getProducts(req, res)
            break;
        case "POST":
            await createProducts(req, res)
            break;
    }
}

const getProducts = async (req, res) => {
    try {
        const products = await Products.find()
        res.json({
            status: 'success',
            result: products.length,
            products
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

const createProducts = async (req, res) => {

    try {

        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(400).json({ err: 'Authentication is not valid.' })

        const { title, price, inStock, description, content, category, images } = req.body

        if (!title || !price || !inStock || !description || !content || !category === 'all' || images.length === 0)
            return res.status(400).json({ err: 'Please add all fields.' })

        const product = await Products.findOne({title})
        if(product) return res.status(400).json({ err: 'Product already exists.' })
        
        const newProduct = new Products({
            title, price, inStock, description, content, category, images
        })

        await newProduct.save()

        res.json({msg: 'Success! Created a new Product.'})

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}