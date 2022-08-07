// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title OpenBatch mint collection 
/// @author Jean Gal at OpenBatch
/// @notice This contract is used only to mint collection's NFT

contract BlyToken is ERC721URIStorage, Ownable {

    //add counter from OpenZeppelin
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    //all the variables that a NFT need
    string public _baseTokenURI;
    string public _imageCid;
    uint256 public _maxSupply;
    uint256 public _mintFee;
    
    ///@dev get all the info of the NFT
    ///@param _name, _symbol, _customTokenURI, _image, _supply, _mintingFee
    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _customTokenURI,
        string memory _image,
        uint256 _supply,
        uint256 _mintingFee
        ) ERC721(_name, _symbol) {
        _maxSupply = _supply;
        _imageCid = _image;
        _baseTokenURI = _customTokenURI;
        _mintFee = _mintingFee;
    }

    ///@dev function to mint the NFT created with the constructor
    ///@return currentCount
    function mint() external payable returns(uint256) {
        require(_tokenIds.current() < _maxSupply, "Max supply already reached.");
        
        uint256 currentCount = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, currentCount);

        return(currentCount);
    }

    ///@notice get the base URI
    ///@return _baseTokenURI
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}