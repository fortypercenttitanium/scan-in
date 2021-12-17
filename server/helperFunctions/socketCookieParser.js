export default function socketCookieParser(req) {
  const cookies = req.headers.cookie?.split(';').reduce((acc, val) => {
    const [key, value] = val.trim().split('=');
    return { ...acc, [key]: value };
  }, {});

  return cookies;
}
