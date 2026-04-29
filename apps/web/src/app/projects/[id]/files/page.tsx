'use client';

const files = [
  { id: 1, name: 'design-mockup.fig', size: '12.5 MB', type: 'design', uploadedBy: 'Alice', uploadedAt: '2024-01-15' },
  { id: 2, name: 'requirements.pdf', size: '2.3 MB', type: 'document', uploadedBy: 'Bob', uploadedAt: '2024-01-14' },
  { id: 3, name: 'api-spec.yaml', size: '156 KB', type: 'code', uploadedBy: 'Charlie', uploadedAt: '2024-01-13' },
];

export default function ProjectFilesPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-void py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-star-gold">Project Files</h1>
          <button className="px-6 py-2 bg-cyan text-void rounded-lg font-semibold hover:bg-cyan/90 transition-colors">
            Upload File
          </button>
        </div>

        <div className="bg-surface/50 backdrop-blur-xl border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-border text-sm font-medium text-text-secondary">
            <span className="col-span-2">Name</span>
            <span>Size</span>
            <span>Uploaded By</span>
            <span>Date</span>
          </div>
          {files.map((file) => (
            <div
              key={file.id}
              className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-0 hover:bg-void/50 transition-colors"
            >
              <span className="col-span-2 text-text-primary flex items-center gap-2">
                <span className="text-2xl">
                  {file.type === 'design' ? '🎨' : file.type === 'document' ? '📄' : '💻'}
                </span>
                {file.name}
              </span>
              <span className="text-text-secondary">{file.size}</span>
              <span className="text-text-secondary">{file.uploadedBy}</span>
              <span className="text-text-secondary">{file.uploadedAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
