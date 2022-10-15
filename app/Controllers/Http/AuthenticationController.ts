import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class Authentication {
  public async index({ auth, request, response }: HttpContextContract) {
    let credentials = await request.validate(LoginValidator)

    try {
      const token = await auth.use('api').attempt(credentials.email, credentials.password)
      return response.ok(token)
    } catch (error) {
      return response.unauthorized(error)
    }
  }
}
