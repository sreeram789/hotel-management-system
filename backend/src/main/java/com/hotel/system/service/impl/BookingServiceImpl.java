package com.hotel.system.service.impl;

import com.hotel.system.dto.DTOs;
import com.hotel.system.entity.Booking;
import com.hotel.system.entity.Room;
import com.hotel.system.entity.User;
import com.hotel.system.repository.BookingRepository;
import com.hotel.system.repository.RoomRepository;
import com.hotel.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class BookingServiceImpl {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    public Booking createBooking(DTOs.BookingRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.isAvailable()) { // Simple check, ideally check dates overlap
            throw new RuntimeException("Room not available");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setStatus(Booking.BookingStatus.BOOKED);

        long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (days < 1)
            days = 1;
        booking.setTotalPrice(room.getPricePerNight().multiply(BigDecimal.valueOf(days)));

        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser_Id(user.getId());
    }

    public Page<Booking> getMyBookings(Pageable pageable) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser_Id(user.getId(), pageable);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        // Could add check if user owns booking
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    public Booking extendBooking(Long id, DTOs.ExtendBookingRequest request) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.BOOKED) {
            throw new RuntimeException("Cannot extend a cancelled booking");
        }

        if (request.getNewCheckOutDate().isBefore(booking.getCheckOutDate())) {
            throw new RuntimeException("New checkout date must be after current checkout date");
        }

        booking.setCheckOutDate(request.getNewCheckOutDate());

        long days = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        if (days < 1)
            days = 1;

        booking.setTotalPrice(booking.getRoom().getPricePerNight().multiply(BigDecimal.valueOf(days)));

        return bookingRepository.save(booking);
    }
}
