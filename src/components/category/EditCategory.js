import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import useGet from "../../hooks/useGet";
import { getErrors, toastDefault } from "../../utils/handler.utils";

const EditCategory = (props) => {
  const categoryId = props.match.params.id;
  const name = useRef(null);
  const sortOrder = useRef(null);
  const history = useHistory();

  const [uniqueState] = useState(false);

  const [categoryData, loading] = useGet(
    `/v1/get-category/${categoryId}`,
    "",
    uniqueState
  );

  const handleUpdateCategory = () => {
    axiosInstance
      .put(`admin/update-category/${categoryId}`, {
        name: name.current.value,
        sortOrder: sortOrder.current.value,
      })
      .then((res) => {
        toast.success("category updated successfully", toastDefault);
        history.push("/category");
      })
      .catch((err) => {
        toast.error(getErrors(err, false, true), toastDefault);
      });
  };

  return (
    <section className="container_admin">
      <form onSubmit={handleUpdateCategory} className="">
        <div className="bg-white overflow-hidden rounded">
          <div className="px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-black">
              Edit Category {`{ ${categoryData?.name} }`}
            </h3>
          </div>
          <div className="py-10 px-4">
            <div className="w-full md:w-[70%] mx-auto py-6 relative border border-gray-200 px-4">
              <input
                ref={name}
                id="name"
                disabled={loading}
                defaultValue={categoryData?.name}
                className="form_input"
                type="text"
                placeholder="Enter Category Name"
                required
              />

              <input
                ref={sortOrder}
                id="sortOrder"
                className="form_input"
                type="number"
                defaultValue={categoryData?.sortOrder}
                placeholder="Enter sort order"
                required
              />

              <button disabled={loading} type="submit" className="cstm_btn">
                Update
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default EditCategory;
