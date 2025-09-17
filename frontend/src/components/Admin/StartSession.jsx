import { useState } from "react";
import { PlayCircle, StopCircle, History } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";

function StartSession({ class_id, class_name, subject_code }) {
  const [sessionActive, setSessionActive] = useState(false);
  const { currentUser } = useAuth();
  const [sessionId, setSessionId] = useState(null);

  // Dummy history (replace with API data later)
  const history = [
    { date: "2025-09-10", status: "Completed", present: 65, total: 80 },
    { date: "2025-09-05", status: "Completed", present: 70, total: 80 },
  ];

  function handleStartSession() {
    setSessionActive(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const {latitude, longitude} = pos.coords; // extracts current latitude nd logitude extraction.
      console.log(latitude, longitude);
      try {
        // Replace with your backend API call
        const result = await axios.post("http://127.0.0.1:8000/sessions", {
          teacher_id: currentUser.uid,
          class_id: class_id,
          class_name: class_name,
          subject_code: subject_code,
          latitude: latitude,
          longitude: longitude
        });
        console.log('Starting sess with data:', result.data);
        setSessionId(result.data.id)
      } catch (error) {
        console.error('Error starting session:', error.response.data);
        alert('Error starting session. Please try again.', error);
      }
    })
  }

  async function handleStopSession() {
    setSessionActive(false);
    console.log("Fuck Off");
    try {
      const result = await axios.put(`http://127.0.0.1:8000/sessions/${sessionId}/end`);
      console.log('Stopping session with data:', result.data);
    } catch (error) {
      console.error('Error stopping session:', error.response.data);
      alert('Error stopping session. Please try again.', error);
    }
  }

  return (
    <div className="mx-auto p-8 w-full">
      {/* Class Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">{class_name}</h1>
        <p className="text-gray-600 text-lg">Subject Code: {subject_code}</p>
      </div>

      {/* Session Controls */}
      <div className="flex justify-center mb-8">
        {!sessionActive ? (
          <button
            onClick={handleStartSession}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            <PlayCircle className="w-5 h-5" />
            Start Attendance
          </button>
        ) : (
          <button
            onClick={handleStopSession}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            <StopCircle className="w-5 h-5" />
            Stop Attendance
          </button>
        )}
      </div>

      {/* Attendance History Preview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          Previous Records
        </h2>
        {history.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {history.map((record, idx) => (
              <li key={idx} className="py-3 flex justify-between text-gray-700">
                <span>{record.date}</span>
                <span>
                  {record.present}/{record.total} present
                </span>
                <span className="text-green-600">{record.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No attendance records yet.</p>
        )}
        <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium transition">
          View Full Records →
        </button>
      </div>
    </div>
  );
}

export default StartSession;
