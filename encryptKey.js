// This code is for encrypting our private key for additional security

const ethers = require('ethers')
const fs = require('fs')
require('dotenv').config()

async function run() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync('./.encryptedKey.json', encryptedJsonKey)
}

async function main() {
  await run()
  process.exit(0)
}

main().catch((e) => {
  console.log(e)
  process.exit(1)
})
