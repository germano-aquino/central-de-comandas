exports.up = (pgm) => {
  pgm.renameTable("service_categories", "service_sections");
};

exports.down = false;
