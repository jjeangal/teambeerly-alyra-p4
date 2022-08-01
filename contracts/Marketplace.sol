// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    //Owner, the address who gt the fees
    address payable public immutable feeAccount;

    //Fee on transaction set (immutable means can only be set on constructor)
    uint256 public immutable feePercent;

    //Counter
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //Struct of items listed on the marketplace
    struct Item {
        IERC721 nft;
        uint256 tokenId;
        uint256 price;
        address payable seller;
        bool sold;
    }

    //Keep track of the items listed
    mapping(uint256 => Item) public idToItem;

    //events at the item creation and item bought
    event MarketItemCreated(
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller
    );

    event MarketItemBought(
        address indexed nft,
        uint256 tokenId,
        uint256 price,
        address indexed seller,
        address indexed buyer
    );

    ///@dev Set feeAccount au créateur du contract et choix du feePercent
    constructor(uint256 _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function getTotalPrice(uint256 _itemId) public view returns (uint256) {
        return ((idToItem[_itemId].price * (100 + feePercent)) / 100);
    }

    //function for the market
    function createMarketItem(IERC721 _nft, uint256 _price)
        external
        nonReentrant
    {
        require(_price > 0, "Price can't be 0");
        //Increment tokenId and get the current ID
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        // transfer NFT
        _nft.transferFrom(msg.sender, address(this), newTokenId);
        //create Item on mapping and struct
        idToItem[newTokenId] = Item(
            _nft,
            newTokenId,
            _price,
            payable(msg.sender),
            false
        );

        emit MarketItemCreated(address(_nft), newTokenId, _price, msg.sender);
    }

    function purchaseItem(uint256 _itemId) external payable nonReentrant {
        //require price must be equal or greater than totalPrice
        uint256 _totalPrice = getTotalPrice(_itemId);
        require(
            msg.value >= _totalPrice,
            "not enough ether to cover item price and market fee"
        );
        //Get Stuct item and his ID on the market
        Item storage item = idToItem[_itemId];
        uint256 newTokenId = _tokenIds.current();
        //Require: if item exist or if the item is already sold
        require(_itemId > 0 && _itemId <= newTokenId, "item doesn't exist");
        require(!item.sold, "item already sold");

        // Pay seller and feeAccount
        item.seller.transfer(item.price);
        feeAccount.transfer(_totalPrice - item.price);
        // Update item info (sold to true)
        item.sold = true;
        // Transfer NFT to buyer*
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        emit MarketItemBought(
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );
        delete idToItem[_itemId];
    }
}
