import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import { getErrors, toastDefault } from "../../utils/handler.utils";

const AddCategory = () => {

  const name = useRef(null);
  const sortOrder = useRef(null);
  const history = useHistory();



  const handleAddCategory = (e) => {
    e.preventDefault();
    toast.promise(
      axiosInstance.post(`admin/create-category`, {
        name: name.current.value,
        sortOrder: sortOrder.current.value
      }),
      {
        pending: "creating Category...",
        error: {
          render(err) {
            console.log(err);
            return getErrors(err.data, false, true);
          },
        },
        success: {
          render() {
            history.push("/category")
            return "Category created successfully";
          },
        },
      },
      toastDefault
    );
  };

  return (
    <section className="container_admin">
      <form onSubmit={handleAddCategory} className="">
        <div className="bg-white overflow-hidden rounded">
          <div className="px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-black">
              Create Category
            </h3>
          </div>
          <div className="py-10 px-4">
            <div className="w-full md:w-[70%] mx-auto py-6 relative border border-gray-200 px-4">
              <input
                ref={name}
                id="name"
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
                placeholder="Enter sort order"
                required
              />

              <button type="submit" className="cstm_btn">
                Add Category
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddCategory;
