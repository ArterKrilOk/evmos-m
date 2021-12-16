import React from "react";

import Page from '../components/Page'
import Button from '../components/Button'
import MyNFTItemsList from '../components/MyNFTItemsList';
import AllMyNFTItemsList from '../components/AllMyNFTItemsList';

import AddTokenModule from "./AddToken.module";
import MarketApi from "../client/MarketApi";

class MyMarketPage extends React.Component {
    constructor(props) {
        super(props);
      }

    marketApi = new MarketApi();

    state = {
        addTokenMode: false,
    }

    componentDidMount() {

    }

    getFormatedAdress() {
        if(this.marketApi.address == null)
        return;
        return '0x' + this.marketApi.address.substr(2).toUpperCase();
    }


    toggleAddTokenMode = () => {
        this.setState({addTokenMode: !this.state.addTokenMode});
    }

    render() {
        if(this.state.addTokenMode) {
            return (
                <Page>
                    <AddTokenModule
                        onClose={this.toggleAddTokenMode} />
                </Page>
            );
        }

        return (
            <Page>
                <div className="row">
                    <h4 className="col-auto title">On Sale</h4>
                    <Button
                        onClick={this.toggleAddTokenMode}
                        style={{marginLeft: 'auto', marginRight: '0.5rem'}}
                        className="col-auto">
                        Create Token
                    </Button>
                    <MyNFTItemsList
                        className="col-12 my-nft-list" />
                </div>

                <div className="row" style={{marginTop: '3em'}}>
                    <h4 className="col-12 title">My NFTs</h4>
                    <AllMyNFTItemsList
                        className="col-12 my-nft-list" />
                </div>
            </Page> 
        );
    }
};

export default MyMarketPage;