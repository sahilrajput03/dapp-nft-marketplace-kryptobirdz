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
- Dapp course on gdrive - [Click here](https://drive.google.com/drive/folders/1o7eExDuepyTlyMUeospr1epx-xF9ELM9)
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

![](./ss-enable-test-networks-in-metamast.png)

2.

![](./ss-metamask-shows-local-blockchain.png)

## Minting/Creating nft with an account using metamask on websites

1.

![](./ss-creating-token-with-ur-account-with-metamask.png)

2.

![](./ss-create-token-confirm.png)

## Buying an nft looks like this

![](./ss-buying-nft-looks-like.png)

and on completion we get

![](./ss-confirm-transaction.png)

## Successful transaction address

![](./ss-how-addresses-linked-on-successful-transaction.png)

## What is mumbai-testnet

![](./ss-what-is-mumbai-testnet.png)

## We cannot delete accounts created (but imported ones can deleted) on metamask and it'll be there foreever

Source: Deleteing imported accounts in metamask (Official Docs): [Click here](https://metamask.zendesk.com/hc/en-us/articles/360057435092-How-to-remove-an-account-from-your-MetaMask-wallet)

![](./ss-we-can-not-delete-created-accounts-in-metamask.png)

## More on theory part

- ![](./ss-1-urxo.png)
- ![](./ss-operations-on-blockchain.png)
- ![](./ss-external-and-contract-accounts.png)
- ![](./ss-incentive-model.png)
- ![](./ss-transaction-integrity-blockchain.png)
- ![](./ss-fallbak-fn-takes-money-into-smart-contract.png)
- ![](./ss-deployment-of-smart-contract.png)
- ![](./ss-what-is-metamask.png)
- ![](./ss-what-is-remix.png)
- ![](./ss-enable-test-networks-in-metamast.png)

**Modifier are used to check user input conditions. Events are used to trigger some outside applications. Event tells the client side applications that some change has been done.**

**Smart contracts need an address to deploy and invoke its functions.**
