package com.hotel.system.config;

import com.hotel.system.entity.Hotel;
import com.hotel.system.repository.HotelRepository;
import com.hotel.system.repository.UserRepository;
import com.hotel.system.repository.RoomRepository;
import com.hotel.system.entity.User;
import com.hotel.system.entity.Room;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import com.hotel.system.repository.BookingRepository;

@Configuration
public class DataInitializer {

        @Bean
        CommandLineRunner initDatabase(HotelRepository repository, UserRepository userRepository,
                        RoomRepository roomRepository, BookingRepository bookingRepository,
                        PasswordEncoder passwordEncoder) {
                return args -> {
                        // Only seed if database is empty
                        boolean hotelsEmpty = repository.count() == 0;
                        boolean usersEmpty = userRepository.count() == 0;

                        if (!hotelsEmpty && !usersEmpty) {
                                System.out.println("Database already has data, skipping seed.");
                                return;
                        }

                        if (usersEmpty) {
                                System.out.println("Seeding users...");
                                User admin = new User();
                                admin.setName("Admin User");
                                admin.setEmail("admin@hotel.com");
                                admin.setPassword(passwordEncoder.encode("admin123"));
                                admin.setRole(User.Role.ADMIN);
                                userRepository.save(admin);

                                User user = new User();
                                user.setName("John Doe");
                                user.setEmail("user@hotel.com");
                                user.setPassword(passwordEncoder.encode("user123"));
                                user.setRole(User.Role.USER);
                                userRepository.save(user);
                                System.out.println("Users seeded: admin@hotel.com, user@hotel.com");
                        }

                        if (hotelsEmpty) {
                                System.out.println("Seeding hotels...");

                                Hotel h1 = new Hotel();
                                h1.setName("Azure Beach Resort");
                                h1.setLocation("Malibu, CA");
                                h1.setDescription("Luxury resort with stunning ocean views and private beach access.");
                                h1.setRating(4.8);
                                h1.setTags("Beach,Luxury,Ocean View");
                                h1.setImageUrl(
                                                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80");

                                Hotel h2 = new Hotel();
                                h2.setName("The Industrial Loft");
                                h2.setLocation("Detroit, MI");
                                h2.setDescription(
                                                "Hip, modern suites in a restored factory building with high ceilings.");
                                h2.setRating(4.2);
                                h2.setTags("Industrial,Modern,City Center");
                                h2.setImageUrl(
                                                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80");

                                Hotel h3 = new Hotel();
                                h3.setName("Central Park Suites");
                                h3.setLocation("New York, NY");
                                h3.setDescription("Elegance overlooking the world's most famous park.");
                                h3.setRating(4.9);
                                h3.setTags("Park Nearby,Luxury,Elite");
                                h3.setImageUrl(
                                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80");

                                Hotel h4 = new Hotel();
                                h4.setName("Mountain Retreat");
                                h4.setLocation("Aspen, CO");
                                h4.setDescription("Cozy cabins with fireplaces and direct ski-in/ski-out access.");
                                h4.setRating(4.5);
                                h4.setTags("Nature,Cozy,Skiing");
                                h4.setImageUrl(
                                                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80");

                                Hotel h5 = new Hotel();
                                h5.setName("Neon Plaza");
                                h5.setLocation("Tokyo, JP");
                                h5.setDescription(
                                                "High-tech hotel in the heart of Shibuya with neon lighting and robots.");
                                h5.setRating(4.3);
                                h5.setTags("City Center,Modern,High Tech");
                                h5.setImageUrl(
                                                "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80");

                                Hotel h6 = new Hotel();
                                h6.setName("Tropic Oasis");
                                h6.setLocation("Bali, ID");
                                h6.setDescription("Villas surrounded by lush gardens and infinity pools.");
                                h6.setRating(4.7);
                                h6.setTags("Beach,Nature,Relaxation");
                                h6.setImageUrl(
                                                "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80");

                                repository.saveAll(Arrays.asList(h1, h2, h3, h4, h5, h6));

                                // Seed Rooms for each hotel
                                System.out.println("Seeding rooms for hotels...");

                                // Rooms for Azure Beach Resort
                                createRoom(roomRepository, h1, "101", Room.RoomType.SINGLE, new BigDecimal("150.00"));
                                createRoom(roomRepository, h1, "102", Room.RoomType.DOUBLE, new BigDecimal("250.00"));
                                createRoom(roomRepository, h1, "103", Room.RoomType.DELUXE, new BigDecimal("400.00"));

                                // Rooms for The Industrial Loft
                                createRoom(roomRepository, h2, "201", Room.RoomType.SINGLE, new BigDecimal("120.00"));
                                createRoom(roomRepository, h2, "202", Room.RoomType.DOUBLE, new BigDecimal("200.00"));

                                // Rooms for Central Park Suites
                                createRoom(roomRepository, h3, "301", Room.RoomType.DOUBLE, new BigDecimal("350.00"));
                                createRoom(roomRepository, h3, "302", Room.RoomType.DELUXE, new BigDecimal("550.00"));

                                // Rooms for Mountain Retreat
                                createRoom(roomRepository, h4, "401", Room.RoomType.SINGLE, new BigDecimal("180.00"));
                                createRoom(roomRepository, h4, "402", Room.RoomType.DOUBLE, new BigDecimal("280.00"));
                                createRoom(roomRepository, h4, "403", Room.RoomType.DELUXE, new BigDecimal("450.00"));

                                // Rooms for Neon Plaza
                                createRoom(roomRepository, h5, "501", Room.RoomType.SINGLE, new BigDecimal("140.00"));
                                createRoom(roomRepository, h5, "502", Room.RoomType.DOUBLE, new BigDecimal("220.00"));

                                // Rooms for Tropic Oasis
                                createRoom(roomRepository, h6, "601", Room.RoomType.DOUBLE, new BigDecimal("300.00"));
                                createRoom(roomRepository, h6, "602", Room.RoomType.DELUXE, new BigDecimal("500.00"));

                                System.out.println("Rooms seeded successfully!");
                                System.out.println("Rooms seeded successfully!");
                        }

                };
        }

        private void clearData(BookingRepository bookingRepository, RoomRepository roomRepository,
                        HotelRepository hotelRepository, UserRepository userRepository) {
                try {
                        // Try to delete in the correct order - if this fails, we'll continue anyway
                        bookingRepository.deleteAll();
                        roomRepository.deleteAll();
                        hotelRepository.deleteAll();
                        userRepository.deleteAll();
                        System.out.println("Existing data cleared successfully");
                } catch (Exception e) {
                        // If deletion fails due to FK constraints, that's OK - data might already exist
                        // We'll just proceed with seeding (which will create duplicates, but that's
                        // acceptable for demo)
                        System.out.println(
                                        "Note: Could not clear existing data (this is OK if database has existing bookings). Continuing with seed...");
                }
        }

        private static void createRoom(RoomRepository roomRepository, Hotel hotel, String roomNumber,
                        Room.RoomType type, BigDecimal price) {
                Room room = new Room();
                room.setHotel(hotel);
                room.setRoomNumber(roomNumber);
                room.setType(type);
                room.setPricePerNight(price);
                room.setAvailable(true);
                roomRepository.save(room);
        }
}
