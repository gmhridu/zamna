import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params;

    const order = await db.order.findUnique({
      where: { trackingId },
      include: { orderItems: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      orderId: order.id,
      trackingId: order.trackingId,
      status: order.status,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      streetAddress: order.streetAddress,
      city: order.city,
      state: order.state,
      postalCode: order.postalCode,
      country: order.country,
      totalAmount: order.totalAmount,
      items: order.orderItems.map((item) => ({
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      createdAt: order.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Order lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
