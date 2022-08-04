// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "./BlyToken.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTFactory is ReentrancyGuard {

  event CollectionCreated(address _collectionAddress, address _owner);
  event NFTMinted(address _collectionAddress, uint256 _tokenId);

  mapping(address => BlyToken) public _collections;
  mapping(address => address) public _owners;
 
  function createCollection(
    string calldata _name, 
    string calldata _symbol, 
    string calldata _tokenUri,
    string calldata _image,
    uint256 _maxSupply,
    uint256 _mintFee
  ) external returns (address) {
    BlyToken newCollection = new BlyToken( _name, _symbol, _tokenUri, _image, _maxSupply, _mintFee);

    address collectionAddress = address(newCollection);

    _collections[collectionAddress] = newCollection;
    _owners[collectionAddress] = msg.sender;

    emit CollectionCreated(collectionAddress, msg.sender);

    return collectionAddress;
  }

  function mintFromCollection(address _collectionAddress) external payable nonReentrant returns (uint256) {
    uint256 mintFee = getCollectionMintFee(_collectionAddress);
    require(
      msg.value >= mintFee, 
      "Minting price not satisfied."
    );
    
    address collectionOwner = _owners[_collectionAddress];
    payable(collectionOwner).transfer(msg.value);
    uint256 tokenId = _collections[_collectionAddress].mint();

    emit NFTMinted(_collectionAddress, tokenId);
    
    return(tokenId);
  }

  function getCollectionName(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress].name());
  }

  function getCollectionSymbol(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress].symbol());
  }

  function getCollectionBaseUri(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress]._baseTokenURI());
  }

  function getCollectionImage(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress]._imageCid());
  }

  function getCollectionMaxSupply(address _collectionAddress) external view returns(uint256) {
    return(_collections[_collectionAddress]._maxSupply());
  }

  function getTokenUri(address _collectionAddress, uint256 _tokenId) external view returns(string memory) {
    return(_collections[_collectionAddress].tokenURI(_tokenId));
  }

  function getCollectionOwner(address _collectionAddress) public view returns(address) {
    return(_owners[_collectionAddress]);
  }

  function getCollectionMintFee(address _collectionAddress) public view returns(uint256) {
    return(_collections[_collectionAddress]._mintFee());
  }
}