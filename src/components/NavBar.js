import React from "react";
import Button from './Button'
import {isMobile} from 'react-device-detect';

import { NavLink } from "react-router-dom";
import MetamaskBtn from "./MetamaskBtn";

class NavBar extends React.Component {
    state = {
        expand: false,
        walletConnected: false,
    };

    expandMenu = () => {
        this.setState({expand: !this.state.expand});
    }

    onConnect = (addr) => {
        this.setState({walletConnected: true});
    }

    onDisconnect = () => {
        this.setState({walletConnected: false});
    }


    render() {
        if(isMobile) {
            return (
                <nav className="navbar navbar-expand-lg navbar-light custom-nav" style={{padding: "0.75rem"}}>
                    <div style={{display: 'flex', width: '100%'}}>
                        <a className="navbar-brand" href="#">EVMOS Market</a>
                        <Button
                            style={{marginLeft: 'auto'}}
                            onClick={this.expandMenu}>
                            <span className="navbar-toggler-icon"></span>
                        </Button>
                    </div>
                    {this.state.expand?
                        <div className="navbar-nav" style={{display: 'flex', alignItems: 'center', width: '100%', flexDirection: 'inline'}}>
                            {this.props.tabs.map((item, i) => {
                                    if(!this.state.walletConnected && i == 2)
                                        return;
                                    return (
                                        <NavLink 
                                            to={this.props.links[i]}
                                            className={`nav-item nav-link ${this.state.currentTab == i? "active" : ""}`}
                                            key={i}>
                                            { item } 
                                        </NavLink>
                                    );
                                }
                            )}    
                            <MetamaskBtn
                                onConnect={this.onConnect}
                                onDisconnect={this.onDisconnect}
                                style={{marginLeft: 'auto', width: '15em'}} />
                        </div> : <></>
                    }
                </nav>
            );
        }

        return(
            <nav className="navbar navbar-expand-lg navbar-light custom-nav" style={{padding: "0.75rem"}}>
                <a className="navbar-brand" href="#">EVMOS Market</a>
                <button className="navbar-toggler" onClick={this.expandMenu}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="navbar-nav">
                        {this.props.tabs.map((item, i) => {
                                if(!this.state.walletConnected && i == 2)
                                    return;
                                return (
                                    <NavLink 
                                        to={this.props.links[i]}
                                        className={`nav-item nav-link ${this.state.currentTab == i? "active" : ""}`}
                                        key={i}>
                                        { item } 
                                    </NavLink>
                                );
                            }
                        )}    
                    </div>

                    <MetamaskBtn
                        onConnect={this.onConnect}
                        onDisconnect={this.onDisconnect}
                        style={{marginLeft: 'auto', width: '15em'}} />
                </div>
            </nav>
        );
    }
};

export default NavBar; 