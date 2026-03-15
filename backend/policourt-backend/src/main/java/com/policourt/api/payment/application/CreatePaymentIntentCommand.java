package com.policourt.api.payment.application;

import java.time.OffsetDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentIntentCommand {
    private String courtSlug;
    private String organizerUsername;
    private String sportSlug;
    private OffsetDateTime startTime;
    private OffsetDateTime endTime;
}
