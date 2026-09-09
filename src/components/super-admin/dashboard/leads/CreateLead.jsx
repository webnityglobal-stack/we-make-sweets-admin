import { leadService } from "@/services/leads.service";
import { superAdminUser } from "@/services/super-admin/super.admin.dashboard.service";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateLead = ({ users }) => {
    const navigate= useNavigate();
  const [data, setData] = useState({
    name: "",
    mobileNumber: "",
    email: "",
    companyName: "",
    product: "",
    service: "",
    source: "Manual",
    assignedTo: "",
    remarks: "",
  });

 const [allUser, setallUser]=useState([]);
    const fetchUserDetails = async()=>{
      try {
        const response = await superAdminUser.getUserData({});
        setallUser(response);
      } catch (error) {
        console.log(error); 
      }
    }

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await leadService.createLead(data);
    navigate('/super-admin/leads')
    console.log(response);

  };
console.log("data:", data, allUser);
  return (
    <div className="max-w-4xl mx-auto p-6">
          <div className='font-bold text-3xl p-3'>
            Add New Lead
        </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label>Mobile Number *</label>
          <input
            type="text"
            name="mobileNumber"
            value={data.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={data.companyName}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label>Product</label>
          <input
            type="text"
            name="product"
            value={data.product}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label>Service</label>
          <input
            type="text"
            name="service"
            value={data.service}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label>Source</label>
          <select
            name="source"
            value={data.source}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="Manual">Manual</option>
            <option value="Website">Website</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div>
          <label>Assigned User (Optional)</label>

          <select
            name="assignedTo"
            value={data.assignedTo}
            onChange={handleChange}
            onClick={()=>{fetchUserDetails()}}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select User</option>

            {allUser?.map((user) => (
              <option
                key={user?._id}
                value={user?._id}
                className="text-black"
              >
                {user?.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="md:col-span-2">
          <label>Remarks</label>

          <textarea
            rows={4}
            name="remarks"
            value={data.remarks}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div> */}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-md"
          >
            Create Lead
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLead;