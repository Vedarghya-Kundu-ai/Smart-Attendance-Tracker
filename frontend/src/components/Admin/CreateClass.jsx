import { useState } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';

function CreateClass() {
    const [formData, setFormData] = useState({
        className: '',
        subjectCode: '',
        studentCount: 0
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!formData.className.trim() || !formData.subjectCode.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Replace with your backend API call
            console.log('Creating class with data:', formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Reset form after successful creation
            setFormData({
                className: '',
                subjectCode: '',
                studentCount: 0
            });
            
            alert('Class created successfully!');
            
        } catch (error) {
            console.error('Error creating class:', error);
            alert('Error creating class. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClear = () => {
        setFormData({
            className: '',
            subjectCode: '',
            studentCount: 0
        });
    };

    const isFormValid = formData.className.trim() && formData.subjectCode.trim();

    return (
        <div className="w-full max-w-lg mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-8">

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Class</h2>
                <p className="text-gray-600">Add a new class to your dashboard</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
                <div className="space-y-6">
                    {/* Class Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Class Name *
                        </label>
                        <input
                            type="text"
                            name="className"
                            value={formData.className}
                            onChange={handleInputChange}
                            placeholder="e.g., Data Structures and Algorithms"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-gray-800"
                        />
                    </div>

                    {/* Subject Code Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject Code *
                        </label>
                        <input
                            type="text"
                            name="subjectCode"
                            value={formData.subjectCode}
                            onChange={handleInputChange}
                            placeholder="e.g., CSE-10T"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-gray-800"
                        />
                    </div>
                    
                    {/* No of students */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total number of students *
                        </label>
                        <input
                            type="text"
                            name="studentCount"
                            value={formData.studentCount}
                            onChange={handleInputChange}
                            placeholder="e.g., 80"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-gray-800"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isSubmitting}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                                isFormValid && !isSubmitting
                                    ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-md'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </span>
                            ) : (
                                'Create Class'
                            )}
                        </button>
                        
                        <button
                            onClick={handleClear}
                            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                            title="Clear form"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Fields marked with * are required
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateClass