export const getUUIDWithHyphens = (uuid: string) =>
  uuid.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, '$1-$2-$3-$4-$5');
