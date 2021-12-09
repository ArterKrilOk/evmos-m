import axios from 'axios'
import Web3Modal from "web3modal"
import { ethers } from 'ethers'

import {
  nftaddress, nftmarketaddress
} from './config'

import NFT from './NFT.json'
import Market from './NFTMarket.json'


class MarketApi {
    constructor() {
        if (!!MarketApi.instance) {
            return MarketApi.instance;
        }

        MarketApi.instance = this;

        this.provider = new ethers.providers.JsonRpcProvider("https://evmos-evm-rpc.tk");
        this.tokenContract = new ethers.Contract(nftaddress, NFT.abi, this.provider);
        this.marketContract = new ethers.Contract(nftmarketaddress, Market.abi, this.provider);
        this.address = null;

        return this;
    }

    connectToWallet = () => {
        return new Promise( async ( resolve, reject ) => {
            const web3Modal = new Web3Modal({
                network: "mainnet",
                cacheProvider: true,
            })
            const connection = await web3Modal.connect();
            this.provider = new ethers.providers.Web3Provider(connection)
            const signer = this.provider.getSigner();

            if(connection != null) {
                this.marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
                this.tokenContract = new ethers.Contract(nftaddress, NFT.abi, this.provider)
                this.address = connection.selectedAddress;
                resolve(connection.selectedAddress);
            } else 
                reject();
    
            connection.on("disconnect", (error) => {
                reject(error);
            });
        });
    }

    fetchItems = async (data) => {
        return await Promise.all(data.map(async i => {
            const tokenUri = await this.tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price, 
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item;
        }));
    }

    
    getOnSaleItems = (query, page, limit) => { 
        return new Promise( async (resolve, reject) => {
            // const web3Modal = new Web3Modal({
            //     network: "mainnet",
            //     cacheProvider: true,
            // })
            // const connection = await web3Modal.connect()
            // const provider1 = new ethers.providers.Web3Provider(connection)
            // const signer = provider1.getSigner()
        
            // const marketContract1 = new ethers.Contract(nftmarketaddress, Market.abi, signer)
            // const tokenContract1 = new ethers.Contract(nftaddress, NFT.abi, provider1)
            const data = await this.marketContract.GetOnSaleItems(page, limit, 0);
            console.log(data);

            resolve(this.fetchItems(data));
        });
    }

    getMarketItems = (query, page, limit) => { 
        return new Promise( async (resolve, reject) => {
            const data = await this.marketContract.GetMarketItems("", page, limit, 0);
            //console.log(data);
            resolve(this.fetchItems(data));
        });
    }
};

export default MarketApi;