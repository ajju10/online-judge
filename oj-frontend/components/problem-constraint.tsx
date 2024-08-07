interface ProblemConstraint {
  constraints: string[];
}

export default function ProblemConstraint({ constraints }: ProblemConstraint) {
  return (
    <ul className="list-disc pl-6 text-muted-foreground">
      {constraints.map((constraint, index) => (
        <li key={index}>
          <code>{constraint}</code>
        </li>
      ))}
    </ul>
  );
}
