import React, { useEffect, useState } from 'react'
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import { Row, Col } from 'antd'
import Axios from 'axios';



function DetailProductPage(props) {

    const productId = props.match.params.productId
    const [Product, setProduct] = useState([])

    console.log(productId)

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
                console.log('success')
                console.log(Product)
            })
    }, [])

    
    
  
  
    return (
        <div className='postPage' style={{ width: '100%', padding: '3rem 4rem' }}>
            <div style={{display:'flex', justifyContent:'center'}}>
                <h1>{Product.title}</h1>
            </div>
            <br/>

            <Row guttter = {[16, 16]}>
                <Col lg={12} xs={24}>
                    <ProductImage detail={Product}/>
                </Col>
                <Col lg={12} xs={24}>
                    <ProductInfo detail={Product}/>
                </Col>
            </Row>
        </div>
  )
}

export default DetailProductPage