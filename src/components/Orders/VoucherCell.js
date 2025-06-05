import { useState } from "react";
import { toast } from "react-toastify";
import { toastDefault } from "../../utils/handler.utils";

const VoucherCell = ({ voucherData, childVouchers, handleCopy }) => {
  const [showAll, setShowAll] = useState(false);
  
  const copyToClipboard = async (text) => {
    try {
      console.log(text)
      await navigator.clipboard.writeText(text);
      handleCopy && handleCopy(text, true); // Call handleCopy if provided
      toast.success('Voucher copied to clipboard!', {toastDefault})
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // If there are child vouchers, show them
  if (childVouchers && childVouchers.length > 0) {
    if (!showAll) {
      // Show only first voucher with "See More" button
      return (
        <div className="flex flex-col space-y-2">
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => copyToClipboard(childVouchers[0].data)}
            title="Click to copy"
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
          {childVouchers.map((voucher) => (
            <span
              key={voucher.id}
              className="cursor-pointer hover:text-blue-600"
              onClick={() => copyToClipboard(voucher.data)}
              title="Click to copy"
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
        onClick={() => copyToClipboard(voucherData)}
        title="Click to copy"
      >
        {voucherData}
      </span>
    );
  }

  // If no vouchers at all
  return "---";
};

export default VoucherCell;