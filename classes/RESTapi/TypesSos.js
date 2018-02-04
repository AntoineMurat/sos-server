const typesSos = [{
  title: 'Une faim de hobbit',
  type: 'faim-de-hobbit',
  description: `Si toi aussi, tu te sens l’appétit d’un hobbit, ou que tu as juste envie de profiter de 6 repas dans la journée, c’est l’occasion rêvée ! (indisponible pendant les p'tits dej')`,
  parameters: [{
    name: 'Repas',
    code: 'REPAS',
    required: true,
    multi: false,
    values: [{
      name: 'Repas de liste : Poulet au curry avec légumes – 2€50',
      code: 'REPAS DE LISTE'
    }, {
      name: 'Cookies (x5) – 1€',
      code: '5 COOKIES'
    }, {
      name: 'Pâtes – gratuit',
      code: 'PATES'
    }, {
      name: 'Croque humain(e) - gratuit',
      code: 'CROQUE'
    }, {
      name: 'Ent (Plat de légumes) – gratuit',
      code: 'ENT LEGUMES'
    }, {
      name: 'Sucreries (Roses des sables, rochers, cookies) – gratuit',
      code: 'SUCRERIES'
    }, {
      name: 'Crêpes – gratuit',
      code: 'CREPES'
    }, {
      name: 'Petit Déjeuner du Hobbit (Jus de pomme ou d\'orange, croissant ou pain au chocolat. A réserver la veille.) – gratuit',
      code: 'PETIT DEJ HOBBIT'
    }]
  }]
}, {
  title: 'Une soif de nain',
  type: 'soif-de-nain',
  description: `Un vrai nain se doit d’avoir un foie résistant, afin de profiter au maximum de la semaine à venir !`,
  parameters: [{
    name: 'Boisson',
    code: 'BOISSON',
    multi: false,
    required: true,
    values: [{
      name: 'On vous propose en exclusivité notre recette de piña colada maison - 2€ le litre',
      code: 'COCKTAIL'
    }, {
      name: 'Alcool à foison - prix coûtant',
      code: 'ALCOOL A FOISON'
    }, {
      name: 'Maître des Nains – 5€ pour un mètre de shots',
      code: 'METRE DE SHOTS'
    }, {
      name: 'Bière des Dépravés (50cL de 8.6) – 1€',
      code: 'CANETTE 8.6'
    }, {
      name: 'Bière des Cavernes (la Cuvée des Trolls) – 3€',
      code: 'CUVEE DES TROLLS'
    }]
  }]
}, {
  title: 'Au chaud dans ta caverne',
  type: 'chaud-dans-caverne',
  description: `Une furieuse envie de rester tranquillement chez toi aujourd’hui ? Pas de soucis, on est toujours présents pour prendre soin de toi !`,
  parameters: [{
    name: 'Activité',
    code: 'ACTIVITE',
    multi: false,
    required: true,
    values: [{
      name: 'Film – gratuit',
      code: 'FILM'
    }, {
      name: 'Chorégraphie – gratuit',
      code: 'CHOREGRAPHIE'
    }, {
      name: 'Jeu à boire - alcool payant',
      code: 'BOIRE'
    }, {
      name: 'Jeux-vidéo : On débarque avec notre Battlefront et c\'est  tipar on vous met la misère.',
      code: 'BATTLEFRONT'
    }, {
      name: 'Jeu de cartes original – gratuit',
      code: 'JEU DE CARTES'
    }, {
      name: 'Shittyflute – gratuit',
      code: 'SHITTYFLUTE'
    }, {
      name: 'Expertise C de l\'AST (obligation de moyens) – gratuit',
      code: 'EXPERTISE C'
    }, {
      name: 'Magie – gratuit',
      code: 'MAGIE'
    }]
  }]
}, {
  title: 'Les Nain\'Dispensables',
  type: 'service',
  description: `Besoin d'un dépannage ou juste fainéant ? Nos nains sont là pour résoudre tous vos problèmes !`,
  parameters: [{
    name: `Corvée`,
    code: 'SERVICE',
    multi: false,
    required: true,
    values: [{
      name: 'Vaisselle – gratuit',
      code: 'VAISSELLE'
    }, {
      name: 'Ménage – gratuit',
      code: 'MENAGE'
    }, {
      name: 'Livraison Burger King - prix coûtant',
      code: 'BURGER KING'
    }, {
      name: 'Livraison Mac Do - prix coûtant',
      code: 'MAC DO'
    }, {
      name: 'Livraison Syfax - prix coûtant',
      code: 'SYFAX'
    }, {
      name: 'Livraison quelconque - prix coûtant',
      code: 'LIVRAISON QUELCONQUE'
    }, {
      name: 'Corvée quelconque – gratuit',
      code: 'QUELCONQUE'
    }]
  }]
}, {
  title: 'Roi du hasard',
  type: 'hasard',
  description: `Trop de choix tue le choix ? Nos Maîtres du Hasard se chargeront de choisir un SOS pour toi ! Des SOS payants sont également à gagner !`,
  parameters: [{
    name: `T'es tenté par`,
    code: 'TENTATION',
    multi: false,
    required: true,
    values: [{
      name: 'Une faim de hobbit – gratuit',
      code: 'FAIM'
    }, {
      name: 'Une soif de nain – gratuit',
      code: 'SOIF'
    }, {
      name: 'Au chaud dans ta caverne – gratuit',
      code: 'CAVERNE'
    }]
  }]
}]

module.exports = typesSos
