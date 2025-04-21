import React from "react";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const InfractionTable = ({ infractions, handleDelete, userRole }) => {
  const navigate = useNavigate();

//   if (!infractions || infractions.length === 0) {
//     return (
//       <>
//         <table className="table">
//           <thead>
//             <tr>
//               <th>{t("infraction.type")}</th>
//               <th>{t("infraction.date")}</th>
//               <th>{t("infraction.amount")}</th>
//               <th className="text-right">{t("common.actions")}</th>
//             </tr>
//           </thead>
          
//         </table>
//       </>
//     );
//   }

  return (
    <div className="rounded-box border border-base-content/5 bg-base-100">
    <table className="table">
      <thead>
        <tr>
          <th>{t("infraction.type")}</th>
          <th>{t("infraction.date")}</th>
          <th>{t("infraction.amount")}</th>
          <th className="text-right">{t("common.actions")}</th>
        </tr>
      </thead>
  
      <tbody>
        {(!infractions || infractions.length === 0) ? (
          <tr>
            <td colSpan={4} className="text-center py-10 text-gray-500">
              <p className="text-lg">No infractions available.</p>
              <p className="mt-2">Add your first infractions to get started.</p>
            </td>
          </tr>
        ) : (
          infractions.map((infraction, index) => (
            <tr key={index}>
              <td>{infraction.infractionType}</td>
              <td>{new Date(infraction.infractionDate).toLocaleDateString()}</td>
              <td>{infraction.fineAmount}</td>
              <td className="text-right">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-xs btn-ghost"
                  >
                    <MoreVertical size={16} />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-10 menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button
                        onClick={() =>
                          navigate(`/infractions/view/${infraction.id}`)
                        }
                        className="flex items-center gap-2"
                      >
                        <Eye size={16} />
                        {t("infraction.viewDetails")}
                      </button>
                    </li>
                    {userRole === "ADMIN" && (
                      <>
                        <li>
                          <button
                            onClick={() =>
                              navigate(`/infractions/edit/${infraction.id}`)
                            }
                            className="flex items-center gap-2"
                          >
                            <Pencil size={16} />
                            {t("infraction.edit")}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => handleDelete(infraction.id)}
                            className="flex items-center gap-2 text-error"
                          >
                            <Trash2 size={16} />
                            {t("infraction.delete")}
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
  
  );
};

export default InfractionTable;
