import moment from 'moment'
import { BlogDB } from '../../database/dbInit'

const postApiHandler = {
  GET: async (ctx) => {
    let { page, size } = ctx.query
    page = parseInt(page, 10) || 1
    size = parseInt(size, 10) || 10
    let [data, total] = await Promise.all([
      BlogDB.find({
        collection: 'post',
        sort: { publish_time: -1 },
        options: {
          skip: (page - 1) * size,
          limit: size
        }
      }),
      BlogDB.count({
        collection: 'post'
      })
    ])
    data = data.map(d => {
      d.publish_time = d.publish_time ? moment(d.publish_time).format('YYYY-MM-DD HH:mm:ss') : null
      d.modify_time = d.modify_time ? moment(d.modify_time).format('YYYY-MM-DD HH:mm:ss') : null
      return d
    })
    return {
      data,
      pagination: {
        page,
        size,
        total
      }
    }
  },
  POST: async (ctx) => {
    const { link, title, type, tag, open, html, raw } = ctx.request.body
    if (!link || !title || !html || !raw || !type) {
      return {
        error: 'invalid params'
      }
    }
    const tm = new Date()
    const year = tm.getFullYear().toString()
    const month = (tm.getMonth() + 1).toString()
    let data = await BlogDB.findOne({
      query: {
        year,
        month,
        link
      },
      collection: 'post'
    })
    if (data) {
      return {
        error: 'invalid link'
      }
    }
    data = await BlogDB.insert({
      docs: {
        year,
        month,
        link,
        title,
        type,
        tag: tag && tag.length ? tag : [],
        open: typeof open === 'boolean' ? open : true,
        publish_time: moment.now(),
        html,
        raw
      },
      collection: 'post'
    })
    return {
      data
    }
  },
  PUT: async (ctx) => {
    const { body } = ctx.request
    return {
      data: body
    }
  },
  DELETE: async (ctx) => {
    const { body } = ctx.request
    return {
      data: body
    }
  }
}

export default async (ctx, next) => {
  ctx.body = await postApiHandler[ctx.request.method](ctx)
}
