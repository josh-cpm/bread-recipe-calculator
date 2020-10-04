export let recipe = {
  ingredients: [
    // NOTE: ingredient names should be unique
    {
      name: 'White Bread Flour',
      qty: 300,
      ingType: 'flour',
    },
    {
      name: 'Whole Wheat Flour',
      ingType: 'flour',
      qty: 100,
    },
    {
      name: 'Water',
      qty: 300,
      ingType: 'water',
    },
    {
      name: 'Salt',
      ingType: 'salt',
      qty: 8,
    },
    {
      name: 'Levain',
      ingType: 'levain',
      qty: 80,
      hydration: 1,
    },
  ],
  numLoaves: 1,
  title: 'Peasant Loaf',
  description: 'My go-to weekday loaf. 25% whole wheat and just enough water.',
};
