import React from 'react';
import PropTypes from 'prop-types';
import Center from './Center';

const Status = {
  PENDING: 'pending',
  LOADING: 'loading',
  LOADED: 'loaded',
  FAILED: 'failed',
};


export default class ImageLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {status: props.src ? Status.LOADING : Status.PENDING};
  }

  componentDidMount() {
    if (this.state.status === Status.LOADING) {
      this.createLoader();
    }
  }

  componentDidUpdate() {
    if (this.state.status === Status.LOADING && !this.img) {
      this.createLoader();
    }
  }

  destroyLoader = () => {
    if (this.img) {
      this.img.src = '';
      this.img.onload = null;
      this.img.onerror = null;
      this.img = null;
    }
  }

  componentWillUnmount() {
    this.destroyLoader();
  }

  createLoader = () => {
    this.destroyLoader();

    this.img = new Image();
    this.img.onload = this.handleLoad;
    this.img.onerror = this.handleError;
    this.img.src = this.props.src;
  }

  handleLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.target; 
    this.destroyLoader();
    this.setState({ status: Status.LOADED, width: naturalWidth, height: naturalHeight });

    if (this.props.onLoad) this.props.onLoad(event);
  }

  handleError = (error) => {
    this.destroyLoader();
    this.setState({status: Status.FAILED});

    if (this.props.onError) this.props.onError(error);
  }

  renderImg = () => {
    const {src, imgProps} = this.props;
    let props = {src};

    for (let k in imgProps) {
      if (imgProps.hasOwnProperty(k)) {
        props[k] = imgProps[k];
      }
    }

    return <img {...props} className={this.props.className} style={this.props.style}/>;
  }

  preloader() {
    return (
      <Center style={this.props.style} >
        loading
      </Center>
    );
  }

  render() {
    switch (this.state.status) {
      case Status.LOADED:
        return this.renderImg();

      case Status.FAILED:
        return this.props.children;

      default:
        return this.preloader();
    }
  }
}