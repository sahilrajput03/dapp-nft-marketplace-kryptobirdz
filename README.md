# NFT Marketplace - Kyptobirdz

Web3 Apps: Web3, in the context of technology, refers to decentralized apps that run on the blockchain. These are apps that allow anyone to participate without monetizing their personal data.

## start from `13. Hardhat & Infra Blockchain Configuration`

Libraries:

- `ethers` - To help us interact with ethereum blockchain
- `hardhat` - To provide us a development environment and it allows us to compile contracts and deploy our contracts to blockchain. (We're uisng `hardhat` instead of `truffle` in this project). Awesome thing: `hardhat` can also initialize the solidity contracts for us and get the project rolling so it can do little bit of that boilerplate which otherwise again would be cumbersome to do over and over again.
- `@nomiclabs/hardhat-waffle`:
- `@nomiclabs/hardhat-ethers`:
- `web3modal`: To connect with metamask and run transactions
- `@openzeppelin/contracts`:
- `ethereum-waffle`: A library which actually contains ERC721 Contracts already build to Standards. (Coz we're not going to build our nft token from scratch)
- `chai`: For testing environment
- `ipfs-http-client`: It is decentralized way of hosting our URI's or NFT images (which are files). So its a way to store files. We use this coz when our users will be tokenizing the NFT's there're gonna be hosting it IPFS.
- `axios` - To help us with http requests
- `add` - A cross-browser, numerically stable way to add floats in Javascript.
- LATEST: `@nomicfoundation/hardhat-toolbox` - A new setup instead of using `@nomiclabs/hardhat-waffle`.

```bash
npm install ethers hardhat @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers web3modal @openzeppelin/contracts ipfs-http-client axios
```

**Linked Course:**

- Complete nft development course - To help you create `ERC721 token` from scratch we learn the tokenomics and the functionality. **FYI: In real world we're not gonna be building from scratch every single nft.** But to solidify the the knowledge its good to learn how its done from scratch.

**TRACK**

`hardhat` initialize our project and build out some smart contracts for us by

```bash
npx hardhat
# ✔ What do you want to do? · Create a JavaScript project
# ✔ Hardhat project root: · /home/array/test/nft-marketplace-kryptobirdz
# ✔ Do you want to add a .gitignore? (Y/n) · y

# Readme generated from above command
# ===================================

# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

# shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## ERC

We're using Openzepplin, so have ready made contracts. YO!

[Dev article](https://dev.to/envoy_/ks-what-are-ethereum-request-for-comments-erc-standards-5f80)

[EIP](https://eips.ethereum.org/EIPS/eip-721)

[ERC-721](https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#top)

FROM `node_modules`: [Here](node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol)

You can see other contracts in ^^ that file as well:

```sol
import "./IERC721.sol";
import "./IERC721Receiver.sol";
import "./extensions/IERC721Metadata.sol";
import "../../utils/Address.sol";
import "../../utils/Context.sol";
import "../../utils/Strings.sol";
import "../../utils/introspection/ERC165.sol";
```

We are gonna use these contracts for minting token and grabbing TOKEN_URI, setting up our IPFS.

## Useful resources

- Infure Dashboard - [Click here](https://infura.io/dashboard)
- Upgrading Contracts in Solidity - [Click here](https://docs.openzeppelin.com/learn/upgrading-smart-contracts)
- Solana vs. Ethereum(solidity) 1 - [Click here](https://pixelplex.io/blog/solana-vs-ethereum/)
- Solana vs. Ethereum(solidity) 2 - [Click here](https://www.reddit.com/r/solana/comments/oes1gd/should_i_learn_solana_rust_or_ethereum_solidity/)

**Courses:**

- (TODO) UDEMY COURSE: Become a Blockchain Developer: Ethereum + Solidity + Project
- (TODO) YOUTUBE COURSE: Blockchain Ecommerce App Tutorial (Accept ERC20 Token Payments): https://www.youtube.com/watch?v=f5npM1PvoyE , [Github - unofficial's person code](https://github.com/michael-steinert/SolidityWeb3ECommerceExpressMongooseMongoDBReact)
- (TODO) ~AMAZING~ Youtube Playlist (~Polygon): BUIDL IT - Workshop #1 - Intro to Web3 Tech Stack: https://www.youtube.com/watch?v=S8hZ5rDV7kg
- UDEMY COURSE: Dapp course on gdrive - Build An NFT Marketplace From Scratch - Blockchain DApp: [Click here](https://drive.google.com/drive/folders/1o7eExDuepyTlyMUeospr1epx-xF9ELM9)
- Deployement Cost to Ethereum and other blockchains: [Click here](https://medium.com/the-capital/how-much-does-it-cost-to-deploy-a-smart-contract-on-ethereum-11bcd64da1)

## LEARN

- You can deploy to local blockchain by running the `start-local-blockchain` script and use `deploy-local-KryptoBird` to deploy to local blockchain you just started.
- `artifacts` folder in generated when you run `deploy-local-KryptoBird` script.

## OTHER DISTURBED THINGS BY THIS NFT PROJECT

- [Auth for New Devs: It’s Easier Than You Think](https://www.youtube.com/watch?v=h6wBYWWdyYQ)
- [Build and Deploy a blockchain network for FREE: IBM Blockchain Tutorial #2](https://www.youtube.com/watch?v=mkVUW1KroTI)
- IMP: https://vimeo.com/34017777
- FIGMA COURSE: https://www.udemy.com/course/mastering-figma-beginner-to-expert/learn/lecture/20734372?start=30#overview

## Enabling test network in metamask

1.

![](./ss/ss-enable-test-networks-in-metamast.png)

2.

![](./ss/ss-metamask-shows-local-blockchain.png)

## Minting/Creating nft with an account using metamask on websites

1.

![](./ss/ss-creating-token-with-ur-account-with-metamask.png)

2.

![](./ss/ss-create-token-confirm.png)

## Buying an nft looks like this

![](./ss/ss-buying-nft-looks-like.png)

and on completion we get

![](./ss/ss-confirm-transaction.png)

## Successful transaction address

![](./ss/ss-how-addresses-linked-on-successful-transaction.png)

## What is mumbai-testnet

![](./ss/ss-what-is-mumbai-testnet.png)

## We cannot delete accounts created (but imported ones can deleted) on metamask and it'll be there foreever

Source: Deleteing imported accounts in metamask (Official Docs): [Click here](https://metamask.zendesk.com/hc/en-us/articles/360057435092-How-to-remove-an-account-from-your-MetaMask-wallet)

![](./ss/ss-we-can-not-delete-created-accounts-in-metamask.png)

## More on theory part

- ![](./ss/ss-1-urxo.png)
- ![](./ss/ss-operations-on-blockchain.png)
- ![](./ss/ss-external-and-contract-accounts.png)
- ![](./ss/ss-incentive-model.png)
- ![](./ss/ss-transaction-integrity-blockchain.png)
- ![](./ss/ss-fallbak-fn-takes-money-into-smart-contract.png)
- ![](./ss/ss-deployment-of-smart-contract.png)
- ![](./ss/ss-what-is-metamask.png)
- ![](./ss/ss-what-is-remix.png)
- ![](./ss/ss-enable-test-networks-in-metamast.png)

**Modifier are used to check user input conditions. Events are used to trigger some outside applications. Event tells the client side applications that some change has been done.**

**Smart contracts need an address to deploy and invoke its functions.**

## Using account 3 with Remix IDE

![](./ss/ss-connected-account-with-remix.png)

## Get money in your test wallets i.e, `KovanETH`

@: https://faucets.chain.link/

Source: https://github.com/MetaMask/metamask-extension/issues/5439#issuecomment-990094952

Other multiple Source: https://github.com/MetaMask/metamask-extension/issues/5439#issuecomment-990402909

Promising for 10 coins in 30mins(7:40pm): https://faucet.egorfine.com/

## Hello world contract deployed via remix IDE

- ![](./ss/ss-hello-world-contract-deployed-via-remix.png)
- ![](./ss/ss-more-insights-about-metamask-and-remix.png)
- Add polygon mumbai testnet to metamask [source](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/):

![](./ss/ss-add-polygon-mumbai-testnet.png)

![](./ss/ss-add-polygon-mumbai-testnet-2.png)

- Add polygon mainnet to metamask [source](https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/) :

![](./ss/ss-adding-polygon-network-to-metamask.png)

![](./ss/ss-adding-polygon-network-to-metamask-2.png)

- Mumbai Testnet and Mainnet in Metamask

![](./ss/ss-mumbai-testnet-and-mainnet.png)

- web2 and web3

![](./ss/ss-web2-and-web3.png)

- bitCoin price analysis

![](./ss/ss-bitcoin-price-inc-analysis.png)

- Learn remix ide: FYI: I used locally run hardhat blockchain instead of mumbai-testnet bcoz mumbai-testnet was resolving single request in 5-15mins for me.

![](./ss/ss-learn-remix-ide.png)

## now?? 8 August, 2022

**TODO NOW:**

- Use polygon.technology with mobile internet till connect fixes the GOVT BLOCKED ISSUE.
- Deploy a solidity smartcontract on polygon testnet: https://youtu.be/c80AHFOo63M?t=412
  - (COPY^^):Hardhat - Deploying Smart Contract to Ethereum (Testnet / Mainnet): https://youtu.be/Uvphp4aVeDg
  - youtube search: https://www.youtube.com/results?search_query=deployment+to+mumbainet&sp=CAASAhAB
  - google search: do if required..

**Explore:**

- Q. What is Polygon Pos Chain explorer: https://polygonscan.com/

**DEEP LONG INTERVIEWS**

- Deep Talk with Jaynti Kanani - CEO & Co-founder of Matic (Polygon): Start watching from: https://youtu.be/XsKRaMhX3Iw?t=137
- Matic Network | BlockchainBrad EXCLUSIVE Interview with MATIC COO | An Ethereum Scalability solution: Start watching from here: https://youtu.be/XZcBbKf8lRI?t=1115

**Articles:**

- Matic: https://www.moneycontrol.com/news/business/startup/from-diamond-factory-workers-son-to-founder-of-10-billion-crypto-venture-the-story-of-jaynti-kanani-and-polygon-7007481.html

**Video content**

- Polygon Tv CHANNEL: https://www.youtube.com/c/PolygonTV, src: https://polygon.technology/developers

## Installed `hardhat-watcher`

Usage - Docs: https://github.com/xanderdeseyn/hardhat-watcher#usage

```bash
npm install hardhat-watcher
```

And addded below script to `package.json`

```js
require('@nomiclabs/hardhat-waffle')

// Also add below to default export config object:
{
  // ...,
  watcher: {
  'learn-contracts': {
    tasks: ['test'],
    files: ['./contracts', './test'],
  },
},
}
```

and create a script in `package.json` like:

```json
"test-watch-learn-contracts": "hardhat watch learn-contracts",
```

so we can use `npm run test-watch-learn-contracts` to run tests in watch mode.

### temporary truffle urls

```bash
yarn develop truffle
# from youtube's course of ecommerceWeb3
```

Writing Test in Solidity: https://trufflesuite.com/docs/truffle/testing/writing-tests-in-solidity/

Writing Test in JS: https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript/

Debugger: https://trufflesuite.com/docs/truffle/getting-started/using-the-truffle-debugger/

SOLIDITY Hardhat Typescript Template: https://github.com/xanderdeseyn/solidity-hardhat-template
