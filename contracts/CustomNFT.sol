// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Customizable ERC721 collection 
/// @author Team Beerly
contract CustomNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseTokenURI;
    string public imageCid;
    uint256 public maxSupply;
    
    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _customTokenURI,
        string memory _image,
        uint256 _supply
        ) ERC721(_name, _symbol) {
        maxSupply = _supply;
        imageCid = _image;
        baseTokenURI = _customTokenURI;
    }

    /// @notice Mint a token from the collection
    /// @return The token id
    function mint() external payable onlyOwner returns(uint256) {
        require(_tokenIds.current() < maxSupply, "Max supply already reached.");
        
        uint256 currentCount = _tokenIds.current();
        _tokenIds.increment();

        _mint(msg.sender, currentCount);

        return(currentCount);
    }

    /// @notice Returns the base uri of the collection
    /// @dev Overwrites the ERC721 _baseUri() function
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }
}