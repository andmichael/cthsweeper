async function main() {
  // We get the contract to deploy
  const [owner] = await ethers.getSigners();
  const Sweeper = await ethers.getContractFactory('Sweeper');
  const sweeper = await Sweeper.deploy(ethers.utils.parseEther('0.01'));

  console.log('Sweeper deployed to:', sweeper.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
