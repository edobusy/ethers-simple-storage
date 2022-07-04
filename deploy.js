const ethers = require('ethers')
const fs = require('fs')
require('dotenv').config()

async function deploy() {
  // Deploy a contract? Wait for it to be deployed
  /*
    We comiple SimpleStorage.sol using solcjs:
    yarn solcjs --bin --abi --include-path node_modules/ --basepath . -o . SimpleStorage.sol
    --bin is for the binary file, --abi is for the application binary interface, --include-path node_modules/ is for including any file or contract from the modules (dependencies), --basepath . is to describe the starting path for our query (.), and -o . is for where we want the files to be output 
  */
  // http://172.25.16.1:8545 => Ganache simulated blockchain
  // RPC Provider is a blockchain node, and we connect to it via its URL
  // This is for deployment on Rinkeby
  const provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_URL)
  // You can add your private variables just before the node run command if you don't want to use .env:
  // RPC_URL=... PRIVATE_KEY=... node deploy.js
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

  // Run deploy using PRIVATE_KEY_PASSWORD:
  // PRIVATE_KEY_PASSWORD=... node deploy.js
  /*
  const encryptedJson = fs.readFileSync('./.encryptedKey.json', 'utf8')
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  )
  wallet = await wallet.connect(provider)
  */

  // Read and save SimpleStorage abi and binary object
  const abi = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.abi', 'utf8')
  const bin = fs.readFileSync('./SimpleStorage_sol_SimpleStorage.bin', 'utf8')

  // In ethers, a Contract Factory is an object that you can use to deploy Contracts of SimpleContract
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet)
  console.log('Deploying, please wait...')
  // STOP HERE! Wait for Promise to be resolved
  // contractFactory.deploy() returns a Promise
  // Deploy can have many overrides like gasPrice, or gasLimit, and should be put inside an object as an argument of deploy()
  const contract = await contractFactory.deploy()
  const transactionReceipt = await contract.deployTransaction.wait(1)
  console.log(`Contract Address: ${contract.address}`)
  // This is the transaction response
  //console.log('Here is the deployment transaction: ')
  //console.log(contract.deployTransaction)
  // This is the receipt obtained after waiting for one block confirmation or more
  //console.log('Here is the transaction receipt: ')
  //console.log(transactionReceipt)

  //   console.log("Let's deploy with only transaction data")
  //   // Manually created transaction
  //   const tx = {
  //     nonce: await wallet.getTransactionCount(),
  //     gasPrice: 20000000000,
  //     gasLimit: 1000000,
  //     to: null,
  //     value: 0,
  //     data: '0x' + bin,
  //     chainId: 1337,
  //   }
  //   // To sign our transaction do:
  //   //const signedTxResponse = await wallet.signTransaction(tx)
  //   //console.log(signedTxResponse)

  //   // wallet.sendTransaction will automatically sign it for us
  //   const sentTxResponse = await wallet.sendTransaction(tx)
  //   await sentTxResponse.wait(1)
  //   console.log(sentTxResponse)

  // retrieve() is a function from SimpleStorage
  const currentFavouriteNum = await contract.retrieve()
  console.log(`Current favourite number: ${currentFavouriteNum.toString()}`)
  const transactionResponse = await contract.store('7')
  // Transaction receipt, waiting for one block confirmation
  await transactionResponse.wait(1)
  const updatedFavouriteNum = await contract.retrieve()
  console.log(`Updated favourite number: ${updatedFavouriteNum.toString()}`)
}

async function main() {
  await deploy()
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
