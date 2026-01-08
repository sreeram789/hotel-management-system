package com.hotel.system.controller;

import com.hotel.system.dto.DTOs;
import com.hotel.system.entity.Booking;
import com.hotel.system.service.impl.BookingServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingServiceImpl bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody DTOs.BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<Booking>> getMyBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(bookingService.getMyBookings(pageable));
    }

    @PutMapping("/{id}/extend")
    public ResponseEntity<Booking> extendBooking(@PathVariable Long id,
            @RequestBody DTOs.ExtendBookingRequest request) {
        return ResponseEntity.ok(bookingService.extendBooking(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.ok().build();
    }
}
