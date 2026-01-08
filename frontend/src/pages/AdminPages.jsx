import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

export const AdminDashboard = () => {
    const stats = [
        { label: 'Total Bookings', value: '128', icon: '📅' },
        { label: 'Active Hotels', value: '12', icon: '🏨' },
        { label: 'Total Revenue', value: '$45,280', icon: '💰' },
        { label: 'New Users', value: '34', icon: '👤' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-lg border shadow-sm">
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 text-white rounded-xl p-8">
                <h2 className="text-2xl font-bold mb-4">Quick Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-blue-300 font-bold">Hotels</h4>
                        <p className="text-gray-400 text-sm">Manage hotel entries and images.</p>
                    </div>
                    <div>
                        <h4 className="text-blue-300 font-bold">Users</h4>
                        <p className="text-gray-400 text-sm">Control user access and roles.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Manage Users</h2>
            {loading ? <p>Loading...</p> : (
                <div className="bg-white rounded-lg border overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700">Name</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Email</th>
                                <th className="px-6 py-4 font-bold text-gray-700">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="px-6 py-4">{u.name}</td>
                                    <td className="px-6 py-4">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export const ManageHotels = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [rooms, setRooms] = useState([{ roomNumber: '', type: 'SINGLE', pricePerNight: '' }]);
    const [isSeeding, setIsSeeding] = useState(false);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            const res = await api.get('/hotels?size=100');
            if (res.data.content) setHotels(res.data.content);
            else setHotels(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addRoom = () => {
        setRooms([...rooms, { roomNumber: '', type: 'SINGLE', pricePerNight: '' }]);
    };

    const removeRoom = (index) => {
        setRooms(rooms.filter((_, i) => i !== index));
    };

    const updateRoom = (index, field, value) => {
        const updatedRooms = [...rooms];
        updatedRooms[index][field] = value;
        setRooms(updatedRooms);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const hotelData = {
                name,
                location,
                description,
                rating: rating ? parseFloat(rating) : null,
                tags: tags || null,
                imageUrl: imageUrl || null,
                rooms: rooms
                    .filter(room => room.roomNumber && room.pricePerNight)
                    .map(room => ({
                        roomNumber: room.roomNumber,
                        type: room.type,
                        pricePerNight: parseFloat(room.pricePerNight)
                    }))
            };

            await api.post('/admin/hotels/with-rooms', hotelData);
            alert("Hotel Added Successfully with Rooms!");
            setName('');
            setLocation('');
            setDescription('');
            setRating('');
            setTags('');
            setImageUrl('');
            setRooms([{ roomNumber: '', type: 'SINGLE', pricePerNight: '' }]);
            fetchHotels(); // Refresh the hotels list
        } catch (err) {
            console.error(err);
            alert("Failed to add hotel: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteHotel = async (hotelId, hotelName) => {
        if (!window.confirm(`Are you sure you want to delete "${hotelName}"? This will also delete all associated rooms and bookings. This action cannot be undone!`)) {
            return;
        }
        try {
            await api.delete(`/admin/hotels/${hotelId}`);
            alert("Hotel deleted successfully!");
            fetchHotels(); // Refresh the hotels list
        } catch (err) {
            console.error(err);
            alert("Failed to delete hotel: " + (err.response?.data?.message || "Hotel may have active bookings"));
        }
    };

    const seedData = async () => {
        setIsSeeding(true);
        try {
            const hotelsData = [
                { name: "Ocean Paradise", location: "Miami, FL", description: "Beautiful oceanfront resort." },
                { name: "Alpine Lodge", location: "Aspen, CO", description: "Cozy mountain lodge." },
                { name: "Urban City Hotel", location: "New York, NY", description: "Luxury city hotel." }
            ];

            for (const h of hotelsData) {
                const res = await api.post('/admin/hotels', h);
                const hotelId = res.data.id;
                await api.post('/admin/rooms', { roomNumber: "101", type: "SINGLE", pricePerNight: 100.0, hotelId });
                await api.post('/admin/rooms', { roomNumber: "102", type: "DOUBLE", pricePerNight: 150.0, hotelId });
            }
            alert("Demo data generated!");
        } catch (err) {
            console.error(err);
            alert("Seed failed. Ensure you are an Admin.");
        } finally {
            setIsSeeding(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Hotels</h2>
                <button onClick={seedData} disabled={isSeeding} className="bg-gray-100 px-4 py-2 border rounded hover:bg-gray-200">
                    {isSeeding ? 'Generating...' : 'Seed Demo Data'}
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-xl font-bold mb-4">Add New Hotel</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                            <input className="w-full border p-3 rounded-lg" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input className="w-full border p-3 rounded-lg" value={location} onChange={e => setLocation(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="w-full border p-3 rounded-lg h-24" value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <input type="number" step="0.1" min="0" max="5" className="w-full border p-3 rounded-lg" value={rating} onChange={e => setRating(e.target.value)} placeholder="4.5" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                            <input className="w-full border p-3 rounded-lg" value={tags} onChange={e => setTags(e.target.value)} placeholder="Beach,Luxury" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input className="w-full border p-3 rounded-lg" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-gray-900">Rooms</h4>
                            <button type="button" onClick={addRoom} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">
                                + Add Room
                            </button>
                        </div>
                        <div className="space-y-4">
                            {rooms.map((room, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <h5 className="font-bold text-gray-700">Room {index + 1}</h5>
                                        {rooms.length > 1 && (
                                            <button type="button" onClick={() => removeRoom(index)} className="text-red-600 hover:text-red-800 font-bold">
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                            <input
                                                className="w-full border p-2 rounded-lg"
                                                value={room.roomNumber}
                                                onChange={e => updateRoom(index, 'roomNumber', e.target.value)}
                                                placeholder="101"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                                            <select
                                                className="w-full border p-2 rounded-lg"
                                                value={room.type}
                                                onChange={e => updateRoom(index, 'type', e.target.value)}
                                            >
                                                <option value="SINGLE">Single</option>
                                                <option value="DOUBLE">Double</option>
                                                <option value="DELUXE">Deluxe</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="w-full border p-2 rounded-lg"
                                                value={room.pricePerNight}
                                                onChange={e => updateRoom(index, 'pricePerNight', e.target.value)}
                                                placeholder="100.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">* At least one room with room number and price is required</p>
                    </div>

                    <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 w-full mt-6">
                        Save Hotel with Rooms
                    </button>
                </form>
            </div>

            {/* Existing Hotels List */}
            <div className="bg-white p-6 rounded-lg border shadow-sm mt-8">
                <h3 className="text-xl font-bold mb-4">Existing Hotels</h3>
                {loading ? (
                    <p className="text-gray-500">Loading hotels...</p>
                ) : hotels.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No hotels added yet. Add your first hotel above!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 font-bold text-gray-700">Hotel Name</th>
                                    <th className="px-4 py-3 font-bold text-gray-700">Location</th>
                                    <th className="px-4 py-3 font-bold text-gray-700">Rating</th>
                                    <th className="px-4 py-3 font-bold text-gray-700">Description</th>
                                    <th className="px-4 py-3 font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {hotels.map(hotel => (
                                    <tr key={hotel.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-gray-900">{hotel.name}</td>
                                        <td className="px-4 py-3 text-gray-600">{hotel.location || 'N/A'}</td>
                                        <td className="px-4 py-3">
                                            {hotel.rating ? (
                                                <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold">
                                                    ★ {hotel.rating}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-sm max-w-md truncate">
                                            {hotel.description || 'No description'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleDeleteHotel(hotel.id, hotel.name)}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ManageRooms = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRoom, setNewRoom] = useState({ roomNumber: '', type: 'SINGLE', pricePerNight: '' });

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            fetchRooms(selectedHotelId);
        } else {
            setRooms([]);
        }
    }, [selectedHotelId]);

    const fetchHotels = async () => {
        try {
            const res = await api.get('/hotels');
            setHotels(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async (hotelId) => {
        try {
            const res = await api.get(`/hotels/${hotelId}/rooms`);
            setRooms(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!selectedHotelId) {
            alert("Please select a hotel first");
            return;
        }
        try {
            await api.post(`/admin/rooms?hotelId=${selectedHotelId}`, {
                roomNumber: newRoom.roomNumber,
                type: newRoom.type,
                pricePerNight: parseFloat(newRoom.pricePerNight)
            });
            alert("Room added successfully!");
            setNewRoom({ roomNumber: '', type: 'SINGLE', pricePerNight: '' });
            fetchRooms(selectedHotelId);
        } catch (err) {
            console.error(err);
            alert("Failed to add room: " + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            await api.delete(`/admin/rooms/${roomId}`);
            alert("Room deleted successfully!");
            fetchRooms(selectedHotelId);
        } catch (err) {
            console.error(err);
            alert("Failed to delete room");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Manage Rooms</h2>

            <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                <h3 className="text-xl font-bold mb-4">Select Hotel</h3>
                {loading ? (
                    <p>Loading hotels...</p>
                ) : (
                    <select
                        className="w-full border p-3 rounded-lg"
                        value={selectedHotelId}
                        onChange={(e) => setSelectedHotelId(e.target.value)}
                    >
                        <option value="">-- Select a hotel --</option>
                        {hotels.map(hotel => (
                            <option key={hotel.id} value={hotel.id}>
                                {hotel.name} - {hotel.location}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {selectedHotelId && (
                <>
                    <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                        <h3 className="text-xl font-bold mb-4">Add New Room</h3>
                        <form onSubmit={handleAddRoom} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                <input
                                    className="w-full border p-2 rounded-lg"
                                    value={newRoom.roomNumber}
                                    onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                                    placeholder="101"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="w-full border p-2 rounded-lg"
                                    value={newRoom.type}
                                    onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                                >
                                    <option value="SINGLE">Single</option>
                                    <option value="DOUBLE">Double</option>
                                    <option value="DELUXE">Deluxe</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full border p-2 rounded-lg"
                                    value={newRoom.pricePerNight}
                                    onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
                                    placeholder="100.00"
                                    required
                                />
                            </div>
                            <div className="flex items-end">
                                <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
                                    Add Room
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-lg border shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Existing Rooms</h3>
                        {rooms.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No rooms added yet for this hotel.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-gray-700">Room Number</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">Type</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">Price/Night</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">Status</th>
                                            <th className="px-4 py-3 font-bold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {rooms.map(room => (
                                            <tr key={room.id}>
                                                <td className="px-4 py-3">{room.roomNumber}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                                        {room.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-bold text-blue-600">${parseFloat(room.pricePerNight).toFixed(2)}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {room.available ? 'Available' : 'Unavailable'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleDeleteRoom(room.id)}
                                                        className="text-red-600 hover:text-red-800 font-bold text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
