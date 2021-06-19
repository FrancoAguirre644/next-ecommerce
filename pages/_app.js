import '../styles/globals.css'
import '../styles/loading.css'
import '../styles/product.css'
import '../styles/profile.css'
import '../styles/products_manager.css'
import Layout from '../components/Layout'
import { DataProvider } from '../store/GlobalState'

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </DataProvider>
  )
}

export default MyApp
