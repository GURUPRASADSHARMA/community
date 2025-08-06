import { Loader } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  );
};

export default Spinner;