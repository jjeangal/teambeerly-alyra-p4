import Layout from "../components/Layout/Layout";
import { useState, useContext, useCallback } from "react";

//import { NFTContext } from "../context/NFTContext.js";

export default function CreateToken() {
  const [fileUrel, setFileUrl] = useState(null);
  // const { uploadToIPFS } = useContext(NFTContext);

  const onDrop = useCallback(async (file: any[]) => {
    // const url = await uploadToIPFS(file[0]);
    //setFileUrl(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Layout>CreateToken Token Page</Layout>;
}
