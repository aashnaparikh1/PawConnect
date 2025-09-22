import React from 'react';

const team = [
  {
    name: "Aashna Parikh",
    roll: "16010423002"
  },
  {
    name: "Anushka Joshi",
    roll: "16010423014"
  },
  {
    name: "Ashutosh Dosi",
    roll: "16010423018"  
  },
];

const AboutTeam = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {team.map((member) => (
          <div
            key={member.roll}
            className="bg-white rounded-xl shadow-md p-8 w-80 flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h2>
            <p className="text-gray-600 mb-1">Roll No: {member.roll}</p>
            <p className="text-gray-400 text-sm">Web Development Project : PawConnect</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTeam;
