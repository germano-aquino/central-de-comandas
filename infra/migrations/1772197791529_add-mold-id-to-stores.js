exports.up = (pgm) => {
  pgm.addColumns("stores", {
    mold_id: {
      type: "uuid",
      notNull: false,
    },
  });
};

exports.down = false;
