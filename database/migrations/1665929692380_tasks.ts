import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('creator_id').unsigned().references('id').inTable('users').onDelete('CASCADE')

      table.string('title').notNullable()
      table.string('description').nullable()
      table.enu('priority', [0, 1, 2]).defaultTo(1)
      table.boolean('done').defaultTo(false).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
