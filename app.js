
const HTTPServer = require('./classes/HTTPServer')
const Bot = require('./classes/Bot')

const appToken = 'EAAadBOjD6PcBALqe46IdeOhOCsJK1oAwiH369GKbTcrrzFDSFZA4QI1ZCKJdwtNus4cgsrdfCGfm4LPOhJDHEeZB9CWbL0TSGSJD0I4JZAcPsnLZBNqxVfXV4O9GryZCF5nViWMB65AfEEeWZBMxvTIWpH8xefymNj2LXvmTQ6Vi8ZAO4lye7g0w'
const verifyToken = 'wellhooked'

httpServer = new HTTPServer(80, 443, './static')
bot = new Bot(httpServer, appToken, verifyToken)

setInterval(_ => bot.notifyAll(), 5000)