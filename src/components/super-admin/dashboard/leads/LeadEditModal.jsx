import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { leadService } from '@/services/leads.service';



const LeadEditModal = ({open, setOpen, oldLeadValue}) => {
     const [data, setData] = useState({
    name: oldLeadValue?.name || "",
    mobileNumber: oldLeadValue?.mobileNumber || "",
    email: oldLeadValue?.email || "",
    companyName: oldLeadValue?.companyName || "",
    product: oldLeadValue?.product || "",
    service: oldLeadValue?.service || "",
    source: oldLeadValue?.source || "Manual",
    remarks: oldLeadValue?.remarks || "",
    status: oldLeadValue?.status || "NEW",
  });

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await leadService.updateLead(
        oldLeadValue._id,
        data
      );
      if(response.success){
      window.location.reload();
      }
    } catch (error) {
     console.log(error);
    }
  };
  console.log("this is old lead ", oldLeadValue);


useEffect(() => {
  if (oldLeadValue) {
    setData({
      name: oldLeadValue.name || "",
      mobileNumber: oldLeadValue.mobileNumber || "",
      email: oldLeadValue.email || "",
      companyName: oldLeadValue.companyName || "",
      product: oldLeadValue.product || "",
      service: oldLeadValue.service || "",
      source: oldLeadValue.source || "Manual",
      remarks: oldLeadValue.remarks || "",
      status: oldLeadValue.status || "NEW",
    });
  }
}, [oldLeadValue]);
Deb

  return (
    <div>
    
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sticky Footer</DialogTitle>
          <DialogDescription>
            This dialog has a sticky footer that stays visible while the content
            scrolls.
          </DialogDescription>
        </DialogHeader>
         <div className="w-full max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Edit Lead
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block mb-1">
            Lead Name
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={data.mobileNumber}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={data.companyName}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1">
            Product
          </label>
          <input
            type="text"
            name="product"
            value={data.product}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1">
            Service
          </label>
          <input
            type="text"
            name="service"
            value={data.service}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block mb-1">
            Source
          </label>

          <select
            name="source"
            value={data.source}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="Website">
              Website
            </option>
            <option value="Facebook">
              Facebook
            </option>
            <option value="Google">
              Google
            </option>
            <option value="Referral">
              Referral
            </option>
            <option value="Manual">
              Manual
            </option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Status
          </label>

          <select
            name="status"
            value={data.status}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          >
            <option value="NEW">NEW</option>
            <option value="CONTACTED">
              CONTACTED
            </option>
            <option value="CALL_BACK">
              CALL_BACK
            </option>
            <option value="NOT_ANSWERING">
              NOT_ANSWERING
            </option>
            <option value="SWITCH_OFF">
              SWITCH_OFF
            </option>
            <option value="INTERESTED">
              INTERESTED
            </option>
            <option value="NOT_INTERESTED">
              NOT_INTERESTED
            </option>
            <option value="DEAL_CONFIRMED">
              DEAL_CONFIRMED
            </option>
            <option value="DEAL_LOST">
              DEAL_LOST
            </option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">
            Remarks
          </label>

          <textarea
            rows={4}
            name="remarks"
            value={data.remarks}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">
            Update Lead
          </Button>
        </div>
      </form>
    </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default LeadEditModal