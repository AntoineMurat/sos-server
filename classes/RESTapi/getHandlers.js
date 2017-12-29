const stripResultsMetadata = results => {
	if (results === null)
		return null
	const records = []
	for (var idx = 0; idx < results.length; idx++) {
		const loki_rec = results[ idx ]
		const clean_rec = Object.assign({}, loki_rec)
		delete clean_rec['meta']
		delete clean_rec['$loki']
		records.push( clean_rec )
	}
	return records
}

const sendJson = (res, json) => res.json(stripResultsMetadata(json))

// GET SOS
module.exports.allSos = function(req, res){
  sendJson(res, this.sosRepository.get())
}

module.exports.sosDoneByContact = function(req, res) {
  sendJson(res, this.sosRepository.getDoneByContact({id: req.params.id}))
}

module.exports.sosTodoByContact = function(req, res) {
  sendJson(res, this.sosRepository.getTodoByContact({id: req.params.id}))
}

module.exports.sosFree = function(req, res) {
  sendJson(res, this.sosRepository.getFree())
}

module.exports.sosTodo = function(req, res) {
  sendJson(res, this.sosRepository.getTodo())
}

module.exports.sosDone = function(req, res) {
  sendJson(res, this.sosRepository.getDone())
}

module.exports.deleteById = function(req, res) {
  sendJson(res, { error: this.bot.supprimerSos(req.params.id) })
}

module.exports.sosById = function(req, res) {
  sendJson(res, this.sosRepository.getById(req.params.id))
}

// GET Contacts
module.exports.allContacts = function(req, res) {
  sendJson(res, this.contactRepository.get())
}

module.exports.contactsSosing = function(req, res) {
  sendJson(res, this.contactRepository.getSosing())
}

module.exports.contactById = function(req, res) {
  sendJson(res, this.contactRepository.getById(req.params.id))
}
