import { useState } from 'react'; 
import { BookOpen, Plus, User, LogOut, Users, Settings, Home } from 'lucide-react';
import CreateClass from './CreateClass';

function AdminDashboard() {

    const [navigationPage, setNavigationPage] = useState("");


    return (
        <div className="min-h-screen bg-gray-100 flex flex-row">
            {/* Side Navigation Bar */}
            <div className="min-h-screen w-64 bg-white flex flex-col border-gray-100 shadow-md gap-15">
                {/* Heading Admin Dashboard */}
                <div className="h-20 flex border-b-2 border-gray-100 bg-white justify-center items-center shadow-md">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-8 flex-grow p-4">
                    <button onClick={() => setNavigationPage("view class")} className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium text-xl text-gray-800 rounded-md cursor-pointer border-b-2 border-gray-100 shadow-md">
                        <BookOpen className="inline w-6 h-6" />
                        View Classes
                    </button>
                    <button onClick={() => setNavigationPage("create class") } className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium text-xl text-gray-800 rounded-md cursor-pointer border-b-2 border-gray-100 shadow-md">
                        <Plus className="inline w-6 h-6" />
                        Create Class
                    </button>
                    <button className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium text-xl text-gray-800 rounded-md cursor-pointer border-b-2 border-gray-100 shadow-md">
                        <User className="inline w-6 h-6" />
                        Profile
                    </button>
                    </div>

                    {/* Sign Out pinned to bottom */}
                    <div className="p-4">
                    <button className="flex gap-2 p-2 hover:bg-gray-200 justify-center items-center font-medium bg-red-400 text-xl text-white rounded-md cursor-pointer border-t-2 border-gray-100 shadow-md w-full">
                        <LogOut className="inline w-6 h-6" />
                        Sign Out
                    </button>
                </div>
            </div>
          
            {/* Page Content */}
            <div className='flex flex-col flex-grow justify-center items-center'>
                {navigationPage === "create class" && <CreateClass />}
            </div>
            
        </div>
    );
}

export default AdminDashboard;