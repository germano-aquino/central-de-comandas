import email from "infra/email.js";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email", () => {
  test("Send email", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Germano Aquino <germano@curso.dev>",
      to: "contato@curso.dev",
      subject: "Teste de envio automatizado",
      text: "Corpo do email será que vai mandar msm?",
    });
    await email.send({
      from: "Germano Aquino <germano@curso.dev>",
      to: "contato@curso.dev",
      subject: "Teste de envio automatizado",
      text: "Corpo do email será que vai mandar msm?",
    });
    await email.send({
      from: "Germano Aquino <germano@curso.dev>",
      to: "contato@curso.dev",
      subject: "Ultimo email",
      text: "Corpo do ultimo email será que vai mandar msm?",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<germano@curso.dev>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Ultimo email");
    expect(lastEmail.text).toBe(
      "Corpo do ultimo email será que vai mandar msm?\r\n",
    );
  });
});
