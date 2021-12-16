import React from "react";
import Center from "../components/Center";
import ProgressBar from "../components/Progress";
import Page from '../components/Page'
import MarketApi from "../client/MarketApi";
import styles from "../styles/TokenPage.module.css"
import Button from "../components/Button";
import Expandable from "../components/Expandable";
import { Link } from "react-router-dom";
import {isMobile} from 'react-device-detect';
import NFTItem from "../components/NFTItem";




class TokenPage extends React.Component {
    constructor(props) {
        super(props);
    }

    marketApi = new MarketApi();

    state = {
        nft: null,
        itemId: null,
        loading: false,
        error: null,
        moreItemsLoading: false,
        moreItems: null,
        gLoading: false,
        gText: null
    }

    getFormatedAdress(address, small = false) {
        if(address == null)
            return;
        if(!small)
            return '0x' + address.substr(2).toUpperCase();
        let add = address.substr(2, 4);
        add += "...";
        add += address.substr(-4);
        return '0x' + add.toUpperCase();
        
    }

    componentDidMount() {
        this.state.itemId = parseInt(window.location.pathname.split('/')[2]);
        this.loadItem();
    }

    loadItem = () => {
        if(this.state.itemId == null || this.state.loading) 
            return;

        this.setState({loading: true});
        this.marketApi.getMarketItem(this.state.itemId)
            .then((data) => {
                this.setState({nft: data});
                // this.loadMoreItems(this.state.nft.seller);
            })
            .catch((error) => {
                this.setState({error: error});
            })
            .finally(() => {
                this.setState({loading: false});
            });
    }

    loadMoreItems = (address) => {
        if(this.state.moreItemsLoading || address == null)
            return
        
        this.state.moreItemsLoading = true;
        
        console.log(this.marketApi.address);
        console.log(address);

        this.marketApi.getOnSaleItems(this.marketApi.address, null, 0, 50)
            .then((data) => {
                this.setState({moreItems: data});
            })
            .finally(() => {
                this.state.moreItemsLoading = false;
            });
    }

    closeOverflow() {
        setTimeout(() => this.setState({gLoading: false, gText: null}), 2500);
    }

    buyToken = () => {
        if(this.state.gLoading)
            return;
        this.setState({gLoading: true});
        this.marketApi.buyToken(this.state.nft)
            .then(() => {
                console.log("Success");
                this.setState({gText: "Success"});
                this.closeOverflow()
            }, (err) => {
                console.log("Failed", err);
                this.setState({gText: "Failed"});
                this.closeOverflow()
            })
            .catch(err => {
                console.log(err);
                this.setState({gText: "Failed"});
                this.closeOverflow()
            });
    }

    getCorrectPrice() {
        // if(this.props.nft.price > 1000000)
        //     return Number((this.props.nft.price / 1000000).toFixed(1)).toLocaleString() + 'M';
        // if(this.props.nft.price > 1000)
        //     return Number((this.props.nft.price / 1000).toFixed(1)).toLocaleString() + 'k';
        return this.state.nft.price + ' PHOTON';
    }

    moreItems() {
        return (
                <div className="row">
                    {this.state.moreItems.map((item, i) => 
                        <NFTItem
                            clickable={true}
                            key={i}
                            nft={item} />
                    )}
                </div>
        );
    }

    globalLoading = () => {
        return (
            <div style={{position:'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(224,224,224,0.75)'}}>
                <Center>
                    {this.state.gText == null? <ProgressBar /> : <h2>{this.state.gText}</h2>}
                </Center>
            </div>
        );
    }

    render() {
        if(!this.state.loading && this.state.error != null) 
            return (
                <Page>
                    <Center>
                        {this.state.error}
                    </Center>
                </Page>
            );

        if(this.state.loading || this.state.nft == null) 
            return (
                <Page>
                    <Center>
                        <ProgressBar />
                    </Center>
                </Page>
            );
            
            
        if(isMobile)
            return (
                <Page>
                    {this.state.gLoading? this.globalLoading() : ""}
                    <div className="row">
                        <div className="col-sm-12">
                            <Center horizontal={true}>
                                <img src={this.state.nft.image} className={styles.tokenImage}/>
                            </Center>
                        </div>  
                        <div className="col-sm-12" style={{marginTop: '2em'}}>
                            <Center horizontal={true}>
                                <h3 style={{marginBottom: '1em'}}>{this.state.nft.name}</h3>
                            </Center>
                            <p>{this.state.nft.description}</p>
                            by {this.getFormatedAdress(this.state.nft.seller, true)}
                            {/* <Link
                                className={styles.sellerAddress}
                                to={'/seller/' + this.getFormatedAdress(this.state.nft.seller)}> */}
                            {/* </Link> */}

                            <div className={styles.section}>
                                <h5>Current Price</h5>
                                <p className={styles.price}>
                                    {this.getCorrectPrice()}
                                    <em className={styles.dollarPrice}> ( {this.marketApi.getEquivalentPrice(this.state.nft.price)} )
                                    </em>
                                </p>
                                <Button className={styles.buyBtn} style={{width: '100%'}} onClick={this.buyToken}>
                                    Buy 
                                </Button>
                            </div>
                            <Expandable 
                                className={styles.section}
                                closedClassName={styles.closedSection}
                                closed={() => <h5>Full Information <em className={styles.subText}>click to expand</em></h5>}>
                                <h5>Full Information</h5>
                                Item ID: {this.state.nft.itemId}<br></br>
                                Token ID: {this.state.nft.tokenId}<br></br>
                                Name: {this.state.nft.name}<br></br>
                                Price: {this.getCorrectPrice()}<br></br>
                                Seller: {this.getFormatedAdress(this.state.nft.seller, true)}<br></br> 
                                Image: <a target="_blank" rel="noopener noreferrer" href={this.state.nft.image}>Full Image Link</a><br></br> 
                                URL: <a target="_blank" rel="noopener noreferrer" href={this.state.nft.url}>Full NFT Url</a><br></br> 
                            </Expandable>
                        </div>
                        
                        
                    </div>
                </Page>
            );
        
        return (
                <Page>
                    {this.state.gLoading? this.globalLoading() : ""}
                    <div className="row">
                        <div className="col-md-5">
                            <Center horizontal={true}>
                                <img src={this.state.nft.image} className={styles.tokenImage}/>
                            </Center>
                        </div>  
                        <div className="col-md-7">
                            <h3 style={{marginBottom: '1em'}}>{this.state.nft.name}</h3>
                            <p>{this.state.nft.description}</p>
                            by {this.getFormatedAdress(this.state.nft.seller)}
                                {/* <Link
                                    className={styles.sellerAddress}
                                    to={'/seller/' + this.state.nft.seller}> */}     
                                {/* </Link> */}

                            <div className={styles.section}>
                                <h5>Current Price</h5>
                                <p className={styles.price}>
                                    {this.getCorrectPrice()}
                                    <em className={styles.subText}> ( {this.marketApi.getEquivalentPrice(this.state.nft.price)} )
                                    </em>
                                </p>
                                <Button className={styles.buyBtn} onClick={this.buyToken}>
                                    Buy
                                </Button>
                                <Button disabled={true} className={styles.bofferBtn}>
                                    Offer 
                                </Button>
                            </div>

                            <Expandable 
                                className={styles.section}
                                closedClassName={styles.closedSection}
                                closed={() => <h5>Full Information <em className={styles.subText}>click to expand</em></h5>}>
                                <h5>Full Information</h5>
                                Item ID: {this.state.nft.itemId}<br></br>
                                Token ID: {this.state.nft.tokenId}<br></br>
                                Name: {this.state.nft.name}<br></br>
                                Price: {this.getCorrectPrice()}<br></br>
                                Seller: {this.getFormatedAdress(this.state.nft.seller)}<br></br> 
                                Image: <a target="_blank" rel="noopener noreferrer" href={this.state.nft.image}>{this.state.nft.image}</a><br></br> 
                                URL: <a target="_blank" rel="noopener noreferrer" href={this.state.nft.url}>{this.state.nft.url}</a><br></br> 
                            </Expandable>
                        </div>
                    </div>
                    {this.state.moreItems != null? this.moreItems() : ""}
                </Page>
            );
    }
};

export default TokenPage;