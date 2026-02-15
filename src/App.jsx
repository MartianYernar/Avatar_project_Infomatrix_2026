import { Routes, Route } from 'react-router-dom'
import { Dashboard } from '@/pages/Dashboard'
import { TaskHistory } from '@/pages/TaskHistory'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/task-history" element={<TaskHistory />} />
    </Routes>
  )
}
