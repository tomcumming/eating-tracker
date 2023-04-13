export const dbUpdateEventName = "db-update";

const localStorageKey = "db";

/** @type {Schema} */
const emptyDb = {
  foods: [],
};

/** @returns {Promise<Schema>} */
async function readData() {
  const src = localStorage.getItem(localStorageKey);

  /** @type {Schema} */
  let db;

  if (src === null) {
    db = emptyDb;
  } else {
    db = JSON.parse(src);
  }

  return db;
}

export async function getFoods() {
  const data = await readData();
  return data.foods;
}

/**
 * @param {undefined | number} id
 * @param {Food} food
 */
export async function setFood(id, food) {
  const db = await readData();
  if (id !== undefined) {
    db.foods[id] = food;
  } else {
    db.foods.push(food);
  }

  localStorage.setItem(localStorageKey, JSON.stringify(db));

  globalThis.dispatchEvent(new Event(dbUpdateEventName));

  return id === undefined ? db.foods.length - 1 : id;
}
