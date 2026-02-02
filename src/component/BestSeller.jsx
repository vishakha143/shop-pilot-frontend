import React, { useContext, useEffect, useState } from "react";
import Title from "./Title";
import eComm from "../assets/eComm.jpg";
import { shopDataContext } from "../context/ShopContext";
import Card from "./Card";

function BestSeller() {
  let { products } = useContext(shopDataContext);
  let [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    let filterProduct = products.filter((item) => item.bestseller);

    setBestSeller(filterProduct.slice(0, 4));
  }, [products]);
  return (
    <div>
      <div className="h-[8%] w-[100%] text-center mt-[50px] ">
        <Title text1={"BEST"} text2={"SELLER"} />
        <p className="w-[100%] m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100">
          Tried, Tested, Loved – Discover Our All-Time Best Sellers.
        </p>
      </div>
      <div className="w-[100%] h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px]">
        {bestSeller && bestSeller.length > 0 ? (
          bestSeller.map((item, index) => (
            <Card
              key={item._id || index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image1}
            />
          ))
        ) : (
          <div className="flex gap-4">
            <img
              src={eComm}
              alt="Popular product"
              className="w-[600px] rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BestSeller;
