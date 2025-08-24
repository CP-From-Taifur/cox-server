import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import useGet from "../../hooks/useGet";
import { getErrors, hasData, toastDefault } from "../../utils/handler.utils";
import { packageTableColumns } from "../../utils/reactTableColumns";
import PackagesAccordion from "../PackagesAccordion";
import ReactTable from "../ReactTables/ReactTable";
import UiHandler from "../UiHandler";

function Packages() {
  const [products, loadingProducts, errorProducts] =
    useGet(`admin/topup-products`);
  const softDeleteVoucher = () => {
    if (window.confirm("Are you sure")) {
      toast.promise(
        axiosInstance.get(`admin/soft-delete-voucher`),
        {
          pending: "Deleting voucher...",
          error: {
            render(err) {
              return "Something went wrong";
            },
          },
          success: {
            render() {
              return "Voucher deleted successfully";
            },
          },
        },
        toastDefault
      );
    }
  };

  console.log("products", products);

  return (
    <section className="relative container_admin">
      <div className="bg-white overflow-hidden rounded">
        <div className="px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-bold text-black">Packages</h3>
        </div>
        <div className="md:px-6 my-10 md:max-w-[1000px] min-h-[200px] md:mx-auto">
          <div className="rounded relative overflow-hidden">
            <div className="m-3">
              <button
                className="cstm_btn_small text-xs"
                onClick={() => softDeleteVoucher()}
              >
                Soft Delete All Used Voucher
              </button>
            </div>
            <div>
              <UiHandler
                data={products}
                loading={loadingProducts}
                error={errorProducts}
              />
              {hasData(products, loadingProducts) && (
                <>
                  {products?.map((product, i) => (
                    <PackagesAccordion title={product?.name} key={i}>
                      <PackagesUnderProduct product={product} />
                    </PackagesAccordion>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Packages;

const PackagesUnderProduct = ({ product }) => {
  const [uniqueState, setUniqueState] = useState(false);
  const [packages, loading, error] = useGet(
    `admin/topup-packages/${product.id}`,
    "",
    uniqueState
  );
  const [togglingStatus, setTogglingStatus] = useState({});
console.log("packages", packages);
  const update_dollar_ref = useRef(null);

  const updateDollarHandler = (e) => {
    e.preventDefault();

    const dollar_rate = update_dollar_ref.current?.value?.trim();

    if (!dollar_rate) return;

    toast.promise(
      axiosInstance.post(`/admin/topup-package/update-dollar`, {
        product_id: product.id,
        dollar_rate,
      }),
      {
        pending: "Updating dollar rate...",
        error: {
          render(err) {
            console.log(err);
            return getErrors(err.data, false, true);
          },
        },
        success: {
          render() {
            setUniqueState((prev) => !prev);
            return "Dollar rate updated successfully";
          },
        },
      },
      toastDefault
    );

    update_dollar_ref.current.value = "";
  };

  const deletePackageHandler = (id) => {
    if (window.confirm("Are you sure")) {
      toast.promise(
        axiosInstance.post(`/admin/topup-package/delete/${id}`),
        {
          pending: "Deleting package...",
          error: {
            render(err) {
              console.log(err);
              return getErrors(err.data, false, true);
            },
          },
          success: {
            render() {
              setUniqueState((prev) => !prev);
              return "Package deleted successfully";
            },
          },
        },
        toastDefault
      );
    }
  };

  const togglePackageStock = (id, currentStockStatus) => {
    if (!id) {
      toast.error("Invalid package ID", toastDefault);
      return;
    }

    // Prevent multiple clicks
    if (togglingStatus[id]) {
      return;
    }

    const newStockStatus = currentStockStatus === 1 ? 0 : 1;
    const stockText = newStockStatus === 1 ? 'in stock' : 'out of stock';
    
    // Find the current package data to send all required fields
    const currentPackage = packages?.find(pkg => pkg.id === id);
    if (!currentPackage) {
      toast.error("Package data not found", toastDefault);
      return;
    }
    
    // Set loading state
    setTogglingStatus(prev => ({ ...prev, [id]: true }));
    
    // Prepare update data with all required fields
    const updateData = {
      product_id: currentPackage.product_id,
      name: currentPackage.name,
      price: currentPackage.price,
      buy_price: currentPackage.buy_price,
      admin_com: currentPackage.admin_com || 0,
      tag: currentPackage.tag || '',
      type: currentPackage.type || '',
      sort_order: currentPackage.sort_order || 0,
      is_auto: currentPackage.is_auto || 0,
      in_stock: newStockStatus,
      botUrl: currentPackage.botUrl || '',
      code: currentPackage.code || ''
    };
    
    toast.promise(
      axiosInstance.post(`/admin/topup-package/update/${id}`, updateData),
      {
        pending: `Setting package ${stockText}...`,
        error: {
          render(err) {
            console.log(err);
            setTogglingStatus(prev => ({ ...prev, [id]: false }));
            return getErrors(err.data, false, true) || "Failed to update package stock status";
          },
        },
        success: {
          render() {
            setTogglingStatus(prev => ({ ...prev, [id]: false }));
            setUniqueState((prev) => !prev);
            return `Package is now ${stockText}`;
          },
        },
      },
      toastDefault
    );
  };

  const withActionButton = [
    ...packageTableColumns,
    {
      id: "edit",
      Header: "Action",
      accessor: "id",
      Cell: (e) => {
        const packageData = packages?.find(pkg => pkg.id === e.value);
        const isInStock = packageData?.in_stock === 1;
        
        return (
          <ul className="flex space-x-2">
            {product.topup_type === "voucher" && (
              <Link
                to={`/topup-package/voucher/${e.value}`}
                className="cstm_btn_small"
              >
                Voucher
              </Link>
            )}
            <Link
              to={`/topup-package/edit/${e.value}`}
              className="cstm_btn_small"
            >
              Edit
            </Link>
            <li
              className={`cstm_btn_small cursor-pointer ${
                togglingStatus[e.value] 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : packageData?.in_stock === 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
              }`}
              onClick={() => togglePackageStock(e.value, packageData?.in_stock)}
              title={`Click to ${packageData?.in_stock === 1 ? 'set out of stock' : 'set in stock'}`}
              style={{ pointerEvents: togglingStatus[e.value] ? 'none' : 'auto' }}
            >
              {togglingStatus[e.value] ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {packageData?.in_stock === 1 ? 'Setting out of stock...' : 'Setting in stock...'}
                </span>
              ) : (
                <span>{packageData?.in_stock === 1 ? 'In Stock' : 'Stock Out'}</span>
              )}
            </li>
            <li
              className="cstm_btn_small btn_red"
              onClick={() => deletePackageHandler(e.value)}
            >
              Delete
            </li>
          </ul>
        );
      },
    },
  ];

  return (
    <>
      <UiHandler data={packages} loading={loading} error={error} />
      <div className="flex flex-wrap items-center gap-4">
        {hasData(packages) && (
          <div>
            <form
              className="flex items-center space-x-2"
              onSubmit={updateDollarHandler}
            >
              <input
                type="text"
                className="form_input mb-0 text-xs w-[150px]"
                ref={update_dollar_ref}
                placeholder="Update rate"
              />
              <button type="submit" className="cstm_btn_small text-xs">
                Update rate
              </button>
            </form>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={`/topup-package/add/${product.id}`}
            className="cstm_btn_small text-xs"
          >
            Add new package
          </Link>

          {product.topup_type === "voucher" && (
            <Link to={`/add-vouchers/${product.id}`} className="cstm_btn_small text-xs">
              Add vouchers
            </Link>
          )}
        </div>
      </div>
      {hasData(packages) && (
        <div className="mt-4">
          <ReactTable
            tableId={`package_${product.id}_table`}
            data={packages}
            columns={withActionButton}
          />
        </div>
      )}
    </>
  );
};