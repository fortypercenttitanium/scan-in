export default class JsonFetcher {
  async fetch(url, method = 'GET') {
    try {
      const data = await fetch(url, { method, credentials: 'include' });

      return await data.json();
    } catch (err) {
      console.error(err);
    }
  }
}
