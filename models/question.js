import { NotFoundError, ValidationError } from "infra/errors";
import user from "./user";
import database from "infra/database";
import formSection from "./formSection";

async function create(questionInputValues) {
  const validQuestionObject = await getValidValues(questionInputValues);

  const createdQuestion = await runInsertQuestion(validQuestionObject);
  return createdQuestion;

  async function getValidValues(inputValues) {
    let validValues = {};

    validValues.statement = await getValidStatement(inputValues);

    validValues.type = getValidType(inputValues);

    validValues.options = getValidOptions(inputValues);

    validValues.optionMarked = getValidOptionMarked(inputValues);

    validValues.sectionId = await getValidSectionId(inputValues);

    validValues.answer = inputValues?.answer ? inputValues.answer : null;

    return validValues;
  }

  async function getValidStatement(inputValues) {
    if (!("statement" in inputValues) || !inputValues.statement) {
      throw new ValidationError({
        message: "Campo de pergunta está inválido.",
        action:
          "Verifique se o campo de pergunta está correto e tente novamente.",
      });
    }

    await validateUniqueStatement(inputValues.statement);

    return inputValues.statement;
  }

  async function validateUniqueStatement(statement) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          questions
        WHERE
          statement = $1
        LIMIT
          1
      ;`,
      values: [statement],
    });

    if (results.rowCount !== 0) {
      throw new ValidationError({
        message: "Esta pergunta já existe.",
        action: "Reformule a pergunta e tente novamente.",
      });
    }
  }

  function getValidType(inputValues) {
    const questionTypes = ["multiple-choice", "discursive", "both"];

    if (!("type" in inputValues) || !questionTypes.includes(inputValues.type)) {
      throw new ValidationError({
        message: "Tipo da pergunta inválido.",
        action:
          "Verifique se a propriedade type é algum dos seguintes valores: 'multiple-choice', 'discursive', 'both'.",
      });
    }

    return inputValues.type;
  }

  function getValidOptions(inputValues) {
    const requiredOptionTypes = ["multiple-choice", "both"];

    if (requiredOptionTypes.includes(inputValues.type)) {
      if (
        !("options" in inputValues) ||
        !inputValues.options ||
        inputValues.options.length < 2
      ) {
        throw new ValidationError({
          message: "Campo de opções está inválido.",
          action: "Insira pelo menos duas opções e tente novamente.",
        });
      }
    }
    return inputValues?.options ? inputValues.options : [];
  }

  function getValidOptionMarked(inputValues) {
    if ("option_marked" in inputValues) {
      const optionMarked = inputValues.option_marked;
      const options = inputValues.options;

      if (!options.includes(optionMarked)) {
        throw new ValidationError({
          message: "Opção marcada inválida.",
          action:
            "Verifique se a opção marcada está presente nas opções possíveis.",
        });
      }
      return inputValues.option_marked;
    }

    return null;
  }

  async function getValidSectionId(inputValues) {
    try {
      if ("section_id" in inputValues) {
        await formSection.findOneValidById(inputValues.section_id);
        return inputValues.section_id;
      }

      return null;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new ValidationError(error);
      }

      throw error;
    }
  }

  async function runInsertQuestion(questionObject) {
    const results = await database.query({
      text: `
        INSERT INTO
          questions
          (statement, type, options, option_marked, answer, section_id)
        VALUES
          ($1, $2, $3, $4, $5, $6)
        RETURNING
          *
      ;`,
      values: [
        questionObject.statement,
        questionObject.type,
        questionObject.options,
        questionObject.optionMarked,
        questionObject.answer,
        questionObject.sectionId,
      ],
    });

    return results.rows[0];
  }
}

async function addFeatures(forbiddenUser) {
  const allowedUser = user.addFeaturesByUserId(forbiddenUser.id, [
    "create:question",
    "read:question",
    "edit:question",
    "delete:question",
  ]);

  return allowedUser;
}

const question = { create, addFeatures };

export default question;
