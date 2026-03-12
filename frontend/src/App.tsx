import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './routes/AppRouter';

// React Query er client toiri kora holo
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // Error khele ekbar retry korbe
            refetchOnWindowFocus: false, // Window te fire asle bar bar API call korbe na
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;