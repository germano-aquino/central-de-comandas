import { NotFoundError, UnauthorizedError } from "infra/errors";
import user from "./user";
import password from "./password";

async function create(sessionInputValues) {
  try {
    const storedUser = await user.findOneByEmail(sessionInputValues.email);
    const isPasswordCorrect = await password.compare(
      sessionInputValues.password,
      storedUser.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedError({
        message: "O email ou a senha estão incorretos.",
        action: "Verifique os dados de login e tente novamente.",
      });
    }
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "O email ou a senha estão incorretos.",
        action: "Verifique os dados de login e tente novamente.",
        cause: error,
      });
    }

    throw error;
  }
}

const session = { create };

export default session;
