import { dbUpdateEventName, getFoods, setFood } from "../db.js";
import { promptNumber, queryOrDie, removeChildren } from "../utils.js";

class Foods extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button class="add-new">Add new food type</button>
		<ul class="foods-list">TODO</ul>`;

    queryOrDie(this, HTMLButtonElement, ":scope > *.add-new").addEventListener(
      "click",
      this.#addNewClicked
    );

    globalThis.addEventListener(dbUpdateEventName, this.#dataRefreshed);

    this.#dataRefreshed();
  }

  disconnectedCallback() {
    globalThis.removeEventListener(dbUpdateEventName, this.#dataRefreshed);
  }

  #dataRefreshed = async () => {
    const foods = await getFoods();

    const list = queryOrDie(this, HTMLUListElement, ":scope > *.foods-list");
    removeChildren(list);

    if (foods.length === 0) {
      list.classList.add("empty");
    } else {
      list.classList.remove("empty");

      foods.forEach((food, idx) => {
        // Reverse order: newest at top
        const li = renderFoodItem(idx, food, (id, food) => setFood(id, food));
        list.insertBefore(li, list.firstChild);
      });
    }
  };

  #addNewClicked = () => {
    const name = prompt("New food name");
    if (name !== null) setFood(undefined, { name, cals: 0, carbs: 0 });
  };
}

/**
 * @param {Food} food
 * @param {number} id
 * @param {(id: number, food: Food) => void} onEdit
 */
function renderFoodItem(id, food, onEdit) {
  const li = document.createElement("li");
  li.classList.add("food");
  li.innerHTML = `<button data-id="${id}" class="name">${food.name}</button>
    <div>
      <button class="cals">Cals: ${food.cals}</button>
      <button class="carbs">Carbs: ${food.carbs}</button>
    </div>`;

  const nameButton = queryOrDie(li, HTMLButtonElement, ":scope > button.name");
  const calsButton = queryOrDie(
    li,
    HTMLButtonElement,
    ":scope > div > button.cals"
  );
  const carbsButton = queryOrDie(
    li,
    HTMLButtonElement,
    ":scope > div > button.carbs"
  );

  nameButton.addEventListener("click", () => {
    const name = prompt(`Rename '${food.name}'`);
    if (name !== null) onEdit(id, { ...food, name });
  });
  calsButton.addEventListener("click", () => {
    const cals = promptNumber(`New Cals value`);
    if (cals !== null) onEdit(id, { ...food, cals });
  });
  carbsButton.addEventListener("click", () => {
    const carbs = promptNumber(`New Carbs value`);
    if (carbs !== null) onEdit(id, { ...food, carbs });
  });

  return li;
}

customElements.define("et-foods", Foods);
