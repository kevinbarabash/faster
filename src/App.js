// @flow

import React, {Component} from 'react'
import {connect} from 'react-redux'

import Inspector from './Inspector'
import Renderer from './Renderer'


class App extends Component {
  props: {
    data: any,
  }

  render() {
    const {data} = this.props;
    console.log(data);

    return <div>
      <h1>faster test page</h1>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <Inspector data={data}/>
        <Renderer data={data}/>
      </div>
    </div>
  }
}

// the tree is all about indices of children
// start with a tree separate from the element inspector

const stateToProps = (state) => {
  return {
    data: state,
  }
}

export default connect(stateToProps)(App);
