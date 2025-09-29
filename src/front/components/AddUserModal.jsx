import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const API_ROOT =
  (typeof import.meta !== "undefined" &&
    (import.meta.env.VITE_API_BASE || import.meta.env.VITE_BACKEND_URL)) ||
  (typeof process !== "undefined" &&
    (process.env.REACT_APP_API_URL || process.env.BACKEND_URL)) ||
  "";

export default function AddUserModal({
  open = false,
  defaultRole = "Customer",
  onClose,
  onSaved,
}) {
  const [role, setRole] = useState(defaultRole);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    if (open) setRole(defaultRole || "Customer");
  }, [open, defaultRole]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const save = async () => {
    const payload = {
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      password: password || "!", // backend can ignore / reset
      bio: bio.trim() || null,
      photo_url: photoUrl.trim() || null, 
    };

    const res = await fetch(`${API_ROOT}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      alert(data?.msg ? `Failed to create user: ${data.msg}` : "Failed to create user");
      return;
    }

    // ✅ Success alert
    alert(`User "${data.first} ${data.last}" was added successfully.`);

    onSaved?.();
    onClose?.();

    setFirst("");
    setLast("");
    setEmail("");
    setPhone("");
    setPassword("");
    setBio("");
    setPhotoUrl("");
  };

  const modalUI = (
    <>
      <div
        className="modal d-block"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
        style={{
          position: "fixed",
          display: "flex",
          padding: "3rem .5rem",
        }}
      >
        <div className="modal-dialog" style={{ maxWidth: 620 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add {role}</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Admin</option>
                  <option>Staff</option>
                  <option>Customer</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="First name"
                    value={first}
                    onChange={(e) => setFirst(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Last name"
                    value={last}
                    onChange={(e) => setLast(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <input
                className="form-control mb-3"
                placeholder="Temporary password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <textarea
                className="form-control mb-3"
                placeholder="Bio (Staff)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <input
                className="form-control mb-3"
                placeholder="PhotoUrl (Staff)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-gold" onClick={save}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
      />
    </>
  );

  // Render above the rest of the app so it overlaps & stays centered on scroll
  return createPortal(modalUI, document.body);
}