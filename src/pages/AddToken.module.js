import React from "react";

// Component imports
import Center from "../components/Center";
import Input from '../components/Input';
import TextArea from '../components/TextArea'
import Button from '../components/Button'
import ProgressBar from "../components/Progress";
import ImageLoader from "../components/ImageLoader";

//Blockchain imports
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'

import {
  nftaddress, nftmarketaddress
} from '../client/config'

import NFT from '../client/NFT.json'
import Market from '../client/NFTMarket.json'
import NFTItem from "../components/NFTItem";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


class AddTokenModule extends React.Component {
    constructor(props) {
        super(props);
      }

    minPrice = 0.000001;

    state = {
        position: 1,
        positions: 4,

        assetName: "",
        assetDescr: "",
        assetPrice: 0,
        assetFile: "",

        fileUploadProgress: 0,
        fileUploading: false,
        messages: [],
        canClose: false,
    }

    addMessage = (message) => {
        this.setState({messages: this.state.messages.concat([message])})
    }

    uploadFile = async e => {
        const file = e.target.files[0];
        this.setState({fileUploading: true});
        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => this.setState({fileUploadProgress: (prog / file.size * 100)})
                }
            );
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            this.setState({assetFile: url, fileUploading: false});
        } catch (error) {
            console.log('Error uploading file: ', error);
        }  
    }

    createMarket = async () => {
        this.setState({position: this.state.positions});

        if (!this.state.assetName || !this.state.assetDescr || !this.state.assetPrice || !this.state.assetFile) 
            return;

        this.addMessage("Creating correct data");
        const data = JSON.stringify({
            name: this.state.assetName,
            description: this.state.assetDescr, 
            image: this.state.assetFile
        });

        console.log(data);

        this.addMessage("Uploading data to IPFS");
        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
            console.log(added.path);
            this.createSale(url);
        } catch (error) {
            this.addMessage("Error uploading data: " + data);
            console.log('Error uploading file: ', error);
            this.setState({canClose: true});
        }  
      }
    
    createSale = async (url) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
    
        this.addMessage("Creating tokens");
        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);

        this.addMessage("Creating first transaction");
        let transaction = await contract.createToken(url);

        this.addMessage("Waiting for confirmation");
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();
        const price = ethers.utils.parseUnits(this.state.assetPrice, 'ether');
    
        this.addMessage("Getting item price");
        contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();
        
        this.addMessage("Creating second transaction");
        transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice });

        this.addMessage("Waiting for confirmation");
        await transaction.wait();

        this.addMessage("Success");
        this.setState({canClose: true});
    }

    nextState = () => {
        if(this.state.position == 1 && this.state.assetFile == "")
            return;
        if(this.state.position == 2 && (this.state.assetName == "" || this.state.assetDescr == "" || this.state.assetPrice == 0))
            return;
        if(this.state.fileUploading)
            return;
        if(this.state.position < this.state.positions)
            this.setState({position: this.state.position + 1});
    }

    prevState = () => {
        if(this.state.position > 1)
            this.setState({position: this.state.position - 1});
    }
    
    getAddingState(s) {
        if(s == 1) {
            return (
                <div className="col" style={{minHeight: '25rem'}}>
                    <h5 className="title" style={{marginBottom: '2rem'}}>Please uload the image</h5>
                    <div className="dad-zone" style={this.state.assetFile != ""? {textAlign: 'center'} : {}}>
                        {this.state.assetFile == ""?
                            this.state.fileUploadProgress <= 0?
                                <input
                                    type="file"
                                    name="Asset"
                                    className=""
                                    onChange={this.uploadFile} /> 
                                : 
                                <Center>
                                    <ProgressBar
                                        progress={true}
                                        value={this.state.fileUploadProgress} />
                                </Center>
                            :
                            <ImageLoader
                                style={{height: '100%'}}
                                src={this.state.assetFile}>
                                    <Center style={{height: '12rem'}}>
                                        Image load failed!
                                    </Center>
                            </ImageLoader>
                        }
                    </div> 
                </div>
            );
        }
        if(s == 2) {
            return (
                <div className="col" style={{minHeight: '25rem'}}>
                    <h5 className="title" style={{marginBottom: '2rem'}}>Please enter the required information</h5>
                    <Input
                        type="text"
                        style={{width: '100%'}}
                        value={this.state.assetName}
                        onChange={event => this.setState({assetName: event.target.value})}
                        placeholder="Asset Name" />
                    <TextArea
                        style={{width: '100%', marginTop: '1rem'}}
                        rows="5"
                        value={this.state.assetDescr}
                        onChange={event => this.setState({assetDescr: event.target.value})}
                        placeholder="Asset Description" />
                    <Input
                        type="number"
                        step={this.minPrice}
                        min={this.minPrice}
                        value={this.state.assetPrice}
                        onChange={event => this.setState({assetPrice: event.target.value})}
                        style={{width: '100%', marginTop: '1rem'}}
                        placeholder="Initial price in PHOTON" />
                </div>
            );
        }
        if(s == 3) {
            return (
                <div className="col" style={{minHeight: '25rem'}}>
                    <h5 className="title" style={{marginBottom: '2rem'}}>Please check all parameters</h5>
                    {/* <div style={{width: '100%', height: '10rem', alignItems: 'center'}} >
                        <img src={this.state.assetFile} style={{height: '100%'}} />
                    </div>
                    <p>Asset name: {this.state.assetName}</p>
                    <p>Asset description: {this.state.assetDescr}</p>
                    <p>Price: {this.state.assetPrice} PHOTON</p> */}

                    <Center horizontal={true}>
                        <NFTItem
                            style={{width: '60%'}}
                            nft={{
                                name: this.state.assetName,
                                description: this.state.assetDescr,
                                price: this.state.assetPrice,
                                image: this.state.assetFile
                            }}
                            />
                    </Center>
                </div>
            );
        }
        if(s == 4) {
            return (
                <div className="col" style={{minHeight: '25rem', display: 'grid'}}>
                    <div style={{color: '#CBCBCB', gridRow: 1, gridColumn: 1, overflow: 'hidden'}}>
                        {this.state.messages.map((item, i) => 
                            <p key={i}>{item}</p>
                        )}
                    </div>
                    <Center style={{gridRow: 1, gridColumn: 1}}>
                        {this.state.canClose? 
                            <Button
                                onClick={this.props.onClose} >
                                Close
                            </Button> :
                            <ProgressBar />
                        }
                    </Center>
                </div>
            );
        }
    }

    render() {
        return (
            <Center>
                <div className="row col" style={{maxWidth: '40rem', maxHeight: '30rem', minHeight: '30rem'}}>
                    {this.getAddingState(this.state.position)}
                    <div className="col-12">
                        <div className="row">
                            {this.state.position < this.state.positions?
                                <>
                                    <Button
                                        onClick={this.state.position <= 1? this.props.onClose : this.prevState}
                                        className="col-auto">
                                        {this.state.position <= 1? "Close" : "Prev"}
                                    </Button>
                                    <Button
                                        onClick={this.state.position == this.state.positions-1? this.createMarket : this.nextState}
                                        style={{marginLeft: 'auto'}}
                                        className="col-auto">
                                        {this.state.position == this.state.positions-1? "Create" : "Next"}
                                    </Button>
                                </> : ""
                            }
                        </div>
                    </div>
                </div>
            </Center>
        );
    }
}

export default AddTokenModule;