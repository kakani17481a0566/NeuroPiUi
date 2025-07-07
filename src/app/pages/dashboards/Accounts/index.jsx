import { useState } from "react"; // Import useState

// Local Imports
import { Page } from "components/shared/Page";
import { Balance } from "./Balance";
import { ActivitiesTable } from "./ActivitiesTable";
import { Watchlist } from "./Watchlist";
import { Wallets } from "./Wallets";
import { Exchange } from "./Exchange";
import { TransactionsChart } from "./TransactionsChart";

// ----------------------------------------------------------------------

export default function Crypto1() {
  const [refreshKey, setRefreshKey] = useState(0);

  // This function will be passed to Wallets and called on successful transfer
  const handleTransferSuccess = () => {
    setRefreshKey((prev) => prev + 1); // Increment to trigger refresh
  };

  return (
    <Page title="Cryptocurrency Dashboard V1">
      <div className="transition-content mt-5 grid grid-cols-12 gap-4 px-(--margin-x) pb-8 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-8 lg:space-y-6">
          <Balance />
          <Watchlist />
          {/* Pass refreshKey as prop to ActivitiesTable to trigger data reload */}
          <ActivitiesTable refreshTrigger={refreshKey} />
        </div>
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-4 lg:space-y-6">
          {/* Pass the handler to Wallets */}
          <Wallets onTransferSuccess={handleTransferSuccess} />
          <Exchange />
          <TransactionsChart />
        </div>
      </div>
    </Page>
  );
}
