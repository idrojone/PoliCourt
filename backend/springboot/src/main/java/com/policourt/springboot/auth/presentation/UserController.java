package com.policourt.springboot.auth.presentation;

import com.policourt.springboot.auth.application.service.UserService;
import com.policourt.springboot.auth.presentation.request.UpdateUserRoleRequest;
import com.policourt.springboot.auth.presentation.request.UpdateUserStatusRequest;
import com.policourt.springboot.auth.presentation.request.UserRequest;
import com.policourt.springboot.auth.presentation.response.UserResponse;
import com.policourt.springboot.shared.presentation.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(
    name = "Authentication",
    description = "Endpoints for user authentication and registration."
)
public class UserController {

    private final UserService userService;

    @Operation(
        summary = "Get all users",
        description = "Returns a list of all users in the system."
    )
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(
            ApiResponse.success(
                userService.findAll(),
                "Users retrieved successfully."
            )
        );
    }

    @Operation(
        summary = "Search users by username",
        description = "Returns a list of users whose username contains the provided search term."
    )
    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
        @RequestParam String username
    ) {
        var users = userService.searchByUsername(username);
        return ResponseEntity.ok(
            ApiResponse.success(users, "Users searched successfully.")
        );
    }

    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account in the system."
    )
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
        @Valid @RequestBody UserRequest userRequest
    ) {
        userService.register(userRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<Void>success(null, "User registered successfully.")
        );
    }

    @Operation(
        summary = "Update user role",
        description = "Updates the role of a specific user."
    )
    @PatchMapping("/users/{username}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
        @PathVariable String username,
        @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        var updatedUser = userService.updateUserRole(username, request.role());
        return ResponseEntity.ok(
            ApiResponse.success(updatedUser, "User role updated successfully.")
        );
    }

    @Operation(
        summary = "Update user status",
        description = "Updates the status of a specific user."
    )
    @PatchMapping("/users/{username}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
        @PathVariable String username,
        @Valid @RequestBody UpdateUserStatusRequest request
    ) {
        var updatedUser = userService.updateUserStatus(
            username,
            request.status()
        );
        return ResponseEntity.ok(
            ApiResponse.success(
                updatedUser,
                "User status updated successfully."
            )
        );
    }

    @Operation(
        summary = "Toggle user active status",
        description = "Toggles the active status of a specific user."
    )
    @PatchMapping("/users/{username}/toggle-active")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserActive(
        @PathVariable String username
    ) {
        var updatedUser = userService.toggleUserActive(username);
        return ResponseEntity.ok(
            ApiResponse.success(
                updatedUser,
                "User active status toggled successfully."
            )
        );
    }
}
