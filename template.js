import { ENV } from './config'

const render = (initData = {}) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${initData.title || 'Document'}</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <link rel="shortcut icon" href="/images/favicon.png" type="image/x-icon" />
    <link rel="icon" href="/images/favicon.png" />
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    ${!!initData.css.length && initData.css.map(css => (`<link rel="stylesheet" href="${css}" type="text/css">`)).join('\n    ')}
  </head>
  <body>
    <div id="root"></div>
  </body>
  <script>
    __ENV__ = ${JSON.stringify(ENV)};
  </script>
  ${Array.isArray(initData.js) && initData.js.map(js => (`<script type="text/javascript" src="${js}"></script>`)).join('\n  ')}
</html>`
}

export default (ctx) => {
  ctx.type = 'html'
  ctx.body = render(ctx.initData)
}
