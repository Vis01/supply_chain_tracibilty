//import Portis from '@portis/web3';
import detectEthereumProvider from '@metamask/detect-provider';
//import Web3 from 'web3';
import Abi from './abi'
import keccak256 from 'keccak256'
import $ from 'jquery';
//import { response } from '../../../server/app';

import buy from './Buy.json';
import cont from './Counterfeit.json';

var contract = require("@truffle/contract");
const Web3 = require('web3');
const web3 = new Web3();

// private ganache node...
const myPrivateEthereumNode = {
    nodeUrl: 'HTTP://127.0.0.1:7545', // node url
    chainId: 5777, // chainid
};


const provider = {
    contractAddress: '0x5ECfD36111ABa7d2C87D57F7dB78F45583c01c5e',
    buyAddress: '0xEae376FaD0fbC85e3Dfd773f321DEbf8b69818e4',
    w3: null,
    account: null,




    contract: null,
    buyContract: null,
    metamask: null,
    logout: async function () {
        await this.metamask.logout()
    },
    keccakHash: function (secretId) {
        const encoding = web3.eth.abi.encodeParameter('uint256', secretId)
        const hash = keccak256(encoding)
        return hash
    },
    login: async function () {
        const ethereum = window.ethereum;
        await detectEthereumProvider();
        ethereum.request({ method: 'eth_requestAccounts' })
            .then(handleAccountsChanged)
            .catch((err) => {
                // Some unexpected error.
                // For backwards compatibility reasons, if no accounts are available,
                // eth_accounts will return an empty array.
                console.error(err);
            });
        /*await this.metamask.showPortis()
        await provider.setAccount()*/
    },
    isLoggedIn: async function () {
        //return await this.portis.isLoggedIn()
        return window.ethereum.isConnected();
    },
    setAccount: async function () {
        /*const account = await this.w3.eth.getAccounts()
        this.account = account[0]
        console.log(account);*/
        const ethereum = window.ethereum;
        let accounts = ethereum.request({ method: 'eth_accounts' });
        var ac = null;
        await accounts.then(function (result) {
            console.log(`accounts list: ${result}`);
            ac = result[0];
            console.log(`account: ${ac}`);
        });
        this.account = ac;
        console.log(`this.account set to ${this.account}`)
        /*.then(handleAccountsChanged)
        .catch((err) => {
            // Some unexpected error.
            // For backwards compatibility reasons, if no accounts are available,
            // eth_accounts will return an empty array.
            console.error(err);
          });*/
    },

    getAccount: function () {
        return this.account
    },

    getProvider: function () {
        return this.w3;
    },

    setProvider: async function () {
        /*this.portis = await new Portis('ddc80351-3048-4f28-b726-a90dd111adf2', myPrivateEthereumNode);*/
        //await detectEthereumProvider();
        this.w3 = new web3.providers.HttpProvider("http://localhost:7545");
    },

    setContract: async function () {
        /*const contract = await new this.w3.eth.Contract(Abi.counterfeitAbi, this.contractAddress);
        const side = await new this.w3.eth.Contract(Abi.buyAbi, this.buyAddress)*/
        // console.log('oye');
        // console.log(buy);
        // console.log(cont);
        var bContract = contract(buy);
        bContract.setProvider(this.w3);
        this.buyContract = bContract;

        var tContract = contract(cont);
        tContract.setProvider(this.w3);
        this.contract = tContract;
        //this.buyContract.setProvider(this.w3);
        //his.CounterfeitData.setProvider(this.w3);
    },
    // for non-transaction methods ex- view pure
    callTransaction: async function (method, parameters = []) {
        // console.log(`method----------!!!!!!!!!!!!! ${method}`);
        console.log(`method----------!!!!!!!!!!!!! ${method}`);
        try {
            const transactionParams = {
                from: this.account,
                to: this.contractAddress,
            }
            /*const result = await this.contract.methods[method](...parameters).call(transaction);
            return result;*/
            var contractService = this.contract.deployed();
            if (method == 'productSeller') {
                console.log('called');
                return contractService.then(async function (data) {
                    var instance = data;
                    var res = await instance.productSeller(parameters[0], transactionParams);
                    console.log(`result is: ${res}`);
                    return res;
                });
            }
            else {
                return contractService.then(async function (data) {
                    var instance = data;
                    var res = await instance.getAllProducts(transactionParams);
                    console.log(`result is: ${res}`);
                    return res;
                    // const promise1 = new Promise(resolve => {
                    //     // setTimeout(() => {
                    //         resolve({res});
                    //     // }, 100);
                    // });
                    // promise1.then(result => {
                    //     console.log('conss',result);
                    //     return result;
                    // })
                    // return promise1;
                });
            }
        } catch (error) {
            console.log(error);
            throw new Error({ message: error.message, code: 204 });
        }
    },

    // method for transaction that require fee....
    sendTransaction: async function (method, parameters = [], toBuy = false) {
        /*console.log(`account: ${this.account}`);
        console.log(`method ${method}`);
        console.log(`parameters: ${parameters}`);
        console.log(`type toBuy: ${toBuy}`);*/
        //console.log("parameters: ");
        /*for (var i = 0; i < parameters.length; i++) {
            console.log(parameters[i]);
        }*/
        /*
        
        id: 0
        hash: 1
        price: 2
        name:
        
        */
        try {
            console.log(`method called is: ${method}`);
            var _productId = parameters[0];
            var _secretId = parameters[1];
            var _price = parameters[2];
            var _name = parameters[3];
           // console.log(`address is : ${parameters[0]}`);
            if (method == 'transferOwnership') {
                const transactionParams = {
                    from: this.account,
                    to: this.buyAddress,
                    gas: 500000,
                    gasPrice: 0
                }
                var contractService = this.contract.deployed();
                contractService.then(function (data) {
                    var instance = data;
                    return instance.transferOwnership(parameters[0], transactionParams);
                });
            }
            else if (toBuy) {
                
                const transactionParams = {
                    from: this.account,
                    to: this.buyAddress,
                    gas: 500000,
                    gasPrice: 0
                }

                var contractService = this.buyContract.deployed();
                contractService.then(function (data) {
                    var instance = data;
                    return instance.buyProduct(parameters[0], transactionParams);
                });
            }
            else {
                console.log(`buy is false`);
                const transactionParams = {
                    from: this.account,
                    to: this.buyAddress,
                    gas: 500000,
                    gasPrice: 0,
                }
                /*console.log('parameters: ');
                for (var i = 0; i < transactionParams.length; i++) {
                    console.log(transactionParams[i]);
                }*/
                var contractService = this.contract.deployed();
                contractService.then(function (data) {
                    var instance = data;
                    return instance.addProduct(_productId, _secretId, _price, _name, transactionParams);
                });
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message)
        }
    }
}


function handleAccountsChanged(accounts) {
    let currentAccount = this.account;
    if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
        currentAccount = accounts[0];
        // Do any other work!
        this.account = currentAccount;
    }
}
export default provider