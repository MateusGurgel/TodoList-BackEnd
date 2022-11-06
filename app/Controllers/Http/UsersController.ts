import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const users = await User.all()
    return users
  }

  public async show({ request, response }: HttpContextContract) {
    const userId = request.param('id')
    const user = await User.findOrFail(userId)

    return response.ok(user)
  }

  public async store({ request, response }: HttpContextContract) {
    const credentials = await request.validate(CreateUser)

    const user = await User.create({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    })

    return response.ok(user)
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const credentials = await request.validate(UpdateUserValidator)
    const user = await User.findOrFail(auth.user?.id)
    await user.merge(credentials).save()

    return response.ok(user)
  }

  public async destroy({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()

    const user = await User.findOrFail(auth.use('api').user?.id)
    await user.delete()

    return
  }
}
