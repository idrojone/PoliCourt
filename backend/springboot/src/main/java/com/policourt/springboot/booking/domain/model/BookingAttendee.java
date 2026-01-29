package com.policourt.springboot.booking.domain.model;

import com.policourt.springboot.auth.domain.model.User;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingAttendee {

    private UUID id;
    private User user;
    private String status; // Coincide con el VARCHAR(50) de la BD
    private LocalDateTime joinedAt;
}
