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

// POST LOGIN
module.exports.login = function(req, res){
	if (req.body.login == 'GaétanOuAntoine' && req.body.password == 'snow42estleplusbeau'){
		req.session.isAdmin = true
		return res.json({error: false})
	}
  res.json({error: true})
}
