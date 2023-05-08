
import React, {useState, useEffect } from 'react' 
import axios from 'axios'
// import { PayPalButton } from 'react-paypal-button-v2'
import { Link} from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button,form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import dotenv from 'dotenv'

import {
  getOrderDetails,
  payOrder,
  deliverOrder,

} from '../actions/orderActions'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

dotenv.config()
const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id


 
  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString); 
  const PayStatus = urlParams.get("status");
  const Pay_tx_ref = urlParams.get("tx_ref");
  const Pay_Id = urlParams.get("transaction_id")

    
  const RedirectLink = `${process.env.REACT_APP_BASE_URL}/order/${orderId}`  
  
  const Public_key = process.env.REACT_APP_PUBLIC_KEY

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay    
          
  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

 

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

 

  if(!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }
    
    if(PayStatus !=null && PayStatus === "successful" && Pay_tx_ref!=null && Pay_Id!=null){
     axios.post('/validate', {id: Pay_Id})
      .then((res) => {
        // console.log(res.data.status)
        if(res.data.status ==="success"){
          // console.log("T")
          successPaymentHandler(res.data)
       
        }
      })
      .catch((err) => console.log(err))
    }  
  },[PayStatus,Pay_Id,Pay_tx_ref,userInfo,history])

   useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }  
   

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(`/api/config/paypal`)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}` 
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }


    
    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order, history, userInfo])  

  const successPaymentHandler = (paymentResult) => {
    // console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
    
  }
  

  const deliverHandler = () => {
    dispatch(deliverOrder(order))  
  }  

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'> 
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              
              {order.isPaid ? (
                  <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}

            
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>       
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price} RWF = {item.qty * item.price} RWF
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>{order.itemsPrice} RWF</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>{order.shippingPrice} RWF</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>{order.taxPrice} RWF</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>{order.totalPrice} RWF</Col>
                </Row>
              </ListGroup.Item>
    
          <ListGroup>
              {!order.isPaid && (
                <ListGroup.Item>    
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />   
                  ) : (
                       
                    <form method="POST" action="https://checkout.flutterwave.com/v3/hosted/pay" >
                   
                    <input type="hidden" name="public_key" value={Public_key}/>
                    <input type="hidden" name="customer[email]" value={order.user.email} />
                    <input type="hidden" name="customer[name]" value={order.user.name} />
                    <input type="hidden" name="tx_ref" value={order._id} />
                    <input type="hidden" name="amount" value={order.totalPrice} />
                    <input type="hidden" name="currency" value="RWF" />
                    <input type="hidden" name="meta[token]" value={order.user.token} />
                    <input type="hidden" name="redirect_url" value={RedirectLink}/>
                    <button type="submit"  id="start-payment-button" className='btn btn-block' style={{backgroundColor: '#2C2E2F', color: '#fff', borderRadius: '4px'}}>PAY</button>
                    </form>    
   )}
                </ListGroup.Item>
              )}

              
</ListGroup>
      
                {loadingDeliver && <Loader />}
                {userInfo &&
                  userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen













