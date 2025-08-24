import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../common/axios";
import useGet from "../../hooks/useGet";
import { getErrors, hasData, toastDefault } from "../../utils/handler.utils";
import { categoryTableColumns } from "../../utils/reactTableColumns";
import ReactTable from "../ReactTables/ReactTable";
import UiHandler from "../UiHandler";

const Category = () => {
  const [uniqueState, setUniqueState] = useState(false);
 


  const [categoryData, loading, error] = useGet(
    `/v1/get-categorys`,
    "",
    uniqueState
  );

  const deleteCategoryHangdler = (id) => {
    if (window.confirm("Are you sure")) {
      toast.promise(
        axiosInstance.delete(`admin/delete-category/${id}`),
        {
          pending: "Deleting Category...",
          error: {
            render(err) {
              console.log(err);
              return getErrors(err.data, false, true);
            },
          },
          success: {
            render() {
              setUniqueState((prev) => !prev);
              return "Category deleted successfully";
            },
          },
        },
        toastDefault
      );
    }
  };

 

 
  let editButton = {
    id: "action",
    Header: "Action",
    accessor: "id",
    Cell: (e) => {
      return (
        <ul className="flex space-x-2">
          <Link to={`/category/edit/${e.value}`} className="cstm_btn_small">
            Edit
          </Link>
          <button
            className="cstm_btn_small !bg-red-600 hover:!bg-red-700"
            type="button"
            onClick={() => deleteCategoryHangdler(e.value)}
          >
            Delete
          </button>
        </ul>
      );
    },
  };

  let withEditButton = [...categoryTableColumns, editButton];

  return (
    <section className="relative container_admin">
      <div className="bg-white overflow-hidden rounded">
        <div className="md:px-6 px-3 py-3 border-b border-gray-200 w-full flex items-center justify-between flex-wrap space-y-4">
          <h3 className="text-lg font-bold text-black">Category</h3>
       
          <Link to={"/add-category"} className="cstm_btn">
              Add new
          </Link>
        </div>
        <div>
          <div className="relative min-h-[100px]">
            <UiHandler data={categoryData} loading={loading} error={error} />
            {hasData(categoryData, error) && (
              <ReactTable
                tableId="category_methods_table"
                columns={withEditButton}
                data={categoryData}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;
