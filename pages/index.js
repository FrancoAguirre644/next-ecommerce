import { useState, useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
import ProductItem from '../components/product/productItem'
import Head from 'next/head'

const Home = (props) => {

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const [products, setProducts] = useState(props.productProps)

  const [isCheck, setIsCheck] = useState(false)

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

    </div>
  )
}

export async function getServerSideProps() {

  const res = await getData('product')

  return {
    props: {
      productProps: res.products,
      result: res.result
    }, // will be passed to the page component as props
  }
}

export default Home;