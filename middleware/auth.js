import { decodeToken } from '../utils'

export default async (ctx, next) => {
  const { token } = ctx.cookie || {}
  if (!token || !decodeToken(token)) {
    ctx.res.writeHead(500)
    ctx.res.end()
    return
  }
  await next()
}
