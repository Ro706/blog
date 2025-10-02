import { Routes, Route } from 'react-router-dom';
  import Navbar from './components/Navbar.jsx';
  import HomePage from './components/HomePage';
  import AboutPage from './components/AboutPage';
  import LoginPage from './components/LoginPage';
  import SignupPage from './components/SignupPage';
  import CreateBlogPage from './components/CreateBlogPage';
  import ProtectedRoute from './components/ProtectedRoute';

  function App() {
    return (
      <div>
        {/* Now this is fine, because App is wrapped in BrowserRouter */}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/About" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
          <Route path ="*" element={<h1 className="text-4xl font-bold">404 Not Found</h1>} />
          <Route path = "/Account" element={<h1 className="text-4xl font-bold">Account Page</h1>} />
          <Route path = "/Dashboard" element={<ProtectedRoute><h1 className="text-4xl font-bold">Dashboard Page</h1></ProtectedRoute>} />
        </Routes>
      </div>
    );
  }

  export default App;