const Repository = require('./Repository')
const crypto = require("crypto")

class SosRepository extends Repository{
	// /!\ THE DB HAS TO BE LOADED FIRST /!\
	constructor(db){
		super(db, 'sos')
	}
	getFree(){
		return this.getWhere(sos => sos.contactId === false && !sos.fini)
	}

	getDone(){
		return this.getWhere(sos => sos.fini)
	}

	getTodo(){
		return this.getWhere(sos => !sos.fini && sos.contactId !== false)
	}

	getByContact(contact){
		return this.getWhere(sos => sos.contactId === contact.id)
	}

	getDoneByContact(contact){
		return this.getWhere(sos => sos.contactId === contact.id && sos.fini)
	}

	getTodoByContact(contact){
		return this.getWhere(sos => sos.contactId === contact.id && !sos.fini)
	}

	insert(sos){
		if (typeof sos.id === 'undefined')
			sos.id = crypto.randomBytes(16).toString("hex")
		if (typeof sos.contactId === 'undefined')
			sos.contactId = false
		if (typeof sos.fini === 'undefined')
			sos.fini = false

		if (typeof sos.type === 'undefined')
			sos.type = 'Type unspecified'

		if (typeof sos.coordonnees === 'undefined')
			sos.coordonnees = {}

		remplirCoordonnees(sos, 'firstname')
		remplirCoordonnees(sos, 'lastname')
		remplirCoordonnees(sos, 'phone')
		remplirCoordonnees(sos, 'city')
		remplirCoordonnees(sos, 'address')
		remplirCoordonnees(sos, 'comment')

		if (typeof sos.coordonnees.coordinates === 'undefined')
			sos.coordonnees.coordinates = {lat: 45.186593, lng: 5.742720}

		return super.insert(sos)
	}
}

const remplirCoordonnees = (sos, propriete) => {
	if (typeof sos.coordonnees[propriete] === 'undefined')
		sos.coordonnees[propriete] = propriete
}

module.exports = SosRepository
