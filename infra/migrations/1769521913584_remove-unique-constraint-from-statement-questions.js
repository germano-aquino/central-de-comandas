exports.up = (pgm) => {
  pgm.dropConstraint("questions", "questions_statement_key");
};

exports.down = false;
