const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

// Variables
let deployer, addr1, addr2, nft, marketplace;
let feePercent = 1;
let URI = "Sample URI";

// Tests
describe("NFT", function () {
  beforeEach(async () => {
    // Get accounts
    [deployer, addr1, addr2] = await ethers.getSigners();
    // Get contract
    const NFT = await ethers.getContractFactory("NFT");
    const Marketplace = await ethers.getContractFactory("Marketplace");
    //Deploy contract
    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(feePercent);
  });

  describe("Deployment", () => {
    it("Should track name and symbol of the NFT", async () => {
      expect(await nft.name()).to.equal("First NFT");
      expect(await nft.symbol()).to.equal("FIRST");
    });
    it("Should track feeAccount and feePercent of the marketplace", async () => {
      expect(await marketplace.feeAccount()).to.equal(deployer.address);
      expect(await marketplace.feePercent()).to.equal(feePercent);
    });
  });

  describe("Minting NFT", () => {
    it("Should track each minted NFT", async () => {
      // addr1
      await nft.connect(addr1).mint(URI);
      expect(await nft.tokenCount()).to.equal(1);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.tokenURI(1)).to.equal(URI);
      // // addr2
      await nft.connect(addr2).mint(URI);
      expect(await nft.tokenCount()).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.tokenURI(2)).to.equal(URI);
    });
  });

  describe("Making marketplace items", () => {
    beforeEach(async () => {
      // addr1 mint NFT
      await nft.connect(addr1).mint(URI);
      // addr1 approves marketplace to get NFT
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
    });
    it("Should not be reverted", async () => {
      //Should track newly created item
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1))
      )
        .to.emit(marketplace, "Offered")
        .withArgs(1, nft.address, 1, toWei(1), addr1.address);

      //Should trasnfer NFT from seller to marketplace
      expect(await nft.ownerOf(1)).to.equal(marketplace.address);
      expect(await marketplace.itemCount()).to.equal(1);

      //Should store the NFT in the struct Item with the right values
      const item = await marketplace.items(1);
      expect(item.itemId).to.equal(1);
      expect(item.nft).to.equal(nft.address);
      expect(item.tokenId).to.equal(1);
      expect(item.price).to.equal(toWei(1));
      expect(item.sold).to.equal(false);
    });
    it("Should fail with price set to zero", async () => {
      await expect(
        marketplace.connect(addr1).makeItem(nft.address, 1, 0)
      ).to.be.revertedWith("Price can't be 0");
    });
  });

  describe("Purchasing marketplace items", () => {
    let price = 1;
    let fee = (feePercent / 100) * price;
    let totalPriceInWei;

    beforeEach(async () => {
      // addr1 mint NFT
      await nft.connect(addr1).mint(URI);
      // addr1 approves marketplace to get NFT
      await nft.connect(addr1).setApprovalForAll(marketplace.address, true);
      // addr1 makes their nft a marketplace item
      await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(1));
    });

    it("Should update item as sold, pay seller, transfer NFT to buyer, charge fees and emit a Bought event", async () => {
      const sellerInitialEthBal = await addr1.getBalance();
      const feeAccountInitialEthBal = await deployer.getBalance();

      //Fetch items total price (market fee + item price)
      totalPriceInWei = await marketplace.getTotalPrice(1);

      //Addr2 purchases the NFT
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
      )
        .to.emit(marketplace, "Bought")
        .withArgs(
          1,
          nft.address,
          1,
          toWei(price),
          addr1.address,
          addr2.address
        );

      const sellerFinalEthBal = await addr1.getBalance();
      const feeAccountFinalEthBal = await deployer.getBalance();

      //seller should receive payment
      expect(+fromWei(sellerFinalEthBal)).to.equal(
        +price + +fromWei(sellerInitialEthBal)
      );
      // feeAccount should receive fee
      expect(+fromWei(feeAccountFinalEthBal)).to.equal(
        +fee + +fromWei(feeAccountInitialEthBal)
      );
      //The buyer should own the NFT
      expect(await nft.ownerOf(1)).to.equal(addr2.address);
      // Item should me marked as sold
      expect((await marketplace.items(1)).sold).to.equal(true);
    });

    it("Should revert by invalid item id, not sending enough money and sold item", async () => {
      //fails for invalid items id
      await expect(
        marketplace.connect(addr2).purchaseItem(2, { value: totalPriceInWei })
      ).to.be.revertedWith("item doesn't exist");
      await expect(
        marketplace.connect(addr2).purchaseItem(0, { value: totalPriceInWei })
      ).to.be.revertedWith("item doesn't exist");

      // Not enough money send
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: toWei(price) })
      ).to.be.revertedWith(
        "not enough ether to cover item price and market fee"
      );

      //Sold item
      //addr2 purchase item 1
      await marketplace
        .connect(addr2)
        .purchaseItem(1, { value: totalPriceInWei });
      //deployer tries purchasing item 1
      await expect(
        marketplace
          .connect(deployer)
          .purchaseItem(1, { value: totalPriceInWei })
      ).to.be.revertedWith("item already sold");
    });
  });
});
