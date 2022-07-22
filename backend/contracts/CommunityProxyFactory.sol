// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommunityProxyFactory is Ownable {
    address public implementationContract;

    address[] public allClones;

    event NewClone(address _clone);

    constructor(address _implementation) {
        implementationContract = _implementation;
    }

    function createNewCommunity(address _implementationCollection)
        external
        returns (address instance)
    {
        instance = Clones.clone(implementationContract);
        (bool success, ) = instance.call(
            abi.encodeWithSignature(
                "initialize(address)",
                _implementationCollection
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
