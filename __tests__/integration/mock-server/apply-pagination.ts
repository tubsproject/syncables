export function applyPagination(
  body: any,
  spec: any,
): any {
  let pointer = body;
  spec.itemsPathInResponse.forEach((part) => {
    if (pointer && typeof pointer === 'object' && part in pointer) {
      pointer = pointer[part];
    } else {
      pointer = null;
    }
  });
  if (Array.isArray(pointer)) {
    pointer.push(pointer[0]);
  }
  return body;
}
