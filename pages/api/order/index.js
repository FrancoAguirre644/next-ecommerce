import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await createOrder(req, res)
            break;
    }
}

const createOrder = async (req, res) => {
    try {
        const result = await auth(req, res)
        const { adress, mobile, cart, total } = req.body

        const newOrder = new Orders({
            user: result.id, adress, mobile, cart, total
        })

        cart.filter(item => {
            return sold(item._id, item.quantity, item.inStock, item.sold)
        })

        await newOrder.save()

        res.json({
            msg: 'Payment success! We will contact you to confirm the order',
            newOrder
        })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}

const sold = async (id, quantity, oldInStock, oldSold) => {
    await Products.findOneAndUpdate({ _id: id }, {
        inStock: oldInStock - quantity,
        sold: oldSold + quantity
    })
}
