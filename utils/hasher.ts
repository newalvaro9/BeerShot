import { hash } from 'bcrypt'

const hasher = async (password: string) => {
    const result = await hash(password, 12)
    return result
}

export default hasher;