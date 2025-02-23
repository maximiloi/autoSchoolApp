export default function transformedNullAndStringDate(obj) {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (value === null) {
        return [key, undefined];
      }
      if (typeof value === 'string' && iso8601Regex.test(value)) {
        return [key, new Date(value)];
      }
      return [key, value];
    }),
  );
}
