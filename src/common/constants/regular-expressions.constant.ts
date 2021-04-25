// export const UUID_V4 = '/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i';
export const UUID_V4 = '[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$';

export const ID_AS_UUID_V4 = `:id(${UUID_V4})`;
