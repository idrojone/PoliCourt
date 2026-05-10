from typing import List, Dict
from decimal import Decimal
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, case, cast, Integer

from app.infrastructure.models import (
    PaymentModel, PaymentStatusEnum, BookingModel, SportModel
)


class PaymentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_monthly_revenue(self, months: int = 12) -> List[Dict]:
        """
        Obtiene ingresos mensuales agrupados por año-mes.
        Solo cuenta pagos con status SUCCEEDED.
        """
        results = (
            self.db.query(
                extract("year", PaymentModel.created_at).label("year"),
                extract("month", PaymentModel.created_at).label("month"),
                func.coalesce(func.sum(PaymentModel.amount), 0).label("total"),
                func.count(PaymentModel.id).label("count"),
            )
            .filter(PaymentModel.status == PaymentStatusEnum.SUCCEEDED)
            .group_by(
                extract("year", PaymentModel.created_at),
                extract("month", PaymentModel.created_at),
            )
            .order_by(
                extract("year", PaymentModel.created_at),
                extract("month", PaymentModel.created_at),
            )
            .limit(months)
            .all()
        )

        return [
            {
                "year": int(r.year),
                "month": int(r.month),
                "total": float(r.total),
                "count": int(r.count),
            }
            for r in results
        ]

    def get_by_status(self) -> List[Dict]:
        """
        Conteo y suma agrupados por status de pago.
        """
        results = (
            self.db.query(
                PaymentModel.status.label("status"),
                func.count(PaymentModel.id).label("count"),
                func.coalesce(func.sum(PaymentModel.amount), 0).label("total"),
            )
            .group_by(PaymentModel.status)
            .all()
        )

        return [
            {
                "status": r.status.value,
                "count": int(r.count),
                "total": float(r.total),
            }
            for r in results
        ]

    def get_revenue_by_sport(self) -> List[Dict]:
        """
        Ingresos agrupados por deporte (JOIN bookings → sports).
        Solo pagos SUCCEEDED.
        """
        results = (
            self.db.query(
                SportModel.name.label("sport"),
                func.coalesce(func.sum(PaymentModel.amount), 0).label("total"),
                func.count(PaymentModel.id).label("count"),
            )
            .join(BookingModel, PaymentModel.booking_id == BookingModel.id)
            .join(SportModel, BookingModel.sport_id == SportModel.id)
            .filter(PaymentModel.status == PaymentStatusEnum.SUCCEEDED)
            .group_by(SportModel.name)
            .order_by(func.sum(PaymentModel.amount).desc())
            .all()
        )

        return [
            {
                "sport": r.sport,
                "total": float(r.total),
                "count": int(r.count),
            }
            for r in results
        ]

    def get_summary(self) -> Dict:
        """
        KPIs resumen: total ingresos, nº pagos, ticket medio, tasa de éxito.
        """
        total_count = self.db.query(func.count(PaymentModel.id)).scalar() or 0

        succeeded = (
            self.db.query(
                func.count(PaymentModel.id).label("count"),
                func.coalesce(func.sum(PaymentModel.amount), 0).label("total"),
            )
            .filter(PaymentModel.status == PaymentStatusEnum.SUCCEEDED)
            .first()
        )

        refunded = (
            self.db.query(
                func.count(PaymentModel.id).label("count"),
                func.coalesce(func.sum(PaymentModel.amount), 0).label("total"),
            )
            .filter(PaymentModel.status == PaymentStatusEnum.REFUNDED)
            .first()
        )

        succeeded_count = int(succeeded.count) if succeeded else 0
        succeeded_total = float(succeeded.total) if succeeded else 0.0
        refunded_count = int(refunded.count) if refunded else 0
        refunded_total = float(refunded.total) if refunded else 0.0

        avg_ticket = succeeded_total / succeeded_count if succeeded_count > 0 else 0.0
        success_rate = (succeeded_count / total_count * 100) if total_count > 0 else 0.0

        return {
            "totalRevenue": round(succeeded_total, 2),
            "totalPayments": int(total_count),
            "succeededPayments": succeeded_count,
            "averageTicket": round(avg_ticket, 2),
            "successRate": round(success_rate, 2),
            "refundedCount": refunded_count,
            "refundedTotal": round(refunded_total, 2),
        }
