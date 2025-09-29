import { useState } from "react";
import RoleModal from "./RoleModal";
import EditUserModal from "./EditUserModal.jsx";

export const UserTable = ({ props, refresh }) => {
    const [open, setOpen] = useState(false);
    const allRoles = ["Admin", "Staff", "Customer"];
    
    const API_ROOT = String(import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

    const handleDelete = async () => {
        const name = `${props.first} ${props.last}`.trim() || `#${props.id}`;
        if (!window.confirm(`Are you sure you would like to delete ${name}? 
        This cannot be undone.`)) return;

        try {
            const res = await fetch(`${API_ROOT}/api/user/${props.id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            // re-fetch the tables after deletion
            if (typeof refresh === "function") refresh();
            alert(`User "${name}" was deleted successfully.`);
        } catch (err) {
            console.error(err);
            alert("Failed to delete user. Please try again.");
        }
    };

    return (
        <tbody>

            <tr>
                <th scope="row">{props.id}</th>
                <td>{props.first}</td>
                <td>{props.last}</td>
                <td>{props.email}</td>
                <td>{props.phone}</td>
                <td>
                    <button className="btn btn-gold" onClick={() => setOpen(true)}>
                        Edit User
                    </button>
                    <button
                        className="btn btn-danger ms-2"
                        onClick={handleDelete}
                        title="Delete this user"
                    >
                        X
                    </button>
                </td>
            </tr>
            <EditUserModal
                open={open}
                onClose={() => setOpen(false)}
                user={props}
                onSaved={refresh}
            />
        </tbody>
    );
};

export default UserTable;
