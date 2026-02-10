exports.up = (pgm) => {
  pgm.createTable("customers", {
    id: {
      type: "uuid",
      primaryKey: true,
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
    },

    name: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    phone: {
      type: "varchar(25)",
      notNull: true,
      unique: true,
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
