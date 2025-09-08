import React, {useState} from 'react'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='font-jakarta h-screen'>
      <div className='flex justify-center items-center text-center'>
        <h1 className='text-4xl font-semibold mt-20'>Welcome Back</h1>
      </div>
      <div>
        <form action="submit">
          <div className='flex flex-col gap-4 justify-center items-center mt-10'>
            <div>
            <p>Email</p>
            <input 
              type="email" 
              placeholder='Enter your email' 
              className='border border-gray-300 rounded-lg p-3 w-80 mb-4'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div>
            <p>Password</p>
            <input 
              type="password" 
              placeholder='Enter your password' 
              className='border border-gray-300 rounded-lg p-3 w-80 mb-4'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <div>
              <a className='font-thin text-xs'>Forgot Password?</a>
            </div>

            <button className='bg-blue-500 text-white rounded-lg p-3 w-80 hover:bg-blue-600 transition duration-300'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
