import React, { Component } from 'react';
import { Button, Col, Row } from 'antd';
import Graph from 'react-graph-vis';
import './App.css';

class App extends Component {
  state = {
    nodes: [],
    edges: [],
    nodeMap: {},
  }
  componentDidMount () {
    const config = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    }
    fetch('http://localhost:3031/Root', config)
    .then(resp => this.handleErrors(resp))
    .then(json => {
      if (!json.message) {
        console.log(json)
        const {nodes, edges} = json;
        const nodeMap = nodes.reduce(
          (map, node) => ({...map, [node.id]: node}), {}
        );
        this.setState({nodes, edges, nodeMap});
      }
    })
    .catch(err => console.error(err));
  }
  handleErrors = (response) => {
    try {
      if (!response.ok) {
        const json = response.json()
        const err = `${response.statusText}: ${json.message}`
        console.log(err)
        return { error: err }
      }
      return response.json()
    } catch (e) {
      console.group(response.statusText)
      console.error(e.message)
      console.groupEnd()
      return { error: response.statusText }
    }
  }
  render () {
    const {nodes, edges} = this.state;
    const graph = {nodes, edges};

    const options = {
      layout: {
        hierarchical: true
      },
      edges: {
        color: "#000000"
      }
    };

    const events = {
      select: function(event) {
        var { nodes, edges } = event;
        console.group('Clicked!');
        console.info('Nodes:', nodes);
        console.info('Edges:', edges);
        console.groupEnd();
      }
    }

    return (
      <div className={'App'}>
        <p>Awesome Inc.</p>
        <Row type="flex" justify="space-around" align="top">
          <Col span={16}>
            <Graph
              className={'Graph'}
              graph={graph}
              options={options}
              events={events}
              style={{height:'800px'}}
            />
          </Col>
          <Col span={6}>
            <p className={'height-100'}>
              Lorem ipsum&hellip;
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
