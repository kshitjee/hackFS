const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async function ({ getNamedAccounts, deployments }) {
  /* important variables for deployment */
  const { deploy, log } = deployments;
  const { owner } = await getNamedAccounts();
  const args = [];

  /* deployment */
  log("deploying collection implementation contract");
  const collectionDeployment = await deploy("Collection", {
    from: owner,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  /* verification */
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(collectionDeployment.address, args);
  }
  log("deployed & verfied (if needed)");
};

module.exports.tags = ["all", "collection"];
