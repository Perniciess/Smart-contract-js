# Проект по аренде автомобилей с помощью смарт-контракта


## Установка зависимостей
1. `cd frontend && npm install`
2. `cd ../backend && npm install`
3. `cd ../contract && npm install`


## Запуск проекта
1. `cd contract`
2. `npx hardhat compile`
3. `npx hardhat node`
4. В новом терминале `npx hardhat run scripts/deploy.js --network localhost`
5. Новый терминал `cd ../backend`, в нем же `npm start`
6. Новый терминал, `cd ../frontend`, в нем же `npm run dev`


