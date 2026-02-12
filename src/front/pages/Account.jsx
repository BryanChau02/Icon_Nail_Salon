import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import InfoTab from "../components/AccountInfo";
import UsersTab from "../components/AccountUsers";
import HistoryTab from "../components/AccountHistory";

export const Account = () => {
  const [active, setActive] = useState("info");
  const { user } = useAuth();
  const canViewUsers = user?.role === "Admin";

  useEffect(() => {
    if (active === "users" && !canViewUsers) setActive("info");
  }, [active, canViewUsers]);

  return (
    <div className="border border-0" style={{ margin: "0% 10% 5% 10%" }}>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${active === "info" && "active"}`} onClick={() => setActive("info")}>
            Info
          </button>
        </li>

        {canViewUsers && (
          <li className="nav-item">
            <button className={`nav-link ${active === "users" && "active"}`} onClick={() => setActive("users")}>
              Users
            </button>
          </li>
        )}

        <li className="nav-item">
          <button className={`nav-link ${active === "history" && "active"}`} onClick={() => setActive("history")}>
            History
          </button>
        </li>
      </ul>

      <div className="mt-3">
        {active === "info" && <InfoTab />}
        {active === "users" && canViewUsers && <UsersTab />}   {/* guard content */}
        {active === "history" && <HistoryTab />}
      </div>
    </div>
    
  );
};

// export const testsample = () => {

//     return (
//         <div className="bg-light">
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col-1 bg-light"></div>
//                     <div className="col-10">
//                         <ul className="nav nav-tabs">
//                             <li className="nav-item">
//                                 <button className={`nav-link ${active === "Info" && "active"}`} onClick={() => setActive("Info")}>
//                                     Info
//                                 </button>
//                             </li>
//                             <li className="nav-item">
//                                 <button className={`nav-link ${active === "Users" && "active"}`} onClick={() => setActive("Users")}>
//                                     Users
//                                 </button>
//                             </li>
//                             <li className="nav-item">
//                                 <button className={`nav-link ${active === "History" && "active"}`} onClick={() => setActive("History")}>
//                                     History
//                                 </button>
//                             </li>
//                         </ul>
//                     </div>
//                     <div className="col-1 bg-light"></div>
//                 </div>
//             </div>
//         </div>
//     )
// }