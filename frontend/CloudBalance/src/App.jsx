import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import { ThemeProvider } from './components/ThemeContext';
import './App.css'; // general styling

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
