import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server'
import moment from 'moment'
import Joi from 'joi'

import { Jwt, Uuid } from '../frameworks'
import { token } from '../dto'

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
    let userPermissions: token = {}
    let userId = ''

    if (token) {
      const { error, ...payload } = await Jwt.decode(token)
      if (error) { throw new AuthenticationError('not_authenticated') }
      userPermissions = payload.permissions
      userId = payload.userId
    }

    this.checkScope(userPermissions, scope, req.chainId, userId, req.userId)

    this.checkRequest(req, schema)
  }

  private readonly checkScope = (permissions: token, scope?: string[], chainId?: string, userId?: string, reqUserId?: string): void => {
    if (scope) {
      scope
        .filter((permission: string) => permission[0] === '+')
        .map((permission: string): string => { return permission.slice(1) })
        .forEach((permission: string) => {
          if (!permissions[chainId]?.includes(permission)) {
            throw new ForbiddenError(permission)
          }
        })

      const scopePermissions = scope.filter((permission: string) => permission[0] !== '+')

      if (scopePermissions.length && !scopePermissions.some((permission: string) => {
        if (permission === 'self') {
          return userId === reqUserId
        } else {
          return permissions[chainId]?.includes(permission)
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
