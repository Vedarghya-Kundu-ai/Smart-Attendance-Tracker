import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StartSession from "./StartSession";

function ViewClasses() {
  const { currentUser } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/get_classroom/${currentUser.uid}`
        );
        setClasses(res.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [currentUser]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading classes...</p>;
  }

  if (classes.length === 0) {
    return (
      <p className="text-center text-gray-600">
        No classes created yet. Create your first one!
      </p>
    );
  }

  const handleSubmit = (e) => {
    console.log(e);
  }

  return (
    <>
      {!selectedClass && <div className=" mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          My Classes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-gray-200 shadow-gray-400 p-6 hover:shadow-lg transition-ease-in-out duration-300"
            >
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-gray-700 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {cls.class_name}
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Subject Code:</span>{" "}
                {cls.subject_code}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Students:</span>{" "}
                {cls.total_student_count}
              </p>

              <button onClick={() => setSelectedClass(cls)} className="mt-4 w-full py-2 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>}
      {selectedClass && <StartSession class_id={selectedClass.id} class_name={selectedClass.class_name} subject_code={selectedClass.subject_code} />}
    </>
  );
}

export default ViewClasses;
