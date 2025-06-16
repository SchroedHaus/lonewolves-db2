import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../context/AuthContext";
import Button from "../components/Buttons";

const Admin = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <Button onClick={handleClick}>Add New User</Button>
    </div>
  );
};

export default Admin;
