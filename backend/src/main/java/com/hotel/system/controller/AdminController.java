package com.hotel.system.controller;

import com.hotel.system.entity.Booking;
import com.hotel.system.entity.Hotel;
import com.hotel.system.entity.Room;
import com.hotel.system.entity.User;
import com.hotel.system.dto.DTOs;
import com.hotel.system.repository.UserRepository;
import com.hotel.system.service.impl.BookingServiceImpl;
import com.hotel.system.service.impl.HotelServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private HotelServiceImpl hotelService;

    @Autowired
    private BookingServiceImpl bookingService;
    
    @Autowired
    private UserRepository userRepository;

    // Hotels
    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.addHotel(hotel));
    }

    @PostMapping("/hotels/with-rooms")
    public ResponseEntity<Hotel> createHotelWithRooms(@RequestBody DTOs.HotelWithRoomsRequest request) {
        Hotel hotel = new Hotel();
        hotel.setName(request.getName());
        hotel.setLocation(request.getLocation());
        hotel.setDescription(request.getDescription());
        hotel.setRating(request.getRating());
        hotel.setTags(request.getTags());
        hotel.setImageUrl(request.getImageUrl());
        return ResponseEntity.ok(hotelService.addHotelWithRooms(hotel, request.getRooms()));
    }
    
    @PutMapping("/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
        return ResponseEntity.ok(hotelService.updateHotel(id, hotel));
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok().build();
    }
    
    // Rooms
    @PostMapping("/rooms") // Expecting hotelId inside room or separate? Assuming body has hotel info or we pass hotelId
    // Simplified: Pass hotelId as query param or part of body. Let's assume body has hotel object or just use a DTO. 
    // To match user request "/api/admin/rooms", I'll expect Room with hotel mapping or handle it.
    // For simplicity let's stick to adding room to a hotel via query param or simple DTO.
    // Actually, I'll allow Room entity input but ensure hotel is set if ID allows.
    // Re-reading usage: "POST /api/admin/rooms".
    public ResponseEntity<Room> addRoom(@RequestParam Long hotelId, @RequestBody Room room) {
       return ResponseEntity.ok(hotelService.addRoom(hotelId, room));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(hotelService.updateRoom(id, room));
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        hotelService.deleteRoom(id);
        return ResponseEntity.ok().build();
    }
    
    // Bookings
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    
    // Users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
