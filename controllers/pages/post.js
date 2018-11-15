import { BlogDB } from '../../database/dbInit'
import { HOST, ENV } from '../../config'

const css = [
  'index.css'
]

const js = [
  // 'vendor.js',
  'index.js'
]

const getAssetsPath = filename => ENV === 'DEV' ? `/assets/${filename}` : `://${HOST}/${filename}`

const generateCss = () => css.map(c => getAssetsPath(c))

const generateJs = () => js.map(c => getAssetsPath(c))

export default async (ctx, next) => {
  const { year, month, link } = ctx.params
  const post = await BlogDB.findOne({
    query: {
      year,
      month,
      link
    },
    collection: 'post'
  })
  ctx.render('post', {
    tdk: {
      title: 'title',
      description: 'description',
      keywords: 'keywords'
    },
    ENV,
    post: post || {},
    styleList: generateCss(),
    scriptList: generateJs()
  }, true)
}
