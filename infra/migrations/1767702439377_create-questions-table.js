exports.up = (pgm) => {
  pgm.createType("question_type", ["multiple-choice", "discursive", "both"]);

  pgm.createTable("questions", {
    id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },

    statement: {
      type: "varchar(256)",
      notNull: true,
      unique: true,
    },

    type: {
      type: "question_type",
      notNull: true,
    },

    options: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },

    option_marked: {
      type: "varchar(64)",
      notNull: false,
    },

    answer: {
      type: "varchar(256)",
      notNull: false,
    },

    section_id: {
      type: "uuid",
      notNull: false,
    },

    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },

    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("timezone('utc', now())"),
    },
  });
};

exports.down = false;
