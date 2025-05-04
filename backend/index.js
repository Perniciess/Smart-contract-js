const express = require("express");
const { ethers } = require("ethers");

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  "event CarRented(address indexed renter, uint256 carId, uint256 timestamp)"
];
const PROVIDER_URL = "http://127.0.0.1:8545";

const app = express();
app.use(express.json());

const cars = {
  "1": { status: "free" },
  "2": { status: "free" },
  "3": { status: "free" },
  "4": { status: "free" },
};

async function init() {
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    await provider.getBlockNumber();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);


    contract.on("CarRented", (renter, carId, timestamp) => {
      const id = carId.toString().replace('n', '');
      console.log(`\nНовое событие! Car ${id} rented by ${renter}`);
      
      if (cars[id]) {
        cars[id] = { 
          status: "rented", 
        };
      }
      console.log("Обновленные данные:", cars);
    });

    console.log("Слушаем события CarRented...");

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

app.get("/cars", (req, res) => res.json(cars));

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}`);
  await init();
});