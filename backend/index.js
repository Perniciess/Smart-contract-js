const express = require("express")
const { ethers } = require("ethers")

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const CONTRACT_ABI = [
  "function rentCar(uint256 carId) payable",
  "function checkAndReleaseCar(uint256 carId) external",
  "event CarRented(address indexed renter, uint256 carId, uint256 timestamp)",
  "event CarReturned(uint256 carId, uint256 timestamp)"
]
const PROVIDER_URL = "http://127.0.0.1:8545"
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const app = express()
app.use(express.json())

const cars = {
  "1": { status: "free" },
  "2": { status: "free" },
  "3": { status: "free" },
  "4": { status: "free" },
}
async function init() {
  try {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL); // Используем JsonRpcProvider
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider); // Создаем кошелек для подписания транзакций
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet); // Создаем контракт с подписанным кошельком

    contract.on("CarRented", (renter, carId, timestamp) => {
      const id = carId.toString();
      console.log(`\nНовое событие! Car ${id} rented by ${renter}`);

      if (cars[id]) {
        cars[id] = {
          status: "rented",
          rentedAt: Math.floor(Date.now() / 1000), // Устанавливаем время аренды
        };
      }
      console.log("Обновленные данные:", cars);

      // Через 30 секунд автоматически освобождаем машину
      setTimeout(async () => {
        const car = cars[id];
        if (car && car.status === "rented") {
          try {
            const tx = await contract.checkAndReleaseCar(carId); // Отправляем транзакцию
            await tx.wait(); // Ожидаем завершения транзакции
            cars[id].status = "free";
            cars[id].rentedAt = null;
            console.log(`Машина ${id} освобождена автоматически.`);
          } catch (error) {
            console.error(`Ошибка при освобождении машины ${id}:`, error);
          }
        }
      }, 30000); // Освобождение машины через 30 секунд
    });

    console.log("Слушаем события CarRented...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

app.get("/cars/:id", (req, res) => {
  const car = cars[req.params.id]
  if (!car) return res.status(404).json({ error: "Car not found" })
  res.json(car)
})

const PORT = 3000
app.listen(PORT, async () => {
  console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}`)
  await init()
})