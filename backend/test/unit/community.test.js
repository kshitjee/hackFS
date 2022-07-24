const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Community Unit Tests", function () {
      let owner, collection;
      beforeEach(async function () {
        owner = (await getNamedAccounts()).owner;
        await deployments.fixture(["all"]);
        communityfactory = await ethers.getContract(
          "CommunityProxyFactory",
          owner
        );
        collection = await ethers.getContract("Collection", owner);
        community = await ethers.getContract("Community", owner);
      });

      describe("createCollection()", function () {
        it("reverts if token supplies do not match token ids", async function () {
          await expect(
            community.createCollection("URI", [1, 2, 3, 4], [100, 200, 300])
          ).to.be.revertedWith(
            "Community__TokenIdsDoNotMatchTokenSupplies(4, 3)"
          );
        });
        it("successfully creates a clone and initializes it", async function () {
          const txRequest0 = await communityfactory.createNewCommunity();
          const txReceipt0 = await txRequest0.wait(1);
          const communityCloneAddress = txReceipt0.events[2].args[0];

          const communityCloneContract = await ethers.getContractAt(
            "Community",
            communityCloneAddress
          );
          const txRequest = await communityCloneContract.createCollection(
            "URI",
            [1, 2, 3],
            [100, 200, 300]
          );
          const txReceipt = await txRequest.wait(1);
          const cloneAddress = txReceipt.events[1].args[0];
          const cloneContract = await ethers.getContractAt(
            "Collection",
            cloneAddress
          );
          assert.equal(
            (await cloneContract.baseMetadataURI()).toString(),
            "URI"
          );
        });
        it("updates clone mapping successfully", async function () {
          const txRequest = await community.createCollection(
            "URI",
            [1, 2, 3],
            [100, 200, 300]
          );
          const txReceipt = await txRequest.wait(1);
          const cloneAddress = txReceipt.events[0].args[0];
          const CollectionStruct = await community.getCollection(cloneAddress);
          assert.equal(CollectionStruct.baseMetadataURI, "URI");
        });
      });
      // need tests for airdropNewTokens() and mintToken()
    });
