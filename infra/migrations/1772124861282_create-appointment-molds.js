exports.up = (pgm) => {
  pgm.createTable("appointment_molds", {
    id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },

    store_ids: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },

    form_section_ids: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },

    question_ids: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },

    category_ids: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
    },

    service_ids: {
      type: "varchar[]",
      notNull: true,
      default: "{}",
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
