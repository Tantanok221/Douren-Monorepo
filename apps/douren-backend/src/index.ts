import { Hono } from 'hono'
import eventRoute from './routes/events'
import { logger } from 'hono/logger'
import artistRoute from './routes/artist'

const app = new Hono()
app.route("/event", eventRoute)
app.route("/artist", artistRoute)
export default app