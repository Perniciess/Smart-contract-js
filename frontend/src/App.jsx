import React from 'react'
import WalletConnection from './pages/index'
import { Header } from './components/header/Header'
import { CarsCatalog } from './components/catalog/Catalog'
import { WalletProvider } from './hooks/useWallet'

function App() {
  return (
    <>
      <WalletProvider>
        <Header />
        <WalletConnection />
        <CarsCatalog />
      </WalletProvider>
    </>
  )
}

export default App