const hre = require("hardhat")

async function main() {
  console.log("Deploying HealthRecords contract...")

  const HealthRecords = await hre.ethers.getContractFactory("HealthRecords")
  const healthRecords = await HealthRecords.deploy()

  await healthRecords.waitForDeployment()

  const address = await healthRecords.getAddress()
  console.log("HealthRecords deployed to:", address)

  // Save the contract address and ABI for frontend
  const fs = require("fs")
  const contractInfo = {
    address: address,
    abi: JSON.parse(healthRecords.interface.formatJson()),
  }

  fs.writeFileSync("./lib/contract.json", JSON.stringify(contractInfo, null, 2))

  console.log("Contract info saved to lib/contract.json")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
