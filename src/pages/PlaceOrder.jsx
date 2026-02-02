import React, { useContext, useState } from 'react'
import Title from '../component/Title'
import CartTotal from '../component/CartTotal'
import razorpay from '../assets/Razorpay.jpg'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function PlaceOrder() {
  const navigate = useNavigate()

  const { cartItem, setCartItem, getCartAmount, delivery_fee, products } =
    useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)

  const [method, setMethod] = useState('') // ❌ no default
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setFormData((data) => ({ ...data, [name]: value }))
  }

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Order Payment',
      description: 'Order Payment',
      order_id: order.id,
      receipt: order.receipt,

      handler: async (response) => {
        try {
          const { data } = await axios.post(
            serverUrl + '/api/order/verifyrazorpay',
            response,
            { withCredentials: true }
          )

          if (data) {
            setCartItem({})
            toast.success('Order Placed')
            navigate('/order')
          }
        } catch (err) {
          toast.error('Payment verification failed')
        } finally {
          setLoading(false)
        }
      },

      modal: {
        ondismiss: () => {
          setLoading(false)
          toast.info('Payment cancelled')
        }
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  
  const onSubmitHandler = async (e) => {
    e.preventDefault()

 
    if (!method) {
      toast.error('Please select a payment method')
      return
    }

    setLoading(true)

    try {
      let orderItems = []

      for (const items in cartItem) {
        for (const item in cartItem[items]) {
          if (cartItem[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            )
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItem[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      if (method === 'cod') {
        const result = await axios.post(
          serverUrl + '/api/order/placeorder',
          orderData,
          { withCredentials: true }
        )

        if (result.data) {
          setCartItem({})
          toast.success('Order Placed')
          navigate('/order')
        } else {
          toast.error('Order failed')
        }
        setLoading(false)
      }


      if (method === 'razorpay') {
        const resultRazorpay = await axios.post(
          serverUrl + '/api/order/razorpay',
          orderData,
          { withCredentials: true }
        )

        if (resultRazorpay.data) {
          initPay(resultRazorpay.data)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col lg:flex-row gap-[30px] px-[10px]'>

    
      <form
        onSubmit={onSubmitHandler}
        className='lg:w-[50%] w-full mt-[60px] flex flex-col gap-[10px]'
      >
        <Title text1={'DELIVERY'} text2={'INFORMATION'} />

        <div className='flex gap-2'>
          <input name='firstName' value={formData.firstName} onChange={onChangeHandler}
            placeholder='First name' required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md' />
          <input name='lastName' value={formData.lastName} onChange={onChangeHandler}
            placeholder='Last name' required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md' />
        </div>

        <input name='email' value={formData.email} onChange={onChangeHandler}
          placeholder='Email address' required className='h-[50px] bg-slate-700 text-white px-4 rounded-md' />

        <input name='street' value={formData.street} onChange={onChangeHandler}
          placeholder='Street' required className='h-[50px] bg-slate-700 text-white px-4 rounded-md' />

        <div className='flex gap-2'>
          <input name='city' value={formData.city} onChange={onChangeHandler}
            placeholder='City' required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md' />
          <input name='state' value={formData.state} onChange={onChangeHandler}
            placeholder='State' required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md' />
        </div>

        <div className='flex gap-2'>
          <input name='pinCode' value={formData.pinCode} onChange={onChangeHandler}
            placeholder='Pincode' required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md' />
          <input name='country' value={formData.country} onChange={onChangeHandler}
            placeholder='Country' required className='w-1/2 h-[50px] bg-slate-700 text-white px-4 rounded-md' />
        </div>

        <input name='phone' value={formData.phone} onChange={onChangeHandler}
          placeholder='Phone' required className='h-[50px] bg-slate-700 text-white px-4 rounded-md' />

    
        <button
          type='submit'
          disabled={!method || loading}
          className={`mt-[20px] py-[12px] px-[40px] rounded-2xl text-white border self-center
            ${!method ? 'opacity-50 cursor-not-allowed' : 'bg-[#3bcee848]'}`}
        >
          {loading ? <Loading /> : 'PLACE ORDER'}
        </button>
      </form>

     
      <div className='lg:w-[50%] w-full flex flex-col items-center gap-[20px] mt-[40px]'>

        <CartTotal />
        <Title text1={'PAYMENT'} text2={'METHOD'} />

        <div className='flex gap-[20px]'>
          <button
            type='button'
            onClick={() => setMethod('razorpay')}
            className={`w-[150px] h-[50px] border
              ${method === 'razorpay' ? 'border-blue-900 border-[4px]' : ''}`}
          >
            <img src={razorpay} className='w-full h-full object-fill' />
          </button>

          <button
            type='button'
            onClick={() => setMethod('cod')}
            className={`w-[200px] h-[50px] font-bold border
              ${method === 'cod' ? 'border-blue-900 border-[4px]' : ''}`}
          >
            CASH ON DELIVERY
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
