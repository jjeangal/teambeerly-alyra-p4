// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "./BlyToken.sol";

contract NFTFactory{

  event CollectionCreated(address _collectionAddress);

  mapping(address => BlyToken) public _collections;

  function createCollection(string calldata _name, string calldata _symbol) external returns (address) {
    BlyToken newCollection = new BlyToken( _name, _symbol);

    address collectionAddress = address(newCollection);
    
    _collections[collectionAddress] = newCollection;

    emit CollectionCreated(collectionAddress);
    return collectionAddress;
  }

  function mintFromCollection(address _collectionAddress, string calldata _uri) external returns (uint256){
    return(_collections[_collectionAddress].mint(_uri));
  }
}