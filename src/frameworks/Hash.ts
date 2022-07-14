import bcrypt from 'bcrypt'

class Hash {
  async generate (plaintext: string): Promise<string> {
    const hash = await bcrypt.hash(plaintext, 15)

    return hash
  }

  async verify (ciphertext: string, plaintext: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, ciphertext)
    return isValid
  }
}

export default new Hash()
