import React from "react";

import Page from '../components/Page'
import Button from '../components/Button'
import MyNFTItemsList from '../components/MyNFTItemsList';

import AddTokenModule from "./AddToken.module";
import MarketApi from "../client/MarketApi";

class MyMarketPage extends React.Component {
    marketApi = new MarketApi();

    state = {
        addTokenMode: false,
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
                    <h3 className="col-12">Welcome {this.marketApi.address}</h3>
                    <h5 className="col-auto title">My Items</h5>
                    <Button
                        onClick={this.toggleAddTokenMode}
                        style={{marginLeft: 'auto', marginRight: '0.5rem'}}
                        className="col-auto">
                        Create Token
                    </Button>
                    <MyNFTItemsList
                        className="col-12 my-nft-list" />
                </div>
            </Page> 
        );
    }
};

export default MyMarketPage;