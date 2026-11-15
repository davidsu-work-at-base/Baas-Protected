import { createClientFromRequest } from 'npm:@base44/sdk@0.8.62';

export default async function (req) {
  const base44 = createClientFromRequest(req);
  const { paymentId } = await req.json();
  await base44.asServiceRole.entities.CustomerPayment.delete(paymentId);
  return Response.json({ deleted: paymentId });
}
