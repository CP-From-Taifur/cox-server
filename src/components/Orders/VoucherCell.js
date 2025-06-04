import { useState } from "react";

const VoucherCell = ({ voucherData, childVouchers, handleCopy }) => {
  const [showAll, setShowAll] = useState(false);

  // If there are child vouchers, show them
  if (childVouchers && childVouchers.length > 0) {
    if (!showAll) {
      // Show only first voucher with "See More" button
      return (
        <div className="flex flex-col space-y-2">
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => handleCopy(childVouchers[0].data, true)}
          >
            {childVouchers[0].data}
          </span>
          {childVouchers.length > 1 && (
            <button
              className="text-xs text-blue-500 hover:text-blue-700"
              onClick={() => setShowAll(true)}
            >
              See More ({childVouchers.length - 1} more)
            </button>
          )}
        </div>
      );
    } else {
      // Show all vouchers
      return (
        <div className="flex flex-col space-y-2">
          {childVouchers.map((voucher, index) => (
            <span
              key={voucher.id}
              className="cursor-pointer hover:text-blue-600"
              onClick={() => handleCopy(voucher.data, true)}
            >
              {voucher.data}
            </span>
          ))}
          <button
            className="text-xs text-blue-500 hover:text-blue-700"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </button>
        </div>
      );
    }
  }

  // If no child vouchers but has single voucher
  if (voucherData) {
    return (
      <span
        className="cursor-pointer hover:text-blue-600"
        onClick={() => handleCopy(voucherData, true)}
      >
        {voucherData}
      </span>
    );
  }

  // If no vouchers at all
  return "---";
};

export default VoucherCell;