import { decodeToken } from '../../utils'

export default async (ctx, next) => {
  const { token } = ctx.cookie || {}
  ctx.body = {
    login: token && !!decodeToken(token)
  }
}
