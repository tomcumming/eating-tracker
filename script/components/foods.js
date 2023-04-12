import { dbUpdateEventName, getFoods } from "../db.js";
import { queryOrDie, removeChildren } from "../utils.js";

class Foods extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<button class="add-new">Add new food type</button>
		<ul class="foods-list">TODO</ul>`;

    queryOrDie(this, HTMLButtonElement, ":scope > *.add-new").addEventListener(
      "click",
      this.#addNewClicked
    );

    this.addEventListener(dbUpdateEventName, this.#dataRefreshed);

    this.#dataRefreshed();
  }

  disconnectedCallback() {
    // TODO?
  }

  async #dataRefreshed() {
    const foods = await getFoods();

    const list = queryOrDie(this, HTMLUListElement, ":scope > *.foods-list");
    removeChildren(list);

    if (foods.length === 0) {
      list.classList.add("empty");
    } else {
      list.classList.remove("empty");

      for (const food of foods) {
        // Reverse order: newest at top
        const li = document.createElement("li");
        li.innerHTML = `<button class="name">${food.name}</button>
        <div>
          <button class="cals">Cals: ${food.cals}</button>
          <button class="cals">Carbs: ${food.carbs}</button>
        </div>`;

        li.insertBefore(li, list.firstChild);
      }
    }

    console.log(foods, list);
  }

  #addNewClicked() {
    const name = prompt("New food name");

    console.log("Adding ", name);
  }
}

customElements.define("et-foods", Foods);
