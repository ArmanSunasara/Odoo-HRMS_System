import React from "react";
import { getInitials } from "../../utils/helpers";

function EmployeeCard({ employee, onClick }) {
  const { name, email, position, department, avatar } = employee;

  return (
    <div className="employee-card" onClick={() => onClick && onClick(employee)}>
      <div className="employee-avatar">
        {avatar ? (
          <img src={avatar} alt={name} />
        ) : (
          <div className="initials">{getInitials(name)}</div>
        )}
      </div>
      <div className="employee-info">
        <h3>{name}</h3>
        <p className="position">{position}</p>
        <p className="department">{department}</p>
        <p className="email">{email}</p>
      </div>
    </div>
  );
}

export default EmployeeCard;
