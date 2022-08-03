const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

// Variables
let deployer, addr1, addr2, factory, collection;
let URI = "Test URI";
let name = "Name";
let symbol = "Symbol";
let baseUri = "https://beerly.fr/";
let imageCid = "Image Cid";
let maxSupply = 50;
let fee = 10;

describe("Get Token Uris", function () {
  before(async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();

    const tx = await factory
      .connect(addr1)
      .createCollection(name, symbol, baseUri, imageCid, maxSupply, 0);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("get correct token uri", async () => {
    const tx = await factory.connect(addr1).mintFromCollection(collection);

    const receipt = await tx.wait();
    const event = receipt.events.find((event) => event.event === "NFTMinted");

    const tokId = event.args._tokenId;

    const tokUri = await factory.connect(addr1).getTokenUri(collection, tokId);

    expect(tokUri).to.equal(baseUri + tokId);
  });
});

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
      .createCollection(name, symbol, baseUri, imageCid, maxSupply, fee);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
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

  it("Verify Token Base Uri", async () => {
    const baseUriRes = await factory
      .connect(addr1)
      .getCollectionBaseUri(collection);
    expect(baseUriRes).to.equal(baseUri);
  });

  it("Verifty max supply", async () => {
    const supplyRes = await factory
      .connect(addr1)
      .getCollectionMaxSupply(collection);

    expect(supplyRes.toNumber()).to.equal(maxSupply);
  });

  it("Verify minting fee", async () => {
    const facFee = await factory
      .connect(addr1)
      .getCollectionMintFee(collection);

    expect(facFee.toNumber()).to.equal(fee);
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
      .createCollection("Wname", "Wsymbol", "WUri", "WCid", 100, 0);
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

  it("Verify Token Base Uri", async () => {
    const baseUriRes = await factory
      .connect(addr1)
      .getCollectionBaseUri(collection);
    expect(baseUriRes).to.not.equal(baseUri);
  });

  it("Verify max supply", async () => {
    const supplyRes = await factory
      .connect(addr1)
      .getCollectionMaxSupply(collection);

    expect(supplyRes.toNumber()).to.not.equal(maxSupply);
  });
});

describe("Test Reverts", function () {
  before(async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();

    const tx = await factory
      .connect(addr1)
      .createCollection(name, symbol, baseUri, imageCid, 1, 1);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("Value sent is not enough for minting fee", async () => {
    await expectRevert(
      factory.connect(addr1).mintFromCollection(collection),
      "Minting price not satisfied."
    );
  });
  /*
  it("Reached max supply", async () => {
    await expectRevert(factory.connect(addr1).mintFromCollection(collection, { value: ethers.utils.parseEther("1") }), 
      'Max supply already reached.');
  });
  */
});
