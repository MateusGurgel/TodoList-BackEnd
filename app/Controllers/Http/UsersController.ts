import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()
    return user
  }

  public async store({request}: HttpContextContract) {

    const credentials = request.only(['username', 'email', 'password'])

    const user = await User.create({
      username: credentials.username,
      email: credentials.email,
      password: credentials.password,
    })

    console.log(user.$isPersisted)
    return 'ok'
  }

  public async show({}: HttpContextContract) {

  }

  public async update({}: HttpContextContract) {

  }

  public async destroy({}: HttpContextContract) {

  }
}
