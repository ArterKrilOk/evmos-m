import ProgressBar from "progress";
import React from "react";
import styles from "../styles/NFTItem.module.css"
import ImageLoader from '../components/ImageLoader'
import Center from '../components/Center'
import { Link } from "react-router-dom";


class NFTItem extends React.Component {
    

    componentDidMount() {

    }

    getCorrectPrice() {
        // if(this.props.nft.price > 1000000)
        //     return Number((this.props.nft.price / 1000000).toFixed(1)).toLocaleString() + 'M';
        // if(this.props.nft.price > 1000)
        //     return Number((this.props.nft.price / 1000).toFixed(1)).toLocaleString() + 'k';
        return this.props.nft.price;
    }

    render() {
        return (
            
            <div className={`col-sm-12 col-md-4 col-xl-3 ${styles.nftItemContainer}`} style={this.props.style}>
                {/* <Link to={{
                    pathname: '/token/'+ this.props.nft.tokenId,
                    state: { nft: this.props.nft }
                    }}> */}
                    <div className={`card ${styles.nftItem}`} onClick={this.props.onClick}>
                        <div className={`card-img-top ${styles.centerCropped}`} style={{backgroundImage: 'url(' + this.props.nft.image + ')'}}>
                        </div>


                        {/* <ImageLoader
                            className={`card-img-top ${styles.nftItemImg}`}
                            src={'https://evmos.pixelsg.space/images/?thumb=1&url=' + this.props.nft.image}>
                                <Center style={{height: '20em'}}>
                                    Image load failed!
                                </Center>
                        </ImageLoader> */}
                        <div class="card-img-overlay" style={{padding: '0'}}>
                            <div style={{height: '9em'}}></div>
                            <h5 class={styles.nftTitle}>{this.props.nft.name}</h5>
                            {/* <div>{this.getCorrectPrice()} PHOTON</div> */}
                        </div>

                        {/* <div className="card-body">
                            <h5 className="card-title">{this.props.nft.name}</h5> */}
                            {/* <p className="card-text" style={{marginLeft: '1em'}}>{this.props.nft.description}</p> */}
                            
                        {/* </div> */}
                    </div>
                {/* </Link> */}
            </div>
            
        );
    }
};

export default NFTItem;