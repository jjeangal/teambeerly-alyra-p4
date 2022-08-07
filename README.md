# OpenBatch

OpenBatch is a clone of OpenSea marketplace where you can create, and sell your NFTs collections.

👉 Production site is actually on **Rinkeby** network.

## What is different from OpenSea ?

You can create a collection with a bunch of images (image folder) instead of create one by one.

## Features

-   Explore NFTs collections
-   Create your collections, or a single item with direct listing
-   Buy any NFT listed on the plateform
-   Allow connection with multiple wallets like MetaMask, CoinBase, and WalletConnect

## Getting started

### Use the marketplace on server
Link: https://teambeerly-alyra-p4.vercel.app/

### After cloning this repository, install dependencies (NODE version >= 16.5.x recommended) :

```sh
$ npm i
```

You have to create a `.env.local` file like the [./.env.sample](./.env.sample) as example. You'll need a Infura account and a Rinkeby wallet address.

Then you can run these scripts :

```shell
npm run start:h => Run hardhat node
npm run deploy:local or npm run deploy:rinkeby => Deploy contracts on local blockchain or in the Rinkeby network
npm run dev => Run Nextjs serveur (watch mode)
```

Select the right network (local RPC or Rinkeby) in your wallet settings, and you can load the local site. (Be sure to have funds in order to make transactions with the plateform)
