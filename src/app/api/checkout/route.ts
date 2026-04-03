import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, streetAddress, city, state, postalCode, country, items } = body;

    if (!customerName || !customerPhone || !streetAddress || !city || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    // Get the next order count for tracking ID
    const orderCount = await db.order.count();
    const trackingId = `ZMS${String(orderCount + 1001).padStart(4, '0')}`;

    const order = await db.order.create({
      data: {
        trackingId,
        customerName,
        customerEmail: customerEmail || '',
        customerPhone,
        streetAddress,
        city,
        state: state || '',
        postalCode: postalCode || '',
        country: country || 'Pakistan',
        totalAmount,
        status: 'Processing',
        orderItems: {
          create: items.map((item: { productId: number; title: string; price: number; quantity: number }) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { orderItems: true },
    });

    return NextResponse.json({
      orderId: order.id,
      trackingId: order.trackingId,
      status: order.status,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
