import { useEffect, useState } from "react";
import UserTable from "./AccountUsersTables";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import AddUserModal from "./AddUserModal.jsx";

export const UsersTab = () => {
    {/* gets for admins, employees, and customers */ }
    const [admins, setAdmins] = useState([]);
    const [staff, setStaff] = useState([]);
    const [customers, setCustomers] = useState([]);
    const backendLink = import.meta.env.VITE_BACKEND_URL

    const [loadingAdmins, setLoadingAdmins] = useState(true);
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [loadingCustomers, setLoadingCustomers] = useState(true);
    const [addRole, setAddRole] = useState(null);

    const refreshAll = () => {
        getAdmins();
        getStaff();
        getCustomers();
    };

    const getAdmins = () => {
        setLoadingAdmins(true);
        fetch(`${backendLink}/api/admins`)
            .then((resp) => resp.json())
            .then((dataObj) => setAdmins(dataObj))
            .catch((err) => console.log(err))
            .finally(() => setLoadingAdmins(false));
    };

    const getStaff = () => {
        setLoadingStaff(true);
        fetch(`${backendLink}/api/staff`)
            .then((resp) => resp.json())
            .then((dataObj) => setStaff(dataObj))
            .catch((err) => console.log(err))
            .finally(() => setLoadingStaff(false));
    };

    const getCustomers = () => {
        setLoadingCustomers(true);
        fetch(`${backendLink}/api/customers`)
            .then((resp) => resp.json())
            .then((dataObj) => setCustomers(dataObj))
            .catch((err) => console.log(err))
            .finally(() => setLoadingCustomers(false));
    };

    useEffect(() => {
        getAdmins();
        getStaff();
        getCustomers();
    }, [])

    return (
        <div>
            <div className="container">
                <div>
                    <h4 className="d-flex align-items-center">
                        Admins
                        <button
                            className="btn btn-sm btn-gold ms-2"
                            onClick={() => setAddRole("Admin")}
                        >
                            +
                        </button>
                    </h4>
                    {loadingAdmins ? (
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="loader" />
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Role</th>
                                </tr>
                            </thead>
                            {
                                admins.map(
                                    (char, ind) => < UserTable key={ind} props={char} refresh={refreshAll} />
                                )
                            }
                        </table>)}
                </div>
                <div className="mt-5">
                    <h4 className="d-flex align-items-center my-5">
                        Staff
                        <button
                            className="btn btn-sm btn-gold ms-2"
                            onClick={() => setAddRole("Staff")}
                        >
                            +
                        </button>
                    </h4>
                    {loadingStaff ? (
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="loader" />
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Role</th>
                                </tr>
                            </thead>
                            {
                                staff.map(
                                    (char, ind) => < UserTable key={ind} props={char} refresh={refreshAll} />
                                )
                            }
                        </table>)}
                </div>
                <div className="my-5">
                    <h4 className="d-flex align-items-center my-5">
                        Customers
                        <button
                            className="btn btn-sm btn-gold ms-2"
                            onClick={() => setAddRole("Customer")}
                        >
                            +
                        </button>
                    </h4>
                    {loadingCustomers ? (
                        <div className="d-flex align-items-center justify-content-center">
                            <div className="loader" />
                        </div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">First</th>
                                    <th scope="col">Last</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Role</th>
                                </tr>
                            </thead>
                            {
                                customers.map(
                                    (char, ind) => < UserTable key={ind} props={char} refresh={refreshAll} />
                                )
                            }
                        </table>)}
                </div>
                <AddUserModal
                    open={!!addRole}
                    defaultRole={addRole || "Customer"}
                    onClose={() => setAddRole(null)}
                    onSaved={() => {
                        if (addRole === "Admin") getAdmins();
                        else if (addRole === "Staff") getStaff();
                        else getCustomers();
                        setAddRole(null);
                    }}
                />
            </div>
        </div>
    )
}

export default UsersTab