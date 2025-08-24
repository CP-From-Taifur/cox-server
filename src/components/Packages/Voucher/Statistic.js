import React from "react";
import useGet from "../../../hooks/useGet";
import { hasData } from "../../../utils/handler.utils";
import { voucherStatTableColumns } from "../../../utils/reactTableColumns";
import ReactTable from '../../ReactTables/ReactTable';
import UiHandler from "../../UiHandler";

export default function VoucherStatistic() {
  const [data, loading, error] = useGet('admin/voucher/available-voucher-by-package')
  return (
    <>
        <section className="relative container_admin" >
                <div className="bg-white overflow-hidden rounded">
                    <div className="px-6 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-black">
                            Packages
                        </h3>
                    </div>
                    <div className="md:px-6 my-10 md:max-w-[1000px] min-h-[200px] md:mx-auto" >
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full shadow-lg rounded">
                        <div className="rounded-t mb-0 px-4 py-3 border-0">
                            <div className="flex flex-wrap md:flex-nowrap justify-between w-full items-center">
                                <div className="relative px-4 flex-shrink-0">
                                    <h3 className="font-semibold text-base text-blueGray-700">
                                        Voucher Statistic
                                    </h3>
                                </div>
                    
                            </div>
                        </div>
                        <div className="block w-full overflow-x-auto">
                        <UiHandler absoluteLoader={true} data={data} loading={loading} error={error} />
                        {hasData(data, loading, error) && <ReactTable tableId="completed_order_by_admin" data={data} columns={voucherStatTableColumns} />}

                        </div>
                    </div>
                    </div>
                </div>
        </section>
    </>
  );
}
