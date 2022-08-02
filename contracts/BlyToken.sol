// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BlyToken is ERC721URIStorage, Ownable {

    event NFTMinted(string _uri);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public _baseTokenURI;
    string public _imageCid;
    uint256 public _maxSupply;
    uint256 public _mintFee;
    
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

    function mint() external payable returns(uint256) {
        require(msg.value == _mintFee);
        require(_tokenIds.current() < _maxSupply);
        
        uint256 currentCount = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, currentCount);

        emit NFTMinted(tokenURI(currentCount));

        return(currentCount);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}