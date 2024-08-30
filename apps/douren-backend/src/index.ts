import { Hono } from 'hono'
import eventRoute from './routes/events'

const app = new Hono()
app.route("/event", eventRoute)

export default app