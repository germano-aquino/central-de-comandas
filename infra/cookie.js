import * as ck from "cookie";

const EXPIRATION_IN_MILLISECONDS = 12 * 60 * 60 * 1000; // 12 hours

function set(
  name,
  value,
  serializeOptions = {
    // Garante que o cookie seja acessível a todas as rotas a partir do path
    path: "/",
    // Tempo máximo para ser expirado em segundos
    maxAge: EXPIRATION_IN_MILLISECONDS / 1000,
    // Só aceita cookie se estiver utilizando https
    secure: process.env.NODE_ENV === "production",
    // Restringe a camada de acesso do cookie impedindo leitura pelo console no client side
    httpOnly: true,
  },
) {
  const setCookie = ck.serialize(name, value, serializeOptions);

  return setCookie;
}

function clear(
  name,
  serializeOptions = {
    path: "/",
    maxAge: -1,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
) {
  const setCookie = ck.serialize(name, "invalid", serializeOptions);
  return setCookie;
}

const cookie = { set, clear };

export default cookie;
