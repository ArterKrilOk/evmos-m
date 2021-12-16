import React from "react";
import Center from "../components/Center";
import ProgressBar from "../components/Progress";
import Page from '../components/Page'
import { Link } from "react-router-dom";
import Button from '../components/Button'

import roadmap from './roadmap.png'; // with import

class HomePage extends React.Component {
    constructor(props) {
        super(props);
      }

    render() {
        return (
            <Page>
                <div className="row" style={{marginTop: '5em'}}>
                    <div className="col-sm-12 col-md-6">
                        <h4><b>Explore, create and sell awesome NFTs</b></h4>
                        <p>Evmos Market is the most decentralized and secure NFT marketplace in the world</p>
                        <Link to='/market'><Button style={{width: '10em', marginRight: '2em'}}>Explore</Button></Link>
                        <Link to='/market'><Button style={{width: '10em'}}>Create</Button></Link>
                    </div>
                    <div className="col-sm-12 col-md-6">
                    </div>
                </div>

                <div className="row"  style={{marginTop: '5em'}}>
                    <img src={roadmap} />
                </div>
            </Page>
        );
    }
};

export default HomePage;