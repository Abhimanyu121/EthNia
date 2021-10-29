const path = require("path");
var HDWalletProvider = require("truffle-hdwallet-provider");
const data =
  "myth like bonus scare over problem client lizard pioneer submit female collect";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          data,
          "https://ropsten.infura.io/v3/46770654a6f6479489228ef81a5b797a"
        );
      },
      network_id: 3,
    },
    bnb: {
      provider: function () {
        return new HDWalletProvider(
          data,
          "https://data-seed-prebsc-1-s1.binance.org:8545"
        );
      },
      network_id: 0x61,
    },
    matic: {
      provider: function () {
        return new HDWalletProvider(data, "https://rpc-mumbai.matic.today/");
      },
      network_id: 80001,
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(data, "https://goerli.infura.io/v3/53e706eaa088405491d1e311f6a6938b")
      },
      network_id: 5
    },
  },
};
