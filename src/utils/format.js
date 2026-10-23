export const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
export const money = (n) =>
  n == null || n === ""
    ? "Consultar precio"
    : "RD$" + Number(n).toLocaleString("en-US");
