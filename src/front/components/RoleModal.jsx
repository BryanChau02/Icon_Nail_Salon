import { useState, useEffect } from "react";

export const RoleModal = ({ isOpen, onClose, onSave, user, roles }) => {
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    setSelectedRole(user?.role ?? roles?.[0] ?? "");
  }, [user, roles]);

  if (!isOpen) return null;

  const canSave = !!selectedRole && selectedRole !== user?.role;

  return (
    <>
      <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Role for {user?.first} {user?.last}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
            </div>

            <div className="modal-body">
              {(roles || []).map((role) => (
                <div className="form-check" key={role}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="user-role"
                    id={`role-${role}`}
                    value={role}
                    checked={selectedRole === role}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={`role-${role}`}>
                    {role}
                  </label>
                </div>
              ))}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onSave(selectedRole)}
                disabled={!canSave}
                title={!canSave ? "Pick a different role to enable save" : undefined}
              >
                Save changes
              </button>
            </div>

          </div>
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      />
    </>

  );
};

export default RoleModal;
