// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BlyToken is ERC721URIStorage {

    event NFTMinted(uint256 _id, string _tokenUri);

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}
    
    function mint(string memory _tokenUri) external returns(uint256) {
        uint256 currentCount = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, currentCount);
        _setTokenURI(currentCount, _tokenUri);

        emit NFTMinted(currentCount, _tokenUri);

        return(currentCount);
    }
}