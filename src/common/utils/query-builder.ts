import { Brackets, SelectQueryBuilder, WhereExpression } from 'typeorm';
import { Operator } from '../enums/operator.enum';
import { Field, Where } from '../interfaces/where.type';

export const filterQuery = <T>(query: SelectQueryBuilder<T>, where: Where) => {
  if (!where) {
    return query;
  } else {
    return traverseTree(query, where) as SelectQueryBuilder<T>;
  }
};

const traverseTree = (query: WhereExpression, where: Where, upperOperator = Operator.AND) => {
  Object.keys(where).forEach((key) => {
    if (key === Operator.OR) {
      query = query.orWhere(buildNewBrackets(where, Operator.OR));
    } else if (key === Operator.AND) {
      query = query.andWhere(buildNewBrackets(where, Operator.AND));
    } else {
      // Field
      query = handleArgs(query, where as Field, upperOperator === Operator.AND ? 'andWhere' : 'orWhere');
    }
  });

  return query;
};

const buildNewBrackets = (where: Where, operator: Operator) => {
  return new Brackets((qb) =>
    where[operator].map((queryArray) => {
      traverseTree(qb, queryArray, operator);
    }),
  );
};

const handleArgs = (query: WhereExpression, field: Field, andOr: 'andWhere' | 'orWhere') => {
  const fieldsArgs = Object.entries(field);

  fieldsArgs.map((fieldArg) => {
    const [fieldName, filters] = fieldArg;
    const ops = Object.entries(filters);

    ops.map((parameters) => {
      const [operation, value] = parameters;

      switch (operation) {
        case 'is': {
          const parameter = `${fieldName}.isvalue`;
          query[andOr](`${fieldName} = :${parameter}`, { [parameter]: value });
          break;
        }
        case 'not': {
          const parameter = `${fieldName}.notvalue`;
          query[andOr](`${fieldName} != :${parameter}`, { [parameter]: value });
          break;
        }
        case 'in': {
          const parameter = `${fieldName}.invalue`;
          query[andOr](`${fieldName} IN (:...${parameter})`, { [parameter]: value });
          break;
        }
        case 'not_in': {
          const parameter = `${fieldName}.notinvalue`;
          query[andOr](`${fieldName} NOT IN (:...${parameter})`, { [parameter]: value });
          break;
        }
        case 'lt': {
          const parameter = `${fieldName}.ltvalue`;
          query[andOr](`${fieldName} < :${parameter}`, { [parameter]: value });
          break;
        }
        case 'lte': {
          const parameter = `${fieldName}.ltevalue`;
          query[andOr](`${fieldName} <= :${parameter}`, { [parameter]: value });
          break;
        }
        case 'gt': {
          const parameter = `${fieldName}.gtvalue`;
          query[andOr](`${fieldName} > :${parameter}`, { [parameter]: value });
          break;
        }
        case 'gte': {
          const parameter = `${fieldName}.gtevalue`;
          query[andOr](`${fieldName} >= :${parameter}`, { [parameter]: value });
          break;
        }
        case 'contains': {
          const parameter = `${fieldName}.convalue`;
          query[andOr](`${fieldName} ILIKE :${parameter}`, { [parameter]: `%${value}%` });
          break;
        }
        case 'not_contains': {
          const parameter = `${fieldName}.notconvalue`;
          query[andOr](`${fieldName} NOT ILIKE :${parameter}`, { [parameter]: `%${value}%` });
          break;
        }
        case 'starts_with': {
          const parameter = `${fieldName}.swvalue`;
          query[andOr](`${fieldName} ILIKE :${parameter}`, { [parameter]: `${value}%` });
          break;
        }
        case 'not_starts_with': {
          const parameter = `${fieldName}.nswvalue`;
          query[andOr](`${fieldName} NOT ILIKE :nswvalue`, { [parameter]: `${value}%` });
          break;
        }
        case 'ends_with': {
          const parameter = `${fieldName}.ewvalue`;
          query[andOr](`${fieldName} ILIKE :${parameter}`, { [parameter]: `%${value}` });
          break;
        }
        case 'not_ends_with': {
          const parameter = `${fieldName}.newvalue`;
          query[andOr](`${fieldName} NOT ILIKE :${parameter}`, { [parameter]: `%${value}` });
          break;
        }
        default:
          break;
      }
    });
  });

  return query;
};
