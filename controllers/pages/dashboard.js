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

const generateJs = () => js.map(j => getAssetsPath(j))

export default async (ctx, next) => {
  const posts = await BlogDB.find({
    collection: 'post'
  })
  ctx.render('dashboard', {
    tdk: {
      title: 'title',
      description: 'description',
      keywords: 'keywords'
    },
    posts,
    ENV,
    styleList: generateCss(),
    scriptList: generateJs()
  }, true)
}
