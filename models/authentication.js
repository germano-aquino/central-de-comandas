import password from "models/password";
import user from "models/user";
import { NotFoundError, UnauthorizedError } from "../infra/errors";

async function getAuthenticatedUser(email, password) {
  try {
    const storedUser = await getUserByEmail(email);

    await validatePassword(password, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      error.message = "O email ou a senha estão incorretos.";
    }
    throw error;
  }
}

async function validatePassword(providedPassword, storedPassword) {
  const isPasswordCorrect = await password.compare(
    providedPassword,
    storedPassword,
  );

  if (!isPasswordCorrect) {
    throw new UnauthorizedError({
      message: "A senha está incorreta.",
      action: "Verifique os dados de login e tente novamente.",
    });
  }
}

async function getUserByEmail(email) {
  try {
    const storedUser = await user.findOneByEmail(email);

    return storedUser;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UnauthorizedError({
        message: "O email está incorreto.",
        action: "Verifique os dados de login e tente novamente.",
        cause: error,
      });
    }

    throw error;
  }
}

const authentication = { getAuthenticatedUser };

export default authentication;
