import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../common/axios";
import { getErrors, toastDefault } from "../../../utils/handler.utils";

const AddUpVouchers = (props) => {
  const [uniqueState, setUniqueState] = useState(false);
  const [loadingPage, setLoadingPage] = useState(null);
  const [voucherCount, setVoucherCount] = useState(0);
  const productId = props.match.params.id;
  console.log(productId);
  const dataRef = useRef(null);

  const addVoucherHandler = (e) => {
    e.preventDefault();
    setLoadingPage(true);
    console.log(dataRef.current.value.split("\n"));
    axiosInstance
      .post(`/admin/packages/add-upvoucher`, {
        data: dataRef.current.value.split("\n"),
        product_id: productId,
      })
      .then((res) => {
        toast.success("Voucher created successfully", toastDefault);
        dataRef.current.value = "";
        setLoadingPage(false);
        setUniqueState(!uniqueState);
      })
      .catch((err) => {
        toast.error(getErrors(err, false, true), toastDefault);
        setLoadingPage(false);
      });
  };

  const handleLoadFromEmail = () => {
    setLoadingPage(true);
    console.log(dataRef.current.value.split("\n"));
    axiosInstance
      .post(`/admin/packages/process-email-vouchers`, {
        email_subject: "UniPin Voucher BDT",
        product_id: productId,
      })
      .then((res) => {
        toast.success("Voucher Load successfully", toastDefault);
        dataRef.current.value = "";
        setLoadingPage(false);
        setUniqueState(!uniqueState);
      })
      .catch((err) => {
        toast.error(getErrors(err, false, true), toastDefault);
        setLoadingPage(false);
      });
  }

  const onDataChange = () => {
    if (dataRef.current.value === "") {
      setVoucherCount(0);
      return;
    }
    setVoucherCount(dataRef.current.value.split("\n").length);
  };

  return (
    <section className="relative container_admin">
      <div className="bg-white overflow-hidden rounded">
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between flex-wrap">
          <h3 className="text-lg font-bold text-black">UP Voucher</h3>
          <button disabled={loadingPage} onClick={handleLoadFromEmail} className="cstm_btn">
             Load from email
          </button>
        </div>

        <div className="p-3">
          <form onSubmit={addVoucherHandler}>
            <div>
              <div className="form_grid">
                <div>
                  <label htmlFor="voucher_data">
                    Voucher Data (Detect {voucherCount}){" "}
                  </label>
                  <textarea
                    onChange={onDataChange}
                    ref={dataRef}
                    id="voucher_data"
                    className="form_input"
                    placeholder="Voucher Data"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  disabled={loadingPage}
                  type="submit"
                  className="cstm_btn w-full block"
                >
                  Add Voucher
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Other content of your component */}
      </div>
    </section>
  );
};
export default AddUpVouchers;
