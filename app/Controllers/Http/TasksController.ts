import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Task'
import CreateTaskValidator from 'App/Validators/CreateTaskValidator'
import UpdateTaskValidator from 'App/Validators/UpdateTaskValidator'

export default class TasksController {
  public async index({ auth, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id

    if (userId === undefined) {
      return response.unauthorized({
        errors: [
          {
            message: 'Invalid API token',
          },
        ],
      })
    }

    let tasks = await Task.query().where('creator_id', '=', userId)

    tasks.map((task) => {
      if (task.description !== null && task.description.length > 29) {
        task.description = task.description.slice(0, 26) + '...'
      }

      if (task.title.length > 18) {
        task.title = task.title.slice(0, 15) + '...'
      }
    })

    return response.ok(tasks)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const taskAttributes = await request.validate(CreateTaskValidator)
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
    const taskId = request.param('id')
    const task = await Task.find(taskId)

    if (task === null || userId !== task.creator_id) {
      return response.forbidden({
        errors: [
          {
            message: 'Invalid API token',
          },
        ],
      })
    }

    return task
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id
    const taskId = request.param('id')
    const task = await Task.findOrFail(taskId)

    if (task.creator_id !== userId) {
      return response.forbidden({
        errors: [
          {
            message: 'Invalid API token',
          },
        ],
      })
    }

    const taskAttributes = await request.validate(UpdateTaskValidator)
    await task.merge(taskAttributes).save()

    return task
  }

  public async destroy({ auth, request, response }: HttpContextContract) {
    await auth.use('api').authenticate()

    const userId = auth.user?.id
    const taskId = request.param('id')
    const task = await Task.findOrFail(taskId)

    if (task.creator_id !== userId) {
      return response.forbidden({
        errors: [
          {
            message: 'Invalid API token',
          },
        ],
      })
    }

    task.delete()

    return
  }
}
