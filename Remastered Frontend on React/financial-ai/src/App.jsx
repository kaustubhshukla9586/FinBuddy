import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ExpenseInput from './pages/ExpenseInput';
import GoalTracker from './pages/GoalTracker';
import AIAssistant from './pages/AIAssistant';
import Demo from './pages/Demo';
import AdminDashboard from './pages/AdminDashboard';
import Navigation from './components/Navigation';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<><Dashboard /><Navigation /></>} />
            <Route path="/expenses" element={<><ExpenseInput /><Navigation /></>} />
            <Route path="/goals" element={<><GoalTracker /><Navigation /></>} />
            <Route path="/ai-assistant" element={<><AIAssistant /><Navigation /></>} />
            <Route path="/demo" element={<><Demo /><Navigation /></>} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;