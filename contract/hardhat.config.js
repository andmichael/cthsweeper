require('@nomiclabs/hardhat-waffle');
var fs = require('fs');
var account = fs.readFileSync('C:\\Users\\user\\Desktop\\cthdeploy.txt', {
  encoding: 'utf8',
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.7.3',
  networks: {
    cheapeth: {
      url: 'https://node.cheapeth.org/rpc',
      accounts: [account],
    },
  },
};
