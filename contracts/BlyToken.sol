// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BlyToken is ERC721URIStorage, Ownable {

    event NFTMinted(string _uri);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public mintFee = 0 wei; //mintfee, 0 by default.
    string public imageCid;
    string public _baseTokenURI;

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _customTokenURI,
        string memory _image
        ) ERC721(_name, _symbol) {
        imageCid = _image;
        _baseTokenURI = _customTokenURI;
    }

    function mint() external payable returns(uint256) {
        require(msg.value == mintFee);
        
        uint256 currentCount = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, currentCount);

        emit NFTMinted(tokenURI(currentCount));

        return(currentCount);
    }

    /*
    Set a mint fee.
    */
    function setFee(uint _fee) public onlyOwner {
        mintFee = _fee;
    }

    function setBaseUri(string memory _customTokenURI) public onlyOwner {
        _baseTokenURI = _customTokenURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}