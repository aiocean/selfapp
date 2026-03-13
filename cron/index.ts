import { db } from '../db'

type Job = { name: string; intervalMs: number; fn: () => void | Promise<void> }

const jobs: Job[] = [
  {
    name: 'cleanup-empty-notes',
    intervalMs: 24 * 60 * 60 * 1000, // daily
    fn() {
      const result = db.run(
        "DELETE FROM notes WHERE title = '' AND content = '' AND created_at < datetime('now', '-7 days')"
      )
      if (result.changes > 0) {
        console.log(`Cleaned up ${result.changes} empty notes`)
      }
    },
  },
]

for (const job of jobs) {
  console.log(`Scheduled: ${job.name} (every ${job.intervalMs / 1000}s)`)
  setInterval(async () => {
    try {
      await job.fn()
    } catch (e) {
      console.error(`Job ${job.name} failed:`, e)
    }
  }, job.intervalMs)
  // Run once on startup
  job.fn()
}

console.log(`Cron running with ${jobs.length} job(s)`)
