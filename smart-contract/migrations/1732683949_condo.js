const Condo = artifacts.require("Condo");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(Condo);
};
