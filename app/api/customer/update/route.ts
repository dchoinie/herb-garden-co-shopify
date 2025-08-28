import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession, updateCustomer } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    // Get the current customer session
    const session = await getCustomerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the update data from the request body
    const body = await request.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      note,
      tags,
      accepts_marketing,
    } = body;

    // Validate required fields
    if (!session.customerId) {
      return NextResponse.json(
        { error: "Customer ID not found" },
        { status: 400 }
      );
    }

    // Prepare updates object
    const updates: any = {};
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (note !== undefined) updates.note = note;
    if (tags !== undefined) updates.tags = tags;
    if (accepts_marketing !== undefined)
      updates.accepts_marketing = accepts_marketing;

    // Update the customer
    const updatedCustomer = await updateCustomer(session.customerId, updates);

    if (!updatedCustomer) {
      return NextResponse.json(
        { error: "Failed to update customer" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
