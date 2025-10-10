import { Routes, Route } from 'react-router-dom';
  import Navbar from './components/Navbar.jsx';
  import HomePage from './components/HomePage';
  import AboutPage from './components/AboutPage';
  import LoginPage from './components/LoginPage';
  import SignupPage from './components/SignupPage';
  import CreateBlogPage from './components/CreateBlogPage';
  import ProtectedRoute from './components/ProtectedRoute';
  import BlogPage from './components/BlogPage.jsx';
  import Dashboard from './components/Dashboard.jsx';
  import ProfilePage from './components/ProfilePage.jsx';

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
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/create-blog" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
          <Route path="/edit-blog/:id" element={<ProtectedRoute><CreateBlogPage /></ProtectedRoute>} />
          <Route path ="*" element={<h1 className="text-4xl font-bold">404 Not Found</h1>} />
          <Route path = "/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path = "/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    );
  }

  export default App;