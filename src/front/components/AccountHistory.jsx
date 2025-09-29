// src/front/components/AccountHistory.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_ROOT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
  "";

function money(n) {
  const v = typeof n === "number" ? n : Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

async function fetchUserMap(ids) {
  const map = {};
  await Promise.all(
    ids.map(async (id) => {
      try {
        const r = await fetch(`${API_ROOT}/api/me/${id}`, { headers: { Accept: "application/json" } });
        if (r.ok) map[id] = await r.json();
      } catch {}
    })
  );
  return map;
}

const HistoryTab = () => {
  const { user } = useAuth(); // { id, role }
  const isCustomer = user?.role === "Customer";
  const isStaff = user?.role === "Staff";

  const [rows, setRows] = useState([]);
  const [staffMap, setStaffMap] = useState({});
  const [customerMap, setCustomerMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const query = useMemo(() => {
    const p = new URLSearchParams();
    if (isCustomer) p.set("customer_id", user.id);
    if (isStaff) p.set("staff_id", user.id);
    return p.toString();
  }, [user, isCustomer, isStaff]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(`${API_ROOT}/api/appointments${query ? `?${query}` : ""}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`GET /appointments ${res.status}`);
        const data = await res.json();

        // sort by starts_at (string compare works for ISO-8601, but be safe)
        data.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
        if (cancelled) return;
        setRows(data);

        const staffIds = [...new Set(data.map(a => a.staff_id).filter(Boolean))];
        const customerIds = !isCustomer ? [...new Set(data.map(a => a.customer_id).filter(Boolean))] : [];

        const [sMap, cMap] = await Promise.all([fetchUserMap(staffIds), fetchUserMap(customerIds)]);
        if (!cancelled) {
          setStaffMap(sMap);
          setCustomerMap(cMap);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [query, user, isCustomer]);

  const colSpan = isCustomer ? 5 : 7;

  return (
    <div className="d-flex align-items-center justify-content-center">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            {!isCustomer && <th scope="col">Name</th>}
            {!isCustomer && <th scope="col">Customer Email</th>}
            <th scope="col">Technician</th>
            <th scope="col">Services</th>
            <th scope="col">Price</th>
            <th scope="col">Date & Time</th> {/* raw from backend */}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr><td colSpan={colSpan}>Loading…</td></tr>
          )}
          {!loading && err && (
            <tr><td colSpan={colSpan} className="text-danger">{err}</td></tr>
          )}
          {!loading && !err && rows.length === 0 && (
            <tr><td colSpan={colSpan}>No appointments found.</td></tr>
          )}

          {!loading && !err && rows.map((a, i) => {
            const staff = staffMap[a.staff_id];
            const staffName = staff ? `${staff.first} ${staff.last}` : `#${a.staff_id}`;
            const cust = customerMap[a.customer_id];
            const custName = cust ? `${cust.first} ${cust.last}` : "";
            const custEmail = cust?.email || "";
            const services = Array.isArray(a.services)
              ? a.services.map(s => s?.name).filter(Boolean).join(", ")
              : "";
            const price = (a.total ?? (Number(a.subtotal || 0) + Number(a.tip || 0)));

            return (
              <tr key={a.id}>
                <th scope="row">{i + 1}</th>
                {!isCustomer && <td>{custName}</td>}
                {!isCustomer && <td>{custEmail}</td>}
                <td>{staffName}</td>
                <td>{services}</td>
                <td>{money(price)}</td>
                <td>{a.starts_at_local}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTab;
