import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
import ProductItem from '../components/product/productItem'
import Head from 'next/head'
import filterSearch from '../utils/filterSearch'
import { useRouter } from 'next/router'

const Home = (props) => {

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const [products, setProducts] = useState(props.products)

  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)

  const handleCheck = (id) => {
    products.forEach(product => {
      if(product._id === id) product.checked = !product.checked
    });
    setProducts([...products])
  }

  const handleCheckAll = () => {
    products.forEach(product => product.checked = !isCheck);
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product => {
      if(product.checked) {
        deleteArr.push({
          data: '', id: product._id,
          title: 'Delete all selected products?', type: 'DELETE_PRODUCT'
        })
      }
    })

    dispatch({type: 'ADD_MODAL', payload: deleteArr})

  }

  const handleLoadMore = () => {
    setPage(page + 1)
    filterSearch({router, page: page + 1})
  }

  useEffect(() => {
    setProducts(props.products)
  }, [props.products])

  useEffect(() => {
    if(Object.keys(router.query).length === 0) {
      setPage(1)
    } else {
      setPage(Number(router.query.page))
    }
  }, [router.query])

  return (
    <div className="home_page">
      <Head>
        <title>Home</title>
      </Head>

      {
        auth.user && auth.user.role === 'admin' && 
        <div className="delete_all btn btn-danger mt-2" style={{margin: '-10px'}}>
          <input type="checkbox" checked={isCheck} onChange={() => handleCheckAll()}
          style={{width: '25px', height: '25px', transform: 'translateY(8px)'}}
          />
          <button className="btn btn-danger ml-2"
          data-toggle="modal" data-target="#exampleModal" onClick={handleDeleteAll}>
            DELETE ALL
          </button>
        </div>
      }

      {
        products.length === 0 ?
          <h1>No products</h1>
          :
          <div className="row justify-content-center mt-4">
            {
              products.map(product => (
                <div className="col-md-3" key={product._id}>
                  <ProductItem product={product} handleCheck={handleCheck}/>
                </div>
              ))
            }
          </div>
      }

      {
        props.result < page * 3 ? ""
        : <button className="btn btn-outline-info d-block mx-auto mb-4"
        onClick={handleLoadMore}>
          Load More
        </button>
      }

    </div>
  )
}

export async function getServerSideProps({query}) {
  const page = query.page || 1
  const category = query.category || 'all'
  const sort = query.sort || ''
  const search = query.search || 'all'

  const res = await getData(`product?limit=${page * 3}&category=${category}&sort=${sort}&title=${search}`)

  return {
    props: {
      products: res.products,
      result: res.result
    }, // will be passed to the page component as props
  }
}

export default Home;