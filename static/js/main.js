$(() => {
	$('.button-collapse').sideNav({
		menuWidth: 300, // Default is 300
		edge: 'left', // Choose the horizontal origin
		closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
		draggable: true, // Choose whether you can drag to open on touch screens,
		onOpen: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is opened
		onClose: function(el) { /* Do Stuff */ }, // A function to be called when sideNav is closed
	})

	$('#edt').on('load', _ => {
		$('#preloader').hide()
		$('#edt').show()
	})

	if (typeof Cookies.get('annee') === 'undefined')
		Cookies.set('annee', 1, { expires: 365 })

	if (typeof Cookies.get('groupe') === 'undefined')
		Cookies.set('groupe', 'G1', { expires: 365 })

	let now = new Date();
	let vingtetunaout = new Date(2017, 7, 21);
	let semaine = Math.ceil( (((now - vingtetunaout) / 86400000) + vingtetunaout.getDay() + 1) / 7 )
	console.log(semaine)
	Cookies.set('semaine', semaine, { expires: 365 })

	updatePagination()

	let totalAnnees = 3

	const refs = [
		/* 1A */
		{
			'G1' : 4677,
			'G2' : 4679,
			'G3' : 4681,
			'G4' : 4678,
			'G5' : 4680,
			'G6' : 4675,
			'G7' : 4676,
			'G8' : 4682
		},
		/* 2A */
		{
			'IF1' : 4693,
			'IF2' : 4694,
			'ISI1' : 4696,
			'ISI2' : 4697,
			'MMIS1' : 4686,
			'MMIS2' : 4685,
			'SEOC1' : 4690,
			'SEOC2' : 4691
		},
		/* 3A */
		{
			'IF I2MF' : 4826,
			'IF MEQA' : 4825,
			'ISI' : 4700,
			'ISSC' : 4823,
			'MMIS BIO' : 4817,
			'MMIS IRVM' : 4818,
			'MMIS MCS' : 4816,
			'SLE' : 4821
		}
	]

	$(document).on('click', '.list-groups li', event => {
		Cookies.set('groupe', $(event.currentTarget).attr('data-group'), { expires: 365 })
		update(refs)
	})

	$(document).on('click', '.list-annees li', event => {
		Cookies.set('annee', parseInt($(event.currentTarget).attr('data-annee')), { expires: 365 })
		populateGroups(refs)
		Cookies.set('groupe', Object.entries(refs[parseInt(Cookies.get('annee'))-1])[0][0])
		update(refs)
	})

	$(document).on('click', '.pagination li', event => {
		Cookies.set('semaine', $(event.currentTarget).attr('data-semaine'), { expires: 365 })
		updatePagination()
		update(refs)
	})

	$(window).on('resize', _ => update(refs))

	$('a.magnifik').magnifik()

	update(refs)
	populateAnnee(totalAnnees)
	populateGroups(refs)
})

const populateGroups = (refs) => {
	const annee = parseInt(Cookies.get('annee'))
	const groups = $('.list-groups').html('')
	Object.entries(refs[annee - 1]).forEach(entry => groups.append(`<li data-group="${entry[0]}"><a href="#!">${entry[0]}</a></li>`))
}

const populateAnnee = nbrAnnees => {
	const annees = $('.list-annees').html('')
	for (let i = 1; i <= nbrAnnees; i++)
		annees.append(`<li data-annee="${i}"><a href="#!">${i}A</a></li>`)
}

const updatePagination = () => {
	let semaine = parseInt(Cookies.get('semaine'))

	let semaineMin = Math.max(1, semaine-3)
	let semaineMax = Math.min(52, semaine+3)

	$('.pagination').html('')

	if (semaine != 1)
		$('.pagination').append(`<li data-semaine="${semaine-1}"><a href="#!"><i class="material-icons">chevron_left</i></a></li>`)
			
		for (let i=semaineMin; i<=semaineMax; i++)
			$('.pagination').append(`<li data-semaine="${i}" class="${(semaine == i) ? 'active green' : ''}"><a href="#!">${i}</a></li>`)

	if (semaine != 52)
		$('.pagination').append(`<li data-semaine="${semaine+1}"><a href="#!"><i class="material-icons">chevron_right</i></a></li>`)
}

const update = (refs) => {
	$('.update-annee span').text(`Année - ${Cookies.get('annee')}A`)
	$('.update-groupe span').text(`Groupe - ${Cookies.get('groupe')}`)

	const width = window.innerWidth
	const height = window.innerHeight - 140
	const tree = refs[parseInt(Cookies.get('annee')) - 1][Cookies.get('groupe')]
	const semaine = Cookies.get('semaine')
	const imgWidth = Math.max(width, 700)
	const imgHeight = Math.max(height, 550)

	$('#edt').hide()
	$('#preloader').show()

	$('#edt').attr('src', `https://edt.grenoble-inp.fr/2017-2018/exterieur/jsp/imageEt?identifier=d76b8b64db4809c8917d56fbbad4ce72&`+
						  `idPianoWeek=${semaine}&idPianoDay=0%2C1%2C2%2C3%2C4&`+
						  `idTree=${tree}&width=${imgWidth}&height=${imgHeight}&`+
						  `lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1505210793984&displayConfId=15`)
	$('.magnifik').attr('href', `https://edt.grenoble-inp.fr/2017-2018/exterieur/jsp/imageEt?identifier=d76b8b64db4809c8917d56fbbad4ce72&`+
								`idPianoWeek=${semaine}&idPianoDay=0%2C1%2C2%2C3%2C4&`+
								`idTree=${tree}&width=${Math.max(width, 800)}&height=${Math.max(height, 800)}&`+
								`lunchName=REPAS&displayMode=1057855&showLoad=false&ttl=1505210793984&displayConfId=15`)

	if (imgWidth > width && imgHeight > height){
		const r1 = width/imgWidth
		const r2 = height/imgHeight
		if (r1 > r2)
			$('#edt').height(height).width('')
		else
			$('#edt').width(width).height('')
	} else if (imgWidth > width){
		$('#edt').width(width).height('')
	} else {
		$('#edt').height(height).width('')
	}
}