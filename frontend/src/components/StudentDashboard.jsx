import { doSignOut } from "../firebase/auth"
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
const navigate = useNavigate();
  const handleSignOut = async () => {
    if(confirm("Are you sure you want to sign out?")) {
      try {
        await doSignOut();
        navigate("/Login");
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      return ;
    }
  };
    return (
        <>
        <h1>This is Student Dashboard</h1>
        <button onClick={handleSignOut} >Sign Out</button>
        </>
    )
}
export default StudentDashboard