import React, { useState } from "react";
import useGet from "../hooks/useGet";
import { getErrors } from "../utils/handler.utils";
import VoucherPriceCard from "./VoucherPriceCard";

const VouchersPrice = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [data, loading, error] = useGet(`admin/packages/calculate-prices?type=${selectedType}`);
const {title, price, voucherCount} = data || {};

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold">Vouchers Price</h1>
      
      <div className="my-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value="all">ALL</option>
          <option value="25D">25D</option>
          <option value="50D">50D</option>
          <option value="115D">115D</option>
          <option value="240D">240D</option>
          <option value="610D">610D</option>
          <option value="1240D">1240D</option>
          <option value="2530D">2530D</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Level_Up_Pass">Level Up Pass</option>
        </select>
      </div>

      {!error ? (
        <div className="w-full">
          <VoucherPriceCard title={title} price={price} voucherCount={voucherCount} loading={loading} />
        </div>
      ) : (
        <div className="text-center text-red-500 py-4">
          {getErrors(error, false, true)}
        </div>
      )}
    </div>
  );
};

export default VouchersPrice;