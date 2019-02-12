import React, { Component } from 'react';
import {
  Button, Col, Form, Input, Modal, Row, Select
} from 'antd';

const Option = Select.Option;

const AddEmployeeForm = Form.create({ name: 'empform' })(
  // eslint-disable-next-line
  class extends Component {
    render() {
      const {
        visible, onCancel, onCreate, form, nodes
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Add New Employee"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: 'Please input the employee name'
                }],
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item label="Boss">
              {getFieldDecorator('boss', {
                rules: [{
                  required: true,
                  message: 'Please select employee boss'
                }],
              })(
                <Select>
                  {
                    nodes.map(
                      n => (
                        <Option key={n.id} value={n.eid}>{n.label}</Option>
                      )
                    )
                  }
                </Select>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

export default AddEmployeeForm;
