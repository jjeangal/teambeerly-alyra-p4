// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BlyToken is ERC721URIStorage, Ownable {

    event NFTMinted(uint256 _id, string _tokenUri);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public mintFee = 0 wei; //mintfee, 0 by default.
    string public imageCid;

    constructor(string memory _name, string memory _symbol, string memory _image) ERC721(_name, _symbol) {
        imageCid = _image;
    }

    /*
    Set a mint fee.
    */
    function setFee(uint _fee) public onlyOwner {
        mintFee = _fee;
    }

    function mint(string memory _tokenUri) external payable returns(uint256) {
        require(msg.value == mintFee);
        
        uint256 currentCount = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, currentCount);
        _setTokenURI(currentCount, _tokenUri);

        emit NFTMinted(currentCount, _tokenUri);

        return(currentCount);
    }
}