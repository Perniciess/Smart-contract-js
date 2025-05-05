// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarRental {
    struct Car {
        bool isRented;
        address renter;
        uint256 rentedAt;
    }

    mapping(uint256 => Car) public cars;
    address public owner;

    event CarRented(address indexed renter, uint256 carId, uint256 timestamp);
    event CarReturned(uint256 carId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    // Период аренды: 30 секунд
    uint256 public rentalPeriod = 30 seconds;

    function rentCar(uint256 carId) external payable {
        require(msg.value > 0, "Payment required");
        require(!cars[carId].isRented, "Car already rented");

        cars[carId] = Car(true, msg.sender, block.timestamp);
        emit CarRented(msg.sender, carId, block.timestamp);
    }

    function checkAndReleaseCar(uint256 carId) external {
        require(cars[carId].isRented, "Car is not rented");
        require(
            block.timestamp >= cars[carId].rentedAt + rentalPeriod, // 30 секунд
            "Car rental period not finished"
        );

        cars[carId].isRented = false;
        cars[carId].renter = address(0);
        cars[carId].rentedAt = 0;

        emit CarReturned(carId, block.timestamp);
    }
}
