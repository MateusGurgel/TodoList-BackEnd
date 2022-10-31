import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string([rules.minLength(6), rules.maxLength(30)]),
    password: schema.string([rules.minLength(8), rules.maxLength(32)]),
    email: schema.string([
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: true,
        gmailRemoveSubaddress: true,
      }),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
  })

  public messages: CustomMessages = {}
}
