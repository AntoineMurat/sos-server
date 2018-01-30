const Repository = require('./Repository')
const axios = require('axios')

class ContactRepository extends Repository{
	// /!\ THE DB HAS TO BE LOADED FIRST /!\
	constructor(db){
		super(db, 'contacts')
		this.db = db
	}

	getBestMatchesFor(sos, limit=5){
		const distance = (dest, center) => {
	    const degreesToRadians = degrees => degrees * Math.PI / 180
	    const earthRadiusKm = 6371

	    const dLat = degreesToRadians(center.lat-dest.lat)
	    const dLon = degreesToRadians(center.lng-dest.lng)

	    const lat1 = degreesToRadians(center.lat)
	    const lat2 = degreesToRadians(dest.lat)

	    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
	    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	    const distance = earthRadiusKm * c
	    return distance
	  }
		console.log(this.getDispo().sort((c1, c2) => distance(c1.home, sos.coordonnees.coordinates) < distance(c2.home, sos.coordonnees.coordinates)).slice(0, limit))
		return this.getDispo().sort((c1, c2) => distance(c1.home, sos.coordonnees.coordinates) < distance(c2.home, sos.coordonnees.coordinates)).slice(0, limit)
	}

	getDispo(){
		return this.getWhere(contact => contact.sos && contact.free)
	}

	getSosing(){
		return this.getWhere(contact => contact.sos && !contact.free)
	}

	getNonDispo(){
		return this.getWhere(contact => !contact.sos)
	}

	insert(contact){
		if (typeof contact.firstName === 'undefined')
			contact.firstName = 'Unknown firstname'
		if (typeof contact.lastName === 'undefined')
			contact.lastName = 'Unknown lastname'
		if (typeof contact.profilePic === 'undefined')
			contact.profilePic = 'http://ucommunicate.org/wp-content/uploads/2017/01/noprofile.gif'
		if (typeof contact.home === 'undefined')
			contact.home = {lat: 45.186593, lng: 5.742720}
		if (typeof contact.sos === 'undefined')
			contact.sos = false
		if (typeof contact.free === 'undefined')
			contact.free = true
		const insertedContact = super.insert(contact)

		this.update(insertedContact)

		return insertedContact
	}

	updateAllContacts(){
		this.get().forEach(contact => {
			this.update(contact)
		})
	}

	update(contact){
		axios.get(`https://graph.facebook.com/v2.6/${contact.id}?fields=profile_pic,first_name,last_name&access_token=EAAadBOjD6PcBALqe46IdeOhOCsJK1oAwiH369GKbTcrrzFDSFZA4QI1ZCKJdwtNus4cgsrdfCGfm4LPOhJDHEeZB9CWbL0TSGSJD0I4JZAcPsnLZBNqxVfXV4O9GryZCF5nViWMB65AfEEeWZBMxvTIWpH8xefymNj2LXvmTQ6Vi8ZAO4lye7g0w`)
		.then(res => {
			contact.firstName = res.data.first_name
			contact.lastName = res.data.last_name
			contact.profilePic = res.data.profile_pic
			this.db.saveDatabase()
		})
		.catch(err => console.error('Error while updating ', contact, err))
	}
}

module.exports = ContactRepository
