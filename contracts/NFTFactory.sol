// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

import "./CustomNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Factory ERC721 Contract
/// @author Team Beerly
contract NFTFactory is ReentrancyGuard, Ownable {
    event CollectionCreated(address _collectionAddress, address _owner);
    event NFTMinted(address _collectionAddress, uint256 _tokenId);

    /// Maps the collection addresses to the collection contracts
    mapping(address => CustomNFT) public collections;
    /// Maps the collection addresses to the contract owner addresses
    mapping(address => address[]) public ownerToCollections;

    /// Create a new collection
    /// @notice Adds the owner and collection address to a mapping
    /// @return The address of the collection created
    function createCollection(
        string calldata _name,
        string calldata _symbol,
        string calldata _tokenUri,
        string calldata _image,
        uint256 _maxSupply
    ) external returns (address) {
        CustomNFT newCollection = new CustomNFT(
            _name,
            _symbol,
            _tokenUri,
            _image,
            _maxSupply
        );

        address collectionAddress = address(newCollection);

        collections[collectionAddress] = newCollection;
        ownerToCollections[msg.sender].push(collectionAddress);

        emit CollectionCreated(collectionAddress, msg.sender);
        return collectionAddress;
    }

    /// Mint a token from a chosen collection
    /// @dev Message must be sent with an amount of ethers equal to the minting fee
    /// @notice Owner gets transfered the minting fee amount
    /// @param _collectionAddress The address of the collection
    /// @return The id of the minted token
    function mintFromCollection(address _collectionAddress)
        external
        payable
        onlyOwner
        nonReentrant
        returns (uint256)
    {
        uint256 tokenId = collections[_collectionAddress].mint();
        emit NFTMinted(_collectionAddress, tokenId);
        return (tokenId);
    }

    function getCollectionsOfOwner(address _ownerAddress)
        external
        view
        returns (address[] memory)
    {
        return (ownerToCollections[_ownerAddress]);
    }

    /// @notice Returns the name of a collection
    /// @param _collectionAddress The address of the collection
    function getCollectionName(address _collectionAddress)
        external
        view
        returns (string memory)
    {
        return (collections[_collectionAddress].name());
    }

    /// @notice Returns the symbol of a collection
    /// @param _collectionAddress The address of the collection
    function getCollectionSymbol(address _collectionAddress)
        external
        view
        returns (string memory)
    {
        return (collections[_collectionAddress].symbol());
    }

    /// @notice Returns the base uri of a collection
    /// @param _collectionAddress The address of the collection
    function getCollectionBaseUri(address _collectionAddress)
        external
        view
        returns (string memory)
    {
        return (collections[_collectionAddress].baseTokenURI());
    }

    /// @notice Returns the link of a collection's image
    /// @param _collectionAddress The address of the collection
    function getCollectionImage(address _collectionAddress)
        external
        view
        returns (string memory)
    {
        return (collections[_collectionAddress].imageCid());
    }

    /// @notice Returns the max supply of tokens that a collection allows
    /// @param _collectionAddress The address of the collection
    function getCollectionMaxSupply(address _collectionAddress)
        external
        view
        returns (uint256)
    {
        return (collections[_collectionAddress].maxSupply());
    }

    /// @notice Returns the uri of a token
    /// @param _collectionAddress The address of the collection
    /// @param _tokenId The id of the token
    function getTokenUri(address _collectionAddress, uint256 _tokenId)
        external
        view
        returns (string memory)
    {
        return (collections[_collectionAddress].tokenURI(_tokenId));
    }

    /// @notice Returns the owner of a collection
    /// @param _collectionAddress The address of the collection
    function getCollectionOwner(address _collectionAddress)
        public
        view
        returns (address)
    {
        return (collections[_collectionAddress].owner());
    }
}
