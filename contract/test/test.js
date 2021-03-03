const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Sweeper', function () {
  it('Should work', async function () {
    function createEvent(contract, eventName) {
      let promise = new Promise((resolve, reject) => {
        contract.on(eventName, (from, amount, event) => {
          resolve({ from: from, amount: amount });
          event.removeListener();
        });
        setTimeout(() => {
          reject(new Error('timeout'));
        }, 10000);
      });
      return promise;
    }

    const [owner] = await ethers.getSigners();
    const Sweeper = await ethers.getContractFactory('Sweeper');
    const sweeper = await Sweeper.deploy(ethers.utils.parseEther('0.01'));
    await sweeper.deployed();
    await owner.sendTransaction({
      to: sweeper.address,
      value: ethers.utils.parseEther('0.01'),
    });

    await sweeper.enter({ value: ethers.utils.parseEther('0.01') });
    let enteredEvent = createEvent(sweeper, 'BalanceChanged');
    contractEvent = await enteredEvent;
    expect(contractEvent.amount > 0).to.equal(true);

    let playedEvent = createEvent(sweeper, 'BalanceChanged');
    await sweeper.play();
    contractEvent = await playedEvent;
    expect(contractEvent).to.ok;

    if (contractEvent.amount > 0) {
      console.log('Withdrawing');
      let withdrewEvent = createEvent(sweeper, 'BalanceChanged');
      await sweeper.withdraw();
      contractEvent = await withdrewEvent;
      expect(contractEvent).to.ok;
    }
  });
});
