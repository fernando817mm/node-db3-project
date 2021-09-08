const db = require("../../data/db-config");

function find() {
  return db("schemes")
    .leftJoin("steps", "schemes.scheme_id", "=", "steps.scheme_id")
    .select("schemes.*")
    .count("steps.step_id as number_of_steps")
    .groupBy("schemes.scheme_id")
    .orderBy("scheme_id", "asc");
}

async function findById(scheme_id) {
  const rows = await db("schemes")
    .leftJoin("steps", "schemes.scheme_id", "steps.scheme_id")
    .where("schemes.scheme_id", scheme_id)
    .select("steps.*", "schemes.scheme_name", "schemes.scheme_id")
    .orderBy("steps.step_number");

  const result = {
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: [],
  };

  rows.map((row) => {
    row.step_id
      ? result.steps.push({
          step_id: row.step_id,
          step_number: row.step_number,
          instructions: row.instructions,
        })
      : [];
  });

  return result;
}

async function findSteps(scheme_id) {
  const rows = await db("schemes")
    .leftJoin("steps", "schemes.scheme_id", "steps.scheme_id")
    .select(
      "steps.step_id",
      "steps.step_number",
      "instructions",
      "schemes.scheme_name"
    )
    .where("schemes.scheme_id", scheme_id)
    .orderBy("step_number");

  if (!rows[0].step_id) return [];
  return rows;
}

function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .then(([scheme_id]) => {
      return db("schemes").where("scheme_id", scheme_id).first();
    });
}

function addStep(scheme_id, step) {
  // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */

  return db("steps")
    .insert({
      ...step,
      scheme_id: scheme_id,
    })
    .then(() => {
      return db("steps").where("scheme_id", scheme_id).orderBy("step_number");
    });
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};
