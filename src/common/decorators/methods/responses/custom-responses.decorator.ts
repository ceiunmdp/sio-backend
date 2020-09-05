/* eslint-disable @typescript-eslint/ban-types */
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { CustomError } from 'src/common/classes/custom-error.class';

export const ApiAllOkResponseCustom = (collection: string, type: Function) =>
  ApiOkResponse({ description: `List of ${collection.toLowerCase()}.`, type });

export const ApiOkResponseCustom = (item: string, type: Function) => ApiOkResponse({ description: item, type });

export const ApiPostOkResponseCustom = (item: string, type: Function) =>
  ApiCreatedResponse({ description: `The ${item.toLowerCase()} has been successfully created.`, type });

export const ApiUpdateOkResponseCustom = (item: string, type: Function) =>
  ApiOkResponse({ description: `The ${item.toLowerCase()} has been successfully updated.`, type });

export const ApiPatchOkResponseCustom = (item: string, type: Function) =>
  ApiOkResponse({ description: `The ${item.toLowerCase()} has been successfully partially updated.`, type });

export const ApiDeleteOkResponseCustom = (item: string) =>
  ApiOkResponse({ description: `The ${item.toLowerCase()} has been successfully deleted.` });

export const ApiNotFoundResponseCustom = (item: string) =>
  ApiNotFoundResponse({ description: `${item} not found`, type: CustomError });
