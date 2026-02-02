import React, { useContext, useEffect, useState } from 'react'
import Title from '../component/Title'
import { shopDataContext } from '../context/ShopContext'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

function Order() {
  const [orderData, setOrderData] = useState([])
  const [trackingIndex, setTrackingIndex] = useState(null)

  const { currency } = useContext(shopDataContext)
  const { serverUrl } = useContext(authDataContext)

  const loadOrderData = async (showToast = false) => {
    try {
      const result = await axios.post(
        serverUrl + '/api/order/userorder',
        {},
        { withCredentials: true }
      )

      if (result.data) {
        let allOrdersItem = []

        result.data.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status
            item.payment = order.payment
            item.paymentMethod = order.paymentMethod
            item.date = order.date
            allOrdersItem.push(item)
          })
        })

        setOrderData(allOrdersItem.reverse())

        if (showToast) {
          toast.success('Order status refreshed')
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('Failed to refresh order')
    } finally {
      setTrackingIndex(null)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [])

  return (
    <div className='w-[99vw] min-h-[100vh] p-[20px] pb-[150px] bg-gradient-to-l from-[#141414] to-[#0c2025]'>

      <div className='text-center mt-[80px]'>
        <Title text1={'MY'} text2={'ORDER'} />
      </div>

      <div className='w-full flex flex-col gap-[20px] mt-[30px]'>

        {orderData.map((item, index) => (
          <div key={index} className='w-full border-t border-b'>

            <div className='w-full flex gap-6 bg-[#51808048] py-[15px] px-[20px] rounded-2xl relative flex-wrap'>

              <img
                src={item.image1}
                alt=''
                className='w-[130px] h-[130px] rounded-md'
              />

              <div className='flex flex-col gap-[6px]'>

                <p className='md:text-[25px] text-[20px] text-[#f3f9fc]'>
                  {item.name}
                </p>

                <div className='flex gap-[15px] flex-wrap'>
                  <p className='text-[#aaf4e7]'>
                    {currency} {item.price}
                  </p>
                  <p className='text-[#aaf4e7]'>Quantity: {item.quantity}</p>
                  <p className='text-[#aaf4e7]'>Size: {item.size}</p>
                </div>

                <p className='text-[#aaf4e7]'>
                  Date:
                  <span className='pl-[8px] text-[#e4fbff]'>
                    {new Date(item.date).toDateString()}
                  </span>
                </p>

                <p className='text-[#aaf4e7]'>
                  Payment Method: {item.paymentMethod}
                </p>
              </div>

              <div className='absolute right-[20px] top-[20px] flex items-center gap-2'>
                <span className='w-2 h-2 rounded-full bg-green-500'></span>
                <p className='text-[#f3f9fc]'>{item.status}</p>
              </div>

              <div className='absolute right-[20px] bottom-[20px]'>
                <button
                  type='button'
                  disabled={trackingIndex === index}
                  onClick={() => {
                    setTrackingIndex(index)
                    loadOrderData(true)
                  }}
                  className='px-[14px] py-[6px] rounded-md bg-[#101919] text-[#f3f9fc]
                    text-[14px] cursor-pointer active:bg-slate-600 disabled:opacity-50'
                >
                  {trackingIndex === index ? 'Refreshing...' : 'Track Order'}
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Order
