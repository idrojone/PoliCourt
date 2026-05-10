from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.infrastructure.database import get_db
from app.infrastructure.repository.payment_repository import PaymentRepository
from app.application.payment_service import PaymentService
from app.schemas.payment_schema import (
    MonthlyRevenueItem,
    PaymentByStatus,
    RevenueBySport,
    PaymentSummary,
)
from app.schemas.apiResponse import ApiResponse

payment_router = APIRouter(tags=["Payments"])


@payment_router.get(
    "/payments/analytics/monthly-revenue",
    response_model=ApiResponse[List[MonthlyRevenueItem]],
)
def get_monthly_revenue(
    months: int = Query(12, ge=1, le=24, description="Número de meses a consultar"),
    db: Session = Depends(get_db),
):
    """
    Devuelve los ingresos mensuales (solo pagos SUCCEEDED) agrupados por año-mes.
    """
    service = PaymentService(PaymentRepository(db))
    result = service.get_monthly_revenue(months)
    return ApiResponse.success_response(result)


@payment_router.get(
    "/payments/analytics/by-status",
    response_model=ApiResponse[List[PaymentByStatus]],
)
def get_payments_by_status(db: Session = Depends(get_db)):
    """
    Devuelve el conteo y suma total de pagos agrupados por estado (SUCCEEDED, FAILED, REFUNDED).
    """
    service = PaymentService(PaymentRepository(db))
    result = service.get_by_status()
    return ApiResponse.success_response(result)


@payment_router.get(
    "/payments/analytics/by-sport",
    response_model=ApiResponse[List[RevenueBySport]],
)
def get_revenue_by_sport(db: Session = Depends(get_db)):
    """
    Devuelve los ingresos agrupados por deporte (JOIN bookings → sports).
    Solo incluye pagos con status SUCCEEDED.
    """
    service = PaymentService(PaymentRepository(db))
    result = service.get_revenue_by_sport()
    return ApiResponse.success_response(result)


@payment_router.get(
    "/payments/analytics/summary",
    response_model=ApiResponse[PaymentSummary],
)
def get_payment_summary(db: Session = Depends(get_db)):
    """
    Devuelve KPIs resumen: total ingresos, nº pagos, ticket medio, tasa de éxito, reembolsos.
    """
    service = PaymentService(PaymentRepository(db))
    result = service.get_summary()
    return ApiResponse.success_response(result)
