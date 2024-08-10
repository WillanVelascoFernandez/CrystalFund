import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the YourContract contract using the deployer account
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployCrystalFund: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the YourContract contract
  await deploy("CrystalFund", {
    from: deployer,
    log: true,
    // No constructor arguments for YourContract
    args: [],
    autoMine: true,
  });

  // Get the deployed contract instance
  const crystalFund = await hre.ethers.getContract<Contract>("CrystalFund", deployer);
  console.log("🎉 CrystalFund deployed to:", crystalFund.address);

  // Optional: Check some initial values or interact with the contract
  // For example, you might want to check the initial fee percentage
  const feePercentage = await crystalFund.contractFeePercentage();
  console.log("Initial contract fee percentage:", feePercentage.toString());
};

export default deployCrystalFund;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags CrystalFund
deployCrystalFund.tags = ["CrystalFund"];
