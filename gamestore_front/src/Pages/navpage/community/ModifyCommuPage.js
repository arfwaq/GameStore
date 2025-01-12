import { useParams, useNavigate } from "react-router-dom";
import ModifyCommuComponent from "../../../components/community/ModifyCommuComponent"

const ModifyCommuPage = () => {
  const {comId}=useParams();

  return (
    <div>
    <div className="text-3xl font-extrabold">
      community Modify Page
    </div>
    <ModifyCommuComponent comId={comId}/>
    </div>
  );
}

export default ModifyCommuPage;