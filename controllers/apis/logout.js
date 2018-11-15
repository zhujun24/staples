export default async (ctx, next) => {
  ctx.cookies.set('token', '', { httpOnly: true })
  ctx.body = {}
}
