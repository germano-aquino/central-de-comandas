exports.up = (pgm) => {
  pgm.createTable("sessions", {
    id: {
      type: "uuid",
      notNull: true,
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    // For reference GitHub limits username to 39 characters.
    user_id: {
      type: "uuid",
      notNull: true,
      unique: true,
    },

    //Why 254 characters? https://stackoverflow.com/a/1199238
    token: {
      type: "varchar(64)",
      notNull: true,
      unique: true,
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },

    // Why timestamp with time zone? https://justatheory.com/2012/04/postgres-use-timestamptz/
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
