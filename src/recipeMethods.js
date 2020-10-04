import { recipe } from './recipeData';

/******
 * Callback functions for the
 * ingredients array
 */
export const sumIngredientType = (type, arr = recipe.ingredients) => {
  let sum = 0;
  arr.forEach((el) => {
    if (el.ingType.toLowerCase() === type.toLowerCase()) sum += el.qty;
  });
  return sum;
};

export const getIngredientByType = (type, arr = recipe.ingredients) => {
  const objIndex = arr.findIndex(
    (el) => el.ingType.toLowerCase() === type.toLowerCase()
  );
  return arr[objIndex];
};

export const getIngredientByName = (name, arr = recipe.ingredients) => {
  const objIndex = arr.findIndex(
    (el) => el.name.toLowerCase() === name.toLowerCase()
  );
  return arr[objIndex];
};

/**
 * Function to return flour and water amounts from
 * an hydration ratio. Useful for levain and for doughs.
 *
 * @param {number} mass
 * @param {number: percent as decimal} hydration
 */
const hydrationBreakdown = (mass, hydration) => {
  const flour = mass / (1 + hydration);
  const water = mass - flour;
  return {
    mass: mass,
    hydration: hydration,
    flour: flour,
    water: water,
  };
};

/****
 * Updates the overall recipe stats
 */

const calcDoughPct = () => {
  calcDoughMass();
  recipe.ingredients.forEach((el) => {
    el.doughPct = el.qty / recipe.doughMass;
  });
};

const calcBPct = () => {
  recipe.ingredients.forEach((el) => {
    el.BPct = el.qty / sumIngredientType('flour');
  });
};

export const getDoughMass = (excludeMixIns = false) => {
  let total = 0;

  if (excludeMixIns === true) {
    recipe.ingredients.forEach((el) => {
      if (
        el.ingType === 'flour' ||
        el.ingType === 'water' ||
        el.ingType === 'levain' ||
        el.ingType === 'salt'
      )
        total += el.qty;
    });
    return total;
  } else {
    recipe.ingredients.forEach((el) => (total += el.qty));
    return total;
  }
};

const calcDoughMass = (excludeMixIns = false) => {
  recipe.doughMass = getDoughMass(excludeMixIns);
};

const calcEndHydration = () => {
  let totalFlour = 0;
  let totalWater = 0;

  // get the flour from levain
  const lev = getIngredientByType('levain');
  const levObj = hydrationBreakdown(lev.qty, lev.hydration);
  totalFlour = levObj.flour + sumIngredientType('flour');

  // add the waters
  totalWater = getIngredientByType('water').qty + levObj.water;
  // update the end hydration
  recipe.endHydration = totalWater / totalFlour;
};

const calcBakersHydration = () => {
  recipe.bakersHydration =
    getIngredientByType('water').qty / sumIngredientType('flour');
};

export const updateDoughStats = () => {
  calcDoughMass();
  calcBakersHydration();
  calcEndHydration();
  calcDoughPct();
  calcBPct();
};

/**
 * Functions to mutate the recipe
 */

// Make more or less dough, while keeping the ingredient
// percentages constant
export const scaleDoughMass = (
  newMass,
  numLoaves = 1,
  excludeMixIns = false
) => {
  const massMultiplier = newMass / getDoughMass(excludeMixIns);
  recipe.ingredients.forEach((el) => {
    el.qty = el.qty * massMultiplier * numLoaves;
  });
  recipe.numLoaves = numLoaves;
};

export const setLoafNum = (loafNum) => {
  recipe.ingredients.forEach(
    (el) => (el.qty = el.qty * (loafNum / recipe.numLoaves))
  );
  recipe.numLoaves = loafNum;
  updateDoughStats();
};

// Increase the amount of flour or water in the recipe
// while keeping the dough mass dough mass the same

const changeBakersHydration = (newHydration) => {
  calcDoughMass();
  const mass = recipe.doughMass;

  // get your new flour and water totals
  const loafHydroObj = hydrationBreakdown(recipe.doughMass, newHydration);

  // update the water prop
  getIngredientByType('water').qty = loafHydroObj.water;

  // scale flour up or down, keeping the ratio of flours fixed
  const flourMultipler = loafHydroObj.flour / sumIngredientType('flour');
  recipe.ingredients.forEach((el) => {
    if (el.ingType === 'flour') el.qty *= flourMultipler;
  });

  // Set the mass back to the right size and update stats
  scaleDoughMass(mass);
  updateDoughStats();
};

// Add a new ingredient to the array, then update the overall
// recipe stats to reflect the change
export const modIngredient = (ingName, newQty) => {
  if (getIngredientByName(ingName).qty) {
    getIngredientByName(ingName).qty = newQty;
    updateDoughStats();
  } else {
    console.log(
      `Could not modify ${ingName} because the element was not found in the recipe.`
    );
  }
};

// delete an ingredient
export const deleteIngredient = (ingName) => {
  recipe.ingredients = recipe.ingredients.filter((el) => el.name !== ingName);
};

// add new ingredient
export const addIngredient = (name, qty, type, hydration = -1) => {
  if (hydration > 0) {
    recipe.ingredients.push({
      name,
      qty,
      ingType: type.toLowerCase(),
      hydration,
    });
    updateDoughStats();
  } else {
    recipe.ingredients.push({
      name,
      qty,
      ingType: type.toLowerCase(),
    });
    updateDoughStats();
  }
};
