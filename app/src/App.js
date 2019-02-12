import React, { Component } from 'react';
import { Card, Col, Divider, Icon, Row } from 'antd';
import AddEmployeeForm from './AddEmployeeForm'
import MoveEmployeeForm from './MoveEmployeeForm'
import EmployeeTree from './EmployeeTree'
import './App.css';

const { Meta } = Card;

class App extends Component {
  state = {
    nodes: [],
    edges: [],
    nodeMap: {},
    visible: false,
    moveVisible: false,
  }
  showModal = () => {
    this.setState({ visible: true });
  }
  showMoveModal = () => {
    this.setState({ moveVisible: true });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  }
  handleMoveCancel = () => {
    this.setState({ moveVisible: false });
  }
  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
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
  handleMove = () => {
    const form = this.moveFormRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const {boss, eid} = values;
      if (boss === eid) {
        alert('Please select different employee as boss.')
        return;
      }
      const config = {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify({boss}),
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
      }
      fetch(`http://localhost:3031/employees/${eid}`, config)
        .then(resp => this.handleErrors(resp))
        .then(json => {
          if (!json.error) {
            console.info('Successfully moved employee.')
            this.refreshData();
            form.resetFields();
            this.setState({ moveVisible: false });
          }
        })
        .catch(err => console.error(err));
    });
  }
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }
  saveMoveFormRef = (formRef) => {
    this.moveFormRef = formRef;
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
        <Row type="flex" justify="space-around" align="top">
          <Col span={23}>
            <Divider>Awesome Co.</Divider>
          </Col>
        </Row>
        <Row type="flex" justify="space-around" align="top">
          <Col span={19}>
            {EmployeeTree(graph)}
          </Col>
          <Col span={4}>
            <Card
              title={'Organisation Tree'}
              actions={[
                <Icon type={'plus-circle'} onClick={this.showModal} theme={'twoTone'}/>,
                <Icon type={'edit'} onClick={this.showMoveModal} theme={'twoTone'}/>
              ]}
            >
              <Meta
                description={'Add or move employees with the buttons below.'}
              />
            </Card>
            <AddEmployeeForm
              wrappedComponentRef={this.saveFormRef}
              visible={this.state.visible}
              onCancel={this.handleCancel}
              onCreate={this.handleCreate}
              nodes={nodes}
            />
            <MoveEmployeeForm
              wrappedComponentRef={this.saveMoveFormRef}
              visible={this.state.moveVisible}
              onCancel={this.handleMoveCancel}
              onMove={this.handleMove}
              nodes={nodes}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
