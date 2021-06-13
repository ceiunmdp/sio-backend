import { isObject } from 'lodash';
import * as snakecaseKeys from 'snakecase-keys';

export const snakeCaseProperties = (data: any) => (isObject(data) ? snakecaseKeys(data, { deep: true }) : data);
