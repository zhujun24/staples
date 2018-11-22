import 'isomorphic-fetch'
import React, { Component } from 'react'
import { Modal, Tabs, Button, Icon, message } from 'antd'
import Editor from '../components/adminEditor'
import PostList from '../components/adminPostList'
import '../styles/admin.less'

const confirm = Modal.confirm
const TabPane = Tabs.TabPane

class AdminDashBoard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeKey: '1',
      editPost: null
    }
    this.logout = this.logout.bind(this)
    this.goToEdit = this.goToEdit.bind(this)
    this.onTabChange = this.onTabChange.bind(this)
    this.editSubmit = this.editSubmit.bind(this)
  }

  componentDidMount () {}

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

  goToEdit (editPost) {
    this.setState({
      activeKey: '2',
      editPost
    })
  }

  onTabChange (activeKey) {
    const self = this
    if (this.state.editPost && activeKey !== '2') {
      confirm({
        title: `放弃当前修改?`,
        onOk () {
          self.setState({
            editPost: null,
            activeKey
          })
        }
      })
    } else {
      this.setState({
        editPost: null,
        activeKey
      })
    }
  }

  editSubmit () {
    this.setState({
      editPost: null,
      activeKey: '1'
    })
  }

  render () {
    const { activeKey, editPost } = this.state
    return (
      <div className='admin'>
        <Tabs activeKey={activeKey} onChange={this.onTabChange} tabBarExtraContent={<Button className='logout-btn' type='primary' onClick={this.logout}>退出登录</Button>}>
          <TabPane tab={<span><Icon type='file-text' />文章</span>} key='1'>
            <PostList goToEdit={this.goToEdit} />
          </TabPane>
          <TabPane className='admin-editor' tab={<span><Icon type='edit' />撰写</span>} key='2'>
            <Editor editPost={editPost} editSubmit={this.editSubmit} />
          </TabPane>
          <TabPane tab={<span><Icon type='bars' />分类</span>} key='3'>Content of Tab Pane 3</TabPane>
          <TabPane tab={<span><Icon type='tag' />标签</span>} key='4'>Content of Tab Pane 4</TabPane>
        </Tabs>
      </div>
    )
  }
}

export default AdminDashBoard
