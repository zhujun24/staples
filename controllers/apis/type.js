import { BlogDB } from '../../database/dbInit'

export default async (ctx, next) => {
  let data = await BlogDB.find({
    collection: 'type'
  })
  data = data.map(v => v.value)
  ctx.body = {
    data
  }
}
