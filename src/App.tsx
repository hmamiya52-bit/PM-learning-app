import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Afternoon1Problems from './pages/Afternoon1Problems'
import Afternoon1Practice from './pages/Afternoon1Practice'
import Afternoon1Answer from './pages/Afternoon1Answer'
import Afternoon2Problems from './pages/Afternoon2Problems'
import Afternoon2Practice from './pages/Afternoon2Practice'
import Episodes from './pages/Episodes'
import Notes from './pages/Notes'
import NoteDetail from './pages/NoteDetail'
import Quiz from './pages/Quiz'
import Tracker from './pages/Tracker'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/afternoon1" element={<Afternoon1Problems />} />
          <Route path="/afternoon1/:id/practice" element={<Afternoon1Practice />} />
          <Route path="/afternoon1/:id/answer" element={<Afternoon1Answer />} />
          <Route path="/afternoon2" element={<Afternoon2Problems />} />
          <Route path="/afternoon2/:id/practice" element={<Afternoon2Practice />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/:categoryId" element={<NoteDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/tracker" element={<Tracker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
