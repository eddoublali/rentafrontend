import React from "react";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

const InfractionTable = ({ infractions, handleDelete, userRole }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "badge badge-success";
      case "unpaid":
        return "badge badge-warning";
      case "pending":
        return "badge badge-warning";
      default:
        return "";
    }
  };
console.log(infractions)
  return (
    <div className="rounded-box border border-base-content/5 bg-base-100 mt-5">
      <table className="table">
        <thead>
          <tr>
            <th>{t("infraction.type")}</th>
            <th>{t("tables.infraction.date")}</th>
            <th>{t("tables.infraction.amount")}</th>
            <th>{t("tables.infraction.client")}</th>
            <th>{t("tables.infraction.vehicle")}</th>
            <th>{t("tables.infraction.status")}</th>
            <th className="text-right">{t("common.actions")}</th>
          </tr>
        </thead>
        
        <tbody>
          {(!infractions || infractions.length === 0) ? (
            <tr>
              <td colSpan={8} className="text-center py-10 text-gray-500">
                <p className="text-lg">{t("infraction.Noinfractions")}</p>
                <p className="mt-2">{t("infraction.Addfirstinfractions")}</p>
              </td>
            </tr>
          ) : (
            infractions.map((infraction, index) => (
              <tr key={index}>
                <td>{infraction?.infractionType}</td>
                <td>{new Date(infraction?.infractionDate).toLocaleDateString()}</td>
                <td>{infraction?.fineAmount} {t("dh")}</td>
                <td>{infraction?.client?.name } </td>
                <td>{infraction?.vehicle?.brand} </td>
                <td >
                <span className={getStatusColor(infraction?.status)}>
                {infraction?.status.toLowerCase()}
                </span>
                 
                </td>
                <td className={`text-${t("dropdown")}`}>
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
                          {t("view")}
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
                              {t("edit")}
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => handleDelete(infraction.id)}
                              className="flex items-center gap-2 text-error"
                            >
                              <Trash2 size={16} />
                              {t("delete")}
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