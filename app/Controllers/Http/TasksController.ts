import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskValidator'

export default class TasksController {
  public async index({ auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const user_id = auth.user?.id

    if (user_id === undefined) {
      return response.unauthorized({ message: 'user undefined' })
    }

    const tasks = await Task.query().where('creator_id', '=', user_id)

    console.log(tasks)
    return response.ok(tasks)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const taskAttributes = await request.validate(TaskValidator)
    const user_id = auth.user?.id

    const task = await Task.create({
      creator_id: user_id,
      title: taskAttributes.title,
      description: taskAttributes.description,
      priority_flag: taskAttributes.priority_flag,
    })

    return response.ok(task)
  }

  public async show({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const user_id = auth.user?.id
    const task_id = request.param('id')
    const task = await Task.findOrFail(task_id)

    if (task.creator_id !== user_id) {
      return response.forbidden({ error: 'Unauthorized' })
    }

    return task
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const user_id = auth.user?.id
    const task_id = request.param('id')
    const task = await Task.findOrFail(task_id)

    if (task.creator_id !== user_id) {
      return response.forbidden({ message: 'Unauthorized' })
    }

    const taskAttributes = await request.validate(TaskValidator)
    await task.merge(taskAttributes).save()

    return task
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const user_id = auth.user?.id
    const task_id = request.param('id')
    const task = await Task.findOrFail(task_id)

    if (task.creator_id !== user_id) {
      return response.forbidden({ message: 'Unauthorized' })
    }

    task.delete()

    return
  }
}
