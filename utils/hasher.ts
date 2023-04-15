import { hash } from 'bcrypt'

const hasher: (password: string) => Promise<string> = async (password) => {
    const result = await hash(password, 12)
    return result
}

export default hasher;