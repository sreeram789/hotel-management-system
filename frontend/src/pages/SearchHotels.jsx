import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

// Pagination Control Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center items-center space-x-4 mt-8">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
            Previous
        </button>
        <span className="text-gray-600 font-medium">Page {currentPage + 1} of {totalPages}</span>
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
            Next
        </button>
    </div>
);

// Room Booking Modal Component
const RoomBookingModal = ({ hotel, onClose }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (hotel) {
            fetchRooms();
        }
    }, [hotel]);

    const fetchRooms = async () => {
        try {
            const res = await api.get(`/hotels/${hotel.id}/rooms`);
            setRooms(res.data);
        } catch (err) {
            console.error("Failed to fetch rooms", err);
        } finally {
            setLoading(false);
        }
    };

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleBook = async () => {
        if (!user) {
            setToast({ message: 'You must be logged in to book a room.', type: 'error' });
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        if (!selectedRoom || !checkIn || !checkOut) {
            setToast({ message: 'Please select a room and enter both check-in and check-out dates.', type: 'error' });
            return;
        }
        try {
            await api.post('/bookings', {
                roomId: selectedRoom.id,
                checkInDate: checkIn,
                checkOutDate: checkOut
            });
            setToast({ message: 'Booking Successful!', type: 'success' });
            setTimeout(() => onClose(), 1500);
        } catch (err) {
            console.error(err);
            setToast({ message: 'Booking Failed. ' + (err.response?.data?.message || 'Please try again.'), type: 'error' });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{hotel.name}</h2>
                        <p className="text-gray-500">{hotel.location}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">✕</button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading rooms...</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {rooms.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                                    <div className="text-4xl mb-4">🏨</div>
                                    <p className="text-gray-600 font-medium mb-2">No rooms available yet</p>
                                    <p className="text-sm text-gray-500">This hotel hasn't added any rooms. Please check back later or contact the hotel directly.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Available Rooms</h3>
                                        <p className="text-sm text-gray-500">Select a room to proceed with booking</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {rooms.map(room => (
                                            <div
                                                key={room.id}
                                                className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${selectedRoom?.id === room.id
                                                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
                                                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                                                    } ${!room.available ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                onClick={() => room.available && setSelectedRoom(room)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-lg text-gray-900 mb-1">Room {room.roomNumber}</h4>
                                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                            {room.type}
                                                        </span>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-2xl font-bold text-blue-600">${parseFloat(room.pricePerNight).toFixed(2)}</div>
                                                        <div className="text-xs text-gray-500">per night</div>
                                                    </div>
                                                </div>
                                                {!room.available && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">
                                                            Currently Unavailable
                                                        </span>
                                                    </div>
                                                )}
                                                {room.available && selectedRoom?.id === room.id && (
                                                    <div className="mt-3 pt-3 border-t border-blue-200">
                                                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                                                            ✓ Selected
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <p className="text-sm text-blue-800">
                                            <span className="font-bold">💡 Tip:</span> {rooms.length} room{rooms.length !== 1 ? 's' : ''} available.
                                            {rooms.filter(r => r.available).length > 0
                                                ? ` ${rooms.filter(r => r.available).length} room${rooms.filter(r => r.available).length !== 1 ? 's are' : ' is'} currently available for booking.`
                                                : ' All rooms are currently booked.'}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {selectedRoom && (
                        <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Booking</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                    <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                    <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
                                </div>
                            </div>
                            <button onClick={handleBook} disabled={!checkIn || !checkOut} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg">
                                Confirm Booking
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

const SearchHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('none');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                // Use the shared api instance which points to port 8081
                const response = await api.get(`/hotels?page=${page}&size=6`);

                console.log("Search API Response:", response.data);

                if (response.data.content) {
                    setHotels(response.data.content);
                    setTotalPages(response.data.totalPages);
                } else if (Array.isArray(response.data)) {
                    setHotels(response.data);
                    setTotalPages(0);
                }
            } catch (error) {
                console.error('Backend connection error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, [page]);

    const filteredHotels = hotels
        .filter(hotel =>
            hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (hotel.tags && hotel.tags.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortBy === 'rating-desc') return b.rating - a.rating;
            if (sortBy === 'rating-asc') return a.rating - b.rating;
            return 0;
        });

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Search Hotels</h1>
                    <p className="text-gray-500">Find and book your next stay quickly.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <input
                        type="text"
                        placeholder="Search hotels..."
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="none">Sort by Rating</option>
                        <option value="rating-desc">Rating: High to Low</option>
                        <option value="rating-asc">Rating: Low to High</option>
                    </select>
                </div>
            </div>

            {filteredHotels.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border">
                    <p className="text-gray-500">No hotels found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                    {filteredHotels.map((hotel) => (
                        <div
                            key={hotel.id}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-2 flex flex-col cursor-default"
                        >
                            <div className="relative overflow-hidden h-64">
                                <img
                                    src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
                                    <span className="text-blue-600 font-bold text-sm">★ {hotel.rating}</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-white text-xs font-medium px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md">
                                        {hotel.tags?.split(',')[0]}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-slate-800 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                                </div>
                                <p className="text-slate-500 text-sm mb-3 flex items-center">
                                    <span className="mr-1">📍</span> {hotel.location}
                                </p>
                                <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed">{hotel.description}</p>
                                <button
                                    onClick={() => setSelectedHotel(hotel)}
                                    className="mt-auto w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 hover:shadow-blue-200"
                                >
                                    View Details & Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            )}

            {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

            {selectedHotel && (
                <RoomBookingModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
            )}
        </div>
    );
};

export default SearchHotels;
