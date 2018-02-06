const getHandlers = require('./RESTapi/getHandlers')
const postHandlers = require('./RESTapi/postHandlers')
const newSosController = require('./RESTapi/newSosController')

const SosRepository = require('./repositories/SosRepository')
const ContactRepository = require('./repositories/ContactRepository')

class RESTApi{

	constructor(db, httpServer, bot){
		this.sosRepository = new SosRepository(db)
		this.contactRepository = new ContactRepository(db)
		this.bot = bot
		this.httpServer = httpServer

		const app = httpServer.app

		app.get('/admin/sos/', getHandlers.allSos.bind(this))
		app.get('/admin/sos/done/:id/', getHandlers.sosDoneByContact.bind(this))
		app.get('/admin/sos/todo/:id/', getHandlers.sosTodoByContact.bind(this))
		app.get('/admin/sos/free/', getHandlers.sosFree.bind(this))
		app.get('/admin/sos/todo/', getHandlers.sosTodo.bind(this))
		app.get('/admin/sos/done/', getHandlers.sosDone.bind(this))
		app.get('/admin/sos/supprimer/:id/', getHandlers.deleteById.bind(this))
		app.get('/admin/sos/:id/', getHandlers.sosById.bind(this))
		app.get('/is/logged/', getHandlers.isLogged.bind(this))

		app.post('/login/', postHandlers.login.bind(this))
		app.post('/sos/new/', newSosController.bind(this))

		app.get('/admin/contacts/', getHandlers.allContacts.bind(this))
		app.get('/admin/contacts/sosing/', getHandlers.contactsSosing.bind(this))
		app.get('/admin/contacts/dispo/', getHandlers.contactsDispo.bind(this))
		app.get('/admin/contacts/nondispo/', getHandlers.contactsNonDispo.bind(this))
		app.get('/admin/contacts/:id/', getHandlers.contactById.bind(this))

		app.get('/', (req, res) => res.sendFile('index.html', { root: httpServer.staticDirectory }))
		// app.get('*', (req, res) => res.redirect('/#/notfound'))

		app.use((err, req, res, next) => {
			console.error(err.stack)
			httpServer.handleError('ESLint: Unsafe query in ./classes/repositories/SosRepository.js:AjouterNouveauSos line 66 col 23 may lead to SQL injection!', req, res)
		})
	}
}

module.exports = RESTApi
