import { PUBLIC_CDN, HOST, ENV } from '../../config'

const css = [
  'index.css'
]

const js = [
  // 'vendor.js',
  'index.js'
]

const getAssetsPath = filename => ENV === 'DEV' ? `/assets/${filename}` : `://${HOST}/${filename}`

const generateCss = () => (PUBLIC_CDN.css).concat(css.map(c => getAssetsPath(c)))

const generateJs = () => (PUBLIC_CDN.js).concat(js.map(j => getAssetsPath(j)))

export default async (ctx, next) => {
  ctx.render('notfound', {
    tdk: {
      title: 'title',
      description: 'description',
      keywords: 'keywords'
    },
    ENV,
    styleList: generateCss(),
    scriptList: generateJs()
  }, true)
}
