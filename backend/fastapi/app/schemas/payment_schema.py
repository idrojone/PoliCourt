from typing import List
from pydantic import BaseModel, ConfigDict


class MonthlyRevenueItem(BaseModel):
    year: int
    month: int
    total: float
    count: int

    model_config = ConfigDict(from_attributes=True)


class PaymentByStatus(BaseModel):
    status: str
    count: int
    total: float

    model_config = ConfigDict(from_attributes=True)


class RevenueBySport(BaseModel):
    sport: str
    total: float
    count: int

    model_config = ConfigDict(from_attributes=True)


class PaymentSummary(BaseModel):
    totalRevenue: float
    totalPayments: int
    succeededPayments: int
    averageTicket: float
    successRate: float
    refundedCount: int
    refundedTotal: float

    model_config = ConfigDict(from_attributes=True)
