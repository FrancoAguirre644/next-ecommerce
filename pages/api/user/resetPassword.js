import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import bycript from 'bcrypt'
import Users from '../../../models/userModel'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await resetPassword(req, res)
    }
}

const resetPassword = async (req, res) => {
    try {
        const result = await auth(req, res)
        const { password } = req.body
        const passwordHash = await bycript.hash(password, 12)

        await Users.findOneAndUpdate({ _id: result.id }, { password: passwordHash })

        res.json({ msg: 'Update Success!' })

    } catch (err) {
        return res.status(500).json({ err: err.message })
    }
}