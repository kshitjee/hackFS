const { ethers } = require("hardhat");

async function main() {
    // Deploy Base Contracts First
    const Collection = await ethers.getContractFactory("Collection");
    const collection = await Collection.deploy();
    await collection.deployed();

    const Community = await ethers.getContractFactory("Community");
    const community = await Community.deploy();
    await community.deployed();

    const CommunityProxyFactory = await ethers.getContractFactory("CommunityProxyFactory");
    const cpf = await CommunityProxyFactory.deploy(community.address);
    await cpf.deployed();

    console.log(collection.address, "Collection base contract address");
    console.log(community.address, "Community base contract address");
    console.log(cpf.address, "Minimal Proxy Community Factory contract address");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });