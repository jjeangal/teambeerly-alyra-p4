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

### Use the marketplace on server: https://teambeerly-alyra-p4.vercel.app/

#### How to use it: https://www.loom.com/share/61581f1f5044491d9bbf7e9235030a69


#### Address of the contracts on Rinkeby:
- Contract NFT: 0x13F8c49aA03DCeF7D83775505bbe857916Ba7169
- Contract Marketplace: 0x76E16ABC630d8a95633377CD23fcF6e6eB76452a
- Contract Factory:  0xF1e483F3217163e59831C2f9a142f062DE02163F

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
