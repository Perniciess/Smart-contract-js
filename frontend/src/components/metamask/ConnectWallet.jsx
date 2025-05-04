import { NetworkErrorMessage } from './NetworkErrorMessage'
import './ConnectWallet.css'

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  const handleConnect = async () => {
    await connectWallet()
  }

  return (
    <div className="connect_wallet">
      {networkError && (
        <NetworkErrorMessage
          message={networkError}
          dismiss={dismiss}
        />
      )}

      <p>Подключите ваш криптокошелек</p>

      <button
        type="button"
        onClick={handleConnect}
      >
        Подключить
      </button>
    </div>
  )
}
