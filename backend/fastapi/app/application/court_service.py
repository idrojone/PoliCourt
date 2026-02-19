import math
from typing import Optional, List
from decimal import Decimal

from app.infrastructure.repository.court_repository import CourtRepository
from app.schemas.court_schema import CourtResponse, PaginatedResponse


class CourtService:
    def __init__(self, repository: CourtRepository):
        self.repository = repository

    def search_courts(
        self,
        q: Optional[str] = None,
        name: Optional[str] = None,
        location_details: Optional[str] = None,
        price_min: Optional[Decimal] = None,
        price_max: Optional[Decimal] = None,
        capacity_min: Optional[int] = None,
        capacity_max: Optional[int] = None,
        is_indoor: Optional[bool] = None,
        surfaces: Optional[List[str]] = None,
        sports: Optional[List[str]] = None,
        page: int = 0,
        limit: int = 10,
        sort: Optional[str] = None,
    ) -> PaginatedResponse[CourtResponse]:
        items, total = self.repository.search(
            q=q,
            name=name,
            location_details=location_details,
            price_min=price_min,
            price_max=price_max,
            capacity_min=capacity_min,
            capacity_max=capacity_max,
            is_indoor=is_indoor,
            surfaces=surfaces,
            sports=sports,
            page=page,
            limit=limit,
            sort=sort,
        )

        court_responses = []
        for court in items:
            sport_slugs = [cs.sport.slug for cs in court.court_sports if cs.sport]
            response = CourtResponse.model_validate(court)
            response.sports = sport_slugs
            court_responses.append(response)

        return PaginatedResponse(
            content=court_responses,
            page=page,
            limit=limit,
            totalElements=total,
            totalPages=math.ceil(total / limit) if limit > 0 else 0,
        )
