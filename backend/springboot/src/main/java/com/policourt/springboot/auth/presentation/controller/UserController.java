package com.policourt.springboot.auth.presentation.controller;

import com.policourt.springboot.auth.application.service.UserService;
import com.policourt.springboot.auth.domain.enums.UserRole;
import com.policourt.springboot.auth.presentation.request.UpdateUserRoleRequest;
import com.policourt.springboot.auth.presentation.request.UpdateUserStatusRequest;
import com.policourt.springboot.auth.presentation.request.UserRequest;
import com.policourt.springboot.auth.presentation.response.UserResponse;
import com.policourt.springboot.shared.presentation.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

/**
 * Controlador REST para la gestión de usuarios y autenticación.
 * Expone endpoints para registrar, buscar y modificar usuarios del sistema.
 * Todos los endpoints están bajo la ruta base /api/auth.
 */
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
    /**
     * Recupera una lista de todos los usuarios registrados en el sistema.
     *
     * @return ResponseEntity con una {@link ApiResponse} que contiene la lista de {@link UserResponse}.
     */
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
    /**
     * Busca usuarios cuyo nombre de usuario contenga el término de búsqueda proporcionado.
     *
     * @param username El término a buscar en los nombres de usuario.
     * @return ResponseEntity con una {@link ApiResponse} que contiene la lista de usuarios encontrados.
     */
    @GetMapping("/users/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(
        @RequestParam String username
    ) {
        var users = userService.searchByUsername(username);
        return ResponseEntity.ok(
            ApiResponse.success(users, "Users searched successfully.")
        );
    }

    // ========================
    // BÚSQUEDA POR ROL
    // ========================

    @Operation(
        summary = "Search regular users by username",
        description = "Returns a list of users with role USER whose username contains the search term. If no username provided, returns all users with role USER."
    )
    /**
     * Busca usuarios con el rol 'USER'. Si se proporciona un nombre de usuario, filtra por coincidencia parcial.
     *
     * @param username Término de búsqueda opcional para el nombre de usuario.
     * @return ResponseEntity con una {@link ApiResponse} que contiene la lista de usuarios regulares encontrados.
     */
    @GetMapping("/users/role/user/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchRegularUsers(
        @Parameter(description = "Username to search (optional)") @RequestParam(required = false) String username
    ) {
        return searchUsersByRole(UserRole.USER, username, "Usuarios");
    }

    @Operation(
        summary = "Search coaches by username",
        description = "Returns a list of users with role COACH whose username contains the search term. If no username provided, returns all coaches."
    )
    /**
     * Busca usuarios con el rol 'COACH'. Si se proporciona un nombre de usuario, filtra por coincidencia parcial.
     *
     * @param username Término de búsqueda opcional para el nombre de usuario.
     * @return ResponseEntity con una {@link ApiResponse} que contiene la lista de entrenadores encontrados.
     */
    @GetMapping("/users/role/coach/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchCoaches(
        @Parameter(description = "Username to search (optional)") @RequestParam(required = false) String username
    ) {
        return searchUsersByRole(UserRole.COACH, username, "Entrenadores");
    }

    @Operation(
        summary = "Search monitors by username",
        description = "Returns a list of users with role MONITOR whose username contains the search term. If no username provided, returns all monitors."
    )
    /**
     * Busca usuarios con el rol 'MONITOR'. Si se proporciona un nombre de usuario, filtra por coincidencia parcial.
     *
     * @param username Término de búsqueda opcional para el nombre de usuario.
     * @return ResponseEntity con una {@link ApiResponse} que contiene la lista de monitores encontrados.
     */
    @GetMapping("/users/role/monitor/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchMonitors(
        @Parameter(description = "Username to search (optional)") @RequestParam(required = false) String username
    ) {
        return searchUsersByRole(UserRole.MONITOR, username, "Monitores");
    }

    @Operation(
        summary = "Search club admins by username",
        description = "Returns a list of users with role CLUB_ADMIN whose username contains the search term. If no username provided, returns all club admins."
    )
    /**
     * Busca usuarios con el rol 'CLUB_ADMIN'. Si se proporciona un nombre de usuario, filtra por coincidencia parcial.
     *
     * @param username Término de búsqueda opcional para el nombre de usuario.
     * @return ResponseEntity con una {@link ApiResponse} que contiene la lista de administradores de club encontrados.
     */
    @GetMapping("/users/role/club-admin/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchClubAdmins(
        @Parameter(description = "Username to search (optional)") @RequestParam(required = false) String username
    ) {
        return searchUsersByRole(UserRole.CLUB_ADMIN, username, "Administradores de club");
    }

    /**
     * Método auxiliar para buscar usuarios por rol y, opcionalmente, por nombre de usuario.
     * Si el nombre de usuario es nulo o está en blanco, busca todos los usuarios con el rol especificado.
     *
     * @param role El rol de usuario por el cual filtrar.
     * @param username El término de búsqueda opcional para el nombre de usuario.
     * @param roleDisplayName El nombre del rol para mostrar en el mensaje de respuesta.
     * @return Un {@link ResponseEntity} que contiene la lista de usuarios encontrados.
     */
    private ResponseEntity<ApiResponse<List<UserResponse>>> searchUsersByRole(
        UserRole role,
        String username,
        String roleDisplayName
    ) {
        List<UserResponse> users;
        if (username == null || username.isBlank()) {
            users = userService.findByRole(role);
        } else {
            users = userService.searchByRoleAndUsername(role, username);
        }
        return ResponseEntity.ok(
            ApiResponse.success(users, roleDisplayName + " recuperados correctamente.")
        );
    }

    // ========================
    // REGISTRO Y ACTUALIZACIÓN
    // ========================

    // ========================
    // REGISTRO Y ACTUALIZACIÓN
    // ========================

    @Operation(
        summary = "Register a new user",
        description = "Creates a new user account in the system."
    )
    /**
     * Registra un nuevo usuario en el sistema.
     *
     * @param userRequest El DTO con los datos del usuario a registrar.
     * @return ResponseEntity con estado 201 (Created) y un cuerpo de respuesta vacío.
     */
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
    /**
     * Actualiza el rol de un usuario específico.
     *
     * @param username El nombre de usuario del usuario a modificar.
     * @param request El DTO que contiene el nuevo rol.
     * @return ResponseEntity con una {@link ApiResponse} que contiene el {@link UserResponse} actualizado.
     */
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
    /**
     * Actualiza el estado de un usuario específico (ej. PUBLISHED, DRAFT).
     *
     * @param username El nombre de usuario del usuario a modificar.
     * @param request El DTO que contiene el nuevo estado.
     * @return ResponseEntity con una {@link ApiResponse} que contiene el {@link UserResponse} actualizado.
     */
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
    /**
     * Cambia el estado de activación (activo/inactivo) de un usuario.
     *
     * @param username El nombre de usuario del usuario a modificar.
     * @return ResponseEntity con una {@link ApiResponse} que contiene el {@link UserResponse} actualizado.
     */
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
