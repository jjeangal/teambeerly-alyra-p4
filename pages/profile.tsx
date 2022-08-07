import { useStatStyles } from "@chakra-ui/react";
import { useContext, useState } from "react";

import Layout from "../components/Layout/Layout";
import { MarketPlaceContext } from "../context/MarketPlaceContext";

export default function Profile() {
  const { marketPlaceContract, marketPlaceContractAsSigner } =
    useContext(MarketPlaceContext);

  const [listedItems, setListedItems] = useState();

  const getAccountItemsOnMarketplace = async () => {
    const items = await marketPlaceContractAsSigner.fetchSales();
    setListedItems(items);
  };

  return <Layout>Profile Page</Layout>;
}
