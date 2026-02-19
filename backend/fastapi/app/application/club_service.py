
import math
from typing import Optional, List
from app.infrastructure.repository.club_repository import ClubRepository
from app.schemas.club_schema import ClubResponse, PaginatedResponse

class ClubService:
    def __init__(self, repository: ClubRepository):
        self.repository = repository

    def search_clubs(
        self,
        q: Optional[str] = None,
        name: Optional[str] = None,
        sport_slugs: Optional[List[str]] = None,
        page: int = 0,
        limit: int = 10,
        sort: Optional[str] = None,
    ) -> PaginatedResponse[ClubResponse]:
        items, total = self.repository.search(
            q=q,
            name=name,
            sport_slugs=sport_slugs,
            page=page,
            limit=limit,
            sort=sort,
        )

        club_responses = []
        for club in items:
            # Assuming ClubModel has a 'sport' relationship
            sport_slug = club.sport.slug if club.sport else None
            
            response = ClubResponse(
                slug=club.slug,
                name=club.name,
                description=club.description,
                img_url=club.img_url,
                sport_slug=sport_slug,
                status=club.status
            )
            club_responses.append(response)

        return PaginatedResponse(
            content=club_responses,
            page=page,
            limit=limit,
            totalElements=total,
            totalPages=math.ceil(total / limit) if limit > 0 else 0,
        )
