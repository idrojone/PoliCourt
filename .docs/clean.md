```
src/main/java/com/example/auth/
│   ├── application/
│   │   ├── service/
│   │   │   ├── RegisterUserService.java
│   │   │   └── LoginUserService.java
│   │   └── dto/
│   │       ├── LoginRequest.java
│   │       ├── LoginResponse.java
│   │       ├── RegisterRequest.java
│   │       └── UserResponse.java
│   ├── domain/
│   │   ├── entity/
│   │   │   └── User.java
│   │   └── exception/
│   │       └── UserNotFoundException.java
│   ├── infrastructure/
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   └── security/
│   │       └── JwtProvider.java
│   ├── api/
│   │   └── AuthController.java
│   └── config/
│       └── SecurityConfig.java

---
products-service/
├── src/main/java/com/example/products/
│   ├── application/
│   │   ├── service/
│   │   │   ├── CreateProductService.java
│   │   │   └── ListProductsService.java
│   │   └── dto/
│   │       ├── ProductCreateRequest.java
│   │       └── ProductResponse.java
│   ├── domain/
│   │   ├── entity/
│   │   │   └── Product.java
│   │   └── exception/
│   │       └── ProductNotFoundException.java
│   ├── infrastructure/
│   │   ├── repository/
│   │   │   └── ProductRepository.java
│   │   └── messaging/
│   │       └── EventPublisher.java
│   ├── api/
│   │   └── ProductController.java
│   └── config/
│       └── SwaggerConfig.java
└── pom.xml
```

```
users_service/
├── app/
│   ├── main.py
│   ├── api/                 # Controllers / Routers (UI Layer)
│   │   └── v1/
│   │       ├── routes.py
│   │       └── dependencies.py
│   ├── application/
│   │   └── services/
│   │       ├── create_user.py
│   │       ├── authenticate_user.py
│   │       └── update_user.py
│   ├── domain/
│   │   ├── entities/
│   │   │   └── user.py
│   │   └── exceptions.py
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── user_repository.py
│   │   ├── database.py
│   │   └── security.py
│   ├── schemas/             # Pydantic DTOs
│   │   ├── user_create.py
│   │   ├── user_update.py
│   │   └── user_response.py
│   └── config.py
├── alembic/
└── requirements.txt
```
