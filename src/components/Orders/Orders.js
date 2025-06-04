import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axiosInstance from "../../common/axios";
import { getErrors, hasData, toastDefault } from "../../utils/handler.utils";
import { ordersTableColumns } from "../../utils/reactTableColumns";
import Table from "../react-table/Table";
import SearchOrder from "./SearchOrder";

function Orders() {
  const [totalDataCount, setTotalDataCount] = useState(null);
  const reloadRefFunc = useRef(null);
  const [dynamicMessage, setDynamicMessage] = useState("");
  const [selectedRows, setSelectedRows] = useState({
    rowsId: {},
    selectedFlatRows: [],
  });

  useEffect(() => {
    axiosInstance
      .get("/admin/topup-order-message")
      .then((res) => {
        let message = '<option value="">Select One</option>';
        res.data?.data.forEach((element) => {
          message += `<option value="${element.message}">${element.message}</option>`;
        });

        setDynamicMessage(message);
      })
      .catch((err) => {
        toast.error(getErrors(err, false, true), toastDefault);
      });
  });

  const handleMysterySelect = async (orderId, mysteryId) => {
    try {
      await toast.promise(
        axiosInstance.post("/admin/mystery-action", {
          order_id: orderId,
          mystery_id: mysteryId
        }),
        {
          pending: "Applying mystery package...",
          success: {
            render() {
              reloadRefFunc.current(); // Reload the table
              return "Mystery package applied successfully";
            },
          },
          error: {
            render(err) {
              return getErrors(err.data, false, true);
            },
          },
        },
        toastDefault
      );
    } catch (error) {
      console.error("Mystery select error:", error);
    }
  };

  const handleRetryOrder = async (orderId) => {
    try {
      await toast.promise(
        axiosInstance.post("/admin/retry-bot-request", {
          order_id: orderId,
        }),
        {
          pending: "Retrying order...",
          success: {
            render() {
              reloadRefFunc.current(); // Reload the table
              return "Order retry initiated successfully";
            },
          },
          error: {
            render(err) {
              return getErrors(err.data, false, true);
            },
          },
        },
        toastDefault
      );
    } catch (error) {
      console.error("Retry order error:", error);
    }
  };

  const handleUnusedVoucherLoad = async (order_id, voucher) => {
    const voucherData = voucher?.data?.trim();
    const package_id = voucher?.package_id;

    try {
      await toast.promise(
        axiosInstance.post("/admin/packages/unused-voucher-load", {
          order_id: order_id,
          package_id: package_id,
          data: voucherData,
        }),
        {
          pending: "loaded voucher...",
          success: {
            render() {
              reloadRefFunc.current(); // Reload the table
              return "voucher loaded successfully";
            },
          },
          error: {
            render(err) {
              return getErrors(err.data, false, true);
            },
          },
        },
        toastDefault
      );
    } catch (error) {
      console.error("load voucher error:", error);
    }
  };

  const columnsWithCopy = ordersTableColumns.map((column) => {
    if (column.accessor === "playerid") {
      return {
        ...column,
        Cell: ({ value }) => (
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => handleCopy(value)}
          >
            {value}
          </span>
        ),
      };
    }

    if (column.accessor === "server_url") {
      return {
        ...column,
        Cell: ({ value }) => (
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => handleCopy(value)}
          >
            {value}
          </span>
        ),
      };
    }

    if (column.accessor === "Voucher.data") {
      return {
        ...column,
        Cell: ({ value }) => (
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => handleCopy(value, true)}
          >
            {value || "---"}
          </span>
        ),
      };
    }

    return column;
  });

  const selectData = (res) => {
    // Add onMysterySelect to each order
    console.log(res.data.data.orders);
    const ordersWithHandler = res.data.data.orders.map(order => ({
      ...order,
      onMysterySelect: handleMysterySelect // Add the handler to each order
    }));

    setTotalDataCount(res.data.data.order_count);
    return {
      data: ordersWithHandler,
      total: res.data.data.order_count,
    };
  };

  const handleCopy = (text, isVoucher = false) => {
    let textToCopy = text.toString();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Copied to clipboard!", toastDefault);
      })
      .catch(() => {
        toast.error("Failed to copy!", toastDefault);
      });
  };

  const shouldShowRetryButton = (
    status,
    securityCode,
    isAutoPackage,
    isVoucher
  ) => {
    const isInProgress = status === "in_progress";
    const isAutoPkg = isAutoPackage === "1";
    const isPendingNonVoucher = isVoucher === "0" && status === "pending";

    return (isInProgress || isPendingNonVoucher) && isAutoPkg;
  };

  let actionMenu = {
    id: "edit",
    Header: "Action",
    accessor: "id",
    Cell: (e) => {
      const status = e.row.original.status;
      const securitycode = e.row.original.securitycode;
      const is_auto_package = e.row.original.is_auto_package;
      const isVoucher = e.row.original.isVoucher;
      const voucher = e.row.original.Voucher || null;
      // Show nothing for other cases
      if (
        !(
          status === "pending" ||
          status === "in_progress" ||
          ((status === "in_progress" || status === "cancel") &&
            is_auto_package === "1")
        )
      ) {
        return "---";
      }

      return (
        <ul className="flex space-x-2">
          {/* Edit and Retry buttons for pending or in_progress */}
          {(status === "pending" || status === "in_progress") && (
            <>
              <li
                className="cstm_btn_small"
                onClick={() => openChangeStatusModal(e.value)}
              >
                Edit
              </li>
              {shouldShowRetryButton(
                status,
                securitycode,
                is_auto_package,
                isVoucher
              ) && (
                <li
                  className="cstm_btn_small bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => handleRetryOrder(e.value)}
                >
                  Retry
                </li>
              )}
            </>
          )}

          {/* Voucher button for in_progress/cancel with auto_package */}
          {(status === "in_progress" || status === "cancel") &&
            is_auto_package === "1" &&
            voucher && (
              <li>
                <button
                  disabled={e.row.original.is_voucher_loaded === "1"}
                  className="cstm_btn_small bg-green-500 hover:bg-green-600"
                  onClick={() => handleUnusedVoucherLoad(e.value, voucher)}
                >
                  {e.row.original.is_voucher_loaded === "1" ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-undo"></i>
                  )}
                </button>
              </li>
            )}
        </ul>
      );
    },
  };

  let withActionMenu = [...columnsWithCopy, actionMenu];

  const openChangeStatusModal = async (order_id) => {
    const { value: formValues } = await Swal.fire({
      title: "Change order status",
      html:
        `<select id="order-status-value" class="form_input w-full mb-4">
                    <option value="">Select order status</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending" selected>Pending</option>
                    <option value="cancel">Cancel</option>
                </select>` +
        `
            <label class="block text-left">
            <span class="form_label">Brief Note</span>
            <select
                class="mt-1 block w-full form_input"
                rows="3"
                id="order-note"
                placeholder="Enter some long form content."
            >${dynamicMessage}</select>
            </label>`,
      focusConfirm: false,
      preConfirm: () => {
        let orderStatus = document.getElementById("order-status-value").value;
        let orderNote = document.getElementById("order-note").value;

        if (!orderStatus) {
          toast.error("Select an order status", toastDefault);
          return false;
        }

        return { orderStatus, orderNote };
      },
    });

    if (formValues) {
      toast.promise(
        axiosInstance.post(`/admin/order/update-order-status/${order_id}`, {
          status: formValues.orderStatus,
          order_note: formValues.orderNote,
        }),
        {
          pending: "Updating order...",
          error: {
            render(err) {
              console.log(err);
              return getErrors(err.data, false, true);
            },
          },
          success: {
            render() {
              reloadRefFunc.current();
              return "Order updated successfully";
            },
          },
        },
        toastDefault
      );
    }
  };

  const completeAllHandler = () => {
    toast.promise(
      axiosInstance.post("admin/order/complete-selected-all", {
        ordersId: selectedRows.selectedFlatRows.map((e) => e.original.id),
      }),
      {
        pending: "Completing all selected order...",
        error: {
          render(err) {
            console.log(err);
            return getErrors(err.data, false, true);
          },
        },
        success: {
          render(res) {
            setSelectedRows({
              rowsId: {},
              selectedFlatRows: [],
            });
            reloadRefFunc.current();
            return `Total completed ${res?.data?.data?.data} orders.`;
          },
        },
      },
      toastDefault
    );
  };

  return (
    <div className="md:px-5">
      <div className="bg-white py-5 mb-5 px-5">
        <Table
          customGlobalSearch={({ addSearchParam, removeSearchParam }) => (
            <div className="flex gap-2">
              {hasData(selectedRows?.selectedFlatRows) && (
                <div>
                  <button
                    onClick={completeAllHandler}
                    className="cstm_btn_small self-center"
                  >
                    Complete All
                  </button>
                </div>
              )}
              <SearchOrder
                addSearchParam={addSearchParam}
                removeSearchParam={removeSearchParam}
              />
            </div>
          )}
          reloadRefFunc={reloadRefFunc}
          tableTitle="Product Orders"
          tableSubTitle={
            hasData(totalDataCount) && `Total result: ${totalDataCount}`
          }
          globalSearchPlaceholder="Product id or user id"
          tableId="order_table"
          url="/admin/orders"
          selectData={selectData}
          queryString="order_id"
          disableGlobalSearch
          selectError={(err) => getErrors(err, true)[0]}
          columns={withActionMenu}
          isSelectableRow
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </div>
    </div>
  );
}

export default Orders;
