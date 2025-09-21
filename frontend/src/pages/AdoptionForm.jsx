import React, { useState } from 'react';

// Step 1: Contact Information
const ContactInfo = ({ formData, handleChange, nextStep }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Step 1: Contact Information</h2>
    <input
      type="text"
      name="firstName"
      placeholder="First Name"
      value={formData.firstName}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <input
      type="text"
      name="lastName"
      placeholder="Last Name"
      value={formData.lastName}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <input
      type="tel"
      name="phoneNumber"
      placeholder="Phone Number"
      value={formData.phoneNumber}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <button onClick={nextStep} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Next</button>
  </div>
);

// Step 2: Address
const AddressInfo = ({ formData, handleChange, nextStep, prevStep }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Step 2: Address Information</h2>
    <input
      type="text"
      name="address"
      placeholder="Address"
      value={formData.address}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <input
      type="text"
      name="city"
      placeholder="City"
      value={formData.city}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <input
      type="text"
      name="state"
      placeholder="State"
      value={formData.state}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <div className="flex justify-between">
      <button onClick={prevStep} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">Back</button>
      <button onClick={nextStep} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Next</button>
    </div>
  </div>
);

// Step 3: Animal Information
const AnimalInfo = ({ formData, handleChange, prevStep, submitForm }) => (
  <div className="p-8">
    <h2 className="text-xl font-semibold mb-4">Step 3: Animal Information</h2>
    <input
      type="text"
      name="animalType"
      placeholder="Which animal are you looking to adopt?"
      value={formData.animalType}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <input
      type="text"
      name="animalSerial"
      placeholder="Animal's Serial Number"
      value={formData.animalSerial}
      onChange={handleChange}
      className="block w-full border border-gray-300 rounded-md p-2 mb-4"
    />
    <div className="flex justify-between">
      <button onClick={prevStep} className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400">Back</button>
      <button onClick={submitForm} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Submit</button>
    </div>
  </div>
);

// Main Form Component
const MultiStepAdoptionForm = () => {
  const [step, setStep] = useState(1);
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
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = () => {
    // Here you would handle the form submission, e.g., send data to an API
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully!");
    // Reset form after submission
    setStep(1);
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
        {/* Step Container */}
        <div className="relative">
          {step === 1 && (
            <ContactInfo formData={formData} handleChange={handleChange} nextStep={nextStep} />
          )}
          {step === 2 && (
            <AddressInfo formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />
          )}
          {step === 3 && (
            <AnimalInfo formData={formData} handleChange={handleChange} prevStep={prevStep} submitForm={submitForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepAdoptionForm;