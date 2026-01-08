package com.hotel.system.repository;

import com.hotel.system.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_Id(Long userId); // Keep for existing logic if any

    Page<Booking> findByUser_Id(Long userId, Pageable pageable);

    List<Booking> findByRoom_Id(Long roomId);
}
