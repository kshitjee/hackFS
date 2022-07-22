// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommunityProxyFactory is Ownable {
    address public implementationCommunity;
    address public implementationCollection;

    address[] public allClones;

    event NewClone(address _clone);

    constructor(
        address _implementationCommunity,
        address _implementationCollection
    ) {
        implementationCommunity = _implementationCommunity;
        implementationCollection = _implementationCollection;
    }

    function createNewCommunity() external returns (address instance) {
        instance = Clones.clone(implementationCommunity);
        (bool success, ) = instance.call(
            abi.encodeWithSignature(
                "initialize(address)",
                implementationCollection
            )
        );
        require(
            success,
            "#CommunityProxyFactory: Couldn't create a new community clone!"
        );
        allClones.push(instance);
        emit NewClone(instance);
        return instance;
    }
}
