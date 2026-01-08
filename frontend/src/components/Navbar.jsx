import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/logout');
    };

    return (
        <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex space-x-8">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-blue-600">
                                Luxury Stay
                            </Link>
                        </div>
                        <div className="hidden sm:flex space-x-4 items-center">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Home</Link>
                            <Link to="/search" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Explore Hotels</Link>
                            {user && user.role === 'USER' && (
                                <>
                                    <Link to="/bookings" className="text-gray-700 hover:text-blue-600 text-sm font-medium">My Bookings</Link>
                                    <Link to="/profile" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Profile</Link>
                                </>
                            )}
                            {user && user.role === 'ADMIN' && (
                                <>
                                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Dashboard</Link>
                                    <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Users</Link>
                                    <Link to="/admin/hotels" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Hotels</Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Register</Link>
                            </>
                        ) : (
                            <>
                                <span className="text-gray-600 text-sm">Hello, {user.name}</span>
                                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 text-sm font-medium">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
