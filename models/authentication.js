import password from "models/password";
import user from "models/user";
import { NotFoundError, UnauthorizedError } from "../infra/errors";

async function getAuthenticatedUser(email, password) {
  const storedUser = await getUserByEmail(email);

  await validatePassword(password, storedUser.password);

  return storedUser;
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
