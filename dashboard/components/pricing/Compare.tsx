const plans = [
  { name: 'Starter', price: '$0', features: ['Self-hosted bot', 'Email support', 'Up to 500 reports/month'] },
  { name: 'Growth', price: '$149', features: ['Managed VPS', 'Priority support', 'Custom templates'] },
  { name: 'Enterprise', price: 'Contact us', features: ['Dedicated success manager', 'SLA', 'PHI-compliant hosting'] },
];

export function PricingCompare() {
  return (
    <section className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className="card space-y-3">
          <p className="text-sm uppercase tracking-wide text-cyan-200/80">{plan.name}</p>
          <p className="text-3xl font-semibold text-white">{plan.price}</p>
          <ul className="space-y-2 text-sm text-slate-300">
            {plan.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
