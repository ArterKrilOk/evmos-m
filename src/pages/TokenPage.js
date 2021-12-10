import React from "react";
import Center from "../components/Center";
import ProgressBar from "../components/Progress";
import Page from '../components/Page'

class TokenPage extends React.Component {
    state = {
        nft: null
    }

    render() {
        console.log(this.props);

        if(this.state.nft == null) 
            return (
                <Page>
                    <Center>
                        <ProgressBar />
                    </Center>
                </Page>
            );
        return (
                <Page>
                    <Center>
                        {this.state.nft.name}
                    </Center>
                </Page>
        );
    }
};

export default TokenPage;