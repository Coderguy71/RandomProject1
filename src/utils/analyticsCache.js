const DEFAULT_TTL_MS = 5 * 60 * 1000;

const store = new Map();

const serializeParams = (params = {}) => {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  return Object.entries(params)
    .map(([key, value]) => {
      const normalizedValue = value === undefined || value === null
        ? ''
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);
      return { key, value: normalizedValue };
    })
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(({ key, value }) => `${key}:${value}`)
    .join('|');
};

const buildKey = (userId, scope, params = {}) => {
  const paramString = serializeParams(params);
  return `${userId}::${scope}::${paramString}`;
};

const get = (userId, scope, params = {}) => {
  const key = buildKey(userId, scope, params);
  const entry = store.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt && entry.expiresAt < Date.now()) {
    store.delete(key);
    return null;
  }

  return entry.value;
};

const set = (userId, scope, params = {}, value, ttl = DEFAULT_TTL_MS) => {
  const key = buildKey(userId, scope, params);
  const expiresAt = ttl ? Date.now() + ttl : null;
  store.set(key, { value, expiresAt });
};

const invalidateUser = (userId) => {
  const prefix = `${userId}::`;
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
    }
  }
};

const clearAll = () => {
  store.clear();
};

module.exports = {
  get,
  set,
  invalidateUser,
  clearAll,
};
