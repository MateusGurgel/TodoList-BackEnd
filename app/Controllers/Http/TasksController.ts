import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import TaskValidator from 'App/Validators/TaskUpdateValidator'

export default class TasksController {
  public async index({ auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id

    if (userId === undefined) {
      return response.unauthorized({ message: 'user undefined' })
    }

    let tasks = await Task.query().where('creator_id', '=', userId)

    tasks.map((task) => {
      if (task.description !== null && task.description.length > 29)
        task.description = task.description.slice(0, 26) + '...'
    })

    return response.ok(tasks)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const taskAttributes = await request.validate(TaskValidator)
    const userId = auth.user?.id

    const task = await Task.create({
      creator_id: userId,
      title: taskAttributes.title,
      description: taskAttributes.description,
      priority: taskAttributes.priority,
    })

    return response.ok(task)
  }

  public async show({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id
    const task_id = request.param('id')
    const task = await Task.findOrFail(task_id)

    if (task.creator_id !== userId) {
      return response.forbidden({ error: 'Unauthorized' })
    }

    return task
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id
    const task_id = request.param('id')
    const task = await Task.findOrFail(task_id)

    if (task.creator_id !== userId) {
      return response.forbidden({ message: 'Unauthorized' })
    }

    const taskAttributes = await request.validate(TaskValidator)
    await task.merge(taskAttributes).save()

    return task
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id
    const task_id = request.param('id')
    const task = await Task.findOrFail(task_id)

    if (task.creator_id !== userId) {
      return response.forbidden({ message: 'Unauthorized' })
    }

    task.delete()

    return
  }
}
