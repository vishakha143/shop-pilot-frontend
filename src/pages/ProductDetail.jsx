import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { shopDataContext } from '../context/ShopContext'
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import RelatedProduct from '../component/RelatedProduct';
import Loading from '../component/Loading';

function ProductDetail() {
  let { productId } = useParams()
  let { products, currency, addtoCart, loading } = useContext(shopDataContext)

  let [productData, setProductData] = useState(false)
  const [image, setImage] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [image4, setImage4] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage1(item.image1)
        setImage2(item.image2)
        setImage3(item.image3)
        setImage4(item.image4)
        setImage(item.image1)
      }
      return null
    })
  }

  useEffect(() => {
    fetchProductData()
  }, [productId, products])

  return productData ? (
    <div>

      <div className='w-[99vw] min-h-[130vh] md:min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col lg:flex-row gap-[20px]'>

        
        <div className='lg:w-[50vw] md:w-[90vw] min-h-[50vh] lg:min-h-[90vh] mt-[70px] flex flex-col-reverse lg:flex-row items-center justify-center gap-[20px]'>

          <div className='lg:w-[20%] md:w-[80%] lg:min-h-[80%] flex lg:flex-col flex-wrap items-center justify-center gap-[20px]'>
            {[image1, image2, image3, image4].map((img, i) => (
              <div key={i} className='md:w-[100px] w-[50px] h-[50px] md:h-[110px] border border-[#80808049] rounded-md'>
                <img src={img} alt="" className='w-full h-full cursor-pointer rounded-md'
                  onClick={() => setImage(img)} />
              </div>
            ))}
          </div>

          <div className='lg:w-[60%] w-[80%] min-h-[70%] border border-[#80808049] rounded-md overflow-hidden'>
            <img src={image} alt="" className='w-full h-full object-fill rounded-md' />
          </div>
        </div>

        
        <div className='lg:w-[50vw] w-[100vw] min-h-[40vh] lg:min-h-[75vh] mt-[20px] lg:mt-[80px] px-[30px] flex flex-col gap-[10px]'>

          <h1 className='text-[40px] font-semibold text-[aliceblue]'>
            {productData.name.toUpperCase()}
          </h1>

          <div className='flex items-center gap-1'>
            <FaStar className='fill-[#FFD700]' />
            <FaStar className='fill-[#FFD700]' />
            <FaStar className='fill-[#FFD700]' />
            <FaStar className='fill-[#FFD700]' />
            <FaStarHalfAlt className='fill-[#FFD700]' />
            <p className='text-white font-semibold'>(124)</p>
          </div>

          <p className='text-[30px] font-semibold text-white'>
            {currency} {productData.price}
          </p>

          <p className='w-[80%] md:w-[60%] text-[20px] font-semibold text-white'>
            {productData.description} and Stylish, breathable cotton shirt with a modern slim fit.
          </p>

          <div className='flex flex-col gap-[10px] my-[10px]'>
            <p className='text-[25px] font-semibold text-white'>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button key={index}
                  className={`border py-2 px-4 rounded-md 
                  ${item === size ? 'bg-black text-[#2f97f1]' : 'bg-slate-300'}`}
                  onClick={() => setSize(item)}>
                  {item}
                </button>
              ))}
            </div>

            <button
              onClick={() => addtoCart(productData._id, size)}
              className='bg-[#495b61c9] py-[10px] px-[20px] rounded-2xl border text-white shadow-md cursor-pointer'>
              {loading ? <Loading /> : "Add to Cart"}
            </button>
          </div>

          <div className='w-[90%] h-[1px] bg-slate-700'></div>

          <div className='text-white text-[16px]'>
            <p>100% Original Product.</p>
            <p>Cash on delivery is available on this product</p>
            <p>East return and exchange policy within 7 days</p>
          </div>
        </div>
      </div>

     
      <div className='w-full min-h-[70vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col gap-[20px] overflow-x-hidden'>

        <div className='flex px-[20px] mt-[40px] lg:ml-[80px] gap-2'>
          <p
            onClick={() => setActiveTab('description')}
            className={`border px-5 py-3 text-sm cursor-pointer
              ${activeTab === 'description' ? 'bg-[#ffffff1a] text-white' : 'text-gray-400'}`}>
            Description
          </p>
          <p
            onClick={() => setActiveTab('reviews')}
            className={`border px-5 py-3 text-sm cursor-pointer
              ${activeTab === 'reviews' ? 'bg-[#ffffff1a] text-white' : 'text-gray-400'}`}>
            Reviews (124)
          </p>
        </div>

      
        <div className='w-[80%] min-h-[150px] bg-[#3336397c] border text-white px-[20px] py-[20px] lg:ml-[100px] ml-[20px]'>

          {activeTab === 'description' && (
            <p className='text-[15px] lg:text-[18px]'>
              Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on OneCart.
              Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style.
            </p>
          )}

          {activeTab === 'reviews' && (
            <p className='text-[15px] lg:text-[18px]'>
              ⭐⭐⭐⭐☆ 4.5 average rating based on 124 verified customer reviews.
            </p>
          )}
        </div>

        <RelatedProduct
          category={productData.category}
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </div>
    </div>
  ) : <div className='opacity-0'></div>
}

export default ProductDetail
