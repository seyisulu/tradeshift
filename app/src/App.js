import React, { Component } from 'react';
import { Button, Icon, Tree } from 'antd';
import logo from './logo.svg';
import './App.css';

const { TreeNode } = Tree;
const gData = [
  {
    title: 'Root',
    key:'#0.0',
    children: [
      {
        title: 'A',
        key:'#0.1',
        children: [
          {
            title: 'A-A',
            key:'#0.4',
            children: [
              {
                title: 'A-A-A',
                key:'#0.7',
              },
              {
                title: 'A-A-B',
                key:'#0.8',
              },
              {
                title: 'A-A-C',
                key:'#0.9',
              }
            ]
          },
          {
            title: 'A-B',
            key:'#0.5',
          },
          {
            title: 'A-C',
            key:'#0.6',
          }
        ]
      },
      {
        title: 'B',
        key:'#0.2',
      },
      {
        title: 'C',
        key:'#0.3',
      }
    ]
  }
];

class AwesomeTree extends Component {
  state = {
    gData,
    expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
  }

  onDragEnter = (info) => {
    console.log(info);
  }

  onDrop = (info) => {
    console.log('From:', info.dragNode.props.eventKey);
    console.log('To:', info.node.props.eventKey);
  }

  loop = data => {
    return data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode
            showLine
            key={item.key}
            title={item.title}
            icon={<Icon type={'smile-o'}/>}
          >
            {this.loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} title={item.title} />;
    })
  }

  render() {
    console.log('AwesomeTree');
    return (
      <Tree
        className="draggable-tree"
        draggable
        onDragEnter={this.onDragEnter}
        onDrop={this.onDrop}
      >
        {this.loop(this.state.gData)}
      </Tree>
    );
  }
}

class App extends Component {
  doClick = () => {
    console.log('Clicked!');
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Button type={'primary'} onClick={this.doClick}>Button</Button>
        </header>

        <AwesomeTree/>
      </div>
    );
  }
}

export default App;
