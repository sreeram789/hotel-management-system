import { useState, useEffect } from 'react';
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

// Modal Component for viewing rooms and booking
const RoomBookingModal = ({ hotel, onClose }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [toast, setToast] = useState(null);
    const { user } = useAuth();

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

    const handleBook = async () => {
        if (!selectedRoom || !checkIn || !checkOut) return;
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
            setToast({ message: 'Booking Failed. Room might be unavailable.', type: 'error' });
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
                    {loading ? <p>Loading rooms...</p> : (
                        <div className="space-y-6">
                            {rooms.length === 0 ? <p className="text-gray-500">No rooms available for this hotel yet.</p> : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {rooms.map(room => (
                                        <div key={room.id} className={`border-2 rounded-xl p-4 cursor-pointer transition ${selectedRoom?.id === room.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`} onClick={() => setSelectedRoom(room)}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900">Room {room.roomNumber}</h4>
                                                    <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 mt-1">{room.type}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-blue-600">${room.pricePerNight}</div>
                                                    <div className="text-xs text-gray-400">per night</div>
                                                </div>
                                            </div>
                                            {!room.available && <div className="mt-2 text-red-500 text-xs font-bold">Unavailable</div>}
                                        </div>
                                    ))}
                                </div>
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
        </div>
    );
};

const ExtendBookingModal = ({ booking, onClose, onUpdate }) => {
    const [newCheckOut, setNewCheckOut] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleExtend = async () => {
        if (!newCheckOut) return;
        setLoading(true);
        try {
            await api.put(`/bookings/${booking.id}/extend`, {
                newCheckOutDate: newCheckOut
            });
            setToast({ message: 'Booking Extended Successfully!', type: 'success' });
            setTimeout(() => {
                onUpdate();
                onClose();
            }, 1500);
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to extend booking. Please check dates.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Extend Stay</h3>
                <p className="text-gray-600 mb-4">
                    Current Check-out: <span className="font-semibold">{booking.checkOutDate}</span>
                </p>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Check-out Date</label>
                    <input
                        type="date"
                        min={booking.checkOutDate}
                        value={newCheckOut}
                        onChange={e => setNewCheckOut(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                    />
                </div>
                <div className="flex space-x-3">
                    <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
                    <button
                        onClick={handleExtend}
                        disabled={!newCheckOut || loading}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {loading ? 'Extending...' : 'Confirm Extension'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Reusable Hotel Card
const HotelCard = ({ hotel, onBook }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col h-full">
        <div className="h-48 bg-gray-200 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xl bg-gradient-to-tr from-blue-100 to-indigo-50">
                {hotel.name}
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm">Featured</div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
            <p className="text-gray-500 text-sm mb-3 flex items-center">📍 {hotel.location}</p>
            <p className="text-gray-700 text-sm mb-4 line-clamp-2 flex-1">{hotel.description}</p>
            <button onClick={() => onBook(hotel)} className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded-xl transition">
                Select Rooms
            </button>
        </div>
    </div>
);

export const UserDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchHotels(page);
    }, [page]);

    const fetchHotels = async (currentPage) => {
        setLoading(true);
        try {
            const res = await api.get(`/hotels?page=${currentPage}&size=6`);
            console.log("API Response:", res.data);
            if (res.data.content) {
                setHotels(res.data.content);
                setTotalPages(res.data.totalPages);
            } else {
                setHotels(res.data);
                setTotalPages(0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredHotels = hotels.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    console.log("Hotels State:", hotels);
    console.log("Filtered Hotels:", filteredHotels);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Find your next stay</h2>
                <div className="max-w-2xl mx-auto relative group">
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search hotels in this page..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <button onClick={() => fetchHotels(0)} className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-medium hover:bg-blue-700 transition shadow-md">Refresh</button>
                </div>
            </div>

            {loading ? <p className="text-center text-gray-500">Loading hotels...</p> : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredHotels.map(hotel => (
                            <HotelCard key={hotel.id} hotel={hotel} onBook={setSelectedHotel} />
                        ))}
                        {filteredHotels.length === 0 && (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-500 text-lg">No hotels found matching "{searchTerm}" on this page.</p>
                                <button onClick={() => setSearchTerm('')} className="mt-2 text-blue-600 hover:underline">Clear search</button>
                            </div>
                        )}
                    </div>
                    {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
                </>
            )}

            {selectedHotel && (
                <RoomBookingModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
            )}
        </div>
    );
};

export const Profile = () => {
    const { user } = useAuth();
    const [toast, setToast] = useState(null);
    return (
        <div className="max-w-3xl mx-auto py-10 px-4">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-center -mt-12 mb-6">
                        <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg flex items-center justify-center">
                            <span className="text-4xl">👤</span>
                        </div>
                    </div>
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Email</span>
                            <span className="font-medium text-gray-900">{user?.email}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-100">
                            <span className="text-gray-600">Account ID</span>
                            <span className="font-medium text-gray-900">#{user?.id}</span>
                        </div>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [extendingBooking, setExtendingBooking] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [toast, setToast] = useState(null);
    const [confirmCancel, setConfirmCancel] = useState(null);

    useEffect(() => {
        fetchBookings(page);
    }, [page]);

    const fetchBookings = async (currentPage) => {
        setLoading(true);
        try {
            const res = await api.get(`/bookings/my?page=${currentPage}&size=5`);
            setBookings(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.delete(`/bookings/${id}`);
            setToast({ message: 'Booking cancelled successfully', type: 'success' });
            fetchBookings(page);
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to cancel booking', type: 'error' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h2>
            {loading ? <p>Loading...</p> : (
                <>
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row items-center justify-between border-l-4 border-blue-500 hover:shadow-xl transition duration-300">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                                    <div className="h-16 w-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">🏨</div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{booking.room?.hotel?.name || 'Hotel'}</h4>
                                        <div className="text-sm text-gray-500 mt-1">
                                            <span className="mr-4">Room {booking.room?.roomNumber}</span>
                                            <span>{booking.room?.type}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mt-1">{booking.checkInDate} - {booking.checkOutDate}</p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'BOOKED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {booking.status}
                                            </span>
                                            <span className="font-bold text-gray-900">${booking.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 flex space-x-3 w-full sm:w-auto justify-end">
                                    {booking.status === 'BOOKED' && (
                                        <>
                                            <button onClick={() => setExtendingBooking(booking)} className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-100 transition">Extend</button>
                                            <button onClick={() => setConfirmCancel(booking.id)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition">Cancel</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {bookings.length === 0 && <p className="text-gray-500">No bookings found. Book a hotel to see it here!</p>}
                    </div>
                    {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
                </>
            )}
            {extendingBooking && (
                <ExtendBookingModal
                    booking={extendingBooking}
                    onClose={() => setExtendingBooking(null)}
                    onUpdate={() => fetchBookings(page)}
                />
            )}
            {confirmCancel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Booking?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                        <div className="flex space-x-3">
                            <button onClick={() => setConfirmCancel(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">No, Keep It</button>
                            <button onClick={() => { handleCancel(confirmCancel); setConfirmCancel(null); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Yes, Cancel Booking</button>
                        </div>
                    </div>
                </div>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};
