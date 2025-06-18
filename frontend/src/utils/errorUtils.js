export const createErrorObj = (status, data) => ({
  success: false,
  status,
  ...data,
  message: data?.message || data?.error || 'Ocurrió un error desconocido.',
});
