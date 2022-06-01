import moment from 'moment'
import Joi from 'joi'
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server'

import { Jwt, Uuid } from '../frameworks'

class Services {
  protected createBase (): {
    id: string
    createdAt: string
    updatedAt: string
    isDeleted: boolean
  } {
    const timestamptz = moment().toISOString()

    return {
      id: Uuid.generate(),
      createdAt: timestamptz,
      updatedAt: timestamptz,
      isDeleted: false
    }
  };

  protected async gateway ({ token, schema, req, scope }: {
    token?: string
    schema?: Joi.ObjectSchema<any>
    scope?: string[]
    req: any
  }): Promise<void> {
    let permissions: string[] = []
    let id = ''

    if (token) {
      const { error, ...payload } = await Jwt.decode(token)
      if (error) { throw new AuthenticationError('not_authenticated') }

      permissions = payload.permissions
      id = payload.id
    }

    this.checkScope(permissions, id, scope, req)

    this.checkRequest(req, schema)
  }

  private readonly checkScope = (
    permissions: string[],
    id: string,
    scope?: string[],
    req?: any
  ): void => {
    if (scope) {
      scope
        .filter((p: string) => p[0] === '+')
        .map((p: string): string => { return p.slice(1) })
        .forEach((p: string) => {
          if (!permissions.includes(p)) {
            throw new ForbiddenError(p)
          }
        })

      const scopePermissions = scope.filter((p: string) => p[0] !== '+')

      if (scopePermissions.length && !scopePermissions.some((permission: string) => {
        if (permission === 'self') {
          return id === req.id || id === req.userId
        } else {
          return permissions.includes(permission)
        }
      })) { throw new ForbiddenError('') }
    }
  }

  private readonly checkRequest = (
    request: any,
    schema?: Joi.ObjectSchema<any>
  ): void => {
    if (schema) {
      const { error } = schema.validate(request)
      if (error) {
        console.log(error)
        throw new UserInputError('')
      }
    }
  }
};

export default Services
