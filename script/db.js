/**
@typedef {{ name: string; cals: number; carbs: number }} Food
*/

/**
@typedef {{ foods: Food[] }} Schema
*/
/** @type {Schema} */
const emptyDb = {
  foods: [],
};

export const dbUpdateEventName = "db-update";

/** @returns {Promise<Schema>} */
async function loadData() {
  const src = localStorage.getItem("db");

  /** @type {Schema} */
  let db;

  if (src === null) {
    db = emptyDb;
  } else {
    db = JSON.parse(src);
  }

  window.dispatchEvent(new Event(dbUpdateEventName));

  return db;
}

export async function getFoods() {
  const data = await loadData();
  return data.foods;
}

/**
 * @param {undefined | number} id
 * @param {Food} food
 */
export async function setFood(id, food) {
  const db = await loadData();
  if (id !== undefined) {
    db.foods[id] = food;
  } else {
    db.foods.push(food);
  }

  return id === undefined ? db.foods.length - 1 : id;
}
