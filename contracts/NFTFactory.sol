// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "./BlyToken.sol";

contract NFTFactory {

  event CollectionCreated(address _collectionAddress, address _owner);
  event NFTMinted(address _collectionAddress, uint256 _tokenId);

  mapping(address => BlyToken) public _collections;
  mapping(address => address) public _owners;
 
  function createCollection(
    string calldata _name, 
    string calldata _symbol, 
    string calldata _image,
    uint256 mintFee
  ) external returns (address) {
    BlyToken newCollection = new BlyToken( _name, _symbol, _image);

    address collectionAddress = address(newCollection);

    _collections[collectionAddress] = newCollection;
    _owners[collectionAddress] = msg.sender;

    emit CollectionCreated(collectionAddress, msg.sender);

    newCollection.setFee(mintFee);

    return collectionAddress;
  }

  function mintFromCollection(address _collectionAddress, string calldata _uri) external returns (uint256){
    uint256 tokenId = _collections[_collectionAddress].mint(_uri);

    emit NFTMinted(_collectionAddress, tokenId);
    
    return(tokenId);
  }

  function getCollectionMintFee(address _collectionAddress) external view returns (uint256) {
    return(_collections[_collectionAddress].mintFee());
  }

  function getCollectionName(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress].name());
  }

  function getCollectionSymbol(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress].symbol());
  }

  function getCollectionImage(address _collectionAddress) external view returns(string memory) {
    return(_collections[_collectionAddress].imageCid());
  }
}