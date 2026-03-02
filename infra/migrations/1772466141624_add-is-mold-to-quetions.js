exports.up = (pgm) => {
  pgm.addColumns("questions", {
    is_mold: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

exports.down = false;
