import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashBoardController {
  public async index({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    return auth.use('api').user!
  }
}
