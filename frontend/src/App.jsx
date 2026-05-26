import { useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/footer/Footer';
import AppRoutes from './routes/AppRoutes';
import Chatbot from './components/Chatbot/Chatbot';
import AppErrorBoundary from './components/errors/AppErrorBoundary';

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <AppErrorBoundary title="Error en la aplicación">
      <div className="app-container">
        <Toaster
          position="top-right"
          containerStyle={{ top: 20, left: 20, bottom: 20, right: 20, zIndex: 999999 }}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(234, 179, 8, 0.2)',
              zIndex: 999999,
            },
            success: {
              iconTheme: { primary: '#eab308', secondary: '#1a1a1a' },
            },
          }}
        />
        {!isAdminPath && <Navbar />}
        <AppRoutes />
        {!isAdminPath && <Footer />}
        {!isAdminPath && <Chatbot />}
      </div>
    </AppErrorBoundary>
  );
}

export default App;
