exports.up = (pgm) => {
  pgm.dropColumns("appointment_molds", ["store_ids"]);
};

exports.down = false;
