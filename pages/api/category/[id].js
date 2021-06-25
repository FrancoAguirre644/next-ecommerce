import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoryModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "PUT":
            await updateCategory(req, res)
            break;
        case "DELETE":
            await deleteCategory(req, res)
            break;
    }
}

const updateCategory = async (req, res) => {
    try {
        const result = await auth(req, res)

        if (result.role !== 'admin') return res.status(400).json({ err: 'Authentication is not valid.' })

        const { id } = req.query
        const { name } = req.body

        const newCategory = await Categories.findByIdAndUpdate({ _id: id }, { name })

        res.json({ 
            msg: 'Success! Update a new category',
            category: {
                ...newCategory,
                name
            }
         })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const result = await auth(req, res)

        if (result.role !== 'admin') return res.status(400).json({ err: 'Authentication is not valid.' })

        const { id } = req.query

        const product = await Products.findOne({category: id})

        if(product) return res.status(400).json({err: 'Please delete all products with a relationship'})

        await Categories.findByIdAndDelete(id)

        res.json({ msg: 'Success! Delete category' })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}


