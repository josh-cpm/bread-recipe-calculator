import * as m from './src/recipeMethods';
import { recipe } from './src/recipeData';
import * as elements from './src/UiElements';
import * as ui from './src/uiChanger';

// New Ingredient State Object
let newIngredient = {};

const init = () => {
  m.updateDoughStats();
  ui.emptyParent(elements.ingredientList);
  ui.updateIngQty(recipe.ingredients, elements.ingredientList);
  ui.showCurrentLoafSize(recipe);
  newIngredient = {};
};

init();

const newDoughMass = () => {
  const newMass = elements.otherLoafQuantity.value;
  m.scaleDoughMass(newMass);
  ui.addDoughMass(newMass);
  ui.emptyParent(elements.ingredientList);
  ui.updateIngQty(recipe.ingredients, elements.ingredientList);
};

// change data model quanitity
// 1. get the click event value and parent
elements.quantityList.addEventListener('click', (cur) => {
  // store the click event target
  const clk = cur.target;

  // TODO - add the function to allow me to click the "+"
  if (clk.parentNode.className === 'size-loaves') {
    // if you clicked in the loaf-size section, change loaf size
    if (clk.innerHTML.includes('g')) {
      const loafSize = parseInt(clk.innerHTML.replace('g', ''));
      if (loafSize) {
        m.scaleDoughMass(loafSize, recipe.numLoaves);
      }
    } else if (clk === elements.otherDoughMass) {
      ui.showDoughMassAdder();
    } else if (clk.id === 'cta-save-loaf-size') {
      newDoughMass();
    }
  } else if (clk.parentNode.className === 'num-loaves') {
    // if you clicked the loaf number section, change loaf number
    const num = parseInt(clk.innerHTML);
    if (num) {
      m.setLoafNum(num);
    }
  } else if (clk === elements.otherLoafQuantity) {
    console.log('other dough quant');
  }
  // update the UI. Only change the class if a button was clicked
  if (clk.className.includes('cta')) ui.setButtonClick(clk);
  m.updateDoughStats();
  ui.emptyParent(elements.ingredientList);
  ui.updateIngQty(recipe.ingredients, elements.ingredientList);
});

// const displayModal = () => {
//   newIngredient.editingMode = false;
//   ui.showIngModal();
// };

// Show & Hide Add Ingredient Modal
window.addEventListener('hashchange', ui.toggleModal); // listen for hash changes
elements.addIngButton.addEventListener('click', () => {
  newIngredient.isNewIng = true;
  ui.showIngModal();
});

elements.closeIngModal.addEventListener('click', () => {
  ui.hideIngModal();
  init();
});

// Listen for values in the adding modal
elements.newIngTypeParent.addEventListener('click', (cur) => {
  const clk = cur.target;
  newIngredient.ingType = cur.target.innerHTML;
  if (clk.className.includes('cta')) ui.setButtonClick(clk);
});

elements.newIngName.addEventListener('input', () => {
  newIngredient.name = elements.newIngName.value;
});

// changeme
elements.newIngQty.addEventListener('input', () => {
  // update the new ingredient object
  newIngredient.qty = parseInt(elements.newIngQty.value);
  ui.setNewIngBPct(newIngredient.qty, m.sumIngredientType('flour'));
  // new method changes bpct based on ing type
  ui.modalSetBPct(newIngredient, m.sumIngredientType('flour'));
});

// Add new ingredient or return an error
const saveIngredientChanges = () => {
  if (newIngredient.name && newIngredient.qty > 0 && newIngredient.ingType) {
    // edit the ingredient if it already exists in the recipe model
    if (m.getIngredientByName(newIngredient.name)) {
      m.modIngredient(newIngredient.name, newIngredient.qty);
    } else {
      m.addIngredient(
        // name, qty, ingType
        newIngredient.name,
        newIngredient.qty,
        newIngredient.ingType
      );
    }
    newIngredient = {};
    ui.hideIngModal();
    init();
  } else {
    alert(
      `Please add a type, name, and quantity in order to add your ingredient.`
    );
  }
};

elements.saveIngButton.addEventListener('click', saveIngredientChanges);

// Edit Ingredient 1: Show Modal with values
elements.ingredientList.addEventListener('click', (cur) => {
  // get the target of the click
  try {
    const name = Array.from(cur.target.parentNode.children).find(
      (el) => el.className === 'ingredient-name'
    ).innerHTML;

    // locate the ingredient in the data model
    let ing = m.getIngredientByName(name);
    // add the ingredient to the modal and open it
    ui.addIngredientsToModal(ing.name, Math.round(ing.qty), ing.ingType);
    // TODO: change this bpct function
    //ui.setNewIngBPct(ing.qty, m.sumIngredientType('flour'), true);
    newIngredient = ing;
    newIngredient.isNewIng = false;
    ui.modalSetBPct(newIngredient, m.sumIngredientType('flour'));
    ui.showIngModal();
    ui.showDeleteIngButton();
  } catch (error) {}
});

// Edit Ingredient 2: Delete Ingredient Event listener
elements.deleteIngButton.addEventListener('click', () => {
  m.deleteIngredient(newIngredient.name);
  init();
  ui.hideIngModal();
});

// event listeners for quantity section
// otherLoafQuantity;
// otherDoughMass;

//elements.otherDoughMass.addEventListener('click', ui.newDoughMass);

// Listen for key presses
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    if (!elements.overlay.classList.contains('hidden')) {
      ui.hideIngModal();
      init();
    }
    ui.hideNewInput();
  } else if (e.key === 'Enter') {
    if (elements.otherLoafQuantity.value > 0) {
      newDoughMass();
    } else if (!elements.overlay.classList.contains('hidden')) {
      saveIngredientChanges();
    }
  }
});
