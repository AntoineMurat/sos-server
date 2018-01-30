const loki = require('lokijs')
const readline = require('readline');
const HTTPServer = require('./classes/HTTPServer')
const Bot = require('./classes/Bot')
const RESTapi = require('./classes/RESTapi')

const db = new loki('db.json', {autosave: true})

const noHTTPS = process.argv.includes('--nohttps') || process.argv.includes('-nohttps')
const noBot = process.argv.includes('--nobot') || process.argv.includes('-nobot')

const appToken = 'EAAadBOjD6PcBALqe46IdeOhOCsJK1oAwiH369GKbTcrrzFDSFZA4QI1ZCKJdwtNus4cgsrdfCGfm4LPOhJDHEeZB9CWbL0TSGSJD0I4JZAcPsnLZBNqxVfXV4O9GryZCF5nViWMB65AfEEeWZBMxvTIWpH8xefymNj2LXvmTQ6Vi8ZAO4lye7g0w'
const verifyToken = 'wellhooked'

const SosRepository = require('./classes/repositories/SosRepository')
const sosReposotory = new SosRepository(db)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const readInput = _ => {
	rl.question('> ', input => {

		if (input === 'newsos')
			sosReposotory.insert({
				type: 'debug',
        coordonnees: {
          firstname: 'Antoine',
          lastname: 'Murat',
          ensimag: true,
          phone: '+33604165959',
          address: '10 Boulevard Maréchal Joffre',
          city: 'Grenoble',
          coordinates: {lat: 45.186593, lng: 5.742720},
          comment: 'Mon commentaire'
        },
        options: {}
			})
    else if (input === 'save')
      db.saveDatabase()
    else
			console.error('Unknown command')

		readInput()
	})
}

// Load the DB and then launch the servers.
db.loadDatabase({}, err => {

  let bot = null

	if (err)
	    return console.error("error : " + err)

	const httpServer = new HTTPServer(db, 80, 443, './public')

	if (noHTTPS)
		console.warn('No HTTPS.')

	if (!noBot)
		bot = new Bot(db, httpServer, appToken, verifyToken)
	else
		console.warn('No Bot.')

	const restApi = new RESTapi(db, httpServer, bot)

	readInput()
})
