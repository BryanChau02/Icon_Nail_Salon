from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Appointment
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from functools import wraps
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
import os

api = Blueprint('api', __name__)
CORS(api)

LOCAL_TZ = ZoneInfo(os.getenv("LOCAL_TZ", "America/New_York"))

def to_local_display(dt):
    # Ensure we have an aware datetime
    if dt.tzinfo is None:
        # your DB stores naive (UTC) — mark it as UTC
        dt = dt.replace(tzinfo=timezone.utc)
    # convert to the configured local timezone
    local_dt = dt.astimezone(LOCAL_TZ)
    # format however you want it to look in the UI
    # e.g., "2025-09-30 09:00 AM"
    return local_dt.strftime("%Y-%m-%d %I:%M %p")

# ----------------- Time helpers (all timezone-aware) -----------------

def parse_iso_to_utc(s: str) -> datetime:
    if not s:
        raise ValueError("starts_at required")

    s = s.strip()
    if s.endswith("Z"):
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
    else:
        dt = datetime.fromisoformat(s)

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=LOCAL_TZ)

    return dt.astimezone(timezone.utc)

def day_bounds_utc(yyyy_mm_dd: str) -> tuple[datetime, datetime]:
    y, m, d = map(int, yyyy_mm_dd.split("-"))
    local_start = datetime(y, m, d, 0, 0, 0, tzinfo=LOCAL_TZ)
    local_end = local_start + timedelta(days=1)
    return local_start.astimezone(timezone.utc), local_end.astimezone(timezone.utc)


def overlaps(a_start_dt: datetime, a_min: int,
             b_start_dt: datetime, b_min: int) -> bool:
    a = a_start_dt.astimezone(timezone.utc)
    b = b_start_dt.astimezone(timezone.utc)
    a_end = a + timedelta(minutes=int(a_min or 0))
    b_end = b + timedelta(minutes=int(b_min or 0))
    return a < b_end and b < a_end


def require_roles(*allowed_roles):
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user:
                return jsonify({"msg": "User not found"}), 404
            if user.role not in allowed_roles:
                return jsonify({"msg": "Forbidden: insufficient role"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

# ---- USERS ----


@api.route('/user', methods=['POST'])
def sign_up():

    body = request.json
    print(body)

    email = body.get("email")
    password = body.get("password")
    first = body.get("first")
    last = body.get("last")

    if not all([email, password, first, last]):
        return jsonify({"msg": "Missing required fields"}), 400

    user = User(email=body["email"], password=body["password"],
                phone=body["phone"], fname=body["first"], lname=body["last"])
    db.session.add(user)
    db.session.commit()

    record_exists = User.query.filter_by(email=body["email"])
    if record_exists:
        return "recieved", 200
    else:
        return "Error, user could not be created", 500

# ---- STAFF ----


@api.route('/staff', methods=['GET'])
def get_staff():
    staff_users = User.query.filter_by(role="Staff").all()
    return jsonify([s.serialize() for s in staff_users]), 200


@api.route('/staff', methods=['POST'])
@require_roles("Admin")
def create_staff():
    body = request.get_json(force=True)
    if body is None:
        return jsonify({"msg": "Invalid request, JSON required"}), 400

    email = body.get("email")
    password = body.get("password")
    fname = body.get("first")
    lname = body.get("last")
    phone = body.get("phone")
    bio = body.get("bio", "")
    photo_url = body.get("photo_url")
    booking_url = body.get("booking_url")

    if not all([email, password, fname, lname]):
        return jsonify({"msg": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    staff_user = User(
        email=email,
        password=password,
        fname=fname,
        lname=lname,
        phone=phone,
        bio=bio,
        photo_url=photo_url,
        booking_url=booking_url,
        role="Staff"
    )

    db.session.add(staff_user)
    db.session.commit()

    return jsonify(staff_user.serialize()), 201

# ---- ROLES ----


@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query your database for email and password
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401

    # Create a new token with the user id inside
    # Temporarily changed (identity=user.email) to (identity=user.id)
    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id})

# Get currently logged in user (Protected)
# @api.route("/me", methods=["GET"])
# @jwt_required(optional=True)
# def me():
#    user_id = get_jwt_identity()
#    user = User.query.get(user_id)
#    if not user:
#        return jsonify({"msg": "User not found"}), 404

#    return jsonify({
#        "id": user.id,
#        "first": user.fname,
#        "email": user.email
#    })


@api.route("/me/<int:user_id>", methods=["GET"])
def me(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "first": user.fname,
        "last": user.lname,
        "email": user.email,
        "phone": user.phone,
        "role": user.role,
    })


@api.route("/admins", methods=["GET"])
def get_admins():
    admins = User.query.filter(User.role == "Admin").all()
    if not admins:
        return jsonify({"msg": "No admins found"}), 404

    return jsonify([
        {
            "id": admin.id,
            "first": admin.fname,
            "last": admin.lname,
            "email": admin.email,
            "phone": admin.phone,
            "role": admin.role
        }
        for admin in admins
    ])


@api.route("/customers", methods=["GET"])
def get_customers():
    customers = User.query.filter(User.role == "Customer").all()
    if not customers:
        return jsonify({"msg": "No customers found"}), 404

    return jsonify([
        {
            "id": customer.id,
            "first": customer.fname,
            "last": customer.lname,
            "email": customer.email,
            "phone": customer.phone,
            "role": customer.role
        }
        for customer in customers
    ])


@api.route("/user/<int:user_id>/role", methods=["PUT"])
def update_user_role(user_id):
    data = request.get_json(silent=True) or {}
    new_role = data.get("role")

    ALLOWED = {"Admin", "Staff", "Customer"}
    if not isinstance(new_role, str) or new_role not in ALLOWED:
        return jsonify({"msg": "Invalid role"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.role = new_role
    db.session.commit()

    return jsonify({
        "id": user.id,
        "first": user.fname,
        "last": user.lname,
        "email": user.email,
        "phone": user.phone,
        "role": user.role
    }), 200


@api.route("/user/<int:user_id>", methods=["PUT"])
def update_user_info(user_id):
    data = request.get_json()

    first = data.get("first")
    last = data.get("last")
    phone = data.get("phone")
    email = data.get("email")

    if not all([first, last, phone, email]):
        return jsonify({"msg": "Error: All fields required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.fname = first
    user.lname = last
    user.phone = phone
    user.email = email

    db.session.commit()

    return jsonify({
        "id": user.id,
        "first": user.fname,
        "last": user.lname,
        "email": user.email,
        "phone": user.phone,
        "role": user.role
    }), 200

# ---- Appointments API ----

@api.route("/appointments", methods=["GET"])
def list_appointments():
    q = Appointment.query

    staff_id = request.args.get("staff_id", type=int)
    if staff_id is not None:
        q = q.filter(Appointment.staff_id == staff_id)

    customer_id = request.args.get("customer_id", type=int)
    if customer_id is not None:
        q = q.filter(Appointment.customer_id == customer_id)

    date_str = request.args.get("date")
    if date_str:
        # constrain to that local day, but do it in UTC for storage
        start_utc, end_utc = day_bounds_utc(date_str)
        q = q.filter(
            Appointment.starts_at >= start_utc,
            Appointment.starts_at < end_utc,
        )
    else:
        # optional admin range
        date_from = request.args.get("from")
        date_to = request.args.get("to")
        if date_from:
            start_utc, _ = day_bounds_utc(date_from)
            q = q.filter(Appointment.starts_at >= start_utc)
        if date_to:
            _, end_utc = day_bounds_utc(date_to)
            q = q.filter(Appointment.starts_at < end_utc)

    q = q.order_by(Appointment.starts_at.asc())

    rows = []

    for a in q:
        staff = User.query.get(a.staff_id) if a.staff_id else None
        cust = User.query.get(a.customer_id) if a.customer_id else None

        d = a.serialize()
        d.update({
            "staff_name":     (f"{staff.fname} {staff.lname}" if staff else ""),
            "customer_name":  (f"{cust.fname} {cust.lname}" if cust else ""),
            "customer_email": (cust.email if cust else ""),
            "starts_at_local": to_local_display(a.starts_at),
        })
        rows.append(d)

    return jsonify(rows), 200


# ----------------- POST /api/appointments -----------------

@api.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json(silent=True) or {}

    staff_id = data.get("staff_id")
    starts_at_utc = parse_iso_to_utc(
        data.get("starts_at"))  # <-- ALWAYS UTC (aware)
    duration_min = int(data.get("duration") or data.get("duration_min") or 0)
    services = data.get("services") or []

    subtotal = float(data.get("subtotal") or 0)
    tip = float(data.get("tip") or 0)
    total = float(data.get("total") or (subtotal + tip))

    if not staff_id or not starts_at_utc or not duration_min:
        return jsonify({"msg": "Missing required fields"}), 400

    staff = User.query.get(staff_id)
    if not staff:
        return jsonify({"msg": "Staff not found"}), 404

    local_day = starts_at_utc.astimezone(LOCAL_TZ).strftime("%Y-%m-%d")
    day_start_utc, day_end_utc = day_bounds_utc(local_day)

    existing = (
        Appointment.query
        .filter(Appointment.staff_id == staff_id)
        .filter(Appointment.starts_at >= day_start_utc)
        .filter(Appointment.starts_at < day_end_utc)
        .all()
    )

    for ap in existing:
        if overlaps(starts_at_utc, duration_min, ap.starts_at, ap.duration_min):
            return jsonify({"msg": "Selected time overlaps another appointment"}), 409
    customer_id = None
    cust = data.get("customer") or {}
    cust_email = (cust.get("email") or "").strip().lower()
    if cust_email:
        existing_cust = User.query.filter_by(email=cust_email).first()
        if existing_cust:
            customer_id = existing_cust.id
        else:
            new_cust = User(
                email=cust_email,
                password="!",
                phone=cust.get("phone") or "",
                fname=cust.get("first") or "",
                lname=cust.get("last") or "",
                role="Customer",
            )
            db.session.add(new_cust)
            db.session.flush()
            customer_id = new_cust.id

    appt = Appointment(
        staff_id=staff_id,
        customer_id=customer_id,
        starts_at=starts_at_utc,
        duration_min=duration_min,
        services=services,
        subtotal=subtotal,
        tip=tip,
        total=total,
        notes=data.get("notes") or None,
    )

    db.session.add(appt)
    db.session.commit()

    return jsonify(appt.serialize()), 201


@api.route("/appointments/<int:appt_id>", methods=["DELETE"])
def delete_appointment(appt_id: int):
    ap = Appointment.query.get(appt_id)
    if not ap:
        return jsonify({"msg": "Appointment not found"}), 404
    db.session.delete(ap)
    db.session.commit()
    return jsonify({"ok": True}), 200


@api.before_app_request
def _ensure_tables():
    db.create_all()

# @api.route('/staff', methods=['POST'])
# def add_staff():
#     data = request.get_json()

#     # Validate required fields
#     if not data.get("name") or not data.get("role"):
#         return jsonify({"error": "Name and role are required"}), 400

#     new_staff = Staff(
#         name=data.get("name"),
#         role=data.get("role"),
#         bio=data.get("bio", ""),
#         photo_url=data.get("photoUrl", ""),
#         booking_url=data.get("bookingUrl", "#")
#     )

#     db.session.add(new_staff)
#     db.session.commit()

#     return jsonify(new_staff.serialize()), 201
