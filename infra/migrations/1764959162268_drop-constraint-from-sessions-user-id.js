exports.up = (pgm) => {
  pgm.dropConstraint("sessions", "sessions_user_id_key");
};

exports.down = false;
