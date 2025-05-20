import React from "react";
import useGet from "../../hooks/useGet";
import { hasData } from "../../utils/handler.utils";
import { completedOrderByAdminsTableColumns } from "../../utils/reactTableColumns";
import ReactTable from '../ReactTables/ReactTable';
import UiHandler from "../UiHandler";

export default function CardSocialTraffic() {
  const [data, loading, error] = useGet('/admin/order-completed-by-admin')
  const [thisMonth] = useGet('/admin/this-month-completed-order')
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap md:flex-nowrap justify-between w-full items-center">
            <div className="relative px-4 flex-shrink-0">
              <h3 className="font-semibold text-base text-blueGray-700">
                Admin Performance
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex flex-grow justify-end text-right">
              This month completed orders: <span className="font-bold text-blue-500" >{thisMonth?.data || 0}</span>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <UiHandler absoluteLoader={true} data={data} loading={loading} error={error} />
          {hasData(data, loading, error) && <ReactTable tableId="completed_order_by_admin" data={data} columns={completedOrderByAdminsTableColumns} />}

        </div>
      </div>
    </>
  );
}
