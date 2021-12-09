import React from "react";
import Button from './Button'
import MarketApi from "../client/MarketApi";

class MetamaskBtn extends React.Component {
    marketApi = new MarketApi();

    state = {
        walletConnected: false,
        connectingToWalet: false,
        address: null
    }

    getFormatedAdress() {
        let address = this.state.address.substr(2, 4);
        address += "...";
        address += this.state.address.substr(-4);
        return '0x' + address.toUpperCase();
    }

    componentDidMount() {
        this.connectToWallet();
    }   

    connectToWallet() {
        if(this.state.walletConnected || this.state.connectingToWalet)
            return;
        this.setState({connectingToWalet: true, walletConnected: false});

        this.marketApi.connectToWallet()
            .then( (address) => this.walletConnected(address))
            .catch( (error) => this.walletDisconnected());
    }

    walletConnected(address) {
        this.setState({
            connectingToWalet: false,
            address: address,
            walletConnected: true
        });
        if(this.props.onConnect != null)
            this.props.onConnect(address);
    }

    walletDisconnected() {
        this.setState({
            connectingToWalet: false, 
            walletConnected: false,
            address: null
        });
        if(this.props.onDisconnect != null)
            this.props.onDisconnect();
    }

    render() {
        return (
            <Button
                style={this.props.style}
                onClick={() => this.connectToWallet()}>
                    <img src="https://docs.metamask.io/metamask-fox.svg" height="25" style={{marginRight: '0.5em'}}/>
                    {this.state.walletConnected? this.getFormatedAdress() : "Connect Metamask"}
            </Button>
        );
    }
}

export default MetamaskBtn;