import { CarCard } from '../card/Card'
import { cars } from './data'
import "./catalog.css"
import CarRentalABI from '../../../../contract/artifacts/contracts/CarRental.sol/CarRental.json' // 
import { useWallet } from '../../hooks/useWallet'

export function CarsCatalog() {
  const { provider, signer } = useWallet()

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const contractData = {
    address: contractAddress,
    abi: CarRentalABI.abi,
    provider,
    signer
  }

  return (
    <div className="cars_catalog">
      {cars.map((car) => (
        <CarCard 
          key={car.id} 
          car={car}
          contract={contractData} 
        />
      ))}
    </div>
  )
}