import connectDB from '../../../utils/connectDB'
import valid from '../../../utils/valid'
import Users from '../../../models/userModel'
import bycript from 'bcrypt'

connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await register(req, res)
            break
    }
}

const register = async (req, res) => {
    try {
        const { name, email, password, cf_password } = req.body

        const errorMsg = valid(name, email, password, cf_password)
        if (errorMsg) return res.status(400).json({ error: errorMsg })

        const user = await Users.findOne({ email })
        if (user) return res.status(400).json({ err: 'This email already exists.' })

        const passwordHash = await bycript.hash(password, 12)

        const newUSer = new Users({ name, email, password: passwordHash, cf_password })

        await newUSer.save()

        res.json({ msg: "Register Success!" })

    } catch (error) {
        return res.status(500).json({ err: err.message })
    }
}

