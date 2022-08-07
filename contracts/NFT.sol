// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title OpenBatch mint NFT 
/// @author Antoine Servant at OpenBatch
/// @notice This contract is used only to mint NFT

contract NFT is ERC721URIStorage {
    uint256 public tokenId;

    /// @dev Create a collection for the marketplace to mint
    constructor() ERC721("First NFT", "FIRST") {}

    /// @dev simple safe mint function
    /// @param _tokenURI the URI of the token
    /// @return tokenId
    function mint(string memory _tokenURI) external returns (uint256) {
        tokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        return (tokenId);
    }
}
