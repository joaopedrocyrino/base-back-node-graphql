import Joi from 'joi'

export const createValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
})

export const deleteValidator = Joi.object({
  id: Joi.string().guid().required()
})

export const updateValidator = Joi.object({
  username: Joi.string()
})

export const getOneValidator = Joi.object({
  id: Joi.string().guid(),
  username: Joi.string()
})
  .or('id', 'username')

export const getManyValidator = Joi.object({
  fields: Joi.array().items(
    Joi.object({
      id: Joi.string().guid(),
      username: Joi.string()
    })
      .or('id', 'username')
  ),
  take: Joi.number().integer().positive(),
  skip: Joi.number().integer().positive(),
  order: Joi.string().valid(
    'id',
    'username',
    'createdAt',
    'updatedAt',
    'isDeleted'
  ),
  direction: Joi.string().valid('ASC', 'DESC'),
  group: Joi.array().items(
    Joi.string().valid(
      'id',
      'username',
      'createdAt',
      'updatedAt',
      'isDeleted'
    )
  )
})

export const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
})
