import React from "react";
import CardBarChart from "../../components/Cards/CardBarChart.js";
// components
import CardLineChart from "../../components/Cards/CardLineChart.js";
import HeaderStats from "../../components/Headers/HeaderStats.js";
import VouchersPrice from "../../components/VouchersPrice.js";


export default function Dashboard() {

  return (
    <>
      <div className="container_admin">
        <HeaderStats />
        <VouchersPrice />
        <div className="grid mb-4 grid-cols-1 md:grid-cols-2 gap-3">
          <CardLineChart />
          <CardBarChart />
          
        </div>
      </div>
    </>
  );
}
