import React from "react";

const VoucherPriceCard = ({ title, price, voucherCount, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Total Available Value
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="fas fa-money-bill-wave text-purple-600 text-xl"></i>
            </div>
          </div>

          <div className="">
            <div className="my-5">
              <div className="text-3xl font-bold text-purple-600">
                ৳{price?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Total Price</div>
            </div>

            <div className="border-t">
              <div className="flex justify-between items-center mt-2">
                <div className="text-gray-600">
                  <i className="fas fa-ticket-alt mr-2"></i>
                  Available Vouchers
                </div>
                <div className="text-lg font-semibold text-purple-600">
                  {voucherCount}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoucherPriceCard;
