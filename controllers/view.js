import { PUBLIC_CDN, ENV } from '../config'

const css = [
  'index.css'
]

const js = [
  // 'vendor.js',
  'index.js'
]

const getAssetsPath = filename => ENV === 'DEV' ? `/assets/${filename}` : `your-cdn-domain/${filename}`

const generateCss = () => (PUBLIC_CDN.css).concat(css.map(c => getAssetsPath(c)))

const generateJs = () => (PUBLIC_CDN.js).concat(js.map(j => getAssetsPath(j)))

export default async (ctx, next) => {
  ctx.initData = {
    css: generateCss(),
    js: generateJs()
  }
  await next()
}
