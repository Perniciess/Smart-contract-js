import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { Contract } from 'ethers';
import './card.css';
import { ethers } from 'ethers';

export function CarCard({ car, contract }) {
	const { selectedAccount, balance, signer, provider } = useWallet();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [status, setStatus] = useState('free');

	const fetchCarStatus = async () => {
		try {
			const res = await fetch(`http://localhost:3000/cars/${car.id}`);
			const data = await res.json();
			if (data && data.status) {
				setStatus(data.status);
			}
		} catch (err) {
			console.error('Ошибка при загрузке статуса машины:', err);
		}
	};

	useEffect(() => {
		fetchCarStatus();

		const interval = setInterval(() => {
			fetchCarStatus();
		}, 2000);

		return () => clearInterval(interval);
	}, [car.id]);

	const handleRentCar = async () => {
		try {
			if (!selectedAccount) {
				alert('Пожалуйста подключите свой криптокошелек');
				return;
			}

			setIsLoading(true);
			setError(null);

			const carRentContract = new Contract(contract.address, contract.abi, signer);

			const tx = await carRentContract.rentCar(car.id, {
				value: ethers.parseEther(car.price),
			});

			await tx.wait();
		} catch (err) {
			setError('Произошла ошибка при аренде. Попробуйте снова.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="car-card">
			<div className="car-image-container">
				<img className="car-image" src={car.image} alt={car.title} />
			</div>

			<h3 className="car-title">{car.title}</h3>
			<p className="car-price">От {car.price} ETH/сутки</p>

			<div className="car-content">
				<div className="car-spec">
					<p className="spec-name">Двигатель</p>
					<p className="spec-value">{car.specs.engine}</p>
				</div>

				<div className="car-spec">
					<p className="spec-name">Привод</p>
					<p className="spec-value">{car.specs.drive}</p>
				</div>

				<div className="car-spec">
					<p className="spec-name">Разгон до 100 км/ч</p>
					<p className="spec-value">{car.specs.acceleration}</p>
				</div>

				<div className="car-buttons">
					{status === 'free' ? (
						<button className="btn-book" onClick={handleRentCar} disabled={isLoading}>
							{isLoading ? 'Подтверждение транзакции...' : 'Забронировать'}
						</button>
					) : (
						<span className="span-rented" disabled>
							Уже арендована
						</span>
					)}
				</div>

				{error && <p className="error">{error}</p>}
			</div>
		</div>
	);
}
