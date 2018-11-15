import 'isomorphic-fetch'
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 6 }
}

class AdminDashBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.submit = this.submit.bind(this)
  }

  submit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch('/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }).then(res => res.json()).then(res => {
          if (res && res.login) {
            message.success('登录成功')
            this.props.history.push('/admin')
          } else {
            message.error('登录失败请重试')
          }
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form>
          <FormItem label='password' {...formItemLayout}>
            {getFieldDecorator('password', {
              rules: [{ required: true, pattern: /^[a-zA-Z\d\-_]{6,}$/g, message: '密码由英文、数字、-、_组成，至少6位' }]
            })(
              <Input placeholder='密码由英文、数字、-、_组成，至少6位' />
            )}
          </FormItem>
        </Form>
        <Button onClick={this.submit}>提交</Button>
      </div>
    )
  }
}

export default Form.create({})(AdminDashBoard)
