import CreateItemForm from "../components/CreateItemForm";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../features/auth/authSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateItemPage = () => {

  return (
    <div>
      <h1>Create Item</h1>
      <CreateItemForm />
    </div>
  );
};

export default CreateItemPage;
