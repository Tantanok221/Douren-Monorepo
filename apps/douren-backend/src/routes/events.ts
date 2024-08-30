import { Hono } from 'hono'

const eventRoute = new Hono()
eventRoute.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default eventRoute



