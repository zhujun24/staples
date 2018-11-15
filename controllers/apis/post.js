import { BlogDB } from '../../database/dbInit'

const postApiHandler = {
  GET: async (ctx) => {
    const { params } = ctx
    return {
      params,
      tm: Date.now(),
      method: 'GET'
    }
  },
  POST: async (ctx) => {
    const { link, title, content } = ctx.request.body
    if (!link || !title || !content) {
      return {
        error: 'invalid content'
      }
    }
    const tm = new Date()
    const year = tm.getFullYear().toString()
    const month = (tm.getMonth() + 1).toString()
    let result = await BlogDB.findOne({
      query: {
        year,
        month,
        link
      },
      collection: 'post'
    })
    if (result) {
      return {
        error: 'invalid link'
      }
    }
    result = await BlogDB.insert({
      docs: {
        year,
        month,
        link,
        title,
        content
      },
      collection: 'post'
    })
    return {
      result,
      tm: Date.now()
    }
  },
  PUT: async (ctx) => {
    const { body } = ctx.request
    return {
      body,
      tm: Date.now(),
      method: 'PUT'
    }
  },
  DELETE: async (ctx) => {
    const { body } = ctx.request
    return {
      body,
      tm: Date.now(),
      method: 'DELETE'
    }
  }
}

export default async (ctx, next) => {
  ctx.body = await postApiHandler[ctx.request.method](ctx)
}
