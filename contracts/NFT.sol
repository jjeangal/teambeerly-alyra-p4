// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenId;

    constructor() ERC721("First NFT", "FIRST") {}

    function mint(string memory _tokenURI) external returns (uint256) {
        tokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return (tokenId);
    }
}
