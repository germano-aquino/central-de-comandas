exports.up = (pgm) => {
  pgm.addColumns("services", {
    is_mold: {
      type: "boolean",
      notNull: true,
      default: false,
    },
  });
};

exports.down = false;
