//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/* IMPORTS */
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";

/* ERRORS */
error Collection__AlreadyInitialized();
error Collection__OnlyCallableThroughCommunityContract(
  address communityAddress,
  address caller
);

contract Collection is ERC1155Upgradeable {
  /* STATE VARIABLES */
  address private owner;
  address private communityAddress;
  string public baseMetadataURI;

  /* EXTERNAL FUNCTIONS */
  function initialize(
    address _owner,
    address _communityAddress,
    string memory _baseMetadataURI
  ) external initializer {
    owner = _owner;
    communityAddress = _communityAddress;
    baseMetadataURI = _baseMetadataURI;
    __ERC1155_init(_baseMetadataURI);
  } // do needed checks here

  // only community contract associated can call this function
  function mint(
    address _to,
    uint256 _id,
    uint256 _amount
  ) external {
    if (msg.sender != communityAddress) {
      revert Collection__OnlyCallableThroughCommunityContract(
        communityAddress,
        msg.sender
      );
    }
    _mint(_to, _id, _amount, "");
  }
}
