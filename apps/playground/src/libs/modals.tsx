import ReactDOM from 'react-dom/client'
import { ConfigProvider } from '@arco-design/web-react'
import enUS from '@arco-design/web-react/es/locale/en-US'

import { StoreProvider } from './store'
import CreateNamespace from '@components/CreateNamespace'
import CreateDataset from '@components/CreateDataset'
import CreateCollection from '@components/CreateCollection'
import EditDocument from '@components/EditDocument'

function mount(node: JSX.Element) {
  const el = document.createElement('div')
  const App = () => (
    <ConfigProvider locale={enUS}>
      <StoreProvider>{node}</StoreProvider>
    </ConfigProvider>
  )
  document.body.appendChild(el)
  const root = ReactDOM.createRoot(el)
  root.render(<App />)

  return () => {
    setTimeout(() => {
      root.unmount()
      document.body.removeChild(el)
    }, 100)
  }
}

export function createNamespace() {
  const unmount = mount(
    <CreateNamespace
      onClose={() => {
        unmount()
      }}
    />
  )
}

export function createDataset() {
  const unmount = mount(<CreateDataset onClose={() => unmount()} />)
}

export function createCollection(dataset: string) {
  const unmount = mount(
    <CreateCollection dataset={dataset} onClose={() => unmount()} />
  )
}

export function editDocument(
  space: string,
  dataset: string,
  collection: string,
  _id?: string,
  value?: any
) {
  const unmount = mount(
    <EditDocument
      space={space}
      dataset={dataset}
      collection={collection}
      _id={_id}
      value={value}
      onClose={() => unmount()}
    />
  )
}
