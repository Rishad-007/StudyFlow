import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<div>Dashboard</div>} />
      <Route path="/timer" element={<div>Timer</div>} />
      <Route path="/subjects" element={<div>Subjects</div>} />
      <Route path="/plan" element={<div>Plan</div>} />
      <Route path="/analytics" element={<div>Analytics</div>} />
      <Route path="/settings" element={<div>Settings</div>} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default App
