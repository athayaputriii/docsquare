const team = [
  { name: 'Haydar Amru', title: 'Founder' },
  { name: 'Nadia Pratama', title: 'Clinical Ops' },
  { name: 'Lucas Tan', title: 'ML Lead' },
];

export function AboutTeam() {
  return (
    <section className="card space-y-4">
      <h2 className="text-2xl font-semibold text-white">Leadership</h2>
      <ul className="space-y-2 text-slate-300">
        {team.map((member) => (
          <li key={member.name} className="flex items-center justify-between">
            <span>{member.name}</span>
            <span className="text-sm text-slate-500">{member.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
