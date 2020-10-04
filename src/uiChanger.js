import * as elements from './UiElements';

export const setButtonClick = (tgt) => {
  // remove selected class from all elements
  // create an array from the child elements
  const quanArr = Array.from(tgt.parentNode.children);
  // loop over the array and remove the 'selected' class
  quanArr.forEach((el) => el.classList.remove('selected'));
  // add selected to target element
  tgt.classList.add('selected');
};

export const updateIngQty = (arr, parent) => {
  arr.forEach((i) => {
    const templ = `
      <div class="ingredient-row">
        <span class="ingredient-quantity">${Math.round(i.qty)}g</span>
        <span class="ingredient-name">${i.name}</span>
        <span class="ingredient-percent inline-button">${Math.round(
          i.BPct * 100
        )}%</span>
      </div>
      `;
    parent.insertAdjacentHTML('beforeend', templ);
  });
};

export const emptyParent = (parent) => {
  parent.innerHTML = '';
};

// export const toggleModal = () => {
//   if (window.location.hash.includes('add')) {
//     showIngModal();
//   } else {
//     hideIngModal();
//   }
// };

export const showIngModal = () => {
  elements.overlay.classList.remove('hidden');
  //window.location.hash = 'add';
};

export const hideIngModal = () => {
  //window.location.hash = '';
  clearModalValues();
  hideDeleteIngButton();
  elements.overlay.classList.add('hidden');
};

export const clearModalValues = () => {
  elements.newIngName.value = '';
  elements.newIngQty.value = '';
  elements.newIngBPct.placeholder = 'BAKERS %';
  // un-select the buttons
  const newArr = Array.from(elements.newIngTypeParent.children);
  newArr.forEach((el) => el.classList.remove('selected'));
};

export const addIngredientsToModal = (name, qty, type) => {
  elements.newIngName.value = name;
  elements.newIngQty.value = qty;
  // find the selected type
  const newArr = Array.from(elements.newIngTypeParent.children);
  newArr.forEach((el) => {
    if (el.innerHTML.toLowerCase() === type) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
};

export const showDeleteIngButton = () => {
  elements.deleteIngButton.classList.remove('hidden');
};

export const hideDeleteIngButton = () => {
  elements.deleteIngButton.classList.add('hidden');
};

export const setNewIngBPct = (newIngQty, curFlour, editing = false) => {
  // update the bakers % calc placeholder
  if (elements.newIngQty.value.length > 0) {
    if (editing) {
      elements.newIngBPct.placeholder = `BAKERS: ${Math.round(
        (newIngQty / curFlour) * 100
      )}%`;
    } else {
      elements.newIngBPct.placeholder =
        Math.round((newIngQty / (newIngQty + curFlour)) * 100) + '%';
    }
  }
};

export const modalSetBPct = (ingObj, totalFlour) => {
  // only change bpct if there is an input and it's a number
  if (
    elements.newIngQty.value.length > 0 &&
    typeof parseInt(elements.newIngQty.value) === 'number'
  ) {
    if (ingObj.ingType === 'flour' && ingObj.isNewIng === true) {
      // ingredient is new, and is a flour type
      elements.newIngBPct.placeholder =
        Math.round((ingObj.qty / (ingObj.qty + totalFlour)) * 100) + '%';
    } else {
      elements.newIngBPct.placeholder = `BAKERS: ${Math.round(
        (ingObj.qty / totalFlour) * 100
      )}%`;
    }
  } else {
    elements.newIngBPct.placeholder = `BAKERS %`;
  }
};

export const showCurrentLoafSize = (recipe) => {
  const loafPreSets = getLoafSizePreSets();
  if (loafPreSets.indexOf(recipe.doughMass) === -1) {
    elements.loafSizeLabel.insertAdjacentHTML(
      'afterend',
      `<span class="white-cta loaf-mass selected" id="current-loaf-mass">${Math.round(
        recipe.doughMass
      )}g</span>`
    );
  }
};

const removeSelectedFromLoafQuantity = () => {
  const currLoafSizesEls = Array.from(document.querySelectorAll('.loaf-mass'));
  currLoafSizesEls.forEach((el) => el.classList.remove('selected'));
};

const getLoafSizePreSets = () => {
  const currLoafSizesEls = Array.from(document.querySelectorAll('.loaf-mass'));
  currLoafSizesEls.forEach((el) => el.classList.remove('selected'));
  const curLoafSizes = currLoafSizesEls.map((el) =>
    parseInt(el.innerHTML.replace('g', ''))
  );
  return curLoafSizes;
};

export const showDoughMassAdder = () => {
  elements.otherDoughMass.classList.add('hidden');
  elements.doughMassInserter.classList.remove('hidden');
  elements.otherLoafQuantity.focus();
};

export const addDoughMass = (newMass) => {
  // remove 'selected' from the "+"
  const currLoafSizesEls = Array.from(document.querySelectorAll('.loaf-mass'));
  currLoafSizesEls.forEach((el) => el.classList.remove('selected'));
  //add new loaf to list
  elements.doughMassInserter.insertAdjacentHTML(
    'beforebegin',
    `<span class="white-cta loaf-mass selected">${newMass}g</span>`
  );
  // hide the new mass adder, clear its value, and show the +
  hideNewInput();
};

export const hideNewInput = () => {
  //hide all the input boxes
  const allInputBoxes = Array.from(document.querySelectorAll('.input-box'));
  allInputBoxes.forEach((e) => e.classList.add('hidden'));

  // clear the values from all input elements in the document
  const allInputs = Array.from(document.querySelectorAll('input'));
  allInputs.forEach((e) => (e.value = ''));

  // show all the plusses
  const allPlusEls = Array.from(document.querySelectorAll('.plus'));
  allPlusEls.forEach((e) => e.classList.remove('hidden', 'selected'));
};
