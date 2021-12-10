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

    buyToken = (nft) => {
        return new Promise( async ( resolve, reject ) => {
            const web3Modal = new Web3Modal()
            const connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(connection)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        
            const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
            const transaction = await contract.createMarketSale(nft.tokenId, {value: price});
            await transaction.wait();
            resolve();
        });
    }

    getData = () => {
        return new Promise( async (resolve, reject ) => {
            if(this.address == null)    {
                reject();
                return;
            }
            const response = await fetch('https://api.covalenthq.com/v1/9000/address/' + this.address + '/balances_v2/?&key=ckey_400f3d24d7c14075aace3b82704%20&nft=true');
            const myJson = await response.json(); 
            resolve(myJson.data);
        });
    }


    getMyNFTs = () => {
        return new Promise( async (resolve, reject ) => {
            if(this.address == null)    {
                reject();
                return;
            }
            const response = await fetch('https://api.covalenthq.com/v1/9000/address/' + this.address + '/balances_v2/?&key=ckey_400f3d24d7c14075aace3b82704%20&nft=true');
            const myJson = await response.json(); 
    
            let nfts = [];
            myJson.data.items.forEach(i => {
                if(i.nft_data != null) {
                    i.nft_data.forEach(j => {
                        let item = {
                            price: 0, 
                            tokenId: j.tokenId,
                            seller: null,
                            url: j.tokenUri,
                            image: j.external_data.image_1024,
                            name:   j.external_data.name,
                            description: j.external_data.description,
                        }
    
                        nfts.push(item);
                    });

                    
                }
            });
    
            resolve(nfts);
        });
        
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

            // console.log(this.provider);

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
                url: tokenUri,
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
            
            if(this.address == null) {
                reject();
                return;
            }
            const data = await this.marketContract.GetUserOnSaleItems(page, limit, 0, this.address);
            // console.log(data);

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