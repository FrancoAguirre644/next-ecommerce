import { useState, useEffect } from "react"
import filterSearch from "../utils/filterSearch"
import { getData } from "../utils/fetchData"
import { useRouter } from "next/router"

const Filter = ({state}) => {

    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [category, setCategory] = useState('')

    const {categories} = state

    const router = useRouter()

    const handleCategory = (e) => {
        setCategory(e.target.value)
        filterSearch({router, category: e.target.value})
    }

    const handleSort = (e) => {
        setSort(e.target.value)
        filterSearch({router, sort: e.target.value})
    }

    useEffect(() => {
        filterSearch({router, search: search ? search : 'all'})
    }, [search])

    return (
        <div className="input-group">
            <div className="input-group-prepend col-md-2 px-0 mt-2">
                <select className="custom-select text-capitalize" value={category} onChange={handleCategory}
                 style={{borderRadius: '5px 0px 0px 5px'}}>
                    
                    <option value="all">All Products</option>

                    {
                        categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))
                    }
                </select>
            </div>
            
            <form autoComplete="off" className="mt-2 col-md-8 px-0">
                <input type="text" className="form-control" list="title_product" style={{borderRadius: '0px 0px 0px 0px'}}
                value={search.toLocaleLowerCase()} onChange={e => setSearch(e.target.value)}/>

                <datalist id="title_product">
                </datalist>

                <button className="position-absolute btn btn-info" type="submit"
                style={{top: 0, right: 0, visibility: 'hidden'}}>
                    Search
                </button>
            </form>

            <div className="input-group-prepend col-md-2 px-0 mt-2">
                <select className="custom-select text-capitalize" value={sort} onChange={handleSort}
                    style={{borderRadius: '0px 5px 5px 0px'}}>
                    <option value="-createdAt">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="-sold">Best sales</option>
                    <option value="-price">Price: High-Low</option>
                    <option value="price">Price: Low-High</option>
                </select>
            </div>

        </div>
    )
}

export default Filter