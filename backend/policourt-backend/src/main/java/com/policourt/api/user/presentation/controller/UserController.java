package com.policourt.api.user.presentation.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.policourt.api.booking.application.BookingService;
import com.policourt.api.booking.presentation.mapper.BookingPresentationMapper;
import com.policourt.api.booking.presentation.response.BookingWithTicketResponse;
import com.policourt.api.shared.enums.GeneralStatus;
import com.policourt.api.shared.response.ApiResponse;
import com.policourt.api.shared.response.PaginatedResponse;
import com.policourt.api.shared.security.SecurityOverrideService;
import com.policourt.api.tickets.application.TicketService;
import com.policourt.api.tickets.presentation.mapper.TicketPresentationMapper;
import com.policourt.api.user.application.UserService;
import com.policourt.api.user.presentation.mapper.UserPresentationMapper;
import com.policourt.api.user.presentation.request.UserStatusUpdateRequest;
import com.policourt.api.user.presentation.request.UserUpdateRequest;
import com.policourt.api.user.presentation.response.UserResponse;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Endpoints para la gestión de usuarios")
public class UserController {

        private final UserService userService;
        private final UserPresentationMapper userMapper;
        private final BookingService bookingService;
        private final BookingPresentationMapper bookingMapper;
        private final TicketService ticketService;
        private final TicketPresentationMapper ticketMapper;
        private final SecurityOverrideService securityOverrideService;

        @GetMapping
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Buscar usuarios", description = "Busca usuarios según criterios (q, status, isActive, page, limit, sort)")
        public ResponseEntity<ApiResponse<PaginatedResponse<UserResponse>>> search(
                        @Parameter(description = "Texto de búsqueda (nombre, apellido, email)") @RequestParam(required = false) String q,

                        @Parameter(description = "Filtrar por estados (PUBLISHED, DRAFT, ARCHIVED, SUSPENDED)") @RequestParam(required = false) List<GeneralStatus> status,

                        @Parameter(description = "Filtrar por activo/inactivo") @RequestParam(required = false) Boolean isActive,

                        @Parameter(description = "Número de página (1-indexed)") @RequestParam(defaultValue = "1") int page,

                        @Parameter(description = "Cantidad de elementos por página") @RequestParam(defaultValue = "10") int limit,

                        @Parameter(description = "Ordenamiento: name_asc, name_desc, email_asc, email_desc, createdAt_asc, createdAt_desc") @RequestParam(defaultValue = "name_asc") String sort) {

                var criteria = userMapper.toCriteria(q, status, isActive, page, limit, sort);

                return ResponseEntity.ok(ApiResponse.success(
                                userMapper.toPaginatedResponse(userService.searchUsers(criteria)),
                                "Usuarios obtenidos exitosamente"));
        }

        @GetMapping("/{username}/rentals")
        @Operation(summary = "Obtener rentals confirmadas", description = "Obtiene las reservas tipo rental confirmadas del usuario")
        public ResponseEntity<ApiResponse<PaginatedResponse<BookingWithTicketResponse>>> getConfirmedRentalsByUser(
                        @PathVariable String username,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "10") int limit,
                        @RequestParam(defaultValue = "startTime_asc") String sort) {

                securityOverrideService.verifyAdminOrSameUser(username);

        var rentals = bookingService.getConfirmedRentalsByUser(username, page, limit, sort);

        var content = rentals.getContent().stream().map(booking -> {
            var ticketOpt = ticketService.getTicketByBookingId(booking.getId());
            return new BookingWithTicketResponse(
                    bookingMapper.toResponse(booking),
                    ticketOpt.map(ticketMapper::toResponse).orElse(null));
        }).toList();

        var response = PaginatedResponse.<BookingWithTicketResponse>builder()
                .content(content)
                .page(rentals.getNumber() + 1)
                .limit(rentals.getSize())
                .totalElements(rentals.getTotalElements())
                .totalPages(rentals.getTotalPages())
                .first(rentals.isFirst())
                .last(rentals.isLast())
                .build();

        return ResponseEntity.ok(ApiResponse.success(
                response,
                "Rentals confirmadas obtenidas exitosamente"));
        }

        @PutMapping("/{username}")
        @Operation(summary = "Actualizar usuario", description = "Actualiza un usuario existente por su nombre de usuario. Solo se pueden actualizar: firstName, lastName, phone, dateOfBirth, gender, avatarUrl, password.")
        public ResponseEntity<ApiResponse<UserResponse>> update(
                        @PathVariable String username,
                        @Valid @RequestBody UserUpdateRequest request) {

                var domainUser = userMapper.toDomain(request);
                var updatedUser = userService.updateUser(username, domainUser, request.password());

                return ResponseEntity.ok(ApiResponse.success(
                                userMapper.toResponse(updatedUser),
                                "Usuario actualizado exitosamente"));
        }

        @DeleteMapping("/{username}")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Eliminar usuario", description = "Realiza un borrado lógico del usuario (isActive = false).")
        public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String username) {
                userService.deleteUser(username);
                return ResponseEntity.ok(ApiResponse.success(null, "Usuario eliminado exitosamente"));
        }

        @PatchMapping("/{username}/restore")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Restaurar usuario", description = "Restaura un usuario eliminado lógicamente (isActive = true).")
        public ResponseEntity<ApiResponse<Void>> restore(@PathVariable String username) {
                userService.restoreUser(username);
                return ResponseEntity.ok(ApiResponse.success(null, "Usuario restaurado exitosamente"));
        }

        @PatchMapping("/{username}/status")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Actualizar estado", description = "Actualiza el estado de un usuario (PUBLISHED, DRAFT, ARCHIVED, SUSPENDED).")
        public ResponseEntity<ApiResponse<UserResponse>> updateStatus(
                        @PathVariable String username,
                        @Valid @RequestBody UserStatusUpdateRequest request) {

                var updatedUser = userService.updateUserStatus(username, request.status());

                return ResponseEntity.ok(ApiResponse.success(
                                userMapper.toResponse(updatedUser),
                                "Estado de usuario actualizado exitosamente"));
        }

        @PatchMapping("/{username}/role")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Actualizar rol", description = "Actualiza el rol de un usuario.")
        public ResponseEntity<ApiResponse<UserResponse>> updateRole(
                        @PathVariable String username,
                        @Valid @RequestBody com.policourt.api.user.presentation.request.UserRoleUpdateRequest request) {

                var updatedUser = userService.updateUserRole(username, request.role());

                return ResponseEntity.ok(ApiResponse.success(
                                userMapper.toResponse(updatedUser),
                                "Rol de usuario actualizado exitosamente"));
        }

        @PatchMapping("/{email}/role-monitor")
        @PreAuthorize("hasRole('ADMIN')")
        @Operation(summary = "Actualizar rol", description = "Actualiza el rol de un usuario.")
        public ResponseEntity<ApiResponse<UserResponse>> updateRoleByEmail(
                        @PathVariable String email,
                        @Valid @RequestBody com.policourt.api.user.presentation.request.UserRoleUpdateRequest request) {

                var updatedUser = userService.updateUserRoleByEmail(email, request.role());

                return ResponseEntity.ok(ApiResponse.success(
                                userMapper.toResponse(updatedUser),
                                "Rol de usuario actualizado exitosamente"));
        }
}
