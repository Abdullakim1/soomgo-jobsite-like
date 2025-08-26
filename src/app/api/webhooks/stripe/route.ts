import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Using the service role key for admin-level access to update the database
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const contractId = session.metadata?.contract_id;

    if (contractId) {
      try {
        const { error } = await supabaseAdmin
          .from('contracts')
          .update({ status: 'paid' })
          .eq('id', contractId);

        if (error) {
          throw new Error(`Failed to update contract: ${error.message}`);
        }

        console.log(`Successfully updated contract ${contractId} to paid.`);

      } catch (dbError: any) {
        console.error(dbError.message);
        return new NextResponse(`Database Error: ${dbError.message}`, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
