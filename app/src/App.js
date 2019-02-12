import React, { Component } from 'react';
import { Avatar, Button, Col, Row } from 'antd';
import AddEmployeeForm from './AddEmployeeForm'
import EmployeeTree from './EmployeeTree'
import './App.css';

class App extends Component {
  state = {
    nodes: [],
    edges: [],
    nodeMap: {},
    visible: false,
  }
  showModal = () => {
    this.setState({ visible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      const config = {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(values),
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
      }
      fetch('http://localhost:3031/employees', config)
        .then(resp => this.handleErrors(resp))
        .then(json => {
          if (!json.error) {
            console.info('Successfully added employee.')
            this.refreshData();
            form.resetFields();
            this.setState({ visible: false });
          }
        })
        .catch(err => console.error(err));
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  componentDidMount () {
    this.refreshData();
  }
  refreshData = () => {
    const config = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    }
    fetch('http://localhost:3031/employees', config)
      .then(resp => this.handleErrors(resp))
      .then(json => {
        if (!json.error) {
          const {nodes, edges} = json;
          const nodeMap = nodes.reduce(
            (map, node) => ({...map, [node.id]: node}), {}
          );
          this.setState({nodes, edges, nodeMap});
          console.info(nodeMap);
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

    return (
      <div className={'App'}>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={23}>
            <Avatar>U</Avatar> Amazing Co.
          </Col>
        </Row>
        <Row type="flex" justify="space-around" align="top">
          <Col span={19}>
            {EmployeeTree(graph)}
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={this.showModal}>
              Add Employee
            </Button>
            <AddEmployeeForm
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              nodes={nodes}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
