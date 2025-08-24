import React from "react";
// components
import CardStats from "../../components/Cards/CardStats.js";
import useGet from '../../hooks/useGet';
import { getErrors } from "../../utils/handler.utils";

export default function HeaderStats() {
  const [stats, loading, error] = useGet('admin/dashboard-stats')
  return (
    <>
      {/* Header */}
      <div className="relative mb-4">
        <div className="mx-auto w-full">
          {
            !error ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <CardStats
                  statSubtitle="Total User"
                  statTitle={stats?.totalUser || 0}
                  statDescripiron={`Today users ${stats?.todaysUser || 0}`}
                  statIconName="fas fa-users"
                  statIconColor="bg-red-500"
                  loading={loading}
                />
                <CardStats
                  statSubtitle="Total Wallet"
                  statTitle={stats?.totalWallet || 0}
                  statDescripiron={`Today Added ${stats?.todaysTotalWallet || 0}`}
                  // statDescripiron="Since last week"
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-blue-500"
                  loading={loading}
                />
                <CardStats
                  statSubtitle="Today Orders"
                  statTitle={stats?.todaysOrder || 0}
                  statDescripiron={`Today Completed ${stats?.todaysCompletedOrder || 0}`}
                  statIconName="fas fa-sort-amount-up-alt"
                  statIconColor="bg-purple-500"
                  loading={loading}
                />
                <CardStats
                  statSubtitle="Today Sale"
                  statTitle={stats?.todaySale || 0}
                  // statDescripiron="Since yesterday"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-pink-500"
                  loading={loading}
                />
              </div>
            ) : (
              <ul className="text-center py-4" >
                {getErrors(error, false, true)}
              </ul>
            )
          }

        </div>
      </div>
    </>
  );
}
