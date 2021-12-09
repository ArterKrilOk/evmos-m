import React from "react";

import Page from "../components/Page";
import NFTItemsList from "../components/NFTItemsList";

import MarketApi from "../client/MarketApi";


class MarketPage extends React.Component {
    marketApi = new MarketApi();

    state = {
        loading: false,
        items: []
    }

    componentDidMount() {
        this.loadMarketItems();
    }

    loadMarketItems = () => {
        if(this.state.loading)
            return;

        this.setState({loading: true});
        this.marketApi.getMarketItems("", 0, 10)
            .then( ( result ) => {
                this.setState({items: this.state.items.concat(result)});
            })
            .catch( ( error ) => {
                
            })
            .finally( () => {
                this.setState({loading: false});
            });
    }

    

    render() {
        return (
            <Page>
                <NFTItemsList
                    style={{height: '100%'}}
                    staggered={true}
                    clickable={true}
                    loading={this.state.loading}
                    items={this.state.items} />
            </Page>
        );
    }
};

export default MarketPage;