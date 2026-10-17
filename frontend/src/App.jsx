import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AssetList from './pages/AssetList.jsx'
import AddAsset from './pages/AddAsset.jsx'
import EditAsset from './pages/EditAsset.jsx'
import About from './pages/About.jsx'

function App() {
  return (
    <div>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assets" element={<AssetList />} />
          <Route path="/assets/add" element={<AddAsset />} />
          <Route path="/assets/edit/:id" element={<EditAsset />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
