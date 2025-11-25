test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
  expect(responseBody.dependencies.database.version).toBe("16.11");
  expect(responseBody.dependencies.database.opened_connections).toBe(1);
  expect(responseBody.dependencies.database.max_connections).toBeGreaterThan(1);
});
