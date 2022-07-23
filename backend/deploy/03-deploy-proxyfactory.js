const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  /* important variables for deployment */
  const { deploy, log } = deployments;
  const { owner } = await getNamedAccounts();
  const args = [
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  ];

  /* deployment */
  log("deploying community proxy factory contract");
  const communityDeployment = await deploy("CommunityProxyFactory", {
    from: owner,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  /* verification */
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(communityDeployment.address, args);
  }
  log("deployed & verfied (if needed)");
};
module.exports.tags = ["all", "communityFactory"];
