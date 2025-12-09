import controller from "infra/controller";
import activation from "models/activation";
import { createRouter } from "next-connect";

const router = createRouter();

export default router.handler(controller.errorHandlers);

router.patch(patchHandler);

async function patchHandler(request, response) {
  const tokenId = request.query.token_id;

  const validActivationToken = await activation.findOneValidById(tokenId);
  await activation.activateUserByUserId(validActivationToken.user_id);
  const usedToken = await activation.markTokenAsUsed(validActivationToken);

  return response.status(200).json(usedToken);
}
