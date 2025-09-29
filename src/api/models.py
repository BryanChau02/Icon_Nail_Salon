from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Text, DateTime, JSON, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime, timedelta, timezone

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)
    # maybe change to int later (check api)
    phone: Mapped[str] = mapped_column(String(120), nullable=False)
    fname: Mapped[str] = mapped_column(String(120), nullable=False)
    lname: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="Customer")

    bio: Mapped[str] = mapped_column(Text, nullable=True, default="")
    photo_url: Mapped[str] = mapped_column(String(500), nullable=True)
    booking_url: Mapped[str] = mapped_column(String(500), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "first": self.fname,
            "last": self.lname,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "bio": self.bio or "",
            "photoUrl": self.photo_url or "",
            "bookingUrl": self.booking_url or "",
            # do not serialize the password, its a security breach
            "photoUrl": self.photo_url or "",
        }


class Appointment(db.Model):
    __tablename__ = "appointments"

    id = db.Column(db.Integer, primary_key=True)

    # who is doing the service
    staff_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # optional: who the customer is (can be null if you’re not tying to a user)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    # when it starts (store in UTC ideally)
    starts_at = db.Column(db.DateTime(timezone=False), nullable=False, index=True)

    # total minutes for all selected services
    duration_min = db.Column(db.Integer, nullable=False, default=0)

    # list of {id, name, price, duration}
    services: Mapped[list]   = mapped_column(JSON, nullable=False, default=list)

    # simple money fields (use cents or DECIMAL if you prefer)
    subtotal = db.Column(db.Integer, nullable=False, default=0)
    tip      = db.Column(db.Integer, nullable=False, default=0)
    total    = db.Column(db.Integer, nullable=False, default=0)

    notes      = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True),
                           nullable=False, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "staff_id": self.staff_id,
            "customer_id": self.customer_id,
            "starts_at": self.starts_at.isoformat() if self.starts_at else None,
            "duration_min": self.duration_min,
            "services": self.services or [],
            "subtotal": self.subtotal,
            "tip": self.tip,
            "total": self.total,
            "notes": self.notes or "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
    
# class Staff(db.Model):
#     __tablename__ = "staff"

#     id: Mapped[int] = mapped_column(Integer, primary_key=True)
#     name: Mapped[str] = mapped_column(String(120), nullable=False)
#     role: Mapped[str] = mapped_column(String(120), nullable=False)
#     bio: Mapped[str] = mapped_column(Text, nullable=False, default="")
#     photo_url: Mapped[str] = mapped_column(String(500), nullable=True)
#     booking_url: Mapped[str] = mapped_column(String(500), nullable=True)

#     def serialize(self):
#         return {
#             "id": self.id,
#             "name": self.name,
#             "role": self.role,
#             "bio": self.bio,
#             "photoUrl": self.photo_url,
#             "bookingUrl": self.booking_url,
#         }
