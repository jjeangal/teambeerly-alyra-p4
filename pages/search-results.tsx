import { useContext, useState } from "react";

import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

export default function SearchResults() {
  const { marketPlaceContract, marketPlaceContractAsSigner } =
    useContext(MarketPlaceContext);

  const [listedItems, setListedItems] = useState();

  const getListedItems = async () => {
    const items = await marketPlaceContract.fetchMarketItems();
    setListedItems(items);
  };

  return <Layout>SearchResults Page</Layout>;
}
