import React, { useState } from 'react';

// Validation functions
const validateStep1 = (data) => {
  const errors = {};
  
  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }
  
  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }
  
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/;
  if (!data.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!phoneRegex.test(data.phoneNumber.trim())) {
    errors.phoneNumber = 'Please enter a valid phone number (10-15 digits)';
  }
  
  return errors;
};

const validateStep2 = (data) => {
  const errors = {};
  
  if (!data.address.trim()) {
    errors.address = 'Address is required';
  } else if (data.address.trim().length < 5) {
    errors.address = 'Please enter a complete address';
  }
  
  if (!data.city.trim()) {
    errors.city = 'City is required';
  } else if (data.city.trim().length < 2) {
    errors.city = 'City name must be at least 2 characters';
  }
  
  if (!data.state.trim()) {
    errors.state = 'State is required';
  } else if (data.state.trim().length < 2) {
    errors.state = 'State name must be at least 2 characters';
  }
  
  return errors;
};

const validateStep3 = (data) => {
  const errors = {};
  
  if (!data.animalType.trim()) {
    errors.animalType = 'Please specify which animal you want to adopt';
  } else if (data.animalType.trim().length < 2) {
    errors.animalType = 'Animal type must be at least 2 characters';
  }
  
  if (!data.animalSerial.trim()) {
    errors.animalSerial = 'Animal serial number is required';
  } else if (data.animalSerial.trim().length < 3) {
    errors.animalSerial = 'Please enter a valid serial number';
  }
  
  return errors;
};

// Enhanced form components with error display
const ContactInfo = ({ formData, handleChange, nextStep, errors }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Step 1: Contact Information</h2>
    
    <div className="mb-4">
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.firstName && (
        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
      )}
    </div>
    
    <div className="mb-4">
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.lastName && (
        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
      )}
    </div>
    
    <div className="mb-4">
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number (e.g., +91 98765 43210)"
        value={formData.phoneNumber}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.phoneNumber && (
        <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
      )}
    </div>
    
    <button 
      onClick={nextStep} 
      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
);

const AddressInfo = ({ formData, handleChange, nextStep, prevStep, errors }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Step 2: Address Information</h2>
    
    <div className="mb-4">
      <input
        type="text"
        name="address"
        placeholder="Complete Address"
        value={formData.address}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.address && (
        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
      )}
    </div>
    
    <div className="mb-4">
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.city && (
        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
      )}
    </div>
    
    <div className="mb-4">
      <input
        type="text"
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.state && (
        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
      )}
    </div>
    
    <div className="flex justify-between">
      <button 
        onClick={prevStep} 
        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
      >
        Back
      </button>
      <button 
        onClick={nextStep} 
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Next
      </button>
    </div>
  </div>
);

const AnimalInfo = ({ formData, handleChange, prevStep, submitForm, errors }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Step 3: Animal Information</h2>
    
    <div className="mb-4">
      <input
        type="text"
        name="animalType"
        placeholder="Which animal are you looking to adopt? (e.g., Dog, Cat)"
        value={formData.animalType}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.animalType ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.animalType && (
        <p className="text-red-500 text-sm mt-1">{errors.animalType}</p>
      )}
    </div>
    
    <div className="mb-4">
      <input
        type="text"
        name="animalSerial"
        placeholder="Animal's Serial Number"
        value={formData.animalSerial}
        onChange={handleChange}
        className={`block w-full border rounded-md p-2 ${
          errors.animalSerial ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.animalSerial && (
        <p className="text-red-500 text-sm mt-1">{errors.animalSerial}</p>
      )}
    </div>
    
    <div className="flex justify-between">
      <button 
        onClick={prevStep} 
        className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
      >
        Back
      </button>
      <button 
        onClick={submitForm} 
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Submit Application
      </button>
    </div>
  </div>
);

// Main Form Component with Validation
const MultiStepAdoptionForm = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    animalType: '',
    animalSerial: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateCurrentStep = () => {
    let stepErrors = {};
    
    switch (step) {
      case 1:
        stepErrors = validateStep1(formData);
        break;
      case 2:
        stepErrors = validateStep2(formData);
        break;
      case 3:
        stepErrors = validateStep3(formData);
        break;
      default:
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
      setErrors({}); // Clear errors when moving to next step
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setErrors({}); // Clear errors when going back
  };

  const submitForm = () => {
    if (validateCurrentStep()) {
      // Here you would handle the form submission
      console.log("Form Submitted:", formData);
      alert("Adoption application submitted successfully! We'll contact you soon.");
      
      // Reset form after submission
      setStep(1);
      setErrors({});
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        animalType: '',
        animalSerial: ''
      });
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Step Indicator */}
        <div className="flex justify-center py-4 text-sm text-gray-600">
          Step {step} of 3
        </div>
        
        {/* Step Container */}
        <div className="relative">
          {step === 1 && (
            <ContactInfo 
              formData={formData} 
              handleChange={handleChange} 
              nextStep={nextStep}
              errors={errors}
            />
          )}
          {step === 2 && (
            <AddressInfo 
              formData={formData} 
              handleChange={handleChange} 
              nextStep={nextStep} 
              prevStep={prevStep}
              errors={errors}
            />
          )}
          {step === 3 && (
            <AnimalInfo 
              formData={formData} 
              handleChange={handleChange} 
              prevStep={prevStep} 
              submitForm={submitForm}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepAdoptionForm;
