import { Icon } from '@/components/icon';

const downloads = [
  { name: 'Arduino Starter Kit – Project Files', type: 'ZIP', size: '12.4 MB', course: 'Arduino Bootcamp', date: '10 May 2025' },
  { name: 'Embedded Systems Reference Sheet', type: 'PDF', size: '842 KB', course: 'Embedded C for Beginners', date: '5 May 2025' },
  { name: 'Raspberry Pi Setup Scripts', type: 'ZIP', size: '3.1 MB', course: 'Raspberry Pi Projects', date: '1 May 2025' },
  { name: 'PCB Design Templates – Altium', type: 'ZIP', size: '8.7 MB', course: 'PCB Design with Altium', date: '28 Apr 2025' },
  { name: 'VoltCore Invoice #VC-1042', type: 'PDF', size: '94 KB', course: 'Purchase Receipt', date: '25 Apr 2025' },
];

const typeColor: Record<string, string> = { ZIP: 'pill-indigo', PDF: 'pill-red' };

export default function CustomerDownloads() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Downloads</h2>
        <div className="sub" style={{ marginTop: 4 }}>Course resources, invoices, and digital assets</div>
      </div>
      <div className="card card-pad">
        <table className="tbl">
          <thead><tr><th>File</th><th>Type</th><th>Size</th><th>Source</th><th>Date</th><th /></tr></thead>
          <tbody>
            {downloads.map((d, i) => (
              <tr key={i}>
                <td>
                  <div className="row gap10">
                    <Icon name="file" size={18} color="var(--muted)" />
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</span>
                  </div>
                </td>
                <td><span className={`pill ${typeColor[d.type] || 'pill-slate'}`} style={{ fontSize: 11 }}>{d.type}</span></td>
                <td className="sub" style={{ fontSize: 13 }}>{d.size}</td>
                <td className="sub" style={{ fontSize: 13 }}>{d.course}</td>
                <td className="sub" style={{ fontSize: 13 }}>{d.date}</td>
                <td>
                  <button className="btn btn-ghost btn-sm"><Icon name="download" size={15} />Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
