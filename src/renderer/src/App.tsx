import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import { AprendizadoDetailPage } from './pages/aprendizado-detail/AprendizadoDetailPage';
import { AprendizadosPage } from './pages/aprendizados/AprendizadosPage';
import { NotFoundPage } from './pages/not-found/NotFoundPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { Layout } from './components/Layout';
import { AprendizadosProvider } from './contexts/AprendizadosContext';
import { SnackbarProvider } from './contexts/SnackbarContext';

export function App() {
  return (
    <SnackbarProvider>
      <AprendizadosProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate replace to={ROUTES.APRENDIZADOS} />} />
            <Route path={ROUTES.APRENDIZADOS} element={<AprendizadosPage />} />
            <Route path={ROUTES.APRENDIZADO_DETAIL} element={<AprendizadoDetailPage />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AprendizadosProvider>
    </SnackbarProvider>
  );
}
