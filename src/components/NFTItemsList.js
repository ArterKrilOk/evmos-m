import React from "react";

import NFTItem from "./NFTItem";
import ProgressBar from "./Progress";
import Center from "./Center";
import MarketApi from "../client/MarketApi";


class NFTItemsList extends React.Component {
    constructor(props) {
        super(props);
      }

    marketApi = new MarketApi();

    buyToken = (nft) => {
        // console.log(nft);
        // this.marketApi.buyToken(nft)
        //     .then(() => {
        //         console.log("Success");
        //     });
    }

    render() {
        if(this.props.loading && (typeof this.props.items == 'undefined' || this.props.items.length == 0))
            return (
                <div style={this.props.style} className={this.props.className}>
                    <Center>
                        <ProgressBar />
                    </Center>
                </div>
            );
        if(typeof this.props.items !== 'undefined' && this.props.items.length > 0) 
            return (
                <div style={this.props.style} className={this.props.className}>
                    <div className="row" >
                        {this.props.items.map((item, i) => 
                            <NFTItem
                                clickable={this.props.clickable}
                                onClick={this.props.clickable? () => this.buyToken(item) : () => {}}
                                key={i}
                                nft={item} />
                        )}
                    </div>
                </div>
            );
        return (
            <div style={this.props.style} className={this.props.className} onClick={this.props.onClick}>
                <Center>
                    <h6 className="title">
                        {this.props.emptyMessage != null? this.props.emptyMessage : "This list is empty"}
                    </h6>
                </Center>
            </div>
        );
    }
};

export default NFTItemsList;