import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to Transaction Analytics
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Track your sales, monitor statistics, and visualize transaction data with our 
          comprehensive dashboard.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg 
            hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HomePage;