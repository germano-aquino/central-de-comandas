function status(request, response) {
  return response.status(200).json({ message: "status ok!" });
}

export default status;
