import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 🌟 এই ইমপোর্টটি অ্যাড করা হয়েছে
import AppRouter from './routes/AppRouter'; // তোমার রাউটার ইমপোর্ট পাথ
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ১. QueryClient তৈরি করা
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {/* 🌟 BrowserRouter দিয়ে AppRouter কে র‍্যাপ (Wrap) করে দেওয়া হলো */}
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);