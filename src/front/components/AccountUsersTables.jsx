import { useState } from "react";
import RoleModal from "./RoleModal";

export const UserTable = ({ props, refresh }) => {
    const [isOpen, setIsOpen] = useState(false);
    const allRoles = ["Admin", "Staff", "Customer"];
    const backendLink = import.meta.env.VITE_BACKEND_URL;

    const handleSave = (updatedRole) => {
        console.log("Saving role for user:", props.id, updatedRole);

        fetch(`${backendLink}/api/user/${props.id}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: updatedRole }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to update role");
                return res.json();
            })
            .then((data) => {
                console.log("Updated user:", data);
                setIsOpen(false);
                if (typeof refresh === "function") refresh();
            })
            .catch((err) => {
                console.error(err);
            });
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
                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => setIsOpen(true)}
                    >
                        Edit Role
                    </button>
                    <RoleModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onSave={handleSave}
                        user={props}
                        roles={allRoles}
                    />
                </td>
            </tr>
        </tbody>
    );
};

export default UserTable;
