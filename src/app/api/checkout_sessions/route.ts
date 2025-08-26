import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { contractId } = await request.json();

  if (!contractId) {
    return new NextResponse('Missing contractId', { status: 400 });
  }

  try {
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('*, job:jobs(title)')
      .eq('id', contractId)
      .single();

    if (contractError || !contract) {
      throw new Error('Contract not found.');
    }

    if (contract.company_id !== user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Payment for: ${contract.job.title}`,
            },
            unit_amount: Math.round(contract.budget * 100), // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard/contracts?payment=success`,
      cancel_url: `${request.headers.get('origin')}/dashboard/contracts?payment=cancelled`,
      metadata: {
        contract_id: contract.id,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(`Error creating checkout session: ${error.message}`, { status: 500 });
  }
}
