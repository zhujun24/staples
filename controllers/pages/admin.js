import _ from 'lodash'
import { decodeToken } from '../../utils'
import { PUBLIC_CDN, ADMIN_PATH, HOST, ENV } from '../../config'

const css = [
  'admin.css'
]

const js = [
  // 'vendor.js',
  'admin.js'
]

const getAssetsPath = filename => ENV === 'DEV' ? `/assets/${filename}` : `://${HOST}/${filename}`

const generateCss = () => (PUBLIC_CDN.css).concat(css.map(c => getAssetsPath(c)))

const generateJs = () => (PUBLIC_CDN.js).concat(js.map(j => getAssetsPath(j)))

const needAuthPaths = ['/admin']

export default async (ctx, next) => {
  const { token } = ctx.cookie || {}
  if (_.includes(needAuthPaths, ctx.url.replace(/\/$/, '')) && token && !decodeToken(token)) {
    ctx.redirect('/admin/login')
    return
  }

  ctx.render('admin', {
    tdk: {
      title: 'title',
      description: 'description',
      keywords: 'keywords'
    },
    ADMIN_PATH,
    styleList: generateCss(),
    scriptList: generateJs()
  }, true)
}
