import { createContext, useContext, useState, useEffect } from 'react'
import { BrowserProvider } from 'ethers'

const HARDHAT_NETWORK_ID = '31337'

const WalletContext = createContext()

export function useWallet() {
  return useContext(WalletContext)
}

export function WalletProvider({ children }) {
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [networkError, setNetworkError] = useState(null)
  const [balance, setBalance] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)

  useEffect(() => {
    if (selectedAccount) {
      updateBalance()
    }
  }, [selectedAccount])

  const connectWallet = async () => {
    if (window.ethereum === undefined) {
      setNetworkError('Установите Metamask!')
      return
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const selectedAddress = accounts[0]

      if (!checkNetwork()) return

      await initialize(selectedAddress)

      window.ethereum.on('accountsChanged', ([newAddress]) => {
        if (newAddress === undefined) {
          return resetState()
        }
        initialize(newAddress)
      })

      window.ethereum.on('chainChanged', () => {
        resetState()
      })
    } catch (error) {
      setNetworkError(error.message)
    }
  }

  const initialize = async (selectedAddress) => {
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      setProvider(provider)
      setSigner(signer)
      setSelectedAccount(selectedAddress)
    } catch (error) {
      setNetworkError(error.message)
    }
  }

  const updateBalance = async () => {
      const balanceGwei = await provider.getBalance(selectedAccount)
      const balanceEth = (balanceGwei / BigInt(10 ** 18)).toString()
      setBalance(balanceEth)
  }

  const resetState = () => {
    setSelectedAccount(null)
    setBalance(null)
    setNetworkError(null)
    setProvider(null)
    setSigner(null)
  }

  const checkNetwork = () => {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true
    }
    setNetworkError('Подключитесь localhost:8545')
    return false
  }

  return (
    <WalletContext.Provider
      value={{
        selectedAccount,
        networkError,
        balance,
        connectWallet,
        resetState,
        provider,
        signer,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
