package com.hotel.system.dto;

import com.hotel.system.entity.User;
import java.time.LocalDate;

public class DTOs {

    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class AuthResponse {
        private String token;
        private String role;
        private String name;
        private Long id;

        public AuthResponse(String token, User user) {
            this.token = token;
            this.role = user.getRole().name();
            this.name = user.getName();
            this.id = user.getId();
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role; // "USER" or "ADMIN"

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    public static class BookingRequest {
        private Long roomId;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;

        public Long getRoomId() {
            return roomId;
        }

        public void setRoomId(Long roomId) {
            this.roomId = roomId;
        }

        public LocalDate getCheckInDate() {
            return checkInDate;
        }

        public void setCheckInDate(LocalDate checkInDate) {
            this.checkInDate = checkInDate;
        }

        public LocalDate getCheckOutDate() {
            return checkOutDate;
        }

        public void setCheckOutDate(LocalDate checkOutDate) {
            this.checkOutDate = checkOutDate;
        }
    }

    public static class ExtendBookingRequest {
        private LocalDate newCheckOutDate;

        public LocalDate getNewCheckOutDate() {
            return newCheckOutDate;
        }

        public void setNewCheckOutDate(LocalDate newCheckOutDate) {
            this.newCheckOutDate = newCheckOutDate;
        }
    }

    public static class RoomRequest {
        private String roomNumber;
        private String type; // SINGLE, DOUBLE, DELUXE
        private java.math.BigDecimal pricePerNight;

        public String getRoomNumber() {
            return roomNumber;
        }

        public void setRoomNumber(String roomNumber) {
            this.roomNumber = roomNumber;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public java.math.BigDecimal getPricePerNight() {
            return pricePerNight;
        }

        public void setPricePerNight(java.math.BigDecimal pricePerNight) {
            this.pricePerNight = pricePerNight;
        }
    }

    public static class HotelWithRoomsRequest {
        private String name;
        private String location;
        private String description;
        private Double rating;
        private String tags;
        private String imageUrl;
        private java.util.List<RoomRequest> rooms;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Double getRating() {
            return rating;
        }

        public void setRating(Double rating) {
            this.rating = rating;
        }

        public String getTags() {
            return tags;
        }

        public void setTags(String tags) {
            this.tags = tags;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }

        public java.util.List<RoomRequest> getRooms() {
            return rooms;
        }

        public void setRooms(java.util.List<RoomRequest> rooms) {
            this.rooms = rooms;
        }
    }
}
