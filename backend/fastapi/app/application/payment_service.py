from typing import List, Dict

from app.infrastructure.repository.payment_repository import PaymentRepository
from app.schemas.payment_schema import (
    MonthlyRevenueItem,
    PaymentByStatus,
    RevenueBySport,
    PaymentSummary,
)


class PaymentService:
    def __init__(self, repository: PaymentRepository):
        self.repository = repository

    def get_monthly_revenue(self, months: int = 12) -> List[MonthlyRevenueItem]:
        data = self.repository.get_monthly_revenue(months)
        return [MonthlyRevenueItem(**item) for item in data]

    def get_by_status(self) -> List[PaymentByStatus]:
        data = self.repository.get_by_status()
        return [PaymentByStatus(**item) for item in data]

    def get_revenue_by_sport(self) -> List[RevenueBySport]:
        data = self.repository.get_revenue_by_sport()
        return [RevenueBySport(**item) for item in data]

    def get_summary(self) -> PaymentSummary:
        data = self.repository.get_summary()
        return PaymentSummary(**data)
