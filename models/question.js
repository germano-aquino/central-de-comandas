import { NotFoundError, ValidationError } from "infra/errors";
import user from "./user";
import database from "infra/database";
import formSection from "./formSection";

const REQUIRED_OPTIONS_TYPES = ["multiple-choice", "both"];
const TYPES = ["multiple-choice", "discursive", "both"];

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

    return inputValues.statement;
  }

  function getValidOptions(inputValues) {
    if (REQUIRED_OPTIONS_TYPES.includes(inputValues.type)) {
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
    if ("option_marked" in inputValues && inputValues.option_marked) {
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

async function update(questionInputValues, queryParams) {
  const validQuestionObject = await getValidValues(
    questionInputValues,
    queryParams,
  );

  const updatedQuestion = await runUpdateQuery(validQuestionObject);
  return updatedQuestion;

  async function getValidValues(inputValues, queryParams) {
    let validObject = {};

    const questionId = queryParams.id;
    validObject.removeSection = queryParams?.remove_form_section != undefined;

    const storedQuestion = await findOneValidById(questionId);

    validObject.id = questionId;
    validObject.statement = await getValidStatement(inputValues);
    validObject.type = getValidType(inputValues);
    validObject.options = getValidOptions(inputValues, storedQuestion);
    validObject.optionMarked = getValidOptionMarked(
      inputValues,
      storedQuestion,
    );
    validObject.answer = inputValues?.answer ? inputValues.answer : null;
    validObject.sectionId = await getValidSectionId(inputValues);

    return validObject;
  }

  async function getValidStatement(inputValues) {
    if ("statement" in inputValues && inputValues.statement) {
      await validateUniqueStatement(inputValues.statement);
      return inputValues.statement;
    }
    return null;
  }

  function getValidType(inputValues) {
    if ("type" in inputValues) {
      if (!TYPES.includes(inputValues.type)) {
        throw new ValidationError({
          message: "Tipo da pergunta inválido.",
          action:
            "Verifique se a propriedade type é algum dos seguintes valores: 'multiple-choice', 'discursive', 'both'.",
        });
      }
      return inputValues.type;
    }
    return null;
  }

  function getValidOptions(inputValues, storedQuestion) {
    const type = inputValues?.type ? inputValues.type : storedQuestion.type;
    const optionMarked = inputValues?.option_marked
      ? inputValues.option_marked
      : storedQuestion.option_marked;

    if (REQUIRED_OPTIONS_TYPES.includes(type)) {
      if ("options" in inputValues) {
        if (!inputValues.options || inputValues.options.length < 2) {
          throw new ValidationError({
            message:
              "Este tipo de pergunta necessita de pelo menos duas opções para ser válido.",
            action: "Envie a propriedade 'options' com pelo menos duas opções.",
          });
        }

        if (optionMarked && !inputValues.options.includes(optionMarked)) {
          throw new ValidationError({
            message: "As novas opções não contém a opção marcada.",
            action:
              "Modifique a opção marcada ou inclua a opção marcada entre as opções possíveis.",
          });
        }

        return inputValues.options;
      } else {
        if (
          storedQuestion.type === "discursive" &&
          storedQuestion.options.length < 2
        ) {
          throw new ValidationError({
            message:
              "Este tipo de pergunta necessita de pelo menos duas opções para ser válido.",
            action: "Envie a propriedade 'options' com pelo menos duas opções.",
          });
        }
      }
    }
    return null;
  }

  function getValidOptionMarked(inputValues, storedQuestion) {
    const type = inputValues?.type ? inputValues.type : storedQuestion.type;
    const options = inputValues?.options
      ? inputValues.options
      : storedQuestion.options;

    if (REQUIRED_OPTIONS_TYPES.includes(type)) {
      if ("option_marked" in inputValues) {
        if (!options.includes(inputValues.option_marked)) {
          throw new ValidationError({
            message:
              "A nova opção marcada não está contida as opções possíveis.",
            action:
              "Modifique a opção marcada para uma dentre as opções possíveis.",
          });
        }
        return inputValues.option_marked;
      }
    }
    return null;
  }

  async function runUpdateQuery(questionObject) {
    let values = [
      questionObject.id,
      questionObject.statement,
      questionObject.type,
      questionObject.options,
      questionObject.optionMarked,
      questionObject.answer,
    ];
    let query = `UPDATE
          questions
        SET
          statement = COALESCE($2, statement),
          type = COALESCE($3, type),
          options = COALESCE($4, options),
          option_marked = COALESCE($5, option_marked),
          answer = COALESCE($6, answer),
          updated_at = TIMEZONE('utc', NOW()),`;

    if (questionObject.removeSection) {
      query += " section_id = NULL";
    } else {
      values.push(questionObject.sectionId);
      query += " section_id = COALESCE($7, section_id)";
    }

    query += " WHERE id = $1 RETURNING *;";

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows[0];
  }
}

async function retrieveAll(queryParams) {
  const storedQuestions = runSelectQuery(queryParams);

  return storedQuestions;

  async function runSelectQuery(queryParams) {
    let values = [];
    let query = "SELECT * FROM questions WHERE TRUE";

    if ("form_section_name" in queryParams) {
      const formSectionId = await getValidSectionId({
        section_name: queryParams.form_section_name,
      });
      values.push(formSectionId);
      query += ` AND section_id = $${values.length}`;
    }

    if ("no_form_section" in queryParams) {
      query += ` AND section_id IS NULL`;
    }

    if ("question_type" in queryParams) {
      const type = getValidType({ type: queryParams.question_type });
      values.push(type);
      query += ` AND type = $${values.length}`;
    }

    query += ";";

    const results = await database.query({
      text: query,
      values,
    });

    return results.rows;
  }
}

async function updateManyByIdArray(questionInputValues, queryParams) {
  if (inputIsInvalid(questionInputValues)) {
    return [];
  }
  let updatedQuestions = [];

  for (const id of questionInputValues.question_ids) {
    const updatedQuestion = await update(questionInputValues, {
      id,
      remove_form_section: queryParams?.remove_form_section,
    });
    updatedQuestions.push(updatedQuestion);
  }

  return updatedQuestions;

  function inputIsInvalid(inputValues) {
    validateStatement(inputValues);
    return !(inputValues?.question_ids && inputValues.question_ids.length);
  }

  function validateStatement(inputValues) {
    if ("statement" in inputValues && inputValues.statement) {
      throw new ValidationError({
        message:
          "Não é possível editar o título de múltiplas perguntas com uma única requisição.",
        action:
          "Retire a propriedade 'statement' da requisição e tente novamente.",
      });
    }
  }
}

async function deleteOneById(questionId) {
  await findOneValidById(questionId);

  const questionDeleted = await runDeleteQuery(questionId);
  return questionDeleted;

  async function runDeleteQuery(questionId) {
    const results = await database.query({
      text: `
        DELETE FROM
          questions
        WHERE
          id = $1
        RETURNING
          *
      ;`,
      values: [questionId],
    });

    return results.rows[0];
  }
}

async function deleteManyByIdArray(questionInputValues) {
  const questionIds = getValidQuestionIds(questionInputValues);

  const deletedQuestions = await runDeleteQuery(questionIds);
  return deletedQuestions;

  function getValidQuestionIds(inputValues) {
    if ("question_ids" in inputValues) {
      return inputValues.question_ids;
    }
    return [];
  }

  async function runDeleteQuery(questionIds) {
    const results = await database.query({
      text: `
        DELETE FROM
          questions
        WHERE
          id = ANY($1)
        RETURNING
          *
      ;`,
      values: [questionIds],
    });

    return results.rows;
  }
}

async function getValidSectionId(inputValues) {
  try {
    if ("section_id" in inputValues && inputValues.section_id) {
      await formSection.findOneValidById(inputValues.section_id);
      return inputValues.section_id;
    }

    if ("section_name" in inputValues && inputValues.section_name) {
      const section = await formSection.findOneValidByName(
        inputValues.section_name,
      );
      return section.id;
    }

    return null;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new ValidationError(error);
    }

    throw error;
  }
}

function getValidType(inputValues) {
  if (!("type" in inputValues) || !TYPES.includes(inputValues.type)) {
    throw new ValidationError({
      message: "Tipo da pergunta inválido.",
      action:
        "Verifique se a propriedade type é algum dos seguintes valores: 'multiple-choice', 'discursive', 'both'.",
    });
  }

  return inputValues.type;
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

async function findOneValidById(id) {
  const results = await database.query({
    text: `
        SELECT
          *
        FROM
          questions
        WHERE
          id = $1
        LIMIT
          1
      ;`,
    values: [id],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "Pergunta não existe.",
      action: "Verifique se o id da pergunta está correto e tente novamente.",
    });
  }
  return results.rows[0];
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

const question = {
  create,
  update,
  retrieveAll,
  updateManyByIdArray,
  deleteOneById,
  deleteManyByIdArray,
  addFeatures,
  findOneValidById,
};

export default question;
