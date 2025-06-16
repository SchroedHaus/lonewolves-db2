export const getSanitizedLink = (link) => {
  if (!link) return "";
  let sanitized = link.trim();
  if (sanitized && !/^https?:\/\//i.test(sanitized)) {
    sanitized = "https://" + sanitized;
  }
  return sanitized;
};
