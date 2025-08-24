import React, { useRef, useState } from "react";
import ReactApexChart from 'react-apexcharts';
import useGet from "../../hooks/useGet";
import { hasData } from "../../utils/handler.utils";
import UiHandler from "../UiHandler";


export default function CardLineChart() {
  const [days, setDays] = useState(30)
  const daysInputRef = useRef(null)

  const [data, loading, error] = useGet(`/admin/this-month-sale-chart-data?days=${days}`);


  const CHART_DATA = [
    {
      name: 'Total sale',
      type: 'line',
      data: data?.data || []
    },
  ];

  const chartOptions = {
    stroke: { width: 2, curve: 'smooth', },
    labels: data?.dates || [],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          return `৳ ${y || 0}`
        }
      }
    }
  };

  const setDaysHandler = (e) => {
    e.preventDefault()
    const value = daysInputRef.current?.value
    if (!value || isNaN(value)) return
    setDays(value)
  }


  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent bg-blue-500">
          <div className="flex flex-wrap items-center justify-between">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Total sale
              </h6>
              <h2 className="text-white text-xl font-semibold">Sale chart</h2>
            </div>
            <div className="flex items-center text-white gap-1">
              <span>Last</span>
              <form onSubmit={setDaysHandler} >
                <input defaultValue={days} ref={daysInputRef} type="text" className="border-none outline-none w-[50px] text-center px-1 text-gray-600" />
              </form>
              <span>days</span>
            </div>
          </div>
        </div>
        <div className="flex-auto">
          <div className="relative min-h-[300px]">
            <UiHandler absoluteLoader={true} loading={loading} error={error} data={data} />
            {
              hasData(data, loading) && (
                <ReactApexChart className="mt-3" type="line" series={CHART_DATA} options={chartOptions} height={364} />
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}
