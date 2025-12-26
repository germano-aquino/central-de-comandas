exports.up = (pgm) => {
  pgm.createTable("services", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    name: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    // Service price in cents
    price: {
      type: "int",
      notNull: true,
    },

    category_id: {
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
