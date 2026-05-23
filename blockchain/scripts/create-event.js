const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5f6AF6eF1129b355575a74Aad50cC43F3d1a30Bb";

  const VeriTix = await hre.ethers.getContractAt("VeriTix", contractAddress);

  const priceInWei = hre.ethers.parseEther("0.00125");

  const tx = await VeriTix.createEvent(
    "Sky Tour 2024 - M-TP",
    priceInWei,
    10,
    110
  );

  const receipt = await tx.wait();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});