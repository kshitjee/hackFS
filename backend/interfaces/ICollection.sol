//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

/* COLLECTION INTERFACE */
interface ICollection {
  function initialize(address _owner, address _communityAddress, string memory _baseMetadataURI) external;

  function mint(
    address _to,
    uint256 _id,
    uint256 _amount
  ) external;
}
