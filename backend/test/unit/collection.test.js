const { assert, expect } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Collection Unit Tests", function () {
      let owner, collection;
      beforeEach(async function () {
        owner = (await getNamedAccounts()).owner;
        await deployments.fixture(["all"]);
        collection = await ethers.getContract("Collection", owner);
        community = await ethers.getContract("Community", owner);
      });

      describe("initialize()", async function () {
        it("reverts if someone tries to initialize after initialization", async function () {
          collection.initialize(owner, community.address, "uri");
          await expect(
            collection.initialize(owner, community.address, "uri")
          ).to.be.revertedWith(
            "Initializable: contract is already initialized"
          );
        });
      });

      describe("mint()", async function () {
        it("reverts when eoa or random contract tries calling mint", async function () {
          collection.initialize(
            owner,
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            "uri"
          );

          await expect(
            collection.mint("0x0c670AcA9AA0285B961F1D4AB7D4e462C7982311", 1, 10)
          ).to.be.revertedWith(
            'Collection__OnlyCallableThroughCommunityContract("' +
              community.address.toString() +
              '", "' +
              owner.toString() +
              '")'
          );
        });
        // need test for line 44
      });
    });
