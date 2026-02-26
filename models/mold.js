import category from "./category";
import formSection from "./formSection";
import question from "./question";
import service from "./service";
import store from "./store";
import user from "./user";
import database from "@/infra/database";

async function create(inputValues) {
  const validValues = await validateInputValues(inputValues);
  const createdMold = runInsertQuery(validValues);
  return createdMold;

  async function validateInputValues(inputValues) {
    const propValidationObject = [
      {
        name: "store_ids",
        validateFunction: store.findOneValidById,
      },
      {
        name: "form_section_ids",
        validateFunction: formSection.findOneValidById,
      },
      {
        name: "category_ids",
        validateFunction: category.findOneValidById,
      },
      {
        name: "question_ids",
        validateFunction: question.findOneValidById,
      },
      {
        name: "service_ids",
        validateFunction: service.findOneValidById,
      },
    ];
    let validValues = {};

    for (const { name, validateFunction } of propValidationObject) {
      validValues[name] = await validateInputValue(
        inputValues,
        name,
        validateFunction,
      );
    }

    return validValues;
  }

  async function validateInputValue(inputValues, propName, validateFunction) {
    if (!(propName in inputValues)) {
      return [];
    }

    for (const id of inputValues[propName]) {
      await validateFunction(id);
    }

    return inputValues[propName];
  }

  async function runInsertQuery(inputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          appointment_molds
          (store_ids, form_section_ids, question_ids, category_ids, service_ids)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING
          *
      ;`,
      values: [
        inputValues.store_ids,
        inputValues.form_section_ids,
        inputValues.question_ids,
        inputValues.category_ids,
        inputValues.service_ids,
      ],
    });

    return results.rows[0];
  }
}

async function addFeatures(unallowedUser) {
  const allowedUser = user.addFeaturesByUserId(unallowedUser.id, [
    "create:mold",
    "edit:mold",
    "read:mold",
    "delete:mold",
  ]);
  return allowedUser;
}

const mold = { create, addFeatures };

export default mold;
