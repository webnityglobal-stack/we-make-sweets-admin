import React, { useState } from 'react'
import { Eye } from 'lucide-react';
import authService from '@/services/auth.services';
import {useNavigate } from 'react-router-dom';


const Login = () => {
const [isFocused, setFocused] = useState(false);

const handleFocused = (focus)=>{
  setFocused(focus);
}

const navigate = useNavigate();

const [data, setData] = useState({email:"", password: ""});

const handleChange= (e)=>{
  e.preventDefault()
 const {name, value} = e.target;
  setData((prev)=>({
    ...prev, [name]:value
  }));
  
}

const handleSubmit = async()=>{
  
  try {

  const response = await authService.login(data);

  if(response.user.role.name === 'super-admin'){
    navigate('/super-admin/dashboard'); 
  }else{
    navigate('/employee/dashboard');
  }


} catch (error) {
  console.log(error);
}

}


  return (
    <div className='grid relative grid-cols-2 h-screen  text-white'>
       <img src='/withoutBackground111.png'  className='absolute top-2 left-2 h-22 w-44' alt='withoutBackground111.png'/>
        {/* first half */} 
      <div className='flex flex-col w-[950px] bg-[url("/registerCrm33.png")] bg-contain bg-no-repeat bg-center'>
        {/* heading  and  main containeer */}
        <div className='flex flex-col gap-20 px-5 py-4'>
<div>

 
</div>
{/* sub-container */}
<div className='flex flex-col px-30 gap-8'>
</div>
</div> 
      </div>

      {/* second half */}
      <div className='flex flex-col  gap-6 pr text-black justify-center items-center'>
        {/* welcome section */}
        <div className='flex flex-col gap-2 '>
          <div className='text-3xl font-bold'>Welcome Back!</div>
          <div className='text-center'>Login to your account</div>
        </div>

        {/* mail section */}
        <div className='flex flex-col gap-1 w-[380px]'>
          <div>E-mail</div>
          <div className='border border-gray-400 rounded-[3px] bg-gray-300 p-1'>
            <input className='focus:outline-none ' placeholder='Enter your e-mail' name="email" onFocus= {()=>handleFocused(true)} value={data.email} onChange={(e)=>handleChange(e)}/>
          </div>
        </div>

        {/* passsword */}
        <div className='flex flex-col gap-1 w-[380px]'>
          <div>Password</div>
          <div className='border border-gray-400 relative rounded-[3px] bg-gray-300 p-1'>
            <input className='focus:outline-none relative' value={data.password} name='password' onChange={(e)=>{handleChange(e)}} onFocus={()=>{handleFocused(true)}} onBlur={()=>{handleFocused(false)}} placeholder='Enter your password'/>
          { !isFocused && 
          (  <Eye className='absolute top-1 left-85 '/>)  }
          </div>
          <div className='text-blue-600 hover:text-blue-950'>
            <a
            // href='http://localhost:5173 /forgot-password'
            href='https://crm-frontend-six-blond.vercel.app/forgot-password'
            >Forget Password?</a>
          </div>
        </div>

        {/* button */}
       <div className=' flex flex-col  gap-1 w-[380px]   rounded-[3px]  p-1     bg-pink-600 hover:bg-[#60b396] text-white hover:text-white shadow-[1px_2px_0px_#000] sm:shadow-[2px_3px_0px_#000] hover:shadow-[3px_4px_0px_#000] transition-all duration-300 hover:scale-105 cursor-pointer'>
         <button className='text-white py-1' onClick={()=>{ handleSubmit() }}>Login</button>
        
        </div>

      </div>
    </div>
  )
}

export default Login
