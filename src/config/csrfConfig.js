import CsrfToken from "csrf";

const token = new CsrfToken();

export function createCsrfSecret() {
  return token.secretSync();
}

export function createTokenFromSecret(secret) {
  return token.create(secret);
}

export function validateTokenWithSecret(secret, receivedToken) {
  return token.verify(secret, receivedToken);
}
