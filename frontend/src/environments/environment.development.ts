export const environment = {
  production: false,
  // Em desenvolvimento o proxy.conf.json redireciona /api para
  // http://localhost:8080, entao nao ha CORS e nem URL absoluta no codigo.
  apiUrl: '/api',
};
