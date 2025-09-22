import React from 'react';


const AboutPet = ({name,age,breed,gender}) => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10 px-2 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg px-8 py-8">
        
        <div className="flex justify-center">
          <img
            src="/dog.jpg"
            alt="dog photo"
            className="rounded-3xl object-cover w-[490px] h-[210px] mb-6"
          />
        </div>
        
        <h1 className="text-3xl font-semibold mb-2 text-gray-800">{name}</h1>
        
        <div className="text-gray-500 font-medium mb-5">
          {breed} | {gender} | {age}
        </div>
        
        <p className="mb-7 text-gray-700">
          Buddy is a friendly and energetic Golden Retriever looking for a loving home. He loves playing fetch and going for walks. Buddy is great with kids and other dogs, making him an ideal family pet. He is fully vaccinated and neutered, ready to join your family.
        </p>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Adoption Information</h3>
        <div className="mb-8 grid grid-cols-2 gap-y-2 gap-x-8 text-gray-700 border-b border-gray-200 pb-6">
          <div>
            <span className="block text-sm text-gray-500">Age</span>
            <span className="font-medium">2 years</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Breed</span>
            <span className="font-medium">Golden Retriever</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Size</span>
            <span className="font-medium">Medium</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Temperament</span>
            <span className="font-medium">Friendly, Energetic</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Vaccinated</span>
            <span className="font-medium">Yes</span>
          </div>
          <div>
            <span className="block text-sm text-gray-500">Neutered</span>
            <span className="font-medium">Yes</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Adoption Requirements</h3>
        <p className="text-gray-700 mb-6">
          To adopt Buddy, you must have a secure fenced yard, be able to provide regular exercise, and commit to his ongoing care. A home visit and adoption fee apply.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md mb-5 transition">
          Inquire About Buddy
        </button>
        <div className="flex space-x-6 justify-center mt-2">
          <button className="text-gray-500 hover:text-blue-600 transition">Share on Facebook</button>
          <button className="text-gray-500 hover:text-blue-400 transition">Share on Twitter</button>
          <button className="text-gray-500 hover:text-pink-600 transition">Share on Instagram</button>
        </div>
      </div>
    </div>
  );
};

export default AboutPet;
