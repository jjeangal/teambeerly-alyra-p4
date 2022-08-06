const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require("@openzeppelin/test-helpers");
const toWei = (num) => ethers.utils.parseEther(num.toString());

// Variables
let deployer, addr1, addr2, factory, collection;
let name = "Name";
let symbol = "Symbol";
let baseUri = "https://ipfs.io/ipfs/QvTalyhCoX/";
let imageCid = "Image Cid";
let maxSupply = 50;

describe("Get Token Uris", function () {
  before(async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();

    const tx = await factory.createCollection(
      name,
      symbol,
      baseUri,
      imageCid,
      maxSupply
    );
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("get correct token uri", async () => {
    const tx = await factory.mintFromCollection(collection);

    const receipt = await tx.wait();
    const event = receipt.events.find((event) => event.event === "NFTMinted");

    const tokId = event.args._tokenId;

    const tokUri = await factory.getTokenUri(collection, tokId);

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
      .createCollection(name, symbol, baseUri, imageCid, maxSupply);
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

  it("Verify collection owner", async () => {
    const factoryOwner = await factory.owner();
    expect(deployer.address).to.equal(factoryOwner);

    const tx = await factory.collections(collection);
    const owner = await factory.getCollectionOwner(tx);

    expect(factory.address).to.equal(owner);
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
      .createCollection("Wname", "Wsymbol", "WUri", "WCid", 100);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
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

  it("Verify collection owner", async () => {
    const owner = await factory.connect(addr1).getCollectionOwner(collection);
    expect(addr2.address).to.not.equal(owner);
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
      .createCollection(name, symbol, baseUri, imageCid, 0);
    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("Reached max supply", async () => {
    await expectRevert(
      factory.mintFromCollection(collection),
      "Max supply already reached."
    );
  });
});

describe("Test Events", function () {
  before(async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const Factory = await ethers.getContractFactory("NFTFactory");
    //Deploy contract
    factory = await Factory.deploy();
    const tx = await factory
      .connect(addr1)
      .createCollection(name, symbol, baseUri, imageCid, 1);

    const receipt = await tx.wait();
    const event = receipt.events.find(
      (event) => event.event === "CollectionCreated"
    );
    collection = event.args._collectionAddress;
  });

  it("NFT minted event", async () => {
    const tx = await factory.mintFromCollection(collection);

    const receipt = await tx.wait();
    const event = receipt.events.find((event) => event.event === "NFTMinted");
    const id = event.args._tokenId;
    const collectionRes = event.args._collectionAddress;
    expect(id.toNumber()).to.be.equal(0);
    expect(collectionRes).to.be.equal(collection);
  });
});
