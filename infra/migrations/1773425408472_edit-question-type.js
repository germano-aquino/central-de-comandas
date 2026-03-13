exports.up = (pgm) => {
  pgm.dropColumn("questions", "type");
  pgm.dropColumn("questions", "option_marked");
  pgm.dropType("question_type");

  pgm.createType("question_type", [
    "yesOrNo",
    "yesOrNoDiscursive",
    "discursive",
    "checkBox",
    "radio",
  ]);

  pgm.addColumn("questions", {
    type: {
      type: "question_type",
      notNull: true,
    },

    options_marked: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },
  });
};

exports.down = false;
