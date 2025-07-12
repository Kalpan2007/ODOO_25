import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import AskQuestionPage from './pages/AskQuestionPage';
import TagsPage from './pages/TagsPage';
import TagDetailPage from './pages/TagDetailPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
 import NotificationsPage from './pages/NotificationsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
// import AdminUsersPage from './pages/AdminUsersPage';
import AdminQuestionsPage from './pages/AdminQuestionsPage';
// import AdminTagsPage from './pages/AdminTagsPage';
// import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
// import ContactPage from './pages/ContactPage';
// import PrivacyPage from './pages/PrivacyPage';
// import TermsPage from './pages/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Main Layout Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="questions" element={<QuestionsPage />} />
                 <Route path="questions/:id" element={<QuestionDetailPage />} />
                <Route path="ask" element={
                  <ProtectedRoute>
                     <AskQuestionPage /> 
                  </ProtectedRoute>
                } />
                <Route path="tags" element={<TagsPage />} />
                <Route path="tags/:name" element={<TagDetailPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="users/:id" element={<UserProfilePage />} />
                {/* <Route path="search" element={<SearchPage />} /> */}
                <Route path="about" element={<AboutPage />} />
                <Route path="help" element={<HelpPage />} />
                {/* <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} /> */}
                
                {/* Protected Routes */}
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="settings" element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="notifications" element={
                  <ProtectedRoute>
                     <NotificationsPage /> 
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="admin" element={
                  <ProtectedRoute roles={['admin', 'moderator']}>
                    <AdminDashboardPage /> 
                  </ProtectedRoute>
                } />
                <Route path="admin/users" element={
                  <ProtectedRoute roles={['admin']}>
                    {/* <AdminUsersPage /> */}
                  </ProtectedRoute>
                } />
                <Route path="admin/questions" element={
                  <ProtectedRoute roles={['admin', 'moderator']}>
                    {/* <AdminQuestionsPage /> */}
                  </ProtectedRoute>
                } />
                <Route path="admin/tags" element={
                  <ProtectedRoute roles={['admin', 'moderator']}>
                    {/* <AdminTagsPage /> */}
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;