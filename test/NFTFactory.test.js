const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { checkProperties } = require("ethers/lib/utils");

// Variables
let deployer, addr1, addr2, factory;
let URI = "Test URI";
let name = "Name";
let symbol = "Symbol";
let fee = 10;

// Tests
describe("Correct Creation of ERC721 Collection", function () {
  beforeEach(async () => {
    // Get accounts
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();
  });

  it("Verify minting fee", async () => {
    const tx = await factory.connect(addr1).createCollection(name, symbol, fee);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    const collectionAddress = event.args._collectionAddress;

    const facFee = await factory
      .connect(addr1)
      .getCollectionMintFee(collectionAddress);

    expect(facFee.toNumber()).to.equal(fee);
  });

  it("Verify Token Name", async () => {
    const tx = await factory.connect(addr1).createCollection(name, symbol, fee);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    const collectionAddress = event.args._collectionAddress;

    const nameRes = await factory
      .connect(addr1)
      .getCollectionName(collectionAddress);
    expect(nameRes).to.equal(name);
  });

  it("Verify Token Symbol", async () => {
    const tx = await factory.connect(addr1).createCollection(name, symbol, fee);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    const collectionAddress = event.args._collectionAddress;

    const symbolRes = await factory
      .connect(addr1)
      .getCollectionSymbol(collectionAddress);
    expect(symbolRes).to.equal(symbol);
  });
});
