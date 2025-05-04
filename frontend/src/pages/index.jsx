
import React from 'react'
import { ConnectWallet } from '../components/metamask/ConnectWallet'
import { useWallet } from '../hooks/useWallet'
import './index.css'

export default function WalletConnection() {
  const {
    selectedAccount,
    networkError,
    balance,
    connectWallet,
    resetState,
  } = useWallet()

  const dismissNetworkError = () => {
    setNetworkError(null)
  }

  if (!selectedAccount) {
    return (
      <ConnectWallet
        connectWallet={connectWallet}
        networkError={networkError}
        dismiss={dismissNetworkError}
      />
    )
  }

  return (
    <div className="wallet-card">
      <h2 className="wallet-card__title">Криптокошелек подключен</h2>

      <div className="wallet-card__info">
        <div className="wallet-info__item">
          <span className="wallet-info__label">Идентификатор:</span>
          <span className="wallet-info__value">{selectedAccount}</span>
        </div>

        <div className="wallet-info__item">
          <span className="wallet-info__label">Баланс:</span>
          <span className="wallet-info__value">{balance || '0'} ETH</span>
        </div>
      </div>

      <button className="btn_disconnect" onClick={resetState}>
        Отключить криптокошелек
      </button>
    </div>
  )
}
