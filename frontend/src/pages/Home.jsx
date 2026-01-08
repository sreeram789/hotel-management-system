import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
    const { user } = useAuth();
    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <div className="relative bg-white pt-16 pb-32 overflow-hidden sm:pt-24 sm:pb-40 lg:pt-32 lg:pb-52">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
                    <div className="sm:max-w-lg">
                        <h1 className="text-4xl font font-extrabold tracking-tight text-gray-900 sm:text-6xl relative z-10">
                            Book your dream stay today
                        </h1>
                        <p className="mt-4 text-xl text-gray-500 relative z-10">
                            Experience the best hotels at the best prices. Whether you are traveling for business or leisure, we have the perfect room for you.
                        </p>
                        <div className="mt-10 relative z-10 flex gap-4">
                            <Link to="/search" className="inline-block bg-blue-600 border border-transparent rounded-full py-4 px-10 font-bold text-white hover:bg-blue-700 shadow-2xl shadow-blue-200 transform transition hover:-translate-y-1 active:scale-95">
                                Explore Hotels Now
                            </Link>
                            {!user && (
                                <Link to="/login" className="inline-block bg-white border border-slate-200 rounded-full py-4 px-10 font-bold text-slate-800 hover:bg-slate-50 shadow-lg transform transition hover:-translate-y-1 active:scale-95">
                                    Sign In
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-40 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                {/* Placeholder Image Grid for aesthetics */}
                <div className="hidden lg:block absolute top-24 right-0 w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}>

                </div>
            </div>

            {/* Features/Trust Section */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why choose us?</h2>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">💎</div>
                            <h3 className="text-lg font-bold">Premium Experience</h3>
                            <p className="mt-2 text-gray-500">We curate only the highest rated hotels for your comfort.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🔒</div>
                            <h3 className="text-lg font-bold">Secure Booking</h3>
                            <p className="mt-2 text-gray-500">Your privacy and security are our top priority.</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-lg font-bold">Fast & Easy</h3>
                            <p className="mt-2 text-gray-500">Book your room in less than 2 minutes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
