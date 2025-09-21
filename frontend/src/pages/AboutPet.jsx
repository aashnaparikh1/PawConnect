import React from 'react'

const AboutPet = () => {
  return (
    <div className='AboutPet'>
      <div className='Image flex justify-center w-107 border-r-2-xl'>
        <img src="/dog.jpg" alt="dog photo" />
      </div>
      <div className=''>
        <h1>Buddy</h1>
      </div>
      <div className=''>
        <p>Golden Retriever | Male | 2 years old</p>
      </div>
      <div className=''>
        <p>Buddy is a friendly and energetic Golden Retriever looking for a loving home. He loves playing fetch and going for walks. Buddy is great with kids and other dogs, making him an ideal family pet. He is fully vaccinated and neutered, ready to join your family.</p>
      </div>
      <div>
        <h3>Adoption Information</h3>
      </div>
      <div>
        Age 2 years
      </div>
      <div>Breed Golden Retriver</div>
      <div>Temperament Friendly, Energetic</div>
      <div>Vaccinated Yes</div>
      <div>Neuterd Yes</div>
      <div><h1>Adoption Requiremnts</h1></div>
      <div><p>To adopt Buddy, you must have a secure fenced yard, be able to provide regular exercise, and commit to his ongoing care. A home visit and adoption fee apply.</p></div>
      <div><button>Inquire About Buddy</button></div>

    </div>
    
  )
}

export default AboutPet