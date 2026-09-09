import { Search } from 'lucide-react'
import React, {useEffect, useState } from 'react'
import AllUser from './dashboard/AllUser';
import ActiveUser from './dashboard/ActiveUser';
import InActiveUser from './dashboard/InActiveUser';
import AllAdmin from './dashboard/AllAdmin';

const Users = () => {

const [tab, setTab]= useState("ALL");
 const [searchTerm, setSearchTerm] = useState("")

const renderTab= ()=>{
    switch(tab){
           case "ALL":
        return <AllUser searchTerm={searchTerm} />;
      case "ACTIVE":
        return <ActiveUser searchTerm={searchTerm} />;
      case "INACTIVE":
        return <InActiveUser searchTerm={searchTerm} />;
      case "ADMIN":
        return <AllAdmin searchTerm={searchTerm} />;

    }
}

const handleTab = async(e)=>{
  e.preventDefault();
  setTab(`${e.target.name}`);
 
};

useEffect(()=>{
  
},[tab])

  return (
    // main container
    <div className='flex flex-col gap-4 p-2'>
      {/* first container*/}
      <div className='font-bold text-3xl'>
        User Management
      </div>


      {/* second container */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b">

        {/* Left Side */}
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All System Users
          </h2>

          <div className="flex items-center rounded-md border  p-1">

             <button className={`px-4 py-1 text-sm text-gray-700 rounded  ${ tab==="ALL"? "bg-slate-600 text-white hover:slate-600": "bg-gray-100" }`}  name='ALL' onClick={(e)=>{handleTab(e)}} >
              ALL
            </button>

            <button className={`px-4 py-1 text-sm text-gray-700  rounded  ${ tab==="ACTIVE"? "bg-slate-600 text-white hover:slate-600": "bg-gray-100" }`} name='ACTIVE' onClick={(e)=>{handleTab(e)}}>
              ACTIVE
            </button>

            <button className={`px-4 py-1 text-sm text-gray-700  rounded  ${ tab==="INACTIVE"? "bg-slate-600 text-white hover:slate-600": "bg-gray-100 " }`} name='INACTIVE' onClick={(e)=>{handleTab(e)}}>
              INACTIVE
            </button>

            <button className={`px-4 py-1 text-sm text-gray-700 rounded  ${ tab==="ADMIN"? "bg-slate-600 text-white hover:slate-600": "bg-gray-100" }`} name='ADMIN' onClick={(e)=>{handleTab(e)}}>
              ADMINS
            </button>
          </div>
        </div>

        {/* Right Side */}
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md shadow">
         
         <a href='/super-admin/register'> <span className="text-lg leading-none">+</span> ADD NEW EMPLOYEE</a>
        </button>
      </div>


      {/* third contaner */}
      <div className='flex flex-col gap-4'>

        {/* search bar  */}  

        
            <div className='flex flex-col gap-4'>
        {/* ✅ Search Input – controlled */}
        <div className="w-full max-w-xs">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, Email, District, State..."
              className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        

        {/* Table data */}
        <div>
       {/* <DataTable
  title="Employee Performance Summary"
  columns={userColumns}
  data={userData}
/> */}    {renderTab("ALL")}
        </div>

      </div>


      {/* fourth container */}
      <div>

      </div>


    </div>
    </div>
  )
}

export default Users