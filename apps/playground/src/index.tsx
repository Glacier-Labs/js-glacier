import ReactDOM from 'react-dom/client'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ConfigProvider } from '@arco-design/web-react'
import enUS from '@arco-design/web-react/es/locale/en-US'

import 'prismjs/themes/prism-tomorrow.css'
import '@arco-design/web-react/dist/css/arco.css'
import '@assets/styles/global.scss'
import App from './pages/App'
import { StoreProvider } from '@libs/store'

function getLibrary(provider: any) {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider locale={enUS}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Web3ReactProvider>
  </ConfigProvider>
)
