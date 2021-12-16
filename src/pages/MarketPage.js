import React from "react";

import Page from "../components/Page";
import NFTItemsList from "../components/NFTItemsList";

import MarketApi from "../client/MarketApi";


class MarketPage extends React.Component {
    constructor(props) {
        super(props);
      }

    marketApi = new MarketApi();

    state = {
        loading: false,
        page: 0,
        items: []
    }

    componentDidMount() {
        this.loadMarketItems();
    }

    componentWillMount(){
        window.addEventListener('scroll', this.loadMore);
    }
      
    componentWillUnmount(){
        window.removeEventListener('scroll', this.loadMore);
    }

    loadMarketItems = () => {
        if(this.state.loading)
            return;

        this.setState({loading: true});

        this.marketApi.getMarketItems("", this.state.page, 20)
            .then( ( result ) => {
                this.setState({items: this.state.items.concat(result)});
            })
            .catch( ( error ) => {
                
            })
            .finally( () => {
                this.setState({loading: false, page: this.state.page + 1});
                
            });
    }

    loadMore = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
            this.loadMarketItems();
        }
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