import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

//TODO: Check if the data exists
//TODO: Check if the data is valid
//TODO: Check if the sender is auth

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()
    return user
  }

  public async store({ request }: HttpContextContract) {
    const credentials = request.only(['username', 'email', 'password'])

    const user = await User.create({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    })

    console.log(user.$isPersisted)
    return 'ok'
  }

  public async show({ request }: HttpContextContract) {
    const userID = request.param('id')
    const user = await User.findOrFail(userID)

    return user
  }

  public async update({ request }: HttpContextContract) {
    const userID = request.param('id')
    const credentials = request.only(['username', 'email', 'password'])
    const user = await User.findOrFail(userID)
    await user.merge(credentials).save()
    return user
  }

  public async destroy({ request }: HttpContextContract) {
    const userID = request.param('id')
    const user = await User.findOrFail(userID)

    await user.delete()

    return 'userDeleted'
  }
}
