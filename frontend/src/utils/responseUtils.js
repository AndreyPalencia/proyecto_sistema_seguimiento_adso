export const getFileNameFromContentDisposition = (
  contentDisposition,
  defaultName
) => {
  if (contentDisposition && contentDisposition.includes('filename')) {
    const match = contentDisposition.match(
      /filename\*?=\s*(?:UTF-8'')?["']?([^"';\n]+)/i
    );
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  }
  return defaultName;
};

export const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const readBlobAsText = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(blob);
  });
