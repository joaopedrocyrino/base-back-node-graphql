import mergeWith from 'lodash.mergewith'
import { IExecutableSchemaDefinition } from 'graphql-tools'

function withArraysConcatination (objValue: any, srcValue: any): any {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export const mergeRawSchemas = (...schemas: IExecutableSchemaDefinition[]): IExecutableSchemaDefinition => {
  return mergeWith({}, ...schemas, withArraysConcatination)
}
