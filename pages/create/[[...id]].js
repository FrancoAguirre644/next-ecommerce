import Head from 'next/head'
import { useState, useContext } from 'react'
import { DataContext } from '../../store/GlobalState'

const ProductsManager = () => {

    const initialState = {
        product_id: "",
        title: '',
        price: 0,
        inStock: 0,
        description: '',
        content: '',
        category: ''
    }

    const [product, setProduct] = useState(initialState)

    const { product_id, title, price, inStock, description, content, category } = product

    const [images, setImages] = useState([])

    const { state, dispatch } = useContext(DataContext)

    const { categories } = state

    const handleChangeInput = e => {
        const { name, value } = e.target
        setProduct({ ...product, [name]: value })
    }

    const handleUploadInput = e => {
        dispatch({type: 'NOTIFY', payload: {}})

        let newImages = [];
        let num = 0;
        let err = '';

        const files = [...e.target.files]

        if(files.length === 0) return dispatch({type: 'NOTIFY', payload: {error: 'Files does not exist.'}})

        files.forEach(file => {
            if(file.size > 1024 * 1024) return err = 'The largest image size is 1mb.'

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') return err = 'Image format is incorrect.'
        
            num += 1;
            
            if(num <= 5) newImages.push(file)

            return newImages;
        
        })
        
        if(err) dispatch({type: 'NOTIFY', payload: {error: err}})

        const imgCount = images.length

        if(imgCount + newImages.length > 5)
            return dispatch({type: 'NOTIFY', payload: {error: 'Select up to 5 images.'}})

        setImages([...images, ...newImages])

    }

    const deleteImage = index => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    return (
        <div className="products_manager">
            <Head>
                <title>Products Manager</title>
            </Head>

            <form className="row my-3">

                <div className="col-md-6">
                    <input type="text" name="product_id" value={product_id}
                    placeholder="Product ID" className="form-control w-100 p-2 my-2"
                    onChange={handleChangeInput}/>

                    <input type="text" name="title" value={title}
                    placeholder="Title" className="form-control w-100 p-2 my-2"
                    onChange={handleChangeInput}/>

                    <div className="row">
                        <div className="col-md-6">
                            <input type="number" name="price" value={price}
                            placeholder="Price" className="form-control w-100 p-2 my-2"
                            onChange={handleChangeInput}/>
                        </div>

                        <div className="col-md-6">
                            <input type="number" name="inStock" value={inStock}
                            placeholder="In Stock" className="form-control w-100 p-2 my-2"
                            onChange={handleChangeInput}/>
                        </div>
                    </div>

                    <textarea className="form-control p-2 my-2" name="description" id="description" cols="30" rows="3"
                    placeholder="Description" value={description} onChange={handleChangeInput}
                    />

                    <textarea className="form-control p-2 my-2" name="content" id="content" cols="30" rows="5"
                    placeholder="Content" value={content} onChange={handleChangeInput}
                    />

                    <div className="input-group-prepend px-0 my-2">
                        <select name="category" id="category" value={category}
                        onChange={handleChangeInput} className="custom-select text-capitalize">
                            <option value="all">All products</option>
                            {
                                categories.map(category => (
                                    <option value={category.name} key={category._id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>

                </div>

                <div className="col-md-6">
                    <div className="input-group mb-3 mt-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file border rounded">
                            <input type="file" className="custom-file-input"
                            onChange={handleUploadInput} multiple accept="image/*"/>
                        </div>
                    </div>
                
                    <div className="row img-up">
                        {
                            images.map((image, index) => (
                                <div key={index} className="file_img">
                                    <img src={image.url ? image.url : URL.createObjectURL(image)} 
                                    alt="" className="img-thumbnail rounded"/>

                                    <span onClick={() => deleteImage(index)}>X</span>
                                </div>
                            ))
                        }

                    </div>
                </div>

            </form>

            <button type="button" className="btn btn-info px-4">Create</button>

        </div>
    )
}

export default ProductsManager