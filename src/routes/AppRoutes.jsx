import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HomePage from '../pages/HomePage';
import GamePage from '../pages/GamePage';
import VictoryPage from '../pages/VictoryPage';
import GameOverPage from '../pages/GameOverPage';
import ScoresPage from '../pages/ScoresPage';

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tutorial" element={<GamePage modo="tutorial" />} />
          <Route path="/nivel/:num" element={<GamePage modo="nivel" />} />
          <Route path="/victoria" element={<VictoryPage />} />
          <Route path="/game-over" element={<GameOverPage />} />
          <Route path="/puntajes" element={<ScoresPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </>
  );
}