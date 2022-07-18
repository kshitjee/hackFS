const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  /* important variables for deployment */
  const { deploy, log } = deployments;
  const { owner } = await getNamedAccounts();
  const args1 = ["0x5FbDB2315678afecb367f032d93F642f64180aa3"];

  /* deployment */
  log("deploying community implementation contract");
  const communityDeployment = await deploy("Community", {
    from: owner,
    args: ["0x5FbDB2315678afecb367f032d93F642f64180aa3"],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  /* verification */
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(communityDeployment.address, args1);
  }
  log("deployed & verfied (if needed)");
};
module.exports.tags = ["all", "community"];
