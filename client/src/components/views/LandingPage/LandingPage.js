import { Icon, Col, Card, Row} from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import { price, continents } from './Sections/Data';
import SearchFeature from './Sections/SearchFeature';

const { Meta } = Card;

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [SearchTerms, setSearchTerms] = useState("")
    const [Filters, setFilters] = useState({
        continents : [],
        price : []
    })
    
    useEffect(() => {
        const variables={
            skip: Skip,
            limit: Limit
        }
       getProducts(variables)
    }, [])    
    
    const getProducts = (variables) => {
        Axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    if(variables.loadMore) {
                        setProducts([...Products, ...response.data.products])
                    }
                    else{
                        setProducts(response.data.products)
                    }

                    setPostSize(response.data.postSize)
                
                } else{
                    alert ('Failed to fetch product data')
                }
            })
    }

    const onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
            searchTerm: SearchTerms
        }
        getProducts(variables)

        setSkip(skip)
    }

    
    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24}>
            <a href={`/product/${product._id}`}>
                <Card
                    hoverable={true}
                    cover={<ImageSlider images={product.images} />}
                >
                    <Meta
                        title = {product.title}
                        description = {`$${product.price}`}
                    />
                </Card>
            </a>

        </Col>
    })

    const showFilteredResults = (filters) => {

        const variables = {
            skip : 0,
            limit : Limit,
            filters : filters
        }

        getProducts(variables)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array= [];

        for (let key in data) {       
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array;
            }
        }  
            return array  
    }

    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters }

        newFilters[category] = filters

        if (category === "price"){
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerms = (newSearchTerm) => {
        setSearchTerms(newSearchTerm)
        
        const variables = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerms(newSearchTerm)

        getProducts(variables)
    }

    return (
        <div style= {{ width: '75%', margin: '3rem auto' }}>
            <div style= {{ textAlign: 'center' }}>
                <h2> Travel <Icon type='rocket' /></h2>
            </div>
            

            <Row gutter = {[16, 16]}>
                <Col lg = {12} xs={24}>
                    <CheckBox
                        list = { continents }
                        handleFilters = {filters => handleFilters (filters, "continents")}
                    />
                </Col>
                <Col lg = {12} xs={24}>
                    <RadioBox
                        list = { price }
                        handleFilters = {filters => handleFilters (filters, "price")}
                    />
                </Col>
            </Row>

            <div style={{display:'flex', justifyContent:'flex-end', margin:'1rem auto'}}>
                <SearchFeature
                    refreshFunction={updateSearchTerms}
                />
            </div>

            {Products.length === 0?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center'}}>
                    <h2>No post yet...</h2>
                </div> :
                
                <div>
                    <Row gutter={[16,16]}>
                        {Products.map((product, index) => {})}
                    {renderCards}
                    </Row>
                </div>
            }
            <br/><br/>

            { PostSize >= Limit &&
                <div style= {{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }
            
        </div>
    )

}

export default LandingPage
