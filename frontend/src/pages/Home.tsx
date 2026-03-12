import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to CRC Platform</h1>
            <p className="text-lg text-gray-600 mb-8">Come for Road Child - University Social Service Club</p>
            <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Login Here
            </Link>
        </div>
    );
}