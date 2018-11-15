import { encodeToken } from '../../utils'
import { PASSWORD } from '../../config'

export default async (ctx, next) => {
  const { password } = ctx.request.body
  if (password === PASSWORD) {
    ctx.cookies.set('token', encodeToken(password), { httpOnly: true })
    ctx.body = { login: true }
  } else {
    ctx.cookies.set('token', '', { httpOnly: true })
    ctx.body = { login: false }
  }
}
