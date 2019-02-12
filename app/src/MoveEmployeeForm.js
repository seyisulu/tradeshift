import React, { Component } from 'react';
import {
  Form, Modal, Select
} from 'antd';

const Option = Select.Option;

const MoveEmployeeForm = Form.create({ name: 'empform' })(
  // eslint-disable-next-line
  class extends Component {
    render() {
      const {
        visible, onCancel, onMove, form, nodes
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Move Employee"
          okText="Move"
          onCancel={onCancel}
          onOk={onMove}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator('eid', {
                rules: [{
                  required: true,
                  message: 'Please select the employee'
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
                </Select>
              )}
            </Form.Item>
            <Form.Item label="Boss">
              {getFieldDecorator('boss', {
                rules: [{
                  required: true,
                  message: 'Please select new boss'
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
                </Select>
              )}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

export default MoveEmployeeForm;
