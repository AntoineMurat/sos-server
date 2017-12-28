const getHandlers = require('./RESTapi/getHandlers')
const newSosController = require('./RESTapi/newSosController')

const SosRepository = require('./repositories/SosRepository')
const ContactRepository = require('./repositories/ContactRepository')

class RESTApi{

	constructor(db, httpServer, bot){
		this.sosRepository = new SosRepository(db)
		this.contactRepository = new ContactRepository(db)
		this.bot = bot

		const app = httpServer.app

		app.get('/sos/', getHandlers.allSos.bind(this))
		app.get('/sos/done/:id/', getHandlers.sosDoneByContact.bind(this))
		app.get('/sos/todo/:id/', getHandlers.sosTodoByContact.bind(this))
		app.get('/sos/free/', getHandlers.sosFree.bind(this))
		app.get('/sos/todo/', getHandlers.sosTodo.bind(this))
		app.get('/sos/done/', getHandlers.sosDone.bind(this))
		app.get('/sos/:id/', getHandlers.sosById.bind(this))

		app.post('/sos/new/', newSosController.bind(this))

		app.get('/contacts/', getHandlers.allContacts.bind(this))
		app.get('/contacts/sosing/', getHandlers.contactsSosing.bind(this))
		app.get('/contacts/:id/', getHandlers.contactById.bind(this))
	}
}

module.exports = RESTApi
