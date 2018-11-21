import 'isomorphic-fetch'
import querystring from 'querystring'
import React, { Component } from 'react'
import { Table, Divider, Tag } from 'antd'
import { PAGESIZE_OPTIONS } from '../../constants'
import './index.less'

class PostList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      size: 10,
      page: 1,
      total: 0,
      post: []
    }
    this.paginationChange = this.paginationChange.bind(this)
    this.paginationSizeChange = this.paginationSizeChange.bind(this)
    this.goToEdit = this.goToEdit.bind(this)

    this.columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => <a href={`/post/${record.year}/${record.month}/${record.link}`} target='_blank'>{text}</a>
    }, {
      title: '类型',
      align: 'center',
      dataIndex: 'type',
      key: 'type'
    }, {
      title: 'Tags',
      key: 'tag',
      dataIndex: 'tag',
      render: tags => {
        return tags && tags.length ? <span>
          {
            tags.map(tag => <Tag color='blue' key={tag}><a href={`/post/tag/${tag}`} target='_blank'>{tag}</a></Tag>)
          }
        </span> : null
      }
    }, {
      title: '公开',
      align: 'center',
      dataIndex: 'open',
      key: 'open',
      render: open => (open ? '是' : '否')
    }, {
      title: '发布时间',
      align: 'center',
      dataIndex: 'publish_time',
      key: 'publish_time'
    }, {
      title: '修改时间',
      align: 'center',
      dataIndex: 'modify_time',
      key: 'modify_time'
    }, {
      title: 'Action',
      align: 'center',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href='javascript:;' onClick={() => this.goToEdit(record)}>编辑</a>
          <Divider type='vertical' />
          <a href='javascript:;'>删除</a>
        </span>
      )
    }]
  }

  componentDidMount () {
    this.loadData()
  }

  goToEdit (post) {
    this.props.goToEdit && this.props.goToEdit(post)
  }

  loadData () {
    const { page, size } = this.state
    fetch(`/api/${window.ADMIN_PATH}/post?${querystring.stringify({ page, size })}`).then(res => res.json()).then(res => {
      this.setState({
        post: res.data || [],
        total: res.pagination.total || 0
      })
    })
  }

  paginationChange (page) {
    this.setState({ page }, () => { this.loadData() })
  }

  paginationSizeChange (_, size) {
    this.setState({
      page: 1,
      size
    }, () => { this.loadData() })
  }

  render () {
    const { post, total, size } = this.state
    const data = post.map((d, index) => {
      d.key = index
      return d
    })
    return (
      <div className='post-list'>
        <Table
          columns={this.columns}
          dataSource={data}
          pagination={{
            onChange: this.paginationChange,
            onShowSizeChange: this.paginationSizeChange,
            pageSizeOptions: PAGESIZE_OPTIONS,
            pageSize: size,
            total,
            showTotal: total => `共有 ${total} 篇文章`,
            showSizeChanger: true
          }}
          bordered
        />
      </div>
    )
  }
}

export default PostList
