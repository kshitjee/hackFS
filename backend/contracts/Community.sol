// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/* IMPORTS */
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "../interfaces/ICollection.sol";

/* CONTRACT ERRORS */
error Community__TokenIdsDoNotMatchTokenSupplies(
    uint256 idsLength,
    uint256 suppliesLength
);
error Community__NotEnoughSupply();

contract Community is Ownable, Initializable {
    /* STRUCTS & ENUMS */
    struct Collection {
        address communityAddress;
        string baseMetadataURI;
        uint256[] supplies;
        // type??
    }

    /* STATE VARIABLES */
    address collectionImplemenation;
    mapping(address => Collection) addrToCollection;

    /* EVENTS */
    event CollectionCreated(
        address indexed collectionAddress,
        address indexed communityAddress,
        string baseMetaDataURI,
        Collection collection
    );
    event NewTokenAirdropped(
        address indexed collectionAddress,
        address[] indexed to,
        uint256 indexed tokenId
    );
    event TokenMinted(
        address indexed collectionAddress,
        address indexed to,
        uint256 indexed tokenId,
        uint256 amount
    );

    /* CONSTRUCTOR (init for clone) */
    function initialize(address _collectionImplemenation) external initializer {
        collectionImplemenation = _collectionImplemenation;
        _transferOwnership(tx.origin);
    }

    /* EXTERNAL FUNCTIONS */
    /**
     * @notice Method for creating an ERC-1555 upgradeable collection.
     * @param _baseMetadataURI: Base Metadata URI for ERC-1155 collection.
     * @param _tokenIds: Array of the token Ids.
     * @param _initialSupplies: Array of the initial supplies corresponding to the token Id.
     */
    function createCollection(
        string memory _baseMetadataURI,
        uint256[] memory _tokenIds,
        uint256[] memory _initialSupplies
    ) external onlyOwner {
        if (_tokenIds.length != _initialSupplies.length) {
            revert Community__TokenIdsDoNotMatchTokenSupplies(
                _tokenIds.length,
                _initialSupplies.length
            );
        }

        address collectionAddress = Clones.clone(collectionImplemenation);
        ICollection(collectionAddress).initialize(
            msg.sender,
            address(this),
            _baseMetadataURI
        );
        Collection memory newCollection = Collection(
            address(this),
            _baseMetadataURI,
            _initialSupplies
        );
        addrToCollection[collectionAddress] = newCollection;
        emit CollectionCreated(
            collectionAddress,
            address(this),
            _baseMetadataURI,
            newCollection
        );
    }

    /**
     * @notice Method for Airdropping a single token to those receiving rewards/ airdrops.
     * @param _collectionAddress: The Collection (ERC-1155) clone address.
     * @param _tokenId: The ID of the token to be airdropped.
     * @param _to: Array of the reward/ aidrop recipients.
     */
    function airdropNewTokens(
        address _collectionAddress,
        uint256 _tokenId,
        address[] memory _to
    ) external onlyOwner {
        if (addrToCollection[_collectionAddress].supplies[_tokenId] == 0) {
            revert Community__NotEnoughSupply();
        }
        addrToCollection[_collectionAddress].supplies[_tokenId] -= 1;
        emit NewTokenAirdropped(_collectionAddress, _to, _tokenId);
        for (uint256 i = 0; i < _to.length; i++) {
            ICollection(_collectionAddress).mint(_to[i], _tokenId, 1);
        }
    } // check for reentrancy

    /**
     * @notice Method for Minting a specified amount of tokens to msg.sender.
     * @param _collectionAddress: The Collection (ERC-1155) clone address.
     * @param _tokenId: The ID of the token to be minted.
     * @param _amount: Amount of tokens to be minted to msg.sender.
     */
    function mintToken(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _amount
    ) external {
        if (addrToCollection[_collectionAddress].supplies[_tokenId] < _amount) {
            revert Community__NotEnoughSupply();
        }
        addrToCollection[_collectionAddress].supplies[_tokenId] -= _amount;
        emit TokenMinted(_collectionAddress, msg.sender, _tokenId, _amount);
        ICollection(_collectionAddress).mint(msg.sender, _tokenId, _amount);
    } // check for reentrancy

    /* GETTERS */
    function getCollection(address _collectionAddress)
        public
        view
        returns (Collection memory)
    {
        return addrToCollection[_collectionAddress];
    }
}
