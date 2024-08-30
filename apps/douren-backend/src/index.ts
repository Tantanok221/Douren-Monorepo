import { Hono } from 'hono'
import eventRoute from './routes/events'
import { logger } from 'hono/logger'

const app = new Hono()
app.route("/event", eventRoute)
export default app