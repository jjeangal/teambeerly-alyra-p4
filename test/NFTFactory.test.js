const { expect } = require("chai");
const { ethers } = require("hardhat");

// Variables
let deployer, addr1, addr2, factory, collection;
let URI = "Test URI";
let name = "Name";
let symbol = "Symbol";
let imageCid = "Image Cid";
let fee = 10;

// Tests
describe("Correct Creation of ERC721 Collection", function () {
  before(async () => {
    // Get accounts
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();

    const tx = await factory
      .connect(addr1)
      .createCollection(name, symbol, imageCid, fee);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("Verify minting fee", async () => {
    const facFee = await factory
      .connect(addr1)
      .getCollectionMintFee(collection);

    expect(facFee.toNumber()).to.equal(fee);
  });

  it("Verify Token Name", async () => {
    const nameRes = await factory.connect(addr1).getCollectionName(collection);
    expect(nameRes).to.equal(name);
  });

  it("Verify Token Symbol", async () => {
    const symbolRes = await factory
      .connect(addr1)
      .getCollectionSymbol(collection);
    expect(symbolRes).to.equal(symbol);
  });

  it("Verify Token ImageCid", async () => {
    const imageCidRes = await factory
      .connect(addr1)
      .getCollectionImage(collection);
    expect(imageCidRes).to.equal(imageCid);
  });
});

describe("Test the creation of a ERC721 Collection with wrong values", function () {
  before(async () => {
    // Get accounts
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();

    const tx = await factory
      .connect(addr1)
      .createCollection("Wname", "Wsymbol", "WCid", 0);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("Verify minting fee", async () => {
    const facFee = await factory
      .connect(addr1)
      .getCollectionMintFee(collection);

    expect(facFee.toNumber()).to.not.equal(fee);
  });

  it("Verify Token Name", async () => {
    const nameRes = await factory.connect(addr1).getCollectionName(collection);
    expect(nameRes).to.not.equal(name);
  });

  it("Verify Token Symbol", async () => {
    const symbolRes = await factory
      .connect(addr1)
      .getCollectionSymbol(collection);
    expect(symbolRes).to.not.equal(symbol);
  });

  it("Verify Token ImageCid", async () => {
    const imageCidRes = await factory
      .connect(addr1)
      .getCollectionImage(collection);
    expect(imageCidRes).to.not.equal(imageCid);
  });
});
