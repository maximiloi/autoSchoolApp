export default function createObjectActiveGroup(data) {
  if (data != null) {
    const result = data.reduce((acc, curr) => {
      acc[curr.id] = curr.groupNumber;
      return acc;
    }, {});
    return result;
  }
}
