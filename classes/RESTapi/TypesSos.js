const typesSos = [{
  title: 'Une faim de hobbit',
  type: 'faim-de-hobbit',
  description: `Si toi aussi, tu te sens l’appétit d’un hobbit, ou que tu as juste envie de profiter de 6 repas dans la journée, c’est l’occasion rêvée !`,
  parameters: [{
    name: 'Repas',
    code: 'REPAS',
    required: true,
    multi: false,
    values: [{
      name: 'Repas de liste : Poulet au curry avec légumes – 2€50',
      code: 'LISTE'
    }, {
      name: 'Pâtes – gratuit',
      code: 'PATES'
    }, {
      name: 'Croque humain - gratuit',
      code: 'CROQUE'
    }, {
      name: 'Ent : Plat de légumes – gratuit',
      code: 'ENT'
    }, {
      name: 'Sucreries : Roses des sables, rochers, cookies – gratuit',
      code: 'SUCRERIES'
    }, {
      name: 'Crêpes – gratuit',
      code: 'CREPES'
    }, {
      name: 'Petit Déjeuner du Hobbit : chocolat chaud ou café, jus de pomme ou jus d’orange, croissant ou pain au chocolat – gratuit (à réserver la veille)',
      code: 'HOBBIT'
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
      name: 'On vous propose en exclusivité notre recette de piña colada maison, préparée par les plus grans connaisseurs de nos Terres - 2€ le litre',
      code: 'COCKTAIL'
    }, {
      name: 'Alcool à foison - prix contant',
      code: 'FOISON'
    }, {
      name: 'Maître des Nains – 5€ pour un mètre de shots',
      code: 'MAITRE'
    }, {
      name: 'Bière des Dépravés – 1€ la canette de 50 cL de 8.6',
      code: 'DEPRAVE'
    }, {
      name: 'Bière des Cavernes – 3€ la cuvée des trolls',
      code: 'TROLLS'
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
      name: 'Films',
      code: 'FILMS'
    }, {
      name: 'Chorégraphie',
      code: 'CHORE'
    }, {
      name: 'Jeu à boire - alcool payant',
      code: 'BOIRE'
    }, {
      name: 'Jeux-Vidéo : Jeux vidéo : S’il vous manque des joueurs, ou s’il vous prend l’envie de vous mesurer à nos joueurs, ce SOS est fait pour vous ! (Battlefront, Warcraft , CS - possibilité de venir avec une clé USB avec les jeux)',
      code: 'JV'
    }, {
      name: 'Jeu de carte original',
      code: 'JDC'
    }]
  }]
}, {
  title: 'Roi du hasard',
  type: 'hasard',
  description: `Trop de choix tue le choix ? Nos Maîtres du Hasard se chargeront de choisir un SOS pour toi ! N’hésite pas à tenter ta chance, des SOS payants sont également à gagner !`,
  parameters: [{
    name: `T'es tenté par`,
    code: 'TENTATION',
    multi: false,
    required: true,
    values: [{
      name: 'Une faim de hobbit',
      code: 'FAIM'
    }, {
      name: 'Une soif de nain',
      code: 'SOIF'
    }, {
      name: 'Au chaud dans ta caverne',
      code: 'CAVERNE'
    }]
  }]
}, {
  title: `L'expertise C de l'AST`,
  type: 'ast',
  description: `La campagne c'est un truc de guedin mais le C c'est la galère ? Nos AST les plus dévoués sont là pour résoudre vos bugs. `,
  parameters: [{
    name: `J'ai besoin`,
    code: 'BESOIN',
    multi: false,
    required: true,
    values: [{
      name: `d'aide pour un algo`,
      code: 'ALGO'
    }, {
      name: `qu'on m'explique le C`,
      code: 'C'
    }, {
      name: `de comprendre les pointeurs`,
      code: 'POINTEURS'
    }]
  }]
}]

module.exports = typesSos
