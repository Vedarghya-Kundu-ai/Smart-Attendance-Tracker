import { useState } from 'react'; 
import { BookOpen, Plus, User, LogOut, Users, Settings, Home } from 'lucide-react';
import JoinClass from './JoinClass';
import { doSignOut } from "../../firebase/auth";
import { useNavigate } from 'react-router-dom';
//import ViewClasses from './ViewClasses';

function StudentDashboard() {

    const [navigationPage, setNavigationPage] = useState("");
    const navigate = useNavigate();

    const handleSignOut = async () => {
        if(confirm("Are you sure you want to sign out?")) {
        try {
            await doSignOut();
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
        } else {
        return ;
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-row">
            {/* Side Navigation Bar */}
            <div className="min-h-screen w-64 bg-white flex flex-col border-gray-100 shadow-md gap-15">
                {/* Heading Admin Dashboard */}
                <div className="h-20 flex border-b-2 border-gray-100 bg-white justify-center items-center shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-8 flex-grow p-4">
                    <button onClick={() => setNavigationPage("view class")} className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium text-xl text-gray-800 rounded-md cursor-pointer border-b-2 border-gray-100 shadow-md">
                        <BookOpen className="inline w-6 h-6" />
                        View Classes
                    </button>
                    <button onClick={() => setNavigationPage("join class") } className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium text-xl text-gray-800 rounded-md cursor-pointer border-b-2 border-gray-100 shadow-md">
                        <Plus className="inline w-6 h-6" />
                        Join Class
                    </button>
                    <button className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium text-xl text-gray-800 rounded-md cursor-pointer border-b-2 border-gray-100 shadow-md">
                        <User className="inline w-6 h-6" />
                        Profile
                    </button>
                    </div>

                    {/* Sign Out pinned to bottom */}
                    <div className="p-4">
                    <button onClick={handleSignOut} className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium bg-red-400 text-xl text-white rounded-md cursor-pointer border-t-2 border-gray-100 shadow-md w-full">
                        <LogOut className="inline w-6 h-6" />
                        Sign Out
                    </button>
                </div>
            </div>
          
            {/* Page Content */}
            
            {navigationPage === "join class" && < JoinClass />}
            {navigationPage === "view class" && < ViewClasses />}
            
        </div>
    );
}

export default StudentDashboard;