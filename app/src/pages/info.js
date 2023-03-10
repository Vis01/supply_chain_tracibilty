import React, { useState, useEffect } from 'react';
import Loader from '../components/loader';
import { Link, Redirect } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { popups as pp } from '../store/atoms'
import provider from '../store/web3Provider'
import '../static/css/info.scss';

export default function ProductInfo() {

    const [productInfo, setProductInfo] = useState('');
    const [sellerInfo, setSellerInfo] = useState('');
    const [loading, setLoading] = useState(true);
    const setPopup = useSetRecoilState(pp);
    const productId = window.location.pathname.split('/')[2];

    useEffect(() => {

        async function fetchProductInfo() {
            try {
                const response = await provider.callTransaction()
                setProductInfo(response.filter(p => p.productId == productId)[0]);
            }
            catch (e) {
                setPopup("Failed to fetch product info")
                console.error(e);
            }
        }

        async function fetchSellerInfo() {
            try {
                const response = await provider.callTransaction('productSeller', [productId])

                setSellerInfo(response[0]);

            }
            catch (e) {
                setPopup("Product is invalid")
                console.error(e);
            }
            finally {
                setLoading(false)
            }
        }
        fetchProductInfo();
        fetchSellerInfo();
    }, [])


    if (loading) {
        return (<Loader />)
    }
    if (productInfo == undefined) {
        return <Redirect to="/" />

    }
    return (
        <div className="container CI my-4">
            <div className="d-flex small">
                {console.log('skjs', productInfo)}
                <div className="center">
                    <div>
                        <div className="product-details">
                            <h2>Product Info</h2>
                            <div>
                                <p>Name : <span>
                                    {productInfo.name}
                                </span></p>

                                <p>Price : <span>
                                    {productInfo.price}
                                </span></p>

                                <p>ID : <span>
                                    {productId}
                                </span></p>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="right">
                    <div>
                        <div className="product-details">
                            <h2>Seller Info</h2>
                            <p>Name : <span>
                                {sellerInfo.name}
                            </span></p>


                            <p>Details : <span>
                                {sellerInfo.details}
                            </span></p>

                        </div>
                    </div>
                </div> */}
            </div>
            <div className="fullWidth">

                <div className="buttons">
                    <Link to="/sold" className="btn btn-primary btn-lg ">SOLD</Link>
                </div>
            </div>
        </div>
    )
}