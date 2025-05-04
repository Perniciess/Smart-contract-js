const hre = require("hardhat");

async function main() {
  const CarRental = await hre.ethers.getContractFactory("CarRental");
  const carRental = await CarRental.deploy();

  await carRental.waitForDeployment();

  console.log(`🚗 CarRental deployed to: ${carRental.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
