import { Button } from "@nextui-org/react";
import { Camera, List, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FooterCliente: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="border-t border-gray-200 p-2 flex justify-around items-center">
      <Button onClick={() => navigate('/client/dashboard')}>
        <List size={24} />
      </Button>
      <Button onClick={() => navigate('/client/qrscanner')} color="primary" className="rounded-full w-16 h-16 flex items-center justify-center -mt-8 shadow-lg">
        <Camera size={32} />
      </Button>
      <Button onClick={() => navigate('/client/user')}>
        <User size={24} />
      </Button>
    </div>
  );
};

export default FooterCliente;