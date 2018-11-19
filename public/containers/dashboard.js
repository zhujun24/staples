import 'isomorphic-fetch'
import striptags from 'striptags'
import React, { Component } from 'react'
import { Tabs, Form, Input, Select, Switch, Button, Icon, message } from 'antd'
import BraftEditor from 'braft-editor'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'
import '../styles/admin.less'

BraftEditor.use(CodeHighlighter())

const Option = Select.Option
const TabPane = Tabs.TabPane
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 12 }
}
const fontFamilies = [
  {
    name: 'MS Yahei',
    family: 'Microsoft Yahei'
  }, {
    name: 'Araial',
    family: 'Arial, Helvetica, sans-serif'
  }, {
    name: 'Georgia',
    family: 'Georgia, serif'
  }, {
    name: 'Impact',
    family: 'Impact, serif'
  }, {
    name: 'Monospace',
    family: '"Courier New", Courier, monospace'
  }, {
    name: 'Tahoma',
    family: 'tahoma, arial, "Hiragino Sans GB", 宋体, sans-serif'
  }
]

const controls = [
  'undo', 'redo', 'separator',
  'font-size', 'font-family', 'line-height', 'letter-spacing', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
  'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
  'link', 'separator', 'hr', 'separator',
  'media', 'separator',
  'clear'
]

const extendControls = [
  'separator',
  {
    key: 'my-button', // 控件唯一标识，必传
    type: 'button',
    title: '这是一个自定义的按钮', // 指定鼠标悬停提示文案
    className: 'my-button', // 指定按钮的样式名
    html: null, // 指定在按钮中渲染的html字符串
    text: '预览', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
    onClick: () => {
      console.log('Hello World!')
    }
  },
  'separator',
  {
    key: 'my-button2', // 控件唯一标识，必传
    type: 'button',
    title: '这是一个自定义的按钮', // 指定鼠标悬停提示文案
    className: 'my-button2', // 指定按钮的样式名
    html: null, // 指定在按钮中渲染的html字符串
    text: '发布', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
    onClick: () => {
      console.log('Hello World!')
    }
  }
]

class AdminDashBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      content: BraftEditor.createEditorState(null)
    }
    this.logout = this.logout.bind(this)
    this.submit = this.submit.bind(this)
    this.handleEditorChange = this.handleEditorChange.bind(this)
  }

  logout () {
    fetch(`/api/${window.ADMIN_PATH}/logout`).then(res => res.json()).then(res => {
      if (res) {
        message.success('登出成功!')
        this.props.history.push('/admin/login')
      } else {
        message.error('登出失败请重试!')
      }
    })
  }

  submit (e) {
    const { content } = this.state
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log(values)
        // return
        const html = content.toHTML()
        if (striptags(html).trim()) {
          fetch(`/api/${window.ADMIN_PATH}/post`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.assign({
              html,
              raw: content.toRAW()
            }, values))
          }).then(res => res.json()).then(res => {
          }).catch(() => {
            message.error('提交失败请重试!')
          })
        }
      }
    })
  }

  handleEditorChange (content) {
    this.setState({ content })
  }

  render () {
    const { content } = this.state
    const { getFieldDecorator } = this.props.form
    const tm = new Date()
    const urlPrefix = `${window.location.protocol}//${window.location.host}/post/${tm.getFullYear()}/${tm.getMonth() + 1}/`
    return (
      <div className='admin'>
        <Tabs tabBarExtraContent={<Button className='logout-btn' type='primary' onClick={this.logout}>退出登录</Button>}>
          <TabPane tab={<span><Icon type='file-text' />文章</span>} key='1'>Content of Tab Pane 1</TabPane>
          <TabPane className='admin-editor' tab={<span><Icon type='edit' />撰写</span>} key='2'>
            <Form>
              <FormItem label='标题' {...formItemLayout}>
                {getFieldDecorator('title', {
                  rules: [{ required: true, message: '请输入文章标题' }]
                })(
                  <Input size='large' addonBefore='标题' placeholder='我是博客的标题' />
                )}
              </FormItem>
              <FormItem label='自定义链接' {...formItemLayout}>
                {getFieldDecorator('link', {
                  rules: [{ required: true, pattern: /^[a-zA-Z\d\-_]+$/g, message: '请输入合法的文章链接，由英文、数字、-、_组成' }]
                })(
                  <Input addonBefore={urlPrefix} placeholder='文章链接，由英文、数字、-、_组成' />
                )}
              </FormItem>
              <FormItem label='类别' {...formItemLayout}>
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择文章类别' }]
                })(
                  <Select mode='multiple' placeholder='类别'>
                    <Option value='jack'>Jack</Option>
                    <Option value='lucy'>Lucy</Option>
                    <Option value='Yiminghe'>yiminghe</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label='标签(可选)' {...formItemLayout}>
                {getFieldDecorator('tag')(
                  <Select addonBefore='xxx' mode='tags' placeholder='标签'>
                    <Option key='tag1'>tag1</Option>
                    <Option key='tag2'>tag2</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label='公开' {...formItemLayout}>
                {getFieldDecorator('open')(
                  <Switch defaultChecked />
                )}
              </FormItem>
            </Form>
            <Button onClick={this.submit}>提交</Button>
            <div className='editor'>
              <BraftEditor
                controls={controls}
                extendControls={extendControls}
                fontFamilies={fontFamilies}
                value={content}
                onChange={this.handleEditorChange}
              />
            </div></TabPane>
          <TabPane tab={<span><Icon type='bars' />分类</span>} key='3'>Content of Tab Pane 2</TabPane>
          <TabPane tab={<span><Icon type='tag' />标签</span>} key='4'>Content of Tab Pane 2</TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Form.create({})(AdminDashBoard)
