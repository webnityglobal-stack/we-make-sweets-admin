import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { callService } from '@/services/call.service';


const CreateCall = ({ open, setOpen, lead }) => {

    const [callStatus, setCallStatus] = useState("");
    const [customerPreferredTime, setCustomerPreferredTime] = useState("");
    const [nextFollowUpDate, setNextFollowUpDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [dealAmount, setDealAmount] = useState("");

    console.log("hti is  elad in modal  ", lead)

    const handleCreateCall = async () => {
        if (!lead) return;
        const payload = {
            lead: lead?._id,
            callStatus,
            comments: remarks,
            nextCallDate: nextFollowUpDate,
            customerPreferredTime,
            dealAmount
        };

        console.log("this is payooad", payload);

        await callService.createCall(payload);
        window.location.reload();
        setOpen(false);

    }

    useEffect(() => {
        if (lead) {
            setCustomerPreferredTime(
                lead.customerPrefferedTime || ""
            );

            setNextFollowUpDate(
                lead.nextFollowUpDate
                    ? lead.nextFollowUpDate.split("T")[0]
                    : ""
            );
        }
    }, [lead]);

    return (

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!max-w-3xl">

                <DialogHeader>
                    <DialogTitle>Create Call</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4">

                    <div>
                        <label>Client Name</label>

                        <input
                            disabled
                            value={lead?.name || ""}
                            className="w-full border rounded p-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label>Company</label>

                        <input
                            disabled
                            value={lead?.company || ""}
                            className="w-full border rounded p-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label>Source</label>

                        <input
                            disabled
                            value={lead?.source || ""}
                            className="w-full border rounded p-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label>Call Status</label>

                        <select
                            className="w-full border rounded p-2"
                            value={callStatus}
                            onChange={(e) => setCallStatus(e.target.value)}
                        >
                            <option value="">Select</option>

                            <option value="ANSWERED">
                                ANSWERED
                            </option>

                            <option value="NOT_ANSWERED">
                                NOT ANSWERED
                            </option>

                            <option value="BUSY">
                                BUSY
                            </option>

                            <option value="SWITCH_OFF">
                                SWITCH OFF
                            </option>

                            <option value="CALL_BACK">
                                CALL BACK
                            </option>

                            <option value="INTERESTED">
                                INTERESTED
                            </option>

                            <option value="NOT_INTERESTED">
                                NOT_INTERESTED
                            </option>
                            <option value="DEAL_LOST">
                                DEAL_LOST
                            </option>
                            <option value="DEAL_CONFIRMED">
                                DEAL CONFIRMED
                            </option>
                        </select>
                    </div>

                    <div>
                        <label>Customer Preferred Time</label>

                        <input
                            className="w-full border rounded p-2"
                            value={customerPreferredTime}
                            onChange={(e) =>
                                setCustomerPreferredTime(e.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label>Next Follow Up</label>

                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            value={nextFollowUpDate}
                            onChange={(e) =>
                                setNextFollowUpDate(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-span-2">

                        <label>Remarks</label>

                        <textarea
                            rows={4}
                            className="w-full border rounded p-2"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                    </div>

                    {
                        callStatus === "DEAL_CONFIRMED" &&

                        <div>

                            <label>Deal Amount</label>

                            <input
                                type="number"
                                className="w-full border rounded p-2"
                                value={dealAmount}
                                onChange={(e) =>
                                    setDealAmount(e.target.value)
                                }
                            />

                        </div>
                    }

                </div>

                <DialogFooter>

                    <Button
                        onClick={handleCreateCall}
                    >
                        Save Call
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>

    )
}

export default CreateCall