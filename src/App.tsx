import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SettlePage from './pages/SettlePage';
import TrustPage from './pages/TrustPage';
import DoPage from './pages/DoPage';
import PeoplePage from './pages/PeoplePage';
import StoryPage from './pages/StoryPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<SettlePage />} />
            <Route path="/trust" element={<TrustPage />} />
            <Route path="/do" element={<DoPage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/story" element={<StoryPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
