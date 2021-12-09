import React from "react";
import MarketApi from "../client/MarketApi";

import NFTItemsList from "./NFTItemsList";

class MyNFTItemsList extends React.Component {
    marketApi = new MarketApi();

    state = {
        loading: false,
        items: [],
        error: ""
    };

    componentDidMount() {
        this.loadNFTS();
    }

    loadNFTS = () => {
        if(this.state.loading)
            return;
        this.setState({loading: true});
        this.marketApi.getOnSaleItems(null, 0, 20)
            .then( ( result ) => this.setState({items: this.state.items.concat(result)}))
            .catch( ( error ) => this.setState({error: error}))
            .finally( () => this.setState({loading: false}));
    }

    reload = () => {
        if(!this.state.loading && this.state.items.length == 0)
            this.loadNFTS();
    }

    render() {
        return (
            <NFTItemsList
                onClick={this.reload}
                className={this.props.className}
                style={this.props.style}
                loading={this.state.loading}
                emptyMessage={this.state.error == ""? "You don't have any items." : ""}
                items={this.state.items} />
        );
    }
};

export default MyNFTItemsList;