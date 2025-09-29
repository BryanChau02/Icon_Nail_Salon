import React, { useEffect, useState } from "react";

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    (import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL)) ||
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.REACT_APP_API_URL || process.env.BACKEND_URL)) ||
  "";
const API_ROOT = String(API_BASE || "").replace(/\/+$/, "");

export default function EditUserModal({ open, onClose, user, onSaved }) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Customer");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [bookingUrl, setBookingUrl] = useState("");

  useEffect(() => {
    if (!open) return;
    setFirst(user?.first || user?.fname || "");
    setLast(user?.last || user?.lname || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setRole(user?.role || "Customer");
    setBio(user?.bio || "");
    setPhotoUrl(user?.photo_url || user?.photoUrl || "");
    setBookingUrl(user?.booking_url || "");
    document.body.classList.add("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open, user]);

  if (!open) return null;

  const save = async () => {
    const payload = {
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      bio: bio.trim() || null,
      photo_url: photoUrl.trim() || null,
      booking_url: bookingUrl.trim() || null,
    };

    const res = await fetch(`${API_ROOT}/api/user/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Failed to update user");
      return;
    }
    onSaved?.();
    onClose?.();
  };

  return (
    <>
      <div 
      className="modal d-block" 
      role="dialog" 
      aria-modal="true" 
      style={{
          position: "fixed",
          display: "flex",
          padding: "3rem .5rem",
        }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">Edit User (#{user?.id})</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>Admin</option>
                  <option>Staff</option>
                  <option>Customer</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col">
                  <input className="form-control" placeholder="First name"
                         value={first} onChange={(e) => setFirst(e.target.value)} />
                </div>
                <div className="col">
                  <input className="form-control" placeholder="Last name"
                         value={last} onChange={(e) => setLast(e.target.value)} />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col">
                  <input className="form-control" placeholder="Email"
                         value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="col">
                  <input className="form-control" placeholder="Phone"
                         value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              <div className="mb-3">
                <textarea className="form-control" placeholder="Bio"
                          value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              <div className="mb-3">
                <input className="form-control" placeholder="Photo URL"
                       value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
              </div>

              <div className="mb-3">
                <input className="form-control" placeholder="Booking URL"
                       value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-gold" onClick={save}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}
