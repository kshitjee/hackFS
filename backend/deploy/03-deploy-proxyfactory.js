const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  /* important variables for deployment */
  const { deploy, log } = deployments;
  const { owner } = await getNamedAccounts();
  const args = [
    "0xc72DF9762e0e71015bC81f6864F3cd50C2e6C33c",
    "0xa2af19E78dA3E5910Ed6253344F022a02544544f",
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
    console.log(args);
    await verify(communityDeployment.address, args);
  }
  log("deployed & verfied (if needed)");
};
module.exports.tags = ["all", "communityFactory"];
