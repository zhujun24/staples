import 'isomorphic-fetch'
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}

class AdminDashBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.logout = this.logout.bind(this)
    this.submit = this.submit.bind(this)
  }

  logout () {
    fetch('/api/logout').then(res => res.json()).then(res => {
      if (res) {
        message.success('登出成功!')
        this.props.history.push('/admin/login')
      } else {
        message.error('登出失败请重试!')
      }
    })
  }

  submit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        fetch('/api/post', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        }).then(res => res.json()).then(res => {
          console.log(res)
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const tm = new Date()
    const urlPrefix = `${window.location.protocol}//${window.location.host}/post/${tm.getFullYear()}/${tm.getMonth() + 1}/`
    return (
      <div>
        <Button onClick={this.logout}>Logout</Button>
        <Form>
          <FormItem label='link' {...formItemLayout}>
            {getFieldDecorator('link', {
              rules: [{ required: true, pattern: /^[a-zA-Z\d\-_]+$/g, message: '请输入合法的文章链接，由英文、数字、-、_组成' }]
            })(
              <Input addonBefore={urlPrefix} placeholder='文章链接，由英文、数字、-、_组成' />
            )}
          </FormItem>
          <FormItem label='title' {...formItemLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请输入文章标题' }]
            })(
              <Input placeholder='文章标题...' />
            )}
          </FormItem>
          <FormItem label='content' {...formItemLayout}>
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请输入文章内容' }]
            })(
              <Input placeholder='文章内容...' />
            )}
          </FormItem>
        </Form>
        <Button onClick={this.submit}>提交</Button>
      </div>
    )
  }
}

export default Form.create({})(AdminDashBoard)
