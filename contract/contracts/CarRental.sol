// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CarRental {
    struct Car {
        bool isRented;
        address renter;
    }
    
    mapping(uint256 => Car) public cars;
    address public owner;

    event CarRented(address indexed renter, uint256 carId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function rentCar(uint256 carId) external payable {
        require(msg.value > 0, "Payment required");
        require(!cars[carId].isRented, "Car already rented");
        
        cars[carId] = Car(true, msg.sender);
        emit CarRented(msg.sender, carId, block.timestamp);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not authorized");
        payable(owner).transfer(address(this).balance);
    }
}