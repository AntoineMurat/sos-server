class Repository{
	// /!\ THE DB HAS TO BE LOADED FIRST /!\
	constructor(db, entitiesName){
		this.entities = db.getCollection(entitiesName) || db.addCollection(entitiesName)
	}

	get(){
		return this.entities.find()
	}

	getWhere(func){
		return this.entities.where(func)
	}

	getOneWhere(func){
		const all = this.getWhere(func)
		if (all.length === 0)
			return null
		return all[0]
	}

	getIs(entity){
		return this.getById(entity.id)
	}

	getById(id){
		return this.getOneWhere(one => one.id === id)
	}

	forEach(func){
		return this.entities.forEach(func)
	}

	insert(entity){
		return this.entities.insert(entity)
	}

}

module.exports = Repository
