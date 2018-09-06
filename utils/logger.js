import log4js from 'log4js'

log4js.configure({
  appenders: {
    out: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d{ISO8601}]%] %p %h %m'
      }
    }
  },
  categories: { default: { appenders: ['out'], level: 'info' } }
})

let _logger = log4js.getLogger()

let logger = {}

for (let method of ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark', 'log']) {
  logger[method] = (msg) => {
    if (msg instanceof Error) {
      msg = `${msg.stack}`
    }
    _logger[method](msg)
  }
}

export default logger
