/** Normalize Express route params to a single string. */
export function routeParam(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}

export function requireRouteParam(
  value: string | string[] | undefined,
  name: string,
): string {
  const id = routeParam(value);
  if (!id) {
    throw new Error(`Missing route parameter: ${name}`);
  }
  return id;
}

export function getMultipartFile(
  files: Express.Request["files"],
  field: string,
): Express.Multer.File | undefined {
  if (!files || Array.isArray(files)) return undefined;
  const entry = files[field];
  if (!entry) return undefined;
  return Array.isArray(entry) ? entry[0] : entry;
}
