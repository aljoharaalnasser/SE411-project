export const team = [
  { name: 'Student One', studentId: '000000001' },
  { name: 'Student Two', studentId: '000000002' },
  { name: 'Student Three', studentId: '000000003' }
]

function About() {
  return (
    <div>
      <h1 className="page-title">About</h1>
      <p className="page-subtitle">
        SE411 Project, Fall 2026-27. Financial Asset Manager: a web application to manage stocks and bonds.
      </p>

      <h2 className="section-title">Team members</h2>
      <div className="team-grid">
        {team.map((member) => (
          <div className="team-card" key={member.studentId}>
            <span className="team-name">{member.name}</span>
            <span className="team-id">{member.studentId}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
