import React, { useEffect, useState } from 'react'
import { CircleCheckBig } from 'lucide-react';
import { stateAndCitiesService } from '@/services/state-cities.service';
import { roleService } from '@/services/role.service';
import authService from '@/services/auth.services';

const Register = () => {

  const [data, setData] = useState({});
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [roles, setRoles] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev, [name]: value
    }))
  }

  const getRole = async () => {

    try {
      const response = await roleService.getAllRole();
      setRoles(response);
    } catch (error) {
      console.log(error)
    }

  }

  const handleState = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setSelectedState(value);
    setData((prev) => ({
      ...prev, [name]: value
    }))

  }

  const fetchState = async () => {
    try {
      const data = await stateAndCitiesService.getAllState('India');
      setStates(data);

    } catch (error) {
      console.log(error)
    }
  }

  const fetchCity = async () => {
    try {
      const { data } = await stateAndCitiesService.getAllCity("India", `${selectedState}`);
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchState();
    getRole()
  }, []);

  useEffect(() => {
    fetchCity();
  }, [selectedState]);

  const handleSubmit = async()=>{
   try {
     const response = await authService.register(data);

   } catch (error) {
    console.log(error)
   }
  }

  return (
    <div className='h-full w-full'>
      <img src="/registerCrm2.png" alt="registerCrm2.png" />
      {/* main register container  */}
      <div className='flex shadow-blue-500 w-[1000px] h-[600px] shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>

        {/* main first container */}
        <div className='flex flex-col  w-1/3 bg-[#061166] px-12 py-12 gap-8 '>
          <div className='border object-contain h-[240px] w-[240px]  '>
            <img src="/registerCrm.jpg" alt="" className='overflow-hidden rounded-3xl' />
          </div>

          {/* text container */}
          <div className='text-white flex flex-col gap-5'>

            {/* 1st  */}
            <div className=''>

              <div className='font-bold flex gap-3'> <CircleCheckBig />Quick and free sign-up</div>
              <div className='text-[13px]'>Enter your email adddress to create an account </div>
            </div>

            {/* 2nd */}
            <div>
              <div className='font-bold flex gap-3'> <CircleCheckBig />Automate your work </div>
              <div className='text-[13px]'>focus on bringing sales while CRM will manage all the rest </div>
            </div>
            {/* 3rd */}
            <div>
              <div className='font-bold flex gap-3'> <CircleCheckBig />Something for everyone </div>
              <div className='text-[13px]'>The best customer experienceS are built with CRM</div>
            </div>
          </div>
        </div>

        {/* main second container */}
        {/* <div className=' flex  justify-center items-center w-2/3 text-white '> */}
        <div className="flex justify-center items-center w-2/3 bg-[url('/registerCrm3.png')] bg-cover bg-center text-white">

          <div className='flex flex-col gap-12'>

            {/* 1st part  */}
            <div className='flex flex-col gap-1 text-[20px] justify-center items-center'>
              <div><span className='text-blue-700 font-bold'>Webnity</span> <span className='font-bold text-orange-500'>CRM</span></div>
              <div className='font-bold text-[18px]'>Create Account</div>
              <div className='text-[14px]'>Join us by creating your Webnity CRM account</div>
            </div>

            {/* 2nd part  */}
            <div className='flex gap-5 w-[]'>

              <div className='flex flex-col gap-4'>

                {/* 1st row */}
                <div className='flex flex-col gap-4'>
                  <div className='flex flex-col'>
                    <div>FullName:</div>
                    <input name='fullName' placeholder='Webnity-User' className='border border-gray-300 bg-gray-100 p-1 rounded-[5px] focus:outline-none placeholder-gray-700 text-black' value={data.fullName} onChange={(e) => handleChange(e)} />
                  </div>



                  <div className='flex flex-col'>
                    <div>Email:</div>
                    <input name='email' placeholder='example@gmail.com' className='border border-gray-300 bg-gray-100 placeholder-gray-700 text-black p-1 rounded-[5px] focus:outline-none' value={data.email} onChange={(e) => handleChange(e)} />
                  </div>
                </div>


                {/* 2nd row */}
                <div className='flex gap-4'>

                  <div className='flex flex-col'>
                    <div>Password:</div>
                    <input name='password' placeholder='Password' className='border border-gray-300 bg-gray-100 placeholder-gray-700 text-black p-1 rounded-[5px] focus:outline-none' value={data.password} onChange={(e) => handleChange(e)} />
                  </div>

                  <div className='flex flex-col'>
                    <div>State:</div>
                    <select name='state' className='border border-gray-300 w-[180px] bg-gray-100 p-1 rounded-[5px] focus:outline-none placeholder-gray-700 text-black' value={selectedState} onChange={(e) => handleState(e)}  >
                      <option className='text-gray-700'>Select State</option>
                      {
                        states.map((state, index) => {
                          return (
                            <option key={index}>{state.name}</option>
                          )
                        })
                      }
                    </select>
                  </div>

                </div>


                {/* 3rd row */}
                <div className='flex gap-4'>
                  <div className='flex flex-col'>
                    <div>District:</div>
                    {/* <input placeholder='FullName' className='border border-gray-300 bg-gray-100 p-1 rounded-[5px] focus:outline-none placeholder-gray-700 text-black' /> */}
                    <select name='district' className='border border-gray-300 w-[180px] bg-gray-100 p-1 rounded-[5px] focus:outline-none placeholder-gray-700 text-black' onChange={(e) => handleChange(e)} >
                      <option className='text-gray-700'>Select State</option>
                      {
                        cities.map((city, index) => {
                          return (
                            <option key={index}>{city}</option>
                          )
                        })
                      }
                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <div>Role:</div>
                    {/* <input placeholder='Role-Name' className='border border-gray-300 bg-gray-100 p-1 rounded-[5px] focus:outline-none placeholder-gray-700 text-black' value={data.role} name="role" onChange= {(e)=>handleChange(e)}/> */}
                    <select name="role" onChange={(e) => handleChange(e)} className='border border-gray-300 w-[180px] bg-gray-100 p-1 rounded-[5px] focus:outline-none placeholder-gray-700 text-black' >
                      <option className='text-gray-700'>Select Role</option>
                      {
                        roles?.roles?.map((r, index) => {
                          return (
                            <option key={index} value={r._id} >{r.name}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>

              </div>


            </div>


            <div className='flex flex-col'>
              <button placeholder='Password' className='border border-gray-300 bg-blue-700 text-white p-2 rounded-[5px] focus:outline-none' onClick={handleSubmit}>Create Account</button>
            </div>



            {/* 3rd part */}
            <div className='flex gap-1 justify-center'>
              <div>You have an account? </div>
              <div className='text-orange-500'>
                <a href='/login'>Login</a>
              </div>
            </div>


          </div>
        </div>

      </div>
    </div>
  )
}

export default Register
