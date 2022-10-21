import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/LoginValidator'

export default class Authentication {
  public async login({ auth, request, response }: HttpContextContract) {
    let credentials = await request.validate(LoginValidator)

    try {
      const token = await auth.use('api').attempt(credentials.email, credentials.password, {
        expiresIn: '7 days',
      })
      
      return response.ok(token)
    } catch (error) {
      return response.unauthorized({message: "Invalid credentials"})
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    await auth.use('api').revoke()
    return response.ok({ revoked: true })
  }
}
