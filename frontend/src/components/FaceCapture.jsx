import React, { useRef, useState } from "react";
import { Camera, User, Hash, CheckCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/authContext";

function StudentProfileSetup() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    enrollmentNumber: ''
  });
  const [cameraActive, setCameraActive] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please ensure camera permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const captureImage = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 JPEG
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(dataUrl);
    setImageCaptured(true);
    
    // Stop camera after capture
    stopCamera();
  };

  const retakePhoto = () => {
    setImageCaptured(false);
    setCapturedImage(null);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return;
    }
    
    if (!formData.enrollmentNumber.trim()) {
      alert("Please enter your enrollment number");
      return;
    }
    
    if (!imageCaptured) {
      alert("Please capture your photo");
      return;
    }

    // Here you would send the data to your backend
    const profileData = {
      name: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
      image: capturedImage
    };

    console.log("Profile data to submit:", profileData);
    alert("Profile setup completed! (Check console for data)");
    
    // Uncomment and modify for actual backend integration:
    
    try {
          const response = await axios.post("http://127.0.0.1:8000/register_student", {
            name: profileData.name,
            enrollment_no: profileData.enrollmentNumber,
            face_image_path: profileData.image,
            email: currentUser.email,
            auth_id: currentUser.uid,
          });
          return true;
    } catch (err) {
      console.error("❌ Error setting up profile:", err);
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Please provide your details and capture your photo
            </p>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
              />
            </div>

            {/* Enrollment Number Field */}
            <div>
              <label htmlFor="enrollmentNumber" className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline w-4 h-4 mr-1" />
                Enrollment Number
              </label>
              <input
                type="text"
                id="enrollmentNumber"
                name="enrollmentNumber"
                value={formData.enrollmentNumber}
                onChange={handleInputChange}
                placeholder="Enter your enrollment number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-black text-sm sm:text-base"
              />
            </div>

            {/* Photo Capture Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Camera className="inline w-4 h-4 mr-1" />
                Profile Photo
              </label>
              
              <div className="bg-gray-100 rounded-lg p-4">
                {/* Camera/Preview Container */}
                <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '4/3' }}>
                  {imageCaptured ? (
                    // Show captured image
                    <img 
                      src={capturedImage} 
                      alt="Captured" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // Show video stream or placeholder
                    <>
                      <video
                        ref={videoRef}
                        className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                        playsInline
                        muted
                      />
                      {!cameraActive && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm opacity-75">Camera Preview</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex gap-2 justify-center">
                  {!imageCaptured ? (
                    <>
                      {!cameraActive ? (
                        <button
                          type="button"
                          onClick={startCamera}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Start Camera
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={captureImage}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Capture Photo
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <button
                        type="button"
                        onClick={retakePhoto}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Retake Photo
                      </button>
                      <div className="flex items-center text-green-600 px-3">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
            >
              Complete Profile Setup
            </button>
          </div>

          {/* Hidden canvas for image capture */}
          <canvas 
            ref={canvasRef} 
            width="640" 
            height="480" 
            style={{ display: "none" }} 
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs sm:text-sm">
            Your information is secure and will be used for identification purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentProfileSetup;
