import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';
import { Order } from '../interfaces/order.type';

@Injectable()
export class OrderPipe<T> implements PipeTransform<string, Order<T>> {
  // private readonly type;

  // constructor(type: new (partial: Partial<T>) => T) {
  //   this.type = new type({});
  // }

  transform(order: string) {
    if (order) {
      const array = order.split(',').map((tuple) => tuple.trim().split(' ')) as [string, string][];
      // const array = [['name', 'ASC'], ['surname', 'DESC']] as [string, string][]

      array.forEach((tuple) => {
        if (tuple.length !== 2) {
          throw new UnprocessableEntityException(`Wrong syntax in 'sort' parameter`);
        } else if (tuple[1] !== 'ASC' && tuple[1] !== 'DESC') {
          throw new UnprocessableEntityException(`Order must be 'ASC' or 'DESC'`);
        }
      });

      const obj: Order<T> = {};
      return array.reduce((o, [key, value]) => {
        // if (this.isObjKey(key)) {
        o[key] = value as 'ASC' | 'DESC';
        return o;
        // } else {
        // throw new BadRequestException(`Property ${key} does not exist in entity`);
        // }
      }, obj);
    } else {
      return {};
    }
  }

  // isObjKey(key: any): key is keyof T {
  //   return key in Object.getOwnPropertyNames(this.type);
  // }
}
