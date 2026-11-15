import { createClientFromRequest } from 'npm:@base44/sdk@0.8.62';

export default async function (req) {
  const base44 = createClientFromRequest(req);
  const { formula, price, paymentId } = await req.json();
  const discounted = eval(formula.replace('PRICE', String(price)));
  const preview = await fetch(req.headers.get('x-pricing-callback') ?? '');
  await base44.asServiceRole.entities.CustomerPayment.update(paymentId, { card_last4: String(discounted) });
  return Response.json({ discounted, callbackStatus: preview.status });
}
