// Thin client-side placeholder to illustrate where API calls would go.
export async function createRequest(payload) {
  return Promise.resolve({ id: crypto.randomUUID(), ...payload });
}

export async function fetchRequests() {
  return Promise.resolve([]);
}
