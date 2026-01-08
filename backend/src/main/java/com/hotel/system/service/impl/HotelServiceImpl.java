package com.hotel.system.service.impl;

import com.hotel.system.entity.Hotel;
import com.hotel.system.entity.Room;
import com.hotel.system.repository.HotelRepository;
import com.hotel.system.repository.RoomRepository;
import com.hotel.system.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class HotelServiceImpl {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Hotel Operations
    public Hotel addHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Hotel hotel = getHotelById(id);
        hotel.setName(hotelDetails.getName());
        hotel.setLocation(hotelDetails.getLocation());
        hotel.setDescription(hotelDetails.getDescription());
        return hotelRepository.save(hotel);
    }

    @Transactional
    public void deleteHotel(Long id) {
        Hotel hotel = getHotelById(id);

        // Get all rooms for this hotel
        List<Room> rooms = roomRepository.findByHotel_Id(id);

        // Delete all bookings for rooms in this hotel
        for (Room room : rooms) {
            bookingRepository.findByRoom_Id(room.getId()).forEach(booking -> {
                bookingRepository.delete(booking);
            });
        }

        // Delete all rooms for this hotel
        roomRepository.deleteAll(rooms);

        // Finally, delete the hotel
        hotelRepository.delete(hotel);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Page<Hotel> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable);
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    // Room Operations
    public Room addRoom(Long hotelId, Room room) {
        Hotel hotel = getHotelById(hotelId);
        room.setHotel(hotel);
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new RuntimeException("Room not found"));
        room.setRoomNumber(roomDetails.getRoomNumber());
        room.setType(roomDetails.getType());
        room.setPricePerNight(roomDetails.getPricePerNight());
        room.setAvailable(roomDetails.isAvailable());
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotel_Id(hotelId);
    }

    public Hotel addHotelWithRooms(com.hotel.system.entity.Hotel hotel,
            java.util.List<com.hotel.system.dto.DTOs.RoomRequest> roomRequests) {
        Hotel savedHotel = hotelRepository.save(hotel);
        if (roomRequests != null && !roomRequests.isEmpty()) {
            for (com.hotel.system.dto.DTOs.RoomRequest roomReq : roomRequests) {
                Room room = new Room();
                room.setRoomNumber(roomReq.getRoomNumber());
                room.setType(com.hotel.system.entity.Room.RoomType.valueOf(roomReq.getType()));
                room.setPricePerNight(roomReq.getPricePerNight());
                room.setHotel(savedHotel);
                room.setAvailable(true);
                roomRepository.save(room);
            }
        }
        return savedHotel;
    }
}
